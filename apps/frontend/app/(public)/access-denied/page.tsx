import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold text-[#0B162C]">
          Accès refusé
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Votre compte ne permet pas d'accéder à cet espace.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/">Accueil</Link>
          </Button>
          <Button asChild className="bg-[#0B162C] text-white hover:bg-[#1C2942]">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
