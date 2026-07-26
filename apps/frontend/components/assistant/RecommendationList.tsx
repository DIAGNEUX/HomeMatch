import { Recommendation } from "@/types/assistant";

import RecommendationCard from "./RecommendationCard";

type RecommendationListProps = {
  recommendations: Recommendation[];
};

export default function RecommendationList({
  recommendations,
}: RecommendationListProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.annonce.id}
          recommendation={recommendation}
        />
      ))}
    </section>
  );
}
