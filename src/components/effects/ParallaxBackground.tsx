"use client";
import React, { useEffect, useState } from "react";

export default function ParallaxBackground({ isDark }: { isDark: boolean }) {
	const [offset, setOffset] = useState(0);

	useEffect(() => {
		let ticking = false;
		const onScroll = () => {
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
			if (ticking) return;
			ticking = true;
			window.requestAnimationFrame(() => {
				setOffset(window.scrollY);
				ticking = false;
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const translate = (factor: number) => ({ transform: `translateY(${-(offset * factor)}px)` });

	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
			<div className={`absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10 ${isDark ? 'bg-cyan-500' : 'bg-cyan-400/80'}`} style={translate(0.03)} />
			<div className={`absolute top-10 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10 ${isDark ? 'bg-purple-500' : 'bg-purple-400/80'}`} style={translate(0.06)} />
			<div className={`absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10 ${isDark ? 'bg-teal-500' : 'bg-teal-400/80'}`} style={translate(0.045)} />
			{/* subtle grid */}
			<div className={`absolute inset-0 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.05]'}`} style={{ backgroundImage: 'linear-gradient(rgba(120,120,120,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
		</div>
	);
}


