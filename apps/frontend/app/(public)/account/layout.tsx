import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleRouteGuard role="USER" loginPath="/login">
      {children}
    </RoleRouteGuard>
  );
}
