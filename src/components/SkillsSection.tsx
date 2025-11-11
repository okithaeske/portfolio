"use client";
import React, { useEffect, useMemo, useState } from "react";
import { SpotlightCard, StarBorder } from "@appletosolutions/reactbits";
import Reveal from "@/components/animations/Reveal";

type Repo = { language: string | null };

const CATEGORY_MAP: Record<string, string> = {
	"TypeScript": "Core",
	"JavaScript": "Core",
	"HTML5": "Core",
	"Next.js": "Core",
	"React": "Core",
	"Node.js": "Backend",
	"Express": "Backend",
	".NET": "Backend",
	"C#": "Backend",
	"Java": "Backend",
	"Go": "Backend",
	"Python": "Backend",
	"Dart": "Mobile",
	"Flutter": "Mobile",
	"Swift": "Mobile",
	"Kotlin": "Mobile",
	"AWS": "Cloud/DevOps",
	"Azure": "Cloud/DevOps",
	"Docker": "Cloud/DevOps",
	"Kubernetes": "Cloud/DevOps",
	"Kafka": "Cloud/DevOps",
	"Terraform": "Cloud/DevOps",
	"Firebase": "Cloud/DevOps",
	"PostgreSQL": "Databases",
	"MongoDB": "Databases",
	"MySQL": "Databases",
	"SQLite": "Databases",
	"Redis": "Databases",
	"Prisma": "Databases",
	"MicrosoftSQLServer": "Databases",
	"TailwindCSS": "Core",
	"PHP": "Backend",
	"NumPy": "Data/ML",
	"Pandas": "Data/ML",
	"Matplotlib": "Data/ML",
	"scikit-learn": "Data/ML",
	"TensorFlow": "Data/ML",
	"GitHub": "Tools",
	"Postman": "Tools",
	"Trello": "Tools",
	"Figma": "Tools",
	"Canva": "Tools",
};

const DISPLAY_ORDER = [
	"Core",
	"Backend",
	"Cloud/DevOps",
	"Mobile",
	"Databases",
  "Data/ML",
  "Tools",
];

const normalize = (lang: string): string => {
	const map: Record<string, string> = {
		"Jupyter Notebook": "Python",
		"C#": "C#",
		"C++": "C++",
		"C": "C",
	};
	return map[lang] || lang;
};

export default function SkillsSection({
	isDark,
	username,
	baseSkills,
}: {
	isDark: boolean;
	username: string;
	baseSkills: string[];
}) {
	const [ghSkills, setGhSkills] = useState<string[]>([]);

	useEffect(() => {
		let aborted = false;
		(async () => {
			try {
				const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { cache: "no-store" });
				if (!res.ok) throw new Error("github");
				const data: Repo[] = await res.json();
				if (aborted) return;
				const langs = Array.from(new Set(
					data
						.map(r => r.language)
						.filter((l): l is string => Boolean(l))
						.map(normalize)
				));
				setGhSkills(langs);
			} catch {
				setGhSkills([]);
			}
		})();
		return () => { aborted = true; };
	}, [username]);

	const grouped = useMemo(() => {
		const merged = Array.from(new Set([...baseSkills, ...ghSkills]));
		const byCat = new Map<string, string[]>();
		for (const skill of merged) {
			const cat = CATEGORY_MAP[skill] || "Core";
			const arr = byCat.get(cat) || [];
			if (!arr.includes(skill)) arr.push(skill);
			byCat.set(cat, arr);
		}
		return DISPLAY_ORDER.map(cat => ({ title: cat, items: (byCat.get(cat) || []).sort() })).filter(g => g.items.length);
	}, [baseSkills, ghSkills]);

	return (
		<section id="skills" className="py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-4xl font-bold mb-12 text-center bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Tech Stack</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{grouped.map((group, idx) => (
						<Reveal key={group.title} delay={idx * 80}>
							<SpotlightCard
								spotlightColor={isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.2)'}
								className={`h-full rounded-2xl border p-6 backdrop-blur ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/90 shadow-lg'}`}
							>
								<StarBorder
									as="div"
									color="rgba(14, 165, 233, 0.85)"
									speed={`${4 + idx}s`}
									className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
								>
									{group.title}
								</StarBorder>
								<div className="mt-4 flex flex-wrap gap-2">
									{group.items.map(item => (
										<span
											key={item}
											className={`rounded-full px-3 py-1 text-sm font-medium shadow-sm ${isDark ? 'bg-gray-900/70 text-gray-100' : 'bg-slate-100 text-slate-700'}`}
										>
											{item}
										</span>
									))}
								</div>
							</SpotlightCard>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}


