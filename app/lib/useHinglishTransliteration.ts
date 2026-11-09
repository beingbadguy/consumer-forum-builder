'use client';

import { useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  transliterateWordImmediate,
  fetchGoogleTransliteration,
  isEnglishSentence,
  translateEnglishSentence,
  transliterateFullText,
  cleanMixedScript,
} from './transliteration';

export interface UseHinglishTransliterationOptions {
  disabled?: boolean;
  noTransliterate?: boolean;
  type?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Custom hook to handle real-time Hinglish to Hindi transliteration
 * and English sentence translation for HTMLInputElement & HTMLTextAreaElement.
 *
 * Guaranteed:
 * - Clean Devanagari script for Hinglish inputs
 * - Zero mixed characters (no 'अंaन', 'दीpक', 'कुmar')
 * - Instant Space/Enter word transliteration
 * - Cursor preservation and natural typing experience
 */
export function useHinglishTransliteration({
  disabled = false,
  noTransliterate = false,
  type = 'text',
  onValueChange,
}: UseHinglishTransliterationOptions = {}) {
  const { language } = useLanguage();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prefetchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active only when website language is Hindi ('hi') and field is eligible
  const isExcludedType =
    type === 'email' ||
    type === 'tel' ||
    type === 'number' ||
    type === 'password' ||
    type === 'date' ||
    type === 'file';

  const isEnabled = language === 'hi' && !disabled && !noTransliterate && !isExcludedType;

  /**
   * Helper to set input value and trigger React's synthetic onChange event
   * while precisely preserving cursor position.
   */
  const triggerInputChange = useCallback(
    (element: HTMLInputElement | HTMLTextAreaElement, newValue: string, newCursorPos?: number) => {
      const targetPos = newCursorPos !== undefined ? newCursorPos : element.selectionStart;

      // Use native value descriptor so React state listeners trigger reliably
      const valueSetter = Object.getOwnPropertyDescriptor(
        element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
        'value'
      )?.set;

      if (valueSetter) {
        valueSetter.call(element, newValue);
      } else {
        element.value = newValue;
      }

      // Dispatch native input event for React onChange handlers
      element.dispatchEvent(new Event('input', { bubbles: true }));

      // Restore cursor position seamlessly
      if (targetPos !== null && targetPos !== undefined) {
        requestAnimationFrame(() => {
          element.setSelectionRange(targetPos, targetPos);
        });
      }

      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    [onValueChange]
  );

  /**
   * Word-level transliteration on Space, Enter, or Punctuation
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isEnabled) return;

      // Trigger word transliteration on Space, Enter, or common delimiters
      const isWordDelimiter =
        e.key === ' ' ||
        e.key === 'Enter' ||
        e.key === '.' ||
        e.key === ',' ||
        e.key === '?' ||
        e.key === '!' ||
        e.key === ';';

      if (!isWordDelimiter) return;

      const element = e.currentTarget;
      const cursorPos = element.selectionStart || 0;
      const text = element.value;

      const textBeforeCursor = text.slice(0, cursorPos);
      const textAfterCursor = text.slice(cursorPos);

      // Find the last alphabetical word right before the cursor
      const match = textBeforeCursor.match(/([a-zA-Z]+)$/);
      if (!match) return;

      const englishWord = match[1];
      const wordStartIndex = cursorPos - englishWord.length;

      // 1. Get instant transliteration from dictionary, cache, or phonetic syllabary
      const hindiWord = transliterateWordImmediate(englishWord);

      if (!hindiWord || hindiWord === englishWord) return;

      // Prevent default delimiter typing so we can insert the Hindi word + delimiter together
      e.preventDefault();

      const delimiter = e.key === 'Enter' ? '\n' : e.key;
      const cleanHindi = cleanMixedScript(hindiWord);
      const newText = text.slice(0, wordStartIndex) + cleanHindi + delimiter + textAfterCursor;
      const newCursorPos = wordStartIndex + cleanHindi.length + delimiter.length;

      triggerInputChange(element, newText, newCursorPos);

      // 2. In background, fetch Google transliteration to keep cache warm and refine
      fetchGoogleTransliteration(englishWord).then((refinedHindi) => {
        if (
          refinedHindi &&
          refinedHindi !== cleanHindi &&
          element &&
          document.activeElement === element
        ) {
          const curVal = element.value;
          const expectedSnippet = cleanHindi + delimiter;
          const refinedSnippet = cleanMixedScript(refinedHindi) + delimiter;

          if (curVal.includes(expectedSnippet)) {
            const currentSel = element.selectionStart || 0;
            const updated = curVal.replace(expectedSnippet, refinedSnippet);
            const delta = refinedSnippet.length - expectedSnippet.length;
            triggerInputChange(element, updated, currentSel + delta);
          }
        }
      });
    },
    [isEnabled, triggerInputChange]
  );

  /**
   * Handles trailing words or full English sentences on blur or debounce
   */
  const handleBlurOrDebounce = useCallback(
    async (element: HTMLInputElement | HTMLTextAreaElement) => {
      if (!isEnabled || !element) return;

      const text = element.value;
      if (!text || !text.trim()) return;

      // Check if user entered a full English sentence
      if (isEnglishSentence(text)) {
        try {
          const translated = await translateEnglishSentence(text);
          if (translated && translated !== text) {
            triggerInputChange(element, translated, translated.length);
            return;
          }
        } catch {
          // Fallback to word transliteration
        }
      }

      // Check for trailing un-transliterated English words at the end
      const trailingMatch = text.match(/([a-zA-Z]+)(\s*)$/);
      if (trailingMatch) {
        const word = trailingMatch[1];
        const space = trailingMatch[2];
        const hindiWord = transliterateWordImmediate(word);

        if (hindiWord && hindiWord !== word) {
          const cleanHindi = cleanMixedScript(hindiWord);
          const startIndex = text.length - word.length - space.length;
          const newText = text.slice(0, startIndex) + cleanHindi + space;
          triggerInputChange(element, newText, newText.length);
        }
      }
    },
    [isEnabled, triggerInputChange]
  );

  /**
   * On blur: finish any pending sentence translation or trailing word conversion
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isEnabled) return;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      handleBlurOrDebounce(e.currentTarget);
    },
    [isEnabled, handleBlurOrDebounce]
  );

  /**
   * On input / change:
   * 1. Pre-fetch upcoming word suggestion from Google Input Tools
   * 2. Debounce full sentence or trailing word completion
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isEnabled) return;

      const element = e.currentTarget;
      const cursorPos = element.selectionStart || 0;
      const val = element.value;

      // Extract current word being typed for background pre-fetching
      const textBeforeCursor = val.slice(0, cursorPos);
      const match = textBeforeCursor.match(/([a-zA-Z]{2,})$/);

      if (match) {
        const currentWord = match[1];
        if (prefetchTimerRef.current) {
          clearTimeout(prefetchTimerRef.current);
        }
        prefetchTimerRef.current = setTimeout(() => {
          fetchGoogleTransliteration(currentWord);
        }, 150);
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // If user typed period/question mark with space, trigger quickly
      if (val.endsWith('. ') || val.endsWith('? ') || val.endsWith('! ')) {
        handleBlurOrDebounce(element);
      } else {
        debounceTimerRef.current = setTimeout(() => {
          handleBlurOrDebounce(element);
        }, 800);
      }
    },
    [isEnabled, handleBlurOrDebounce]
  );

  /**
   * On paste: support pasting English sentences or Hinglish text
   */
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isEnabled) return;
      const pastedText = e.clipboardData.getData('text');
      if (!pastedText || !pastedText.trim()) return;

      e.preventDefault();
      const element = e.currentTarget;

      let converted = '';
      if (isEnglishSentence(pastedText)) {
        converted = await translateEnglishSentence(pastedText);
      } else {
        converted = await transliterateFullText(pastedText);
      }

      const cursorPos = element.selectionStart || 0;
      const curVal = element.value;
      const insertText = converted || pastedText;
      const newText =
        curVal.slice(0, cursorPos) + insertText + curVal.slice(element.selectionEnd || cursorPos);
      const newPos = cursorPos + insertText.length;

      triggerInputChange(element, newText, newPos);
    },
    [isEnabled, triggerInputChange]
  );

  return {
    isEnabled,
    handleKeyDown,
    handleChange,
    handleBlur,
    handlePaste,
  };
}
