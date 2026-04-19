import { Github, Star, GitFork, ExternalLink } from "lucide-react";

export default function ProfileGithub({ repos, loading, username, error }) {
  console.log('Fetching for username:', username);

  if (loading) {
    return (
      <div className="mt-8 border-t border-white/10 pt-8">
        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
          <Github className="w-5 h-5 text-white" /> Verified GitHub Repositories
        </h3>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-32 bg-white/5 rounded-xl w-full"></div>
          <div className="h-32 bg-white/5 rounded-xl w-full hidden md:block"></div>
          <div className="h-32 bg-white/5 rounded-xl w-full hidden lg:block"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
        <Github className="w-5 h-5 text-white" /> Verified GitHub Repositories
      </h3>

      {error ? (
        <div className="p-6 rounded-xl border border-red-500/20 text-red-400 text-center bg-red-500/5 text-sm md:text-base leading-relaxed">
          Could not fetch repositories. Please ensure your GitHub username is correct.
        </div>
      ) : !repos || repos.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-white/10 text-gray-500 text-center select-none bg-white/5 text-sm md:text-base">
          No public repositories found for this user.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#8b949e] transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden"
            >
              {/* Subtle gradient to mimic github's card */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#58a6ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h4 className="text-[#58a6ff] font-semibold text-base truncate group-hover:underline">
                    {repo.name}
                  </h4>
                  <ExternalLink className="w-4 h-4 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
                {repo.description && (
                  <p className="text-[#8b949e] text-sm line-clamp-2 mb-4 leading-relaxed">
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-[#8b949e] mt-auto font-medium">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span 
                      className="w-3 h-3 rounded-full border border-white/10" 
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    ></span>
                    {repo.language}
                  </span>
                )}
                {repo.stargazers_count > 0 && (
                  <span className="flex items-center gap-1 hover:text-[#58a6ff] transition-colors cursor-pointer">
                    <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
                  </span>
                )}
                {repo.forks_count > 0 && (
                  <span className="flex items-center gap-1 hover:text-[#58a6ff] transition-colors cursor-pointer">
                    <GitFork className="w-3.5 h-3.5" /> {repo.forks_count}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Map common languages to GitHub's colors
function getLanguageColor(lang) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    React: "#61dafb",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    PHP: "#4F5D95"
  };
  return colors[lang] || "#8b949e";
}