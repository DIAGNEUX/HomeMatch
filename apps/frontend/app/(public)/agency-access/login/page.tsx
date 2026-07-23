import LoginForm from "@/components/auth/LoginForm";

export default function AgencyLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <LoginForm
        redirectTo="/agency"
        registerHref="/agency-access/register"
        registerLabel="Pas encore de compte agence ? Créer un compte"
      />
    </main>
  );
}
