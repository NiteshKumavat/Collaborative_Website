import { Link } from "react-router-dom";
import { ArrowRight, Code2, Users, MessageSquare } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0C15] relative overflow-x-hidden">
      
      {/* ==================== 1. NAVBAR ==================== */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <img
            src="/logo-removebg-preview.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-white tracking-tight">
            CollabSpace
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-300 hover:text-white transition font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition shadow-lg shadow-indigo-500/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ==================== 2. HERO SECTION ==================== */}
      <div className="relative pt-20 pb-32 flex flex-col items-center text-center px-4 max-w-5xl mx-auto z-10">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          The #1 Platform for Student Developers
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Find your team. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Build your vision.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Don't let your great ideas die because you couldn't find a partner.
          CollabSpace connects developers, designers, and creators instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="btn-primary-glow px-8 py-4 text-lg flex items-center gap-2 group"
          >
            Start Collaborating
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
          >
            View Existing Projects
          </Link>
        </div>
      </div>

      {/* ==================== 3. FEATURES GRID ==================== */}
      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-[#151725] border border-white/10 hover:border-indigo-500/50 transition duration-300 group">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="text-indigo-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Smart Matching
            </h3>
            <p className="text-gray-400">
              Find teammates based on skills, interests, and project goals. No
              more random searching.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-[#151725] border border-white/10 hover:border-purple-500/50 transition duration-300 group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Real-time Chat
            </h3>
            <p className="text-gray-400">
              Integrated team chat rooms powered by Socket.io for instant
              collaboration and idea sharing.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-[#151725] border border-white/10 hover:border-pink-500/50 transition duration-300 group">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="text-pink-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Project Showcase
            </h3>
            <p className="text-gray-400">
              Display your portfolio, get feedback, and recruit the best talent
              for your next big hackathon.
            </p>
          </div>
        </div> 
        {/* ^^^ THIS DIV WAS MISSING IN YOUR CODE, CAUSING THE NESTING ISSUE */}
      </div>

      {/* ==================== 4. HOW IT WORKS ==================== */}
      <div className="bg-[#0B0C15] relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              From Idea to Launch in 3 Steps
            </h2>
            <p className="text-gray-400">
              Streamlined for hackathons and semester projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 border-t border-dashed border-white/20 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-[#151725] border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                🚀
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Create a Project
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Post your idea, requirements, and tech stack to the
                community feed.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-[#151725] border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                🤝
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Connect & Match
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Review applications, accept teammates, and form your dream
                squad.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-[#151725] border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                💬
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Build & Chat
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Use the real-time workspace to share ideas and track
                progress.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 5. STATS / FOOTER CTA ==================== */}
      <div className="py-24 border-t border-white/10 bg-[#151725]/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 w-full">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                500+
              </div>
              <div className="text-indigo-400 text-sm uppercase tracking-widest font-bold">
                Developers
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                120+
              </div>
              <div className="text-purple-400 text-sm uppercase tracking-widest font-bold">
                Projects
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                50+
              </div>
              <div className="text-pink-400 text-sm uppercase tracking-widest font-bold">
                Colleges
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                24/7
              </div>
              <div className="text-green-400 text-sm uppercase tracking-widest font-bold">
                Uptime
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="p-12 rounded-3xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to build something great?
              </h2>
              <p className="text-gray-300 mb-10 text-lg md:text-xl max-w-2xl mx-auto">
                Join the community of student developers today. Stop
                searching, start building.
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-indigo-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transform duration-200"
              >
                Join CollabSpace Now
              </Link>
            </div>
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}