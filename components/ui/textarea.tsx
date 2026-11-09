'use client';

import * as React from "react"
import { cn } from "@/lib/utils"
import { useHinglishTransliteration } from "@/app/lib/useHinglishTransliteration"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  noTransliterate?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    noTransliterate,
    onKeyDown,
    onChange,
    onBlur,
    onPaste,
    disabled,
    readOnly,
    ...props
  }, ref) => {
    const {
      handleKeyDown: translitKeyDown,
      handleChange: translitChange,
      handleBlur: translitBlur,
      handlePaste: translitPaste,
    } = useHinglishTransliteration({
      disabled: Boolean(disabled || readOnly),
      noTransliterate,
      type: 'textarea',
    });

    const combinedKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      translitKeyDown(e);
      if (onKeyDown) onKeyDown(e);
    };

    const combinedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      translitChange(e);
      if (onChange) onChange(e);
    };

    const combinedBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      translitBlur(e);
      if (onBlur) onBlur(e);
    };

    const combinedPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      translitPaste(e);
      if (onPaste) onPaste(e);
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[90px] w-full rounded-lg border border-[#E5E5E5] bg-white p-3.5 text-sm text-[#111111] transition-colors placeholder:text-[#999999] focus-visible:outline-none focus-visible:border-[#111111] focus-visible:ring-1 focus-visible:ring-[#111111] disabled:cursor-not-allowed disabled:bg-[#F9F9F9] disabled:text-[#888888] disabled:border-[#EAEAEA] leading-relaxed",
          className
        )}
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        onKeyDown={combinedKeyDown}
        onChange={combinedChange}
        onBlur={combinedBlur}
        onPaste={combinedPaste}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
