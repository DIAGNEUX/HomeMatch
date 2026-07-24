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

async function seedAnnouncements() {
  console.log("🏠 Seeding announcements...");

  for (const announcement of announcements) {
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
    announcement.gallery
    );
  }

  console.log(`✅ ${announcements.length} annonces créées.`);
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
  gallery: string
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
  .filter((file) => /\.(avif|jpg|jpeg|png)$/i.test(file));

  for (const file of files) {
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