-- CreateEnum
CREATE TYPE "StatutAnnonce" AS ENUM ('BROUILLON', 'PUBLIEE');

-- AlterTable
ALTER TABLE "annonces" ADD COLUMN     "statut" "StatutAnnonce" NOT NULL DEFAULT 'BROUILLON';
