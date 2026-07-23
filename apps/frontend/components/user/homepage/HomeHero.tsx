import { homeHeroContent } from "./home-content";
import HomeHeroImage from "./HomeHeroImage";
import HomeSearchCard from "./HomeSearchCard";

export default function HomeHero() {
  return (
    <section className="home-hero-section relative overflow-hidden bg-white px-4 pb-12 pt-7 sm:px-6 lg:px-8 lg:pb-16 lg:pt-5">
      <div className="home-hero-grid grid items-start gap-8 lg:gap-10">
        <div className="pt-8 lg:pt-20">
          <h1 className="home-hero-title text-5xl font-medium">
            {homeHeroContent.title}
          </h1>

          <p className="home-hero-description mt-6 text-lg leading-8">
            {homeHeroContent.description.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className="relative z-10 flex justify-end">
          <HomeHeroImage />
        </div>
      </div>

      <div className="home-hero-search-card">
        <HomeSearchCard />
      </div>
    </section>
  );
}
