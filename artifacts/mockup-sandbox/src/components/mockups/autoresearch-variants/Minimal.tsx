import React from "react";
import { ArrowRight, FileText, Settings, Search, CheckCircle, Database } from "lucide-react";

export function Minimal() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#f5f5f5] font-sans selection:bg-[#FF4444] selection:text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');
        :root {
          --font-geist: 'Geist', sans-serif;
        }
        .font-geist {
          font-family: var(--font-geist);
        }
        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 50;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}} />
      
      <div className="noise-overlay"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 border-b border-[#2a2a2a] bg-[#111111]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-geist font-medium text-lg tracking-tight">
            <span className="w-4 h-4 rounded-full bg-[#FF4444]"></span>
            AutoResearch
          </div>
          <div className="flex items-center gap-8 text-sm text-[#888888]">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="/login" className="hover:text-white transition-colors">Sign in</a>
            <button className="bg-[#f5f5f5] text-[#111111] px-4 py-2 rounded-md font-medium hover:bg-white transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto font-geist">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2a2a2a] bg-[#1c1c1c] text-xs font-medium mb-12 text-[#a0a0a0]">
          <span className="w-2 h-2 rounded-full bg-[#FF4444] animate-pulse"></span>
          DeepSeek LLM + Tavily Integration Live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[1.1] mb-8">
          Research on <br/><span className="text-[#888888]">autopilot.</span>
        </h1>
        
        <p className="text-xl text-[#888888] max-w-2xl mb-12 font-light leading-relaxed">
          Submit a topic. Our multi-agent LangGraph pipeline plans, researches, writes, and finalizes a complete academic paper in minutes.
        </p>
        
        <div className="flex items-center gap-6">
          <button className="bg-[#FF4444] text-white px-8 py-4 rounded-md font-medium flex items-center gap-2 hover:bg-[#E8372A] transition-all">
            Start Generating <ArrowRight className="w-4 h-4" />
          </button>
          <button className="text-[#888888] px-8 py-4 rounded-md font-medium hover:text-white transition-colors border border-[#2a2a2a] hover:border-[#444]">
            View Sample Paper
          </button>
        </div>

        <div className="mt-24 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent z-10 bottom-0 h-1/2 mt-auto"></div>
          <img 
            src="/__mockup/images/minimal-hero.png" 
            alt="AutoResearch Pipeline Visualization" 
            className="w-full h-auto rounded-lg border border-[#2a2a2a] opacity-80 mix-blend-lighten"
          />
        </div>
      </section>

      {/* Pipeline Steps */}
      <section id="how-it-works" className="py-32 px-6 border-t border-[#1c1c1c] bg-[#141414]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 md:w-1/3">
            <h2 className="text-3xl font-geist font-medium mb-4 tracking-tight">The Pipeline</h2>
            <p className="text-[#888888]">Five autonomous agents working in parallel to synthesize knowledge.</p>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-6 left-0 w-full h-[1px] bg-[#2a2a2a] z-0"></div>

            {[
              { num: "01", name: "Planner", desc: "Outlines structure and goals", icon: FileText },
              { num: "02", name: "Researcher", desc: "Executes deep web search", icon: Search },
              { num: "03", name: "Combine", desc: "Synthesizes source material", icon: Database },
              { num: "04", name: "Writer (Parallel)", desc: "Drafts sections concurrently", icon: Settings },
              { num: "05", name: "Finalize", desc: "Formats and cites sources", icon: CheckCircle },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col md:w-48 bg-[#141414]">
                <div className="w-12 h-12 rounded-full border border-[#2a2a2a] bg-[#111] flex items-center justify-center mb-6 text-[#888888]">
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-[#555] mb-2">{step.num}</div>
                <h3 className="font-geist font-medium text-lg mb-2">{step.name}</h3>
                <p className="text-sm text-[#888888] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Sparse Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-y-24 gap-x-16">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-geist font-medium mb-6 tracking-tight">Parallel Processing</h2>
              <p className="text-[#888888] leading-relaxed text-lg mb-8">
                The Writer agent splits the outline into independent sections and drafts them concurrently, reducing generation time by up to 70%.
              </p>
              <div className="h-[1px] w-12 bg-[#2a2a2a]"></div>
            </div>
            
            <div className="border border-[#1c1c1c] bg-[#141414] rounded-lg p-12 aspect-square flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="flex gap-4">
                 <div className="w-2 h-32 bg-[#2a2a2a] rounded-full overflow-hidden relative"><div className="absolute bottom-0 w-full h-3/4 bg-[#555]"></div></div>
                 <div className="w-2 h-48 bg-[#2a2a2a] rounded-full overflow-hidden relative"><div className="absolute bottom-0 w-full h-1/2 bg-[#555]"></div></div>
                 <div className="w-2 h-24 bg-[#2a2a2a] rounded-full overflow-hidden relative"><div className="absolute bottom-0 w-full h-full bg-[#FF4444]"></div></div>
                 <div className="w-2 h-40 bg-[#2a2a2a] rounded-full overflow-hidden relative"><div className="absolute bottom-0 w-full h-2/3 bg-[#555]"></div></div>
               </div>
            </div>

            <div className="border border-[#1c1c1c] bg-[#141414] rounded-lg p-12 aspect-square flex items-center justify-center md:order-3">
               <div className="w-full max-w-xs space-y-4">
                 <div className="h-4 w-3/4 bg-[#2a2a2a] rounded"></div>
                 <div className="h-4 w-full bg-[#2a2a2a] rounded"></div>
                 <div className="h-4 w-5/6 bg-[#2a2a2a] rounded"></div>
                 <div className="h-4 w-1/2 bg-[#FF4444] rounded opacity-80"></div>
               </div>
            </div>

            <div className="flex flex-col justify-center md:order-4">
              <h2 className="text-3xl font-geist font-medium mb-6 tracking-tight">Resumable Runs</h2>
              <p className="text-[#888888] leading-relaxed text-lg mb-8">
                Pipeline execution state is saved at every node. Pause, inspect the draft, and resume generation without losing progress.
              </p>
              <div className="h-[1px] w-12 bg-[#2a2a2a]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-[#1c1c1c]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-geist font-medium mb-8 tracking-tight">Ready to scale your research?</h2>
          <p className="text-xl text-[#888888] mb-12 font-light">Join the platform redefining academic synthesis.</p>
          <button className="bg-[#FF4444] text-white px-10 py-5 rounded-md font-medium text-lg hover:bg-[#E8372A] transition-colors inline-flex items-center gap-2">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1c1c1c] text-[#555] text-sm text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} AutoResearch. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
