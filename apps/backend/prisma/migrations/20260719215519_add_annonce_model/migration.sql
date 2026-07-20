-- CreateEnum
CREATE TYPE "TypeAnnonce" AS ENUM ('VENTE', 'LOCATION');

-- CreateEnum
CREATE TYPE "TypeBien" AS ENUM ('APPARTEMENT', 'MAISON', 'STUDIO', 'TERRAIN', 'LOCAL_COMMERCIAL', 'AUTRE');

-- CreateTable
CREATE TABLE "annonces" (
    "id" TEXT NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "typeAnnonce" "TypeAnnonce" NOT NULL,
    "typeBien" "TypeBien" NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "surface" DOUBLE PRECISION NOT NULL,
    "nombrePieces" INTEGER NOT NULL,
    "nombreSallesBains" INTEGER NOT NULL,
    "nombreChambres" INTEGER NOT NULL,
    "etage" INTEGER,
    "anneeConstruction" INTEGER,
    "adresse" VARCHAR(255) NOT NULL,
    "ville" VARCHAR(100) NOT NULL,
    "agencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annonces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "annonces_agencyId_idx" ON "annonces"("agencyId");

-- CreateIndex
CREATE INDEX "annonces_ville_idx" ON "annonces"("ville");

-- CreateIndex
CREATE INDEX "annonces_typeAnnonce_typeBien_idx" ON "annonces"("typeAnnonce", "typeBien");

-- AddForeignKey
ALTER TABLE "annonces" ADD CONSTRAINT "annonces_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
