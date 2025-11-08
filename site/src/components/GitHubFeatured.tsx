"use client";
import React, { useEffect, useState } from "react";

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

	if (loading) return (
		<div className="py-10 text-center text-sm text-zinc-500">Loading GitHub projects…</div>
	);
	if (error) return (
		<div className="py-10 text-center text-sm text-red-500">Could not load GitHub repos.</div>
	);
	if (!repos || repos.length === 0) return null;

	return (
		<section className="py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-4xl font-bold mb-12 text-center bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
					Open Source Highlights
				</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{repos.map(repo => (
						<a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/50 hover:shadow-xl transition-all hover:-translate-y-0.5">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{repo.name}</h3>
								<div className="text-xs text-gray-500 dark:text-gray-400">⭐ {repo.stargazers_count} · ⑂ {repo.forks_count}</div>
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{repo.description || "No description"}</p>
							<div className="text-xs px-2 py-1 rounded-full inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
								{repo.language || "Unknown"}
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
