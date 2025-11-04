"use client";
import React, { useEffect, useMemo, useState } from "react";

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
				<h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Tech Stack</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{grouped.map(group => (
						<div key={group.title} className={`${isDark ? 'bg-gray-900/50' : 'bg-white'} backdrop-blur-sm rounded-xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
							<div className="text-sm uppercase tracking-wide mb-3 text-cyan-400">{group.title}</div>
							<div className="flex flex-wrap gap-2">
								{group.items.map(item => (
									<span key={item} className={`px-3 py-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-full text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}


