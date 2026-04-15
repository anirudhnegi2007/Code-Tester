// src/components/layout/Footer.jsx
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 pt-20 pb-16 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-16">
          
          {/* Brand Section - Left */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="font-mono text-2xl font-semibold tracking-tighter text-white/90">
                Code_Tester
              </span>
            </div>
            
            <p className="text-zinc-400 max-w-md text-[15px] leading-relaxed">
              The modern platform for real-time technical interviews. 
              Code. Collaborate. Get instant AI feedback.
            </p>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3">
            <div className="uppercase text-xs font-mono tracking-widest text-zinc-500 mb-6">
              Platform
            </div>
            <div className="flex flex-col gap-3.5 text-sm">
              <a href="#features" className="text-zinc-300 hover:text-white transition-colors">Features</a>
              <a href="#practice" className="text-zinc-300 hover:text-white transition-colors">Practice</a>
              {/* <a href="#" className="text-zinc-300 hover:text-white transition-colors">For Teams</a>
              <a href="#" className="text-zinc-300 hover:text-white transition-colors">Pricing</a> */}
            </div>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <div className="uppercase text-xs font-mono tracking-widest text-zinc-500 mb-6">
              Company
            </div>
            <div className="flex flex-col gap-3.5 text-sm">
              <a href="#" className="text-zinc-300 hover:text-white transition-colors">About</a>
              <a href="#" className="text-zinc-300 hover:text-white transition-colors">Blog</a>
              <a href="#" className="text-zinc-300 hover:text-white transition-colors">Careers</a>
              <a href="#" className="text-zinc-300 hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          {/* Connect / Social + Legal */}
          <div className="md:col-span-2">
            <div className="uppercase text-xs font-mono tracking-widest text-zinc-500 mb-6">
              Connect
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-6 mb-10">
              <a 
                href="https://github.com/anirudhnegi2007" 
                aria-label="GitHub"
                className="text-zinc-400 hover:text-green-400 transition-colors"
              >
                <FaGithub size={24} />
              </a>
              <a 
                href="#" 
                aria-label="Twitter"
                className="text-zinc-400 hover:text-green-400 transition-colors"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/anirudh-negi-b63b26307/" 
                aria-abel="LinkedIn"
                className="text-zinc-400 hover:text-green-400 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
              <a 
                href="mailto:anirudhnegi2007@gmail.com?subject=Hello&body=Hi%20Anirudh," 
                aria-label="Email"
                className="text-zinc-400 hover:text-green-400 transition-colors"
              >
                <FiMail size={24} />
              </a>
            </div>

            {/* Legal Links */}
            <div className="text-xs font-mono text-zinc-500">
              <p className="mb-2">© 2026 Code_Tester Inc.</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
                <span>•</span>
                <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
                <span>•</span>
                <a href="#" className="hover:text-zinc-400 transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;