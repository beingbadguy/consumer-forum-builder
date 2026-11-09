'use client';

import * as React from "react"
import { cn } from "@/lib/utils"
import { useHinglishTransliteration } from "@/app/lib/useHinglishTransliteration"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  noTransliterate?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = "text",
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
      type,
    });

    const combinedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      translitKeyDown(e);
      if (onKeyDown) onKeyDown(e);
    };

    const combinedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      translitChange(e);
      if (onChange) onChange(e);
    };

    const combinedBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      translitBlur(e);
      if (onBlur) onBlur(e);
    };

    const combinedPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      translitPaste(e);
      if (onPaste) onPaste(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#111111] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#999999] focus-visible:outline-none focus-visible:border-[#111111] focus-visible:ring-1 focus-visible:ring-[#111111] disabled:cursor-not-allowed disabled:bg-[#F9F9F9] disabled:text-[#888888] disabled:border-[#EAEAEA]",
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
    );
  }
)
Input.displayName = "Input"

export { Input }
