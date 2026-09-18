import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ExternalLink, 
  Github, 
  Bot, 
  Music, 
  MapPin, 
  Code, 
  Sparkles, 
  Star, 
  GitFork, 
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface Repository {
  id: number;
  name: string;
  displayTitle: string;
  description: string;
  html_url: string;
  homepage?: string | null;
  language?: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  gradient: string;
  icon: React.ElementType;
}

// Default fallback projects from user's GitHub profile
const FALLBACK_REPOS: Repository[] = [
  {
    id: 1287367486,
    name: "Smart-AI-Hiring",
    displayTitle: "Smart AI Hiring",
    description: "Intelligent recruitment and candidate screening platform powered by Machine Learning & NLP algorithms.",
    html_url: "https://github.com/dphp-2106/Smart-AI-Hiring",
    homepage: null,
    language: "Python",
    stargazers_count: 1,
    forks_count: 0,
    topics: ["Python", "AI", "NLP", "Machine Learning"],
    gradient: "from-purple-500 to-indigo-600",
    icon: Bot
  },
  {
    id: 1286836029,
    name: "Music-Generation-Using-AI",
    displayTitle: "Music Generation Using AI",
    description: "Deep learning music synthesis model that generates original melodies and audio patterns automatically.",
    html_url: "https://github.com/dphp-2106/Music-Generation-Using-AI",
    homepage: null,
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["TypeScript", "Deep Learning", "Generative AI", "Audio"],
    gradient: "from-pink-500 to-rose-600",
    icon: Music
  },
  {
    id: 1187941123,
    name: "touristmarg",
    displayTitle: "TouristMarg Exploration Guide",
    description: "Interactive travel guide helping tourists discover deep historical & archaeological destinations with smart routing.",
    html_url: "https://github.com/dphp-2106/touristmarg",
    homepage: "https://touristmarg.vercel.app",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 1,
    topics: ["TypeScript", "Next.js", "Maps", "Vercel"],
    gradient: "from-amber-400 to-orange-600",
    icon: MapPin
  },
  {
    id: 1332121647,
    name: "Dhairya-s-Portfolio",
    displayTitle: "Personal Portfolio Website",
    description: "Personal AI Engineer portfolio showcasing full-stack projects, ML models, and experience.",
    html_url: "https://github.com/dphp-2106/Dhairya-s-Portfolio",
    homepage: null,
    language: "HTML",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["HTML", "CSS", "JavaScript", "Portfolio"],
    gradient: "from-blue-500 to-cyan-500",
    icon: Sparkles
  },
  {
    id: 1290782277,
    name: "Student-Portfolio_24AIML032",
    displayTitle: "Student AI/ML Portfolio",
    description: "Interactive portfolio application for AI & ML academic coursework, projects, and machine learning research.",
    html_url: "https://github.com/dphp-2106/Student-Portfolio_24AIML032",
    homepage: null,
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["JavaScript", "React", "AI/ML", "Academic"],
    gradient: "from-emerald-400 to-teal-600",
    icon: Code
  },
  {
    id: 1322081000,
    name: "Student-Portfolio_24AIML032_Backend",
    displayTitle: "Portfolio Backend Service",
    description: "RESTful API microservice backend supporting candidate data processing, analytics, and authentication.",
    html_url: "https://github.com/dphp-2106/Student-Portfolio_24AIML032_Backend",
    homepage: null,
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["Node.js", "Express", "REST API", "Backend"],
    gradient: "from-violet-500 to-purple-700",
    icon: FolderGit2
  }
];

const GRADIENTS = [
  "from-purple-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-amber-400 to-orange-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-400 to-teal-600",
  "from-violet-500 to-purple-700"
];

function getIconForRepo(name: string, language?: string | null): React.ElementType {
  const n = name.toLowerCase();
  if (n.includes('music') || n.includes('audio')) return Music;
  if (n.includes('hiring') || n.includes('ai') || n.includes('bot')) return Bot;
  if (n.includes('tour') || n.includes('map') || n.includes('guide')) return MapPin;
  if (n.includes('portfolio') || n.includes('web')) return Sparkles;
  if (language === 'Python') return Bot;
  if (language === 'TypeScript' || language === 'JavaScript') return Code;
  return FolderGit2;
}

function formatTitle(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/24AIML032/gi, '')
    .trim();
}

export function Projects() {
  const [repos, setRepos] = useState<Repository[]>(FALLBACK_REPOS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubProjects() {
      try {
        setIsLoading(true);
        const res = await fetch('https://api.github.com/users/dphp-2106/repos?sort=updated&per_page=12');
        if (!res.ok) {
          throw new Error('Failed to fetch GitHub repositories');
        }
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const formatted: Repository[] = data
            .filter((repo: any) => !repo.fork && repo.name !== '.github')
            .map((repo: any, index: number) => ({
              id: repo.id,
              name: repo.name,
              displayTitle: formatTitle(repo.name),
              description: repo.description || `Open-source project ${repo.name} developed by Dhairya Patel.`,
              html_url: repo.html_url,
              homepage: repo.homepage,
              language: repo.language || 'Code',
              stargazers_count: repo.stargazers_count,
              forks_count: repo.forks_count,
              topics: repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language || 'Code', 'GitHub'],
              gradient: GRADIENTS[index % GRADIENTS.length],
              icon: getIconForRepo(repo.name, repo.language)
            }));
            
          if (formatted.length > 0) {
            setRepos(formatted);
          }
        }
      } catch (err: any) {
        console.warn('GitHub API live fetch error, using fallback data:', err);
        setError('Showing cached GitHub repositories');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGitHubProjects();
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <Github size={16} />
            <span>Synced Live with GitHub</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore my latest open-source AI models, full-stack web applications, and Machine Learning repositories from GitHub.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id || project.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => window.open(project.html_url, '_blank')}
              >
                <Card className="bg-gray-900/60 border-gray-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden relative h-full flex flex-col justify-between shadow-lg hover:shadow-blue-500/10">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  <div>
                    <CardHeader className="relative pb-3">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`p-3 rounded-xl bg-gradient-to-r ${project.gradient} bg-opacity-20 text-white shadow-md`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex items-center space-x-2">
                          {project.homepage && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-400 hover:text-white hover:bg-blue-600/30 p-2 h-8 w-8 rounded-lg"
                              title="View Live Demo"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.homepage!, '_blank');
                              }}
                            >
                              <ExternalLink size={16} />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-white hover:bg-purple-600/30 p-2 h-8 w-8 rounded-lg"
                            title="View GitHub Repository"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.html_url, '_blank');
                            }}
                          >
                            <Github size={16} />
                          </Button>
                        </div>
                      </div>

                      <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                        {project.displayTitle}
                      </CardTitle>

                      <CardDescription className="text-gray-400 text-sm mt-2 line-clamp-3 leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                  </div>

                  <CardContent className="relative pt-0">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.language && (
                        <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-400/30">
                          {project.language}
                        </span>
                      )}
                      {project.topics && project.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2.5 py-0.5 bg-purple-500/10 text-purple-300 rounded-full text-xs border border-purple-400/20"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
                      <div className="flex items-center space-x-3">
                        {project.stargazers_count > 0 && (
                          <span className="flex items-center space-x-1 text-amber-400 font-medium">
                            <Star size={13} className="fill-amber-400" />
                            <span>{project.stargazers_count}</span>
                          </span>
                        )}
                        {project.forks_count > 0 && (
                          <span className="flex items-center space-x-1 text-gray-400">
                            <GitFork size={13} />
                            <span>{project.forks_count}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-blue-400 group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1 font-medium text-xs">
                        View Code &rarr;
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group"
            onClick={() => window.open('https://github.com/dphp-2106', '_blank')}
          >
            <Github size={18} className="mr-2" />
            <span>Explore All Repositories on GitHub</span>
            <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}