import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface WelcomeCardProps {
  firstName: string;
}

export default function WelcomeCard({ firstName }: WelcomeCardProps) {
  return (
    <Card className="space-y-8 bg-gradient-to-br from-accent/10 via-white to-white">
      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Espace agence
        </span>

        <div className="space-y-3">
          <h2 className="text-4xl font-semibold text-primary">
            Bonjour {firstName} 👋
          </h2>

          <p className="max-w-2xl text-sm text-muted">
            Suivez vos annonces, demandes et visites en un seul endroit. Votre tableau de bord
            vous aide à garder le contrôle et à saisir les opportunités rapidement.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Ajouter une annonce</Button>
        <Button variant="outline">Voir les visites</Button>
      </div>
    </Card>
  );
}
