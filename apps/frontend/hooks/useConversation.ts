"use client";

import { useState } from "react";

import assistantService from "@/services/assistant.service";

import {
  Message,
  Recommendation,
  RecommendationPayload,
} from "@/types/assistant";
import { Annonce } from "@/types/announcement";

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
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    if (!message.trim()) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      },
    ]);

    setError(null);
    setRecommendations([]);
    setLoading(true);

    try {
      const payload = conversationId
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
          },
        ]);
      }

      if (normalizedRecommendations.length) {
        setRecommendations(normalizedRecommendations);
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    recommendations,
    loading,
    error,
    sendMessage,
  };
}
