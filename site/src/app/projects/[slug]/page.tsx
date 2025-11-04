import { PROJECTS } from "@/data/portfolio";
import Link from "next/link";

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find(p => p.slug === params.slug);
  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-4">Project not found</h1>
        <Link href="/" className="text-cyan-600">Go back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${project.gradient} mb-6`}>
        <h1 className="text-3xl md:text-4xl font-bold text-white">{project.name}</h1>
      </div>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{project.description}</p>

      {project.highlights && project.highlights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Highlights</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
            {project.highlights.map((h, i) => (<li key={i}>{h}</li>))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tech.map(t => (
          <span key={t} className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{t}</span>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/" className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700">Back</Link>
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500">View Repo/Demo</a>
        )}
      </div>
    </div>
  );
}


