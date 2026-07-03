import { BetaCareLogo } from "../../../../components/common/BetaCareLogo";
import { CheckCircle2 } from "lucide-react";

export default function PatientLoginPanel() {
  return (
    <div className="relative h-full min-h-screen w-full bg-foreground overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/80 to-foreground/50" />

      <div className="relative flex flex-col h-full min-h-screen p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center">{BetaCareLogo()}</div>
          <span
            className="font-bold text-lg text-card"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Beta<span className="text-primary">Care</span>
          </span>
        </div>

        {/* Center */}
        <div className="flex-1 flex items-center">
          <div>
            <h2
              className="text-3xl font-extrabold text-card leading-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Welcome back.
              <br />
              <span className="text-primary">Your records are waiting.</span>
            </h2>
            <p className="text-card/50 text-sm leading-relaxed mb-8 max-w-[260px]">
              Your complete medical history — accessible wherever care takes you.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "No app download needed",
                "Works on WhatsApp & SMS",
                "Secure, encrypted records",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span className="text-card/60 text-sm">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom stat */}
        <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          <p className="text-xl font-bold text-card mb-0.5">1 in 3,474</p>
          <p className="text-xs text-card/40 leading-relaxed">
            Nigerians per doctor. BetaCare makes every one count further.
          </p>
        </div>
      </div>
    </div>
  );
}