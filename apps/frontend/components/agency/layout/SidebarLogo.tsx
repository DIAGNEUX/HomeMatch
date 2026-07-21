import Link from "next/link";

export default function SidebarLogo() {
  return (
    <div className="border-b px-6 py-5">
      <Link href="/" className="block">
        <h1 className="text-2xl font-bold text-blue-600">
          HomeMatch
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Espace Agence
        </p>
      </Link>
    </div>
  );
}