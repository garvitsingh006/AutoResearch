import { useEffect, useState } from "react";

const STEPS = [
  { num: "01", label: "PLANNING RESEARCH STRUCTURE" },
  { num: "02", label: "GATHERING SOURCES"            },
  { num: "03", label: "COMBINING RESEARCH CONTEXT"   },
  { num: "04", label: "WRITING SECTIONS IN PARALLEL" },
  { num: "05", label: "FINALIZING PAPER"             },
];

export default function Loader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 4000);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="flex flex-col gap-3">
      {STEPS.map((s, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 border-4 px-6 py-4 transition-all duration-500 ${
            i === step
              ? "border-[#EBFF00] bg-[#EBFF00]/10 shadow-[6px_6px_0px_0px_rgba(235,255,0,0.3)]"
              : i < step
              ? "border-[#FF0055]/40 opacity-40"
              : "border-white/10 opacity-20"
          }`}
        >
          <span className={`font-archivo text-2xl shrink-0 ${i === step ? "text-[#EBFF00]" : "text-white/30"}`}>
            {s.num}
          </span>
          <span className={`font-bebas text-xl tracking-widest ${i === step ? "text-white" : "text-white/30"}`}>
            {s.label}
          </span>
          {i === step && (
            <div className="ml-auto w-5 h-5 border-4 border-[#EBFF00] border-t-transparent animate-spin shrink-0" />
          )}
          {i < step && (
            <span className="ml-auto font-bebas text-[#FF0055] text-lg shrink-0">DONE</span>
          )}
        </div>
      ))}
    </div>
  );
}
