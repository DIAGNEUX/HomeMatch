import Link from "next/link";
import { Plus, User, CalendarDays, MessageCircle } from "lucide-react";
import Card from "@/components/ui/Card";

export default function QuickActions() {
  return (
    <Card className="space-y-6 border-accent/20 shadow-[0_18px_45px_-20px_rgba(11,22,44,0.25)]">
      <div>
        <h2 className="text-lg font-semibold text-primary">Actions rapides</h2>
        <p className="mt-1 text-sm text-muted">
          Accédez aux actions les plus importantes pour votre agence.
        </p>
      </div>

      <div className="space-y-3">
        <Link
          href="/agency/properties/create"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <Plus size={18} />
          Ajouter une annonce
        </Link>

        <Link
          href="/agency/visites"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-surface px-4 py-3 text-sm font-semibold text-primary transition hover:bg-gray-50"
        >
          <CalendarDays size={18} />
          Voir les visites
        </Link>

        <Link
          href="/agency/messages"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-surface px-4 py-3 text-sm font-semibold text-primary transition hover:bg-gray-50"
        >
          <MessageCircle size={18} />
          Messages récents
        </Link>

        <Link
          href="/agency/profile"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-surface px-4 py-3 text-sm font-semibold text-primary transition hover:bg-gray-50"
        >
          <User size={18} />
          Modifier mon profil
        </Link>
      </div>
    </Card>
  );
}
