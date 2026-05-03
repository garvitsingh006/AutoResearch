import React from 'react';
import { Button } from "@/components/ui/button";

export function Maximalist() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Inter:wght@400;700;900&display=swap');
        
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-archivo { font-family: 'Archivo Black', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }

        .clip-diagonal {
          clip-path: polygon(0 0, 100% 10vw, 100% 100%, 0 calc(100% - 10vw));
        }
        .clip-diagonal-reverse {
          clip-path: polygon(0 10vw, 100% 0, 100% calc(100% - 10vw), 0 100%);
        }
      `}} />

      {/* Nav */}
      <nav className="fixed w-full z-50 mix-blend-difference p-6 flex justify-between items-center">
        <div className="font-archivo text-2xl tracking-tighter uppercase">AutoResearch</div>
        <div className="flex gap-4">
          <Button variant="outline" className="font-bebas text-xl rounded-none border-2 border-white text-white hover:bg-white hover:text-black transition-colors h-12 px-6">LOGIN</Button>
          <Button className="font-bebas text-xl rounded-none bg-[#FF0055] hover:bg-[#FF0055]/80 text-white border-2 border-[#FF0055] h-12 px-6">START MACHINE</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 bg-zinc-900">
          <img src="/__mockup/images/maximalist-hero.png" alt="Hero background" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
          <div className="absolute inset-0 bg-blue-900 mix-blend-multiply opacity-50"></div>
        </div>

        <div className="relative z-10 text-center w-full px-4 flex flex-col items-center">
          <h1 className="font-bebas text-[14vw] md:text-[12vw] leading-[0.85] tracking-tight flex flex-col items-center">
            <span className="text-white transform -skew-x-6 drop-shadow-[4px_4px_0_#0055FF]">RESEARCH.</span>
            <span className="text-[#EBFF00] transform skew-x-6 relative -top-4 md:-top-8 drop-shadow-[4px_4px_0_#FF0055]">WRITTEN.</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] via-[#0055FF] to-[#FF5500] animate-gradient transform -skew-x-6 relative -top-8 md:-top-16 filter drop-shadow-[4px_4px_0_#EBFF00]">BY MACHINES.</span>
          </h1>
          <p className="font-inter font-black text-xl md:text-2xl mt-4 md:mt-0 max-w-2xl bg-black p-4 border-l-8 border-[#EBFF00] uppercase tracking-wide">
            Deploy a LangGraph multi-agent pipeline to autonomously research, synthesize, and write academic papers.
          </p>
        </div>
        
        <div className="absolute bottom-10 left-10 font-archivo text-[15vw] md:text-[20vw] leading-none text-white/10 pointer-events-none z-0 select-none">
          01
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-32 md:py-48 bg-[#EBFF00] text-black clip-diagonal relative z-20 -mt-20">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-7xl md:text-[10rem] mb-16 leading-none uppercase text-black drop-shadow-[4px_4px_0_#FF0055]">The Pipeline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {[
              { num: "01", title: "PLANNER", color: "bg-[#FF0055]", desc: "Defines architecture" },
              { num: "02", title: "RESEARCHER", color: "bg-[#0055FF]", desc: "Scrapes literature" },
              { num: "03", title: "COMBINE", color: "bg-[#FF5500]", desc: "Synthesizes data" },
              { num: "04", title: "WRITER", subtitle: "(PARALLEL)", color: "bg-black", desc: "Drafts sections" },
              { num: "05", title: "FINALIZE", color: "bg-[#FF0055]", desc: "Formats output" }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className={`${step.color} text-white p-6 md:p-8 h-full min-h-[250px] md:min-h-[350px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform transition-transform group-hover:-translate-y-4 group-hover:-translate-x-2 flex flex-col`}>
                  <div className="font-archivo text-5xl md:text-6xl opacity-40 mb-4">{step.num}</div>
                  <h3 className="font-bebas text-4xl md:text-5xl leading-[0.9]">{step.title}</h3>
                  {step.subtitle && <h4 className="font-bebas text-2xl md:text-3xl text-[#EBFF00] mt-1">{step.subtitle}</h4>}
                  <div className="mt-auto pt-8 font-inter font-bold text-sm md:text-base uppercase opacity-90 border-t-2 border-white/20">
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 md:py-48 bg-black text-white relative z-10">
        <div className="container mx-auto px-4 relative">
           <div className="absolute -top-64 right-10 font-archivo text-[20vw] leading-none text-white/5 pointer-events-none z-0 select-none">
             02
           </div>
           
           <h2 className="font-bebas text-7xl md:text-[10rem] mb-16 leading-none md:text-right text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] via-[#0055FF] to-[#EBFF00] animate-gradient relative z-10">SYSTEM SPECS</h2>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
             <div className="bg-[#0055FF] p-10 border-4 border-[#EBFF00] transform md:-rotate-3 hover:rotate-0 transition-all duration-300 shadow-[12px_12px_0px_0px_#EBFF00]">
               <h3 className="font-bebas text-6xl mb-6 text-[#EBFF00] leading-none">DEEPSEEK<br/>LLM</h3>
               <p className="font-inter font-bold text-xl leading-snug">Powered by state-of-the-art models for reasoning and synthesis. No fluff, just raw intelligence.</p>
             </div>
             <div className="bg-[#FF0055] p-10 border-4 border-black transform md:rotate-2 hover:rotate-0 transition-all duration-300 shadow-[12px_12px_0px_0px_#EBFF00] lg:mt-24">
               <h3 className="font-bebas text-6xl mb-6 text-black leading-none">PARALLEL<br/>WRITING</h3>
               <p className="font-inter font-bold text-xl text-black leading-snug">Why write linearly? The multi-agent system drafts sections simultaneously. Speed is everything.</p>
             </div>
             <div className="bg-[#FF5500] p-10 border-4 border-black transform md:-rotate-1 hover:rotate-0 transition-all duration-300 shadow-[12px_12px_0px_0px_#EBFF00]">
               <h3 className="font-bebas text-6xl mb-6 text-black leading-none">TAVILY<br/>SEARCH</h3>
               <p className="font-inter font-bold text-xl text-black leading-snug">Real-time academic indexing. The agents scrape the bleeding edge of the internet to form hypotheses.</p>
             </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 md:py-56 bg-[#0055FF] clip-diagonal-reverse relative z-20 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 font-archivo text-[30vw] leading-none text-black/20 pointer-events-none z-0 select-none whitespace-nowrap">
          03
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-bebas text-[12vw] md:text-[10vw] leading-none mb-12 text-[#EBFF00] transform -skew-x-6 drop-shadow-[4px_4px_0_#FF0055]">INITIATE SEQUENCE</h2>
          <Button className="font-bebas text-4xl md:text-5xl h-auto px-12 md:px-20 py-8 md:py-10 rounded-none bg-[#FF0055] hover:bg-black text-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2">
            START RESEARCHING
          </Button>
        </div>
      </section>
      
      <footer className="bg-black py-16 text-center font-inter font-bold text-white/40 uppercase tracking-widest text-sm md:text-base border-t-8 border-[#FF0055]">
        <div className="mb-4 font-archivo text-2xl text-white/80">AUTORESEARCH</div>
        <p>© 2025 // BUILT FOR THE FUTURE // NOT FOR HUMANS</p>
      </footer>
    </div>
  );
}
