"use client";
import React, { useEffect, useState, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

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

  useEffect(() => {
    let aborted = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { cache: "no-store" });
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const data: Repo[] = await res.json();
        if (aborted) return;
        const selected = data
          .filter(r => !r.name.startsWith(".") && r.stargazers_count >= 0)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        setRepos(selected);
        setError(null);
      } catch (e: any) {
        if (!aborted) setError(e?.message || "Failed to load");
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    load();
    return () => {
      aborted = true;
    };
  }, [username]);

  if (loading) return null;
  if (error || !repos || repos.length === 0) return null;

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {repos.map((repo, idx) => (
            <TiltCard key={repo.id} className={`${isDark ? 'bg-gray-900/50' : 'bg-white'} backdrop-blur-sm rounded-2xl p-8 border ${isDark ? 'border-gray-800' : 'border-gray-200'} hover:shadow-2xl transition-all group`}>
              <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${gradients[idx % gradients.length]} mb-4`}>
                <h3 className="text-2xl font-bold text-white">{repo.name}</h3>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 leading-relaxed`}>{repo.description || 'No description provided.'}</p>
              <div className="flex items-center gap-3 text-sm mb-6">
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{repo.language || 'Unknown'}</span>
                <span className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>•</span>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>⭐ {repo.stargazers_count}</span>
              </div>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors group-hover:gap-4`}>
                View Repo <ExternalLink className="w-4 h-4" />
              </a>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    x.set(Math.max(-50, Math.min(50, px / (rect.width / 2) * 50)));
    y.set(Math.max(-50, Math.min(50, py / (rect.height / 2) * 50)));
  }

  function onMouseLeave() {
    x.set(0); y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}


