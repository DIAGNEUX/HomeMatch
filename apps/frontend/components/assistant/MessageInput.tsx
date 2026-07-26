"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";

type MessageInputProps = {
  disabled?: boolean;
  onSend: (message: string) => void;
};

export default function MessageInput({ disabled, onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const submitMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-17 items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-[0_16px_42px_-24px_rgba(11,22,44,0.65)] ring-1 ring-gray-100"
    >
      <label htmlFor="assistant-message" className="sr-only">
        Message pour HomeMatch AI
      </label>

      <textarea
        id="assistant-message"
        rows={1}
        value={message}
        disabled={disabled}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Exemple : Je cherche un appartement T3 à Lyon avec un balcon et proche du métro."
        className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-[#0B162C] outline-none placeholder:text-[#9CA3AD] disabled:cursor-not-allowed"
      />

      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || disabled}
        aria-label="Envoyer le message"
        className="size-9 rounded-lg bg-[#5FC2BA] text-[#0B162C] hover:bg-[#4BB4AC]"
      >
        <ArrowUp size={18} />
      </Button>
    </form>
  );
}
