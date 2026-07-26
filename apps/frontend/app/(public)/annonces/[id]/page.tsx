import AnnonceDetail from "@/components/user/search/AnnonceDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnnonceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AnnonceDetail id={id} />;
}