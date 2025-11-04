import Portfolio from "@/components/Portfolio";
import GitHubFeatured from "@/components/GitHubFeatured";
import { SOCIAL } from "@/data/portfolio";
import ScrollPin from "@/components/effects/ScrollPin";

export default function Home() {
  return (
    <main>
      <Portfolio />
      <ScrollPin>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">I design systems for scale and teams for speed.</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Architecture, developer experience, and measurable outcomes over hype.</p>
        </div>
      </ScrollPin>
      <GitHubFeatured username={SOCIAL.github.replace('https://github.com/','')} />
    </main>
  );
}
