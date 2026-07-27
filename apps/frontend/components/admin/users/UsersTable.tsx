"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/agency/common/PageHeader";
import adminService from "@/services/admin.service";
import type { AdminUser } from "@/types/admin";
import DeactivateUserDialog from "./DeactivateUserDialog";

const roleLabel: Record<AdminUser["role"], string> = {
  USER: "Utilisateur",
  AGENCY: "Agence",
  ADMIN: "Admin",
};

export default function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      setUsers(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err);
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivateClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Supervisez les comptes de la plateforme HomeMatch."
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted">
                  Chargement...
                </TableCell>
              </TableRow>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-600">
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-primary">
                    {u.firstName} {u.lastName}
                  </TableCell>
                  <TableCell className="text-muted">{u.email}</TableCell>
                  <TableCell>{roleLabel[u.role]}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        u.isActive
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border-red-100 bg-red-50 text-red-700"
                      }
                    >
                      {u.isActive ? "Actif" : "Désactivé"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {u.isActive && u.role !== "ADMIN" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDeactivateClick(u)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Désactiver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <DeactivateUserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}