-- CreateEnum
CREATE TYPE "StatutDemandeVisite" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'ANNULEE', 'TERMINEE');

-- CreateTable
CREATE TABLE "demandes_visite" (
    "id" TEXT NOT NULL,
    "dateDemande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateVisiteSouhaitee" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "statut" "StatutDemandeVisite" NOT NULL DEFAULT 'EN_ATTENTE',
    "annonceId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demandes_visite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "demandes_visite_annonceId_idx" ON "demandes_visite"("annonceId");

-- CreateIndex
CREATE INDEX "demandes_visite_utilisateurId_idx" ON "demandes_visite"("utilisateurId");

-- CreateIndex
CREATE INDEX "demandes_visite_statut_idx" ON "demandes_visite"("statut");

-- AddForeignKey
ALTER TABLE "demandes_visite" ADD CONSTRAINT "demandes_visite_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "annonces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demandes_visite" ADD CONSTRAINT "demandes_visite_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
