import Image from "next/image";

export default function HomeHeroImage() {
  return (
    <div
      className="home-hero-image relative mx-auto w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm lg:mx-0"
    >
      <Image
        src="/images/homepage/hero-house.png"
        alt="Maison moderne avec jardin"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 32vw"
        className="object-cover"
      />
    </div>
  );
}
