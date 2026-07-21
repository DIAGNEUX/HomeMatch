import Link from "next/link";
import { Plus, User } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Actions rapides
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Accédez rapidement aux actions les plus fréquentes de votre agence.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/agency/properties/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Ajouter une annonce
        </Link>

        <Link
          href="/agency/profile"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <User size={18} />
          Modifier mon profil
        </Link>
      </div>
    </div>
  );
}