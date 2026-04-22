import { useEffect, useState } from "react";

const STEPS = [
  "Planning research structure…",
  "Gathering sources…",
  "Combining research context…",
  "Writing sections in parallel…",
  "Finalizing paper…",
];

export default function Loader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 4000);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="w-10 h-10 rounded-full border-2 border-black border-t-transparent animate-spin" />
      <p
        className="text-base transition-all duration-500"
        style={{ color: "#4e4e4e", letterSpacing: "0.16px" }}
      >
        {STEPS[step]}
      </p>
      <div className="flex gap-1.5 mt-1">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{ background: i <= step ? "#000" : "#e5e5e5" }}
          />
        ))}
      </div>
    </div>
  );
}
