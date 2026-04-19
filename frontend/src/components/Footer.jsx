import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0B0C15] border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src="/logo-removebg-preview.png" alt="logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-white">CollabSpace</span>
          </div>
          <p className="text-gray-400 text-sm">
            The #1 platform for student developers to find teammates and ship amazing projects.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Projects</Link></li>
            <li><Link to="/chats" className="hover:text-indigo-400 transition-colors">Teams</Link></li>
            <li><Link to="/developers" className="hover:text-indigo-400 transition-colors">Developers</Link></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="text-white font-semibold mb-6">Community</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <a href="https://github.com/Aaryan9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Github size={16} /> Github
              </a>
            </li>
            <li>
              <a href="https://twitter.com/Aaryan9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Twitter size={16} /> Twitter
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/aaryan9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Linkedin size={16} /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <a href="mailto:collabspace@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={16} /> collabspace@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+9191XXXXXXXX" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={16} /> +91 91XXXXXXXX
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center">
        <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} CollabSpace. All rights reserved.</span>
          <span>|</span>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;