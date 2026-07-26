import { Suspense } from "react";
import SearchPage from "@/components/user/search/SearchPage";

export default function RecherchePage() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}