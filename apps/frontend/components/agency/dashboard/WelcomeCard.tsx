interface WelcomeCardProps {
  firstName: string;
}

export default function WelcomeCard({
  firstName,
}: WelcomeCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-8">
      <h2 className="text-2xl font-semibold">
        Bonjour {firstName} 👋
      </h2>

      <p className="mt-2 text-gray-500">
        Bienvenue sur votre espace agence HomeMatch.
      </p>
    </div>
  );
}