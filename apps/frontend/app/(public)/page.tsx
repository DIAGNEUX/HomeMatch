import HomeHero from "@/components/user/homepage/HomeHero";
import HomeRoleRedirect from "@/components/user/homepage/HomeRoleRedirect";

export default function HomePage() {
  return (
    <HomeRoleRedirect>
      <HomeHero />
    </HomeRoleRedirect>
  );
}
