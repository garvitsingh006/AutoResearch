import React, { useEffect, useState } from "react";
import { ArrowRight, Terminal, Layers, Zap, Database, Lock, GitBranch } from "lucide-react";

export function Brutalist() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-space selection:bg-[#c8ff00] selection:text-black overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;600;700&display=swap');
        
        :root {
          --lime: #c8ff00;
          --bg: #111111;
          --card: #1a1a1a;
          --border: #333333;
        }

        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }

        .brutal-border {
          border: 1px solid var(--border);
        }

        .brutal-card {
          background: var(--card);
          border: 1px solid var(--border);
          transition: all 0.2s ease;
        }
        
        .brutal-card:hover {
          border-color: var(--lime);
          box-shadow: 0 0 15px rgba(200, 255, 0, 0.1);
        }

        .brutal-button {
          background: var(--lime);
          color: black;
          border: none;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
          position: relative;
          z-index: 1;
        }

        .brutal-button::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          right: -4px;
          bottom: -4px;
          background: transparent;
          border: 1px solid var(--lime);
          z-index: -1;
          transition: all 0.2s ease;
        }

        .brutal-button:hover::after {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--lime);
          opacity: 0.2;
        }

        .grid-bg {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#111111]/90 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#c8ff00]"></div>
            <span className="font-bold text-xl tracking-tight uppercase">AutoResearch</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-mono-custom text-sm text-gray-400">
            <a href="#how" className="hover:text-[#c8ff00] transition-colors">HOW_IT_WORKS</a>
            <a href="#features" className="hover:text-[#c8ff00] transition-colors">FEATURES</a>
            <a href="#login" className="hover:text-white transition-colors">LOGIN</a>
            <button className="brutal-button px-6 py-2">GET ACCESS</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative grid-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="font-mono-custom text-[#c8ff00] mb-6 flex items-center gap-3 animate-fade-up">
                <Terminal size={16} />
                <span>SYS.INIT // LANGGRAPH PIPELINE</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] mb-8 animate-fade-up delay-100">
                AI RESEARCH.<br />AUTOMATED.
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-xl font-mono-custom animate-fade-up delay-200">
                Submit a topic. Our multi-agent DeepSeek pipeline plans, researches, writes, and finalizes a complete academic paper. Zero human intervention required.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
                <button className="brutal-button px-8 py-4 text-lg flex items-center gap-2">
                  START PIPELINE <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 text-lg border border-[#333] hover:border-white transition-colors font-mono-custom">
                  VIEW LOGS
                </button>
              </div>
            </div>
            
            <div className="relative animate-fade-up delay-400">
              <div className="absolute -inset-4 border border-[#c8ff00]/30 z-0 hidden lg:block"></div>
              <div className="absolute top-4 -right-4 w-full h-full border border-[#333] z-0"></div>
              <img 
                src="/__mockup/images/brutalist-hero.png" 
                alt="Abstract AI Research" 
                className="w-full h-[500px] object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-500 border border-[#333]"
              />
              <div className="absolute bottom-4 left-4 z-20 bg-[#c8ff00] text-black font-mono-custom px-3 py-1 text-xs font-bold">
                IMG_01.DAT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Stages */}
      <section id="how" className="py-24 px-6 border-t border-[#333] bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold uppercase mb-4">The Pipeline</h2>
              <p className="font-mono-custom text-gray-400">5-stage LangGraph execution.</p>
            </div>
            <div className="font-mono-custom text-[#c8ff00] text-sm">
              STATUS: [OPERATIONAL]
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { id: "01", name: "PLANNER", desc: "Outlines paper structure", icon: <Layers /> },
              { id: "02", name: "RESEARCHER", desc: "Tavily web search queries", icon: <Database /> },
              { id: "03", name: "COMBINE", desc: "Aggregates raw data", icon: <GitBranch /> },
              { id: "04", name: "WRITER", desc: "Parallel section drafting", icon: <Zap /> },
              { id: "05", name: "FINALIZE", desc: "Markdown compilation", icon: <Terminal /> }
            ].map((stage, i) => (
              <div key={stage.id} className={`brutal-card p-6 animate-fade-up`} style={{ animationDelay: \`\${(i+1)*100}ms\` }}>
                <div className="text-gray-500 font-mono-custom mb-4">{stage.id}</div>
                <div className="text-[#c8ff00] mb-6">{stage.icon}</div>
                <h3 className="text-xl font-bold uppercase mb-2">{stage.name}</h3>
                <p className="text-sm text-gray-400 font-mono-custom">{stage.desc}</p>
                {i !== 4 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-[#333]">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-[#333]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold uppercase mb-16">System Specs</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="brutal-card p-8 group">
              <GitBranch className="w-12 h-12 text-white group-hover:text-[#c8ff00] mb-6 transition-colors" />
              <h3 className="text-2xl font-bold uppercase mb-4">Parallel Writers</h3>
              <p className="text-gray-400 font-mono-custom">
                Generates multiple sections simultaneously using independent agent threads for maximum speed.
              </p>
            </div>
            <div className="brutal-card p-8 group">
              <Database className="w-12 h-12 text-white group-hover:text-[#c8ff00] mb-6 transition-colors" />
              <h3 className="text-2xl font-bold uppercase mb-4">Resumable Runs</h3>
              <p className="text-gray-400 font-mono-custom">
                Pipeline states are saved. Interrupt and resume generation jobs at any node in the graph.
              </p>
            </div>
            <div className="brutal-card p-8 group">
              <Lock className="w-12 h-12 text-white group-hover:text-[#c8ff00] mb-6 transition-colors" />
              <h3 className="text-2xl font-bold uppercase mb-4">JWT Security</h3>
              <p className="text-gray-400 font-mono-custom">
                HttpOnly cookie authentication ensures secure access to your private research history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#333] bg-[#c8ff00] text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold uppercase mb-8">Deploy Agents Now</h2>
          <p className="text-xl mb-10 font-mono-custom opacity-80">
            Create an account to start generating academic papers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-black text-[#c8ff00] font-bold uppercase px-8 py-4 hover:bg-white hover:text-black transition-colors">
              CREATE ACCOUNT
            </button>
            <button className="border-2 border-black font-bold uppercase px-8 py-4 hover:bg-black hover:text-[#c8ff00] transition-colors">
              SYSTEM LOGIN
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#333] bg-[#111111] font-mono-custom text-sm text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} AUTORESEARCH.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">GITHUB</a>
            <a href="#" className="hover:text-white">DOCS</a>
            <a href="#" className="hover:text-white">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
