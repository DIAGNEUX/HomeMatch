import Link from "next/link";

export default function AgencyPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-5xl font-bold">
          Développez votre activité avec HomeMatch
        </h1>

        <p className="mb-10 text-lg text-gray-600">
          Publiez vos annonces, gérez vos biens et trouvez de nouveaux
          acquéreurs grâce à notre plateforme.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/agency-access/login"
            className="rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
          >
            Se connecter
          </Link>

          <Link
            href="/agency-access/register"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}