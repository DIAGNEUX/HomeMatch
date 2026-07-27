"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

import { useConversation } from "@/hooks/useConversation";
import { Message } from "@/types/assistant";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import RecommendationList from "./RecommendationList";
import TypingIndicator from "./TypingIndicator";

type AssistantChatProps = {
  initialMessage?: string;
};

const welcomeMessage: Message = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Bonjour, je suis HomeMatch AI. Décrivez votre projet immobilier, je vous poserai les questions utiles puis je vous proposerai les biens les plus adaptés.",
};

export default function AssistantChat({ initialMessage = "" }: AssistantChatProps) {
  const hasSentInitialMessage = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { messages, loading, error, sendMessage } = useConversation();

  useEffect(() => {
    const trimmedInitialMessage = initialMessage.trim();

    if (
      !trimmedInitialMessage ||
      hasSentInitialMessage.current ||
      messages.length > 0
    ) {
      return;
    }

    hasSentInitialMessage.current = true;
    void sendMessage(trimmedInitialMessage);
  }, [initialMessage, messages.length, sendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const displayedMessages = messages.length > 0 ? messages : [welcomeMessage];

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl flex-col">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#0B162C]">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#0B162C]">
              Assistant HomeMatch
            </h1>
            <p className="text-sm text-[#5B6F86]">
              Recherche conversationnelle de biens immobiliers
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 pb-8">
          {displayedMessages.map((message) => (
            <div key={message.id} className="space-y-4">
              <MessageBubble message={message} />
              {message.recommendations && (
                <RecommendationList recommendations={message.recommendations} />
              )}
            </div>
          ))}

          {loading && <TypingIndicator />}

          {error && (
            <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-4">
          <MessageInput disabled={loading} onSend={sendMessage} />
        </div>
      </div>
    </section>
  );
}
