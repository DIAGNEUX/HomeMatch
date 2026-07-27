import { homeHeroContent } from "./home-content";
import HomeHeroImage from "./HomeHeroImage";
import HomeSearchCard from "./HomeSearchCard";

export default function HomeHero() {
  return (
    <section className="home-hero-section overflow-hidden bg-white px-4 pb-8 pt-3 sm:px-6 lg:px-8 lg:pb-10 lg:pt-3">
      <div className="home-hero-grid relative grid items-start gap-8">
        <div className="home-hero-copy">
          <h1 className="home-hero-title text-5xl font-medium">
            {homeHeroContent.titleLines.map((line, index) => (
              <span
                key={line}
                className={
                  index === 0 ? "home-hero-title-first block" : "block"
                }
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="home-hero-description mt-6 text-lg leading-8">
            {homeHeroContent.description.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <div className="home-hero-search-card">
            <HomeSearchCard />
          </div>
        </div>

        <div className="relative z-10 flex justify-end">
          <HomeHeroImage />
        </div>
      </div>
    </section>
  );
}
