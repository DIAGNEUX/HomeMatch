"use client";

import { useEffect, useState } from "react";

import assistantService from "@/services/assistant.service";

import {
  Message,
  Recommendation,
  RecommendationPayload,
} from "@/types/assistant";
import { Annonce } from "@/types/announcement";

const STORAGE_KEY = "homematch-assistant-conversation";

type StoredConversation = {
  conversationId: string | null;
  messages: Message[];
};

type SendMessageOptions = {
  startNewConversation?: boolean;
};

function readStoredConversation(): StoredConversation | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedConversation = window.sessionStorage.getItem(STORAGE_KEY);

  if (!storedConversation) {
    return null;
  }

  try {
    return JSON.parse(storedConversation) as StoredConversation;
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function isRecommendationPayload(
  recommendation: RecommendationPayload,
): recommendation is Recommendation {
  return "annonce" in recommendation;
}

function normalizeRecommendations(
  recommendations: RecommendationPayload[] = [],
): Recommendation[] {
  return recommendations.map((recommendation) => {
    if (isRecommendationPayload(recommendation)) {
      return recommendation;
    }

    return {
      annonce: recommendation as Annonce,
      highlights: [],
      differences: [],
    };
  });
}

export function useConversation() {
  const [conversationId, setConversationId] = useState<string | null>(
    () => readStoredConversation()?.conversationId ?? null,
  );

  const [messages, setMessages] = useState<Message[]>(
    () => readStoredConversation()?.messages ?? [],
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        conversationId,
        messages,
      }),
    );
  }, [conversationId, messages]);

  const sendMessage = async (
    message: string,
    options: SendMessageOptions = {},
  ) => {
    if (!message.trim()) {
      return;
    }

    const shouldStartNewConversation = options.startNewConversation ?? false;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    if (shouldStartNewConversation) {
      setConversationId(null);
      setMessages([userMessage]);
    } else {
      setMessages((previous) => [...previous, userMessage]);
    }

    setError(null);
    setLoading(true);

    try {
      const payload =
        !shouldStartNewConversation && conversationId
          ? {
              conversationId,
              message,
            }
          : {
              message,
            };

      const response = await assistantService.sendMessage(payload);

      const data = response.data;

      setConversationId(data.conversationId);

      const normalizedRecommendations = normalizeRecommendations(data.annonces);
      const assistantMessage =
        data.nextQuestion ??
        data.message ??
        (normalizedRecommendations.length > 0
          ? `J'ai trouvé ${normalizedRecommendations.length} bien${
              normalizedRecommendations.length > 1 ? "s" : ""
            } qui correspondent à votre recherche.`
          : null);

      if (assistantMessage) {
        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: assistantMessage,
            recommendations: normalizedRecommendations,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return {
    conversationId,
    messages,
    loading,
    error,
    sendMessage,
  };
}
