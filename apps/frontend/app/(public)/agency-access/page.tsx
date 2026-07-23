import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AgencyPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="mb-6 text-5xl font-bold leading-tight text-primary">
          Développez votre activité avec HomeMatch
        </h1>

        <p className="mb-10 text-lg leading-8 text-secondary">
          Publiez vos annonces, gérez vos biens et trouvez de nouveaux acquéreurs
          grâce à notre plateforme.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            variant="outline"
            className="h-12 cursor-pointer rounded-2xl border-primary px-8 text-base font-semibold text-primary hover:bg-gray-50 hover:text-primary"
          >
            <Link href="/agency-access/login">Se connecter</Link>
          </Button>

          <Button
            asChild
            className="h-12 cursor-pointer rounded-2xl bg-primary px-8 text-base font-semibold text-white hover:bg-primary-800"
          >
            <Link href="/agency-access/register">Créer un compte</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
