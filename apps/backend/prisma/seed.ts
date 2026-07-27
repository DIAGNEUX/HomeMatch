import bcrypt from "bcrypt";
import {
  PrismaClient,
  Role,
  StatutAnnonce,
  TypeAnnonce,
  TypeBien,
} from "@prisma/client";
import fs from "fs";
import path from "path";
import users from "./data/users.json";
import agencies from "./data/agencies.json";
import announcements from "./data/announcements.json";

const prisma = new PrismaClient();
const ANNOUNCEMENTS_PER_CITY = 40;

type SeedAnnouncement = {
  agency: string;
  gallery: string;
  titre: string;
  description: string;
  typeAnnonce: string;
  typeBien: string;
  prix: number;
  surface: number;
  nombrePieces: number;
  nombreSallesBains: number;
  nombreChambres: number;
  etage: number | null;
  anneeConstruction: number | null;
  adresse: string;
  ville: string;
};

type ListingPlan = {
  typeBien: TypeBien;
  typeAnnonce: TypeAnnonce;
};

const cityMarkets = [
  { city: "Paris", sale: 1.45, rent: 1.35 },
  { city: "Marseille", sale: 0.9, rent: 0.92 },
  { city: "Lyon", sale: 1.12, rent: 1.12 },
  { city: "Bordeaux", sale: 1.05, rent: 1.02 },
  { city: "Lille", sale: 0.86, rent: 0.9 },
  { city: "Nantes", sale: 0.92, rent: 0.94 },
  { city: "Toulouse", sale: 0.88, rent: 0.9 },
  { city: "Nice", sale: 1.2, rent: 1.18 },
  { city: "Rennes", sale: 0.84, rent: 0.88 },
  { city: "Strasbourg", sale: 0.82, rent: 0.86 },
  { city: "Le Havre", sale: 0.66, rent: 0.72 },
];

const listingPlans: ListingPlan[] = [
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.APPARTEMENT, typeAnnonce: TypeAnnonce.VENTE },
  { typeBien: TypeBien.STUDIO, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.LOCATION },
  { typeBien: TypeBien.MAISON, typeAnnonce: TypeAnnonce.VENTE },
];

const titleDetails = [
  "proche des transports",
  "avec belle luminosité",
  "dans un quartier calme",
  "avec extérieur",
  "récemment rénové",
  "proche des commerces",
  "avec stationnement",
  "en centre-ville",
  "dans une résidence récente",
  "avec beaux volumes",
];

const streets = [
  "Rue de la République",
  "Avenue Victor Hugo",
  "Rue Nationale",
  "Boulevard Jean Jaurès",
  "Rue des Écoles",
  "Avenue des Tilleuls",
  "Rue Saint-Jean",
  "Cours Gambetta",
  "Rue du Port",
  "Avenue de la Gare",
];

async function seedUsers() {
  console.log("👤 Seeding users...");

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword,
        phone: user.phone,
        role: user.role as Role,
      },
    });
  }

  console.log(`✅ ${users.length} users créés.`);
}

async function seedAgencies() {
  console.log("🏢 Seeding agencies...");

  for (const agency of agencies) {
    const user = await prisma.user.findUnique({
      where: {
        email: agency.email,
      },
    });

    if (!user) {
      console.warn(`⚠️ Utilisateur introuvable : ${agency.email}`);
      continue;
    }

    await prisma.agency.create({
      data: {
        name: agency.name,
        description: agency.description,
        siret: agency.siret,
        phone: agency.phone,
        website: agency.website,
        address: agency.address,
        city: agency.city,
        postalCode: agency.postalCode,
        logo: agency.logo,
        userId: user.id,
      },
    });
  }

  console.log(`✅ ${agencies.length} agences créées.`);
}

function getPrice(
  typeBien: TypeBien,
  typeAnnonce: TypeAnnonce,
  cityIndex: number,
  variantIndex: number
) {
  const market = cityMarkets[cityIndex];
  const spread = 1 + ((variantIndex % 11) - 5) * 0.025;

  if (typeAnnonce === TypeAnnonce.LOCATION) {
    const baseRent =
      typeBien === TypeBien.MAISON ? 1550 : typeBien === TypeBien.STUDIO ? 650 : 1050;

    return Math.round((baseRent * market.rent * spread) / 10) * 10;
  }

  const baseSale =
    typeBien === TypeBien.MAISON ? 430000 : typeBien === TypeBien.STUDIO ? 155000 : 285000;

  return Math.round((baseSale * market.sale * spread) / 1000) * 1000;
}

function getBaseAnnouncementsByType() {
  const baseByType = new Map<TypeBien, SeedAnnouncement[]>();

  for (const announcement of announcements as SeedAnnouncement[]) {
    const typeBien = announcement.typeBien as TypeBien;
    const existingAnnouncements = baseByType.get(typeBien) ?? [];

    baseByType.set(typeBien, [...existingAnnouncements, announcement]);
  }

  return baseByType;
}

function buildAnnouncementVariant(
  announcement: SeedAnnouncement,
  plan: ListingPlan,
  cityIndex: number,
  planIndex: number
): SeedAnnouncement {
  const market = cityMarkets[cityIndex];
  const globalIndex = cityIndex * ANNOUNCEMENTS_PER_CITY + planIndex;
  const detail = titleDetails[globalIndex % titleDetails.length];
  const surfaceDelta = ((globalIndex % 9) - 4) * 3;
  const surface = Math.max(18, announcement.surface + surfaceDelta);
  const bedrooms =
    plan.typeBien === TypeBien.STUDIO
      ? 0
      : Math.max(1, announcement.nombreChambres + ((globalIndex % 3) - 1));
  const rooms =
    plan.typeBien === TypeBien.STUDIO
      ? 1
      : Math.max(bedrooms + 1, announcement.nombrePieces + ((globalIndex % 3) - 1));

  return {
    ...announcement,
    titre: `${announcement.titre} ${detail}`,
    description: `${announcement.description} Ce bien se situe à ${market.city}, avec des caractéristiques adaptées à une recherche ${plan.typeAnnonce === TypeAnnonce.LOCATION ? "en location" : "à l'achat"}.`,
    typeAnnonce: plan.typeAnnonce,
    typeBien: plan.typeBien,
    prix: getPrice(plan.typeBien, plan.typeAnnonce, cityIndex, globalIndex),
    surface,
    nombrePieces: rooms,
    nombreChambres: bedrooms,
    nombreSallesBains: Math.max(
      1,
      Math.min(3, announcement.nombreSallesBains + (globalIndex % 4 === 0 ? 1 : 0))
    ),
    etage:
      plan.typeBien === TypeBien.MAISON
        ? null
        : Math.max(0, ((announcement.etage ?? 1) + globalIndex) % 8),
    anneeConstruction: 2008 + (globalIndex % 16),
    adresse: `${12 + globalIndex} ${streets[globalIndex % streets.length]}`,
    ville: market.city,
  };
}

function buildAnnouncementSeed() {
  const baseByType = getBaseAnnouncementsByType();
  const baseAnnouncements = announcements as SeedAnnouncement[];

  return cityMarkets.flatMap((_, cityIndex) =>
    listingPlans.map((plan, planIndex) => {
      const typedAnnouncements = baseByType.get(plan.typeBien) ?? baseAnnouncements;
      const announcement =
        typedAnnouncements[(cityIndex + planIndex) % typedAnnouncements.length];

      return buildAnnouncementVariant(
        announcement,
        plan,
        cityIndex,
        planIndex
      );
    })
  );
}

async function seedAnnouncements() {
  console.log("🏠 Seeding announcements...");
  const generatedAnnouncements = buildAnnouncementSeed();

  for (const [index, announcement] of generatedAnnouncements.entries()) {
    const agency = await prisma.agency.findFirst({
      where: {
        name: announcement.agency,
      },
    });

    if (!agency) {
      console.warn(`⚠️ Agence introuvable : ${announcement.agency}`);
      continue;
    }

    const createdAnnouncement = await prisma.annonce.create({
      data: {
        titre: announcement.titre,
        description: announcement.description,

        typeAnnonce: announcement.typeAnnonce as TypeAnnonce,
        typeBien: announcement.typeBien as TypeBien,

        prix: announcement.prix,
        surface: announcement.surface,

        nombrePieces: announcement.nombrePieces,
        nombreSallesBains: announcement.nombreSallesBains,
        nombreChambres: announcement.nombreChambres,

        etage: announcement.etage,
        anneeConstruction: announcement.anneeConstruction,

        adresse: announcement.adresse,
        ville: announcement.ville,

        statut: StatutAnnonce.PUBLIEE,

        agencyId: agency.id,
      },
    });
    await seedImages(
    createdAnnouncement.id,
    announcement.gallery,
    index
    );
  }

  console.log(`✅ ${generatedAnnouncements.length} annonces créées.`);
}
function getGalleryFolder(gallery: string): string {
  if (gallery.startsWith("apartment")) {
    return "apartments";
  }

  if (gallery.startsWith("house")) {
    return "houses";
  }

  if (gallery.startsWith("studio")) {
    return "studios";
  }

  throw new Error(`Galerie inconnue : ${gallery}`);
}
async function seedImages(
  announcementId: string,
  gallery: string,
  rotation = 0
) {
  const category = getGalleryFolder(gallery);

  const galleryPath = path.resolve(
    __dirname,
    "../../frontend/public/images/properties",
    category,
    gallery
  );

  if (!fs.existsSync(galleryPath)) {
    console.warn(`⚠️ Dossier introuvable : ${galleryPath}`);
    return;
  }

  const files = fs
  .readdirSync(galleryPath)
  .filter((file) => /\.(avif|jpg|jpeg|png)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.warn(`⚠️ Aucune image trouvée : ${galleryPath}`);
    return;
  }

  const rotatedFiles = files
    .slice(rotation % files.length)
    .concat(files.slice(0, rotation % files.length))
    .slice(0, 5);

  for (const file of rotatedFiles) {
    await prisma.image.create({
      data: {
        url: `/images/properties/${category}/${gallery}/${file}`,
        annonceId: announcementId,
      },
    });
  }
}

async function main() {
  console.log("🧹 Nettoyage de la base...");

  await prisma.image.deleteMany();
  await prisma.annonce.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Base nettoyée.");

  await seedUsers();
  await seedAgencies();
  await seedAnnouncements();

  console.log("🎉 Seed terminé !");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
