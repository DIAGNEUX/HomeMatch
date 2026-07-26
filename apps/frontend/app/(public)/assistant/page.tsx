import AssistantChat from "@/components/assistant/AssistantChat";

type AssistantPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function AssistantPage({
  searchParams,
}: AssistantPageProps) {
  const params = await searchParams;

  return <AssistantChat initialMessage={params.message ?? ""} />;
}
