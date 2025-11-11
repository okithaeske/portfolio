"use client";
import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { SpotlightCard, StarBorder, GlareHover } from "@appletosolutions/reactbits";
import Reveal from "@/components/animations/Reveal";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
};

const gradients = [
  "from-cyan-500 to-teal-500",
  "from-purple-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-green-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-indigo-500",
];

export default function FeaturedProjects({ username, isDark }: { username: string; isDark: boolean }) {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let aborted = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=60`, { cache: "no-store" });
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const data: Repo[] = await res.json();
        if (aborted) return;
        const selected = data
          .filter(r => !r.name.startsWith(".") && r.stargazers_count >= 0)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        setRepos(selected);
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
  }, [username, reloadKey]);
  
  const handleRetry = () => setReloadKey(key => key + 1);

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        {(() => {
          if (loading) {
            return (
              <div className="grid gap-8 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-56 rounded-3xl border ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-white/90'} animate-pulse`}
                  />
                ))}
              </div>
            );
          }

          if (error) {
            return (
              <div className={`rounded-3xl border px-6 py-10 text-center ${isDark ? 'border-red-500/20 bg-red-500/10 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
                <p className="text-base font-medium">Couldn&apos;t reach GitHub ({error}).</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-linear-to-r from-cyan-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow"
                >
                  Try again
                </button>
              </div>
            );
          }

          if (!repos || repos.length === 0) {
            return (
              <div className={`rounded-3xl border px-6 py-10 text-center ${isDark ? 'border-white/5 bg-white/5 text-gray-300' : 'border-slate-200 bg-white text-gray-600'}`}>
                <p className="font-medium">No public repositories to show yet.</p>
                <p className="mt-2 text-sm">Add manual highlights in <span className="font-mono">src/data/portfolio.ts</span>.</p>
              </div>
            );
          }

          return (
            <div className="grid gap-8 md:grid-cols-2">
              {repos.map((repo, idx) => (
                <Reveal key={repo.id} delay={idx * 120}>
                  <GlareHover
                    className="rounded-3xl"
                    background={isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.95)"}
                    borderRadius="1.75rem"
                    glareColor="rgba(34, 211, 238, 0.35)"
                    glareOpacity={0.45}
                  >
                    <SpotlightCard
                      spotlightColor="rgba(59, 130, 246, 0.2)"
                      className={`h-full rounded-3xl border p-8 backdrop-blur ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/90 shadow-2xl'}`}
                    >
                      <div className={`inline-flex items-center rounded-2xl bg-gradient-to-r ${gradients[idx % gradients.length]} px-4 py-2 text-white`}>
                        <h3 className="text-2xl font-bold tracking-tight">{repo.name}</h3>
                      </div>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 mt-4 leading-relaxed`}>
                        {repo.description || 'No description provided.'}
                      </p>
                      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                        <span className={`rounded-full px-3 py-1 ${isDark ? 'bg-cyan-500/10 text-cyan-200' : 'bg-cyan-50 text-cyan-700'}`}>
                          {repo.language || 'Unknown'}
                        </span>
                        <span className={`flex items-center gap-2 ${isDark ? 'text-amber-200' : 'text-amber-600'}`}>
                          ★ {repo.stargazers_count}
                        </span>
                      </div>
                      <StarBorder
                        as="a"
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
                        color="rgba(14, 165, 233, 0.8)"
                      >
                        View Repo
                        <ExternalLink className="w-4 h-4" />
                      </StarBorder>
                    </SpotlightCard>
                  </GlareHover>
                </Reveal>
              ))}
            </div>
          );
        })()}
      </div>
    </section>
  );
}
