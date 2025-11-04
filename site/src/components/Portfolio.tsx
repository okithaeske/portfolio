"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Mail, Github, Linkedin, ExternalLink, Moon, Sun } from 'lucide-react';
import { CV_URL, SKILLS, PROJECTS, SOCIAL } from "@/data/portfolio";

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
      if (stored === 'dark') { setIsDark(true); return; }
      if (stored === 'light') { setIsDark(false); return; }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDark(true);
      } else {
        setIsDark(false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
      }
    } catch {}
  }, [isDark]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (current) setActiveSection(current);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = SKILLS;
  const projects = PROJECTS;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 -left-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse`}></div>
        <div className={`absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute -bottom-8 left-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '4s' }}></div>
      </div>

      <nav className={`fixed top-0 w-full z-50 ${isDark ? 'bg-gray-950/80' : 'bg-white/80'} backdrop-blur-lg border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`} role="navigation" aria-label="Primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ESKE
            </div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`transition-colors ${
                    activeSection === item.toLowerCase()
                      ? 'text-cyan-400'
                      : isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div id="mobile-menu" className={`md:hidden ${isDark ? 'bg-gray-900' : 'bg-white'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === item.toLowerCase()
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-current={activeSection === item.toLowerCase() ? 'page' : undefined}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center z-10">
          <div className="mb-8 inline-block">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-1 animate-pulse`}>
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-gray-950' : 'bg-white'} flex items-center justify-center text-4xl font-bold`}>
                OK
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">Okitha Kaluthotage</h1>
          <div className="text-2xl md:text-3xl mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-400 bg-clip-text text-transparent font-semibold">
            Full-Stack Developer & Cloud Architect
          </div>
          <p className={`text-lg md:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-12 max-w-2xl mx-auto`}>
            Building scalable microservices, gamified applications, and seamless user experiences with modern web technologies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
            >
              View Projects
            </button>
            <a
              href={CV_URL}
              download
              className={`px-8 py-4 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} rounded-lg font-semibold border ${isDark ? 'border-gray-700' : 'border-gray-300'} transition-all transform hover:scale-105 flex items-center justify-center gap-2`}
              aria-label="Download CV as PDF"
            >
              <Download className="w-5 h-5" />
              Download CV
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">About Me</h2>
          <div className={`${isDark ? 'bg-gray-900/50' : 'bg-white'} backdrop-blur-sm rounded-2xl p-8 border ${isDark ? 'border-gray-800' : 'border-gray-200'} shadow-xl`}>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-6`}>
              I'm a passionate full-stack developer with expertise in building scalable cloud systems, gamified applications, and modern web experiences.
            </p>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              I specialize in microservices architecture, cloud-native applications, and creating seamless user experiences.
            </p>
          </div>
        </div>
      </section>

      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, idx) => (
              <div
                key={skill}
                className={`${isDark ? 'bg-gray-900/50' : 'bg-white'} backdrop-blur-sm rounded-xl p-6 border ${isDark ? 'border-gray-800 hover:border-cyan-500/50' : 'border-gray-200 hover:border-cyan-500'} transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 text-center`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {skill}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.name}
                className={`${isDark ? 'bg-gray-900/50' : 'bg-white'} backdrop-blur-sm rounded-2xl p-8 border ${isDark ? 'border-gray-800' : 'border-gray-200'} hover:shadow-2xl transition-all hover:scale-105 group`}
              >
                <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${project.gradient} mb-4`}>
                  <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                </div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 leading-relaxed`}>{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map(tech => (
                    <span key={tech} className={`px-3 py-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-full text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.url || '#'}
                  target={project.url ? '_blank' : undefined}
                  rel={project.url ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-2 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors group-hover:gap-4 ${project.url ? '' : 'opacity-50 pointer-events-none'}`}
                >
                  View Project <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`${isDark ? 'bg-gray-900/50' : 'bg-white'} backdrop-blur-sm rounded-2xl p-8 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
              <div className="space-y-4">
                <a href={`mailto:${SOCIAL.email}`} className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors group`}>
                  <Mail className="w-6 h-6 text-cyan-400" />
                  <span className="group-hover:text-cyan-400 transition-colors">{SOCIAL.email}</span>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors group`}>
                  <Github className="w-6 h-6 text-cyan-400" />
                  <span className="group-hover:text-cyan-400 transition-colors">GitHub</span>
                </a>
                <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors group`}>
                  <Linkedin className="w-6 h-6 text-cyan-400" />
                  <span className="group-hover:text-cyan-400 transition-colors">LinkedIn</span>
                </a>
              </div>
            </div>
            <div className={`${isDark ? 'bg-gray-900/50' : 'bg-white'} backdrop-blur-sm rounded-2xl p-8 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const data = new FormData(form);
                  const name = String(data.get('name') || '').trim();
                  const email = String(data.get('email') || '').trim();
                  const message = String(data.get('message') || '').trim();
                  if (!name || !email || !message) { alert('Please fill in all fields.'); return; }
                  alert('Thanks! Your message is ready to be sent. Hook up a provider to submit.');
                  form.reset();
                }}
                aria-label="Contact form"
              >
                <input type="text" name="name" placeholder="Your Name" required className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:border-cyan-500 transition-colors`} />
                <input type="email" name="email" placeholder="Your Email" required className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:border-cyan-500 transition-colors`} />
                <textarea name="message" placeholder="Your Message" rows={4} required className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:border-cyan-500 transition-colors`}></textarea>
                <button type="submit" className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className={`py-8 px-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            © 2024 Okitha Kaluthotage. Built with Next.js, Tailwind CSS & passion.
          </p>
        </div>
      </footer>
    </div>
  );
}


