"use client";
import React, { useEffect, useState } from "react";
import { SpotlightCard, StarBorder } from "@appletosolutions/reactbits";
import Reveal from "@/components/animations/Reveal";
import { ExternalLink, GitFork, Star } from "lucide-react";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
};

export default function GitHubFeatured({ username }: { username: string }) {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aborted = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { cache: "no-store" });
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const data: Repo[] = await res.json();
        if (aborted) return;
        const filtered = data
          .filter(r => !r.name.startsWith(".") && !r.name.includes("-template"))
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        setRepos(filtered);
        setError(null);
      } catch (error) {
        if (!aborted) setError(error instanceof Error ? error.message : "Failed to load");
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    load();
    return () => {
      aborted = true;
    };
  }, [username]);

  if (loading) return <div className="py-10 text-center text-sm text-zinc-500">Loading GitHub projects...</div>;
  if (error) return <div className="py-10 text-center text-sm text-red-500">Could not load GitHub repos.</div>;
  if (!repos || repos.length === 0) return null;

  return (
    <section className="relative py-20 px-4">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.4) 1px, transparent 0)',
          backgroundSize: '52px 52px',
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold mb-12 text-center bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Open Source Highlights
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo, idx) => (
            <Reveal key={repo.id} delay={idx * 90}>
              <SpotlightCard
                spotlightColor="rgba(34, 211, 238, 0.2)"
                className="h-full rounded-2xl border border-white/10 bg-white/85 p-6 text-left backdrop-blur dark:border-gray-800/60 dark:bg-gray-900/70"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{repo.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-500">
                      <GitFork className="h-4 w-4" />
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{repo.description || 'No description'}</p>
                <div className="mt-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                  {repo.language || 'Unknown'}
                </div>
                <StarBorder
                  as="a"
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white"
                  color="rgba(14, 165, 233, 0.8)"
                >
                  Open Repo
                  <ExternalLink className="h-4 w-4" />
                </StarBorder>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
