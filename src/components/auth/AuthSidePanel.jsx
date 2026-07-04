import { motion } from "motion/react";

// ─── Shared drawing primitives ─────────────────────────────────────────────────
function L({ d, delay = 0, dur = 1.2, sw = 1.7, stroke = "var(--foreground)", fill = "none", op = 0.7, ...r }) {
  return (
    <motion.path d={d} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      fill={fill} opacity={op}
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: op }}
      transition={{ delay, duration: dur, ease: "easeInOut" }} {...r} />
  );
}

function C({ cx, cy, r, delay = 0, dur = 0.8, sw = 1.7, stroke = "var(--foreground)", fill = "none", op = 0.7 }) {
  return (
    <motion.circle cx={cx} cy={cy} r={r} stroke={stroke} strokeWidth={sw} fill={fill} opacity={op}
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: op }}
      transition={{ delay, duration: dur, ease: "easeInOut" }} />
  );
}

function Dot({ cx, cy, delay = 0, r = 3, fill = "var(--border)" }) {
  return (
    <motion.circle cx={cx} cy={cy} r={r} fill={fill}
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.3, type: "spring" }} />
  );
}

// ─── ILLUSTRATION 1: Doctor Login — doctor at desk viewing patient list ────────
function DoctorLoginIllustration() {
  const ink = "var(--foreground)";
  const green = "var(--primary)";
  const faint = "var(--border)";

  return (
    <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[290px] mx-auto" aria-label="Doctor viewing patient dashboard">

      {/* Desk */}
      <L d="M20 230 Q160 224 300 230" stroke={faint} sw={2} delay={0} dur={0.7} op={1} />

      {/* Monitor */}
      <L d="M80 70 L80 200 Q80 206 86 206 L234 206 Q240 206 240 200 L240 70 Q240 64 234 64 L86 64 Q80 64 80 70Z" stroke={ink} sw={1.8} delay={0.1} dur={1.1} op={0.65} />
      <L d="M160 206 L160 226" stroke={ink} sw={1.8} delay={1.1} dur={0.4} op={0.5} />
      <L d="M142 226 L178 226" stroke={ink} sw={1.8} delay={1.3} dur={0.4} op={0.5} />

      {/* Patient list rows on screen */}
      {[90, 110, 130, 150, 170].map((y, i) => (
        <g key={y}>
          <L d={`M92 ${y} L228 ${y}`} stroke={faint} sw={0.8} delay={0.5 + i * 0.06} dur={0.4} op={1} />
          {/* Avatar dot per row */}
          <motion.circle cx={99} cy={y - 6} r={5} fill={i === 1 ? green : "none"}
            stroke={i === 1 ? green : ink} strokeWidth={1.2} opacity={i === 1 ? 0.9 : 0.35}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1, duration: 0.35 }} />
          {/* Name stub */}
          <L d={`M110 ${y - 6} L155 ${y - 6}`} stroke={ink} sw={1.2} delay={0.7 + i * 0.1} dur={0.3} op={i === 1 ? 0.7 : 0.3} />
          {/* Status pill on selected row */}
          {i === 1 && (
            <motion.rect x={185} y={y - 13} width={38} height={14} rx={7}
              fill={green} opacity={0.15} stroke={green} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }} />
          )}
        </g>
      ))}

      {/* Doctor figure – right side */}
      <C cx={272} cy={95} r={22} stroke={ink} sw={1.8} delay={0.2} dur={0.8} op={0.65} />
      {/* Body */}
      <L d="M248 155 Q244 215 250 228 L294 228 Q300 215 296 155 Q292 136 272 134 Q252 136 248 155Z" stroke={ink} sw={1.8} delay={0.5} dur={1.1} op={0.65} />
      {/* Arm toward monitor */}
      <L d="M248 165 Q232 178 230 192" stroke={ink} sw={1.8} delay={0.75} dur={0.9} op={0.6} />
      {/* Stethoscope */}
      <L d="M262 116 Q254 128 252 142 Q252 152 260 153 Q268 155 269 148" stroke={green} sw={1.7} delay={1.1} dur={0.9} op={0.85} />
      <L d="M282 116 Q290 128 292 142 Q292 152 284 153 Q276 155 275 148" stroke={green} sw={1.7} delay={1.2} dur={0.9} op={0.85} />
      <C cx={272} cy={128} r={7} stroke={green} sw={1.7} delay={1.4} dur={0.5} op={0.85} />

      {/* Floating badge: "Signed in" */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.55, ease: "easeOut" }}>
        <rect x="76" y="18" width="110" height="28" rx="14"
          fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />
        <text x="131" y="37" textAnchor="middle" fill="var(--primary)"
          fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">
          ✦ Secure access
        </text>
      </motion.g>

      <Dot cx={22} cy={60} delay={2.1} /><Dot cx={308} cy={80} delay={2.2} /><Dot cx={18} cy={250} delay={2.3} />
    </svg>
  );
}

// ─── ILLUSTRATION 2: Doctor Register — doctor holding clipboard + shield badge ──
function DoctorRegisterIllustration() {
  const ink = "var(--foreground)";
  const green = "var(--primary)";
  const faint = "var(--border)";

  return (
    <svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[290px] mx-auto" aria-label="Doctor MDCN verification">

      {/* Ground */}
      <L d="M30 268 Q160 262 290 268" stroke={faint} sw={2} delay={0} dur={0.7} op={1} />

      {/* Doctor body */}
      <C cx={160} cy={92} r={30} stroke={ink} sw={1.8} delay={0.2} dur={0.9} op={0.65} />
      <L d="M128 165 Q122 240 130 258 L190 258 Q198 240 192 165 Q186 142 160 140 Q134 142 128 165Z" stroke={ink} sw={1.8} delay={0.5} dur={1.1} op={0.65} />
      {/* Coat lapels */}
      <L d="M160 140 L150 180 L160 198" stroke={faint} sw={1} delay={1.3} dur={0.5} op={1} />
      <L d="M160 140 L170 180 L160 198" stroke={faint} sw={1} delay={1.4} dur={0.5} op={1} />

      {/* Left arm + clipboard */}
      <L d="M128 175 Q102 188 96 202" stroke={ink} sw={1.8} delay={0.7} dur={0.9} op={0.65} />
      {/* Clipboard */}
      <L d="M56 172 L56 252 Q56 258 62 258 L104 258 Q110 258 110 252 L110 172 Q110 166 104 166 L62 166 Q56 166 56 172Z" stroke={ink} sw={1.6} delay={0.4} dur={1.0} op={0.6} />
      <L d="M70 166 L70 158 Q70 154 74 154 L86 154 Q90 154 90 158 L90 166" stroke={ink} sw={1.4} delay={1.2} dur={0.5} op={0.6} />
      {/* Lines on clipboard */}
      {[186, 200, 214, 228].map((y, i) => (
        <L key={y} d={`M66 ${y} L100 ${y}`} stroke={faint} sw={1.1} delay={1.1 + i * 0.07} dur={0.4} op={1} />
      ))}
      {/* Big checkmark on clipboard */}
      <L d="M68 242 L78 252 L102 230" stroke={green} sw={2.4} delay={2.0} dur={0.8} op={0.95} />

      {/* Right arm up, holding shield */}
      <L d="M192 175 Q212 158 222 148" stroke={ink} sw={1.8} delay={0.8} dur={0.8} op={0.65} />
      {/* Shield */}
      <L d="M222 108 Q222 84 242 76 Q262 84 262 108 Q262 128 242 138 Q222 128 222 108Z" stroke={ink} sw={1.7} delay={0.6} dur={1.1} op={0.6} />
      <L d="M234 112 L240 119 L252 104" stroke={green} sw={2.2} delay={1.9} dur={0.7} op={0.95} />

      {/* Stethoscope */}
      <L d="M146 114 Q138 130 136 146 Q136 157 144 158 Q152 160 153 152" stroke={green} sw={1.7} delay={1.1} dur={0.9} op={0.85} />
      <L d="M174 114 Q182 130 184 146 Q184 157 176 158 Q168 160 167 152" stroke={green} sw={1.7} delay={1.2} dur={0.9} op={0.85} />
      <C cx={160} cy={126} r={8} stroke={green} sw={1.7} delay={1.4} dur={0.5} op={0.85} />

      {/* Badge */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.55, ease: "easeOut" }}>
        <rect x="96" y="18" width="130" height="28" rx="14"
          fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />
        <text x="161" y="37" textAnchor="middle" fill="var(--primary)"
          fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">
          ✦ MDCN Verified
        </text>
      </motion.g>

      <Dot cx={22} cy={60} delay={2.5} /><Dot cx={306} cy={100} delay={2.6} /><Dot cx={20} cy={272} delay={2.7} />
    </svg>
  );
}

// ─── ILLUSTRATION 3: Patient Login — person with phone + health pulse ──────────
function PatientLoginIllustration() {
  const ink = "var(--foreground)";
  const green = "var(--primary)";
  const faint = "var(--border)";

  return (
    <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[290px] mx-auto" aria-label="Patient accessing health records on phone">

      {/* Ground */}
      <L d="M30 248 Q160 242 290 248" stroke={faint} sw={2} delay={0} dur={0.7} op={1} />

      {/* Person */}
      <C cx={110} cy={80} r={28} stroke={ink} sw={1.8} delay={0.2} dur={0.9} op={0.65} />
      <L d="M80 148 Q76 220 84 238 L136 238 Q144 220 140 148 Q135 128 110 126 Q85 128 80 148Z" stroke={ink} sw={1.8} delay={0.5} dur={1.1} op={0.65} />
      {/* Arm holding phone */}
      <L d="M140 158 Q162 165 168 178" stroke={ink} sw={1.8} delay={0.75} dur={0.8} op={0.65} />
      <L d="M80 158 Q60 165 54 178" stroke={ink} sw={1.8} delay={0.8} dur={0.7} op={0.55} />

      {/* Phone */}
      <L d="M156 148 L156 228 Q156 234 162 234 L202 234 Q208 234 208 228 L208 148 Q208 142 202 142 L162 142 Q156 142 156 148Z" stroke={ink} sw={1.7} delay={0.35} dur={1.0} op={0.65} />
      {/* Phone notch */}
      <L d="M172 142 L172 138 Q172 135 175 135 L189 135 Q192 135 192 138 L192 142" stroke={ink} sw={1.3} delay={1.1} dur={0.4} op={0.5} />
      {/* ECG on phone screen */}
      <L d="M162 182 L170 182 L174 168 L179 196 L184 160 L189 196 L194 182 L208 182"
        stroke={green} sw={2.0} delay={1.2} dur={1.5} op={0.9} />
      {/* App rows on phone */}
      {[208, 220].map((y, i) => (
        <L key={y} d={`M164 ${y} L200 ${y}`} stroke={faint} sw={1} delay={1.5 + i * 0.08} dur={0.4} op={1} />
      ))}

      {/* Cloud / records floating right */}
      <L d="M228 110 Q228 90 244 88 Q244 76 258 76 Q270 76 272 86 Q282 84 284 94 Q292 96 292 106 Q292 118 280 118 L236 118 Q228 118 228 110Z" stroke={ink} sw={1.6} delay={0.5} dur={1.1} op={0.55} />
      {/* Lines in cloud = records */}
      {[96, 104, 112].map((y, i) => (
        <L key={y} d={`M238 ${y} L280 ${y}`} stroke={faint} sw={1} delay={1.0 + i * 0.06} dur={0.35} op={1} />
      ))}
      {/* Dotted line cloud -> phone */}
      <L d="M228 104 Q200 118 208 148" stroke={green} sw={1.3} delay={1.7} dur={0.8} op={0.5}
        strokeDasharray="4 4" />

      {/* Badge */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.55, ease: "easeOut" }}>
        <rect x="66" y="18" width="136" height="28" rx="14"
          fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />
        <text x="134" y="37" textAnchor="middle" fill="var(--primary)"
          fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">
          ✦ Records ready
        </text>
      </motion.g>

      <Dot cx={22} cy={55} delay={2.3} /><Dot cx={306} cy={75} delay={2.4} /><Dot cx={18} cy={252} delay={2.5} />
    </svg>
  );
}

// ─── ILLUSTRATION 4: Patient Register — person + health card + shield ─────────
function PatientRegisterIllustration() {
  const ink = "var(--foreground)";
  const green = "var(--primary)";
  const faint = "var(--border)";

  return (
    <svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[290px] mx-auto" aria-label="Creating a patient health profile">

      {/* Ground */}
      <L d="M30 268 Q160 262 290 268" stroke={faint} sw={2} delay={0} dur={0.7} op={1} />

      {/* Person */}
      <C cx={120} cy={88} r={28} stroke={ink} sw={1.8} delay={0.2} dur={0.9} op={0.65} />
      <L d="M90 158 Q86 232 94 248 L146 248 Q154 232 150 158 Q145 136 120 134 Q95 136 90 158Z" stroke={ink} sw={1.8} delay={0.5} dur={1.1} op={0.65} />
      {/* Arm out holding card */}
      <L d="M150 165 Q174 170 186 178" stroke={ink} sw={1.8} delay={0.75} dur={0.8} op={0.65} />
      <L d="M90 165 Q70 178 64 192" stroke={ink} sw={1.8} delay={0.8} dur={0.7} op={0.55} />

      {/* Health card */}
      <L d="M184 155 L184 205 Q184 211 190 211 L268 211 Q274 211 274 205 L274 155 Q274 149 268 149 L190 149 Q184 149 184 155Z" stroke={ink} sw={1.7} delay={0.3} dur={1.1} op={0.6} />
      {/* Card chip */}
      <L d="M196 163 L196 179 Q196 183 200 183 L216 183 Q220 183 220 179 L220 163 Q220 159 216 159 L200 159 Q196 159 196 163Z" stroke={ink} sw={1.2} delay={1.1} dur={0.6} op={0.5} />
      {/* Card lines */}
      <L d="M194 193 L240 193" stroke={faint} sw={1} delay={1.3} dur={0.4} op={1} />
      <L d="M194 200 L222 200" stroke={faint} sw={1} delay={1.4} dur={0.4} op={1} />
      {/* Heart on card */}
      <L d="M244 168 Q244 160 252 160 Q260 160 260 168 Q260 176 252 184 Q244 176 244 168Z" stroke={green} sw={1.8} delay={1.2} dur={0.7} op={0.9} />

      {/* Shield above person */}
      <L d="M106 42 Q106 22 120 16 Q134 22 134 42 Q134 58 120 66 Q106 58 106 42Z" stroke={ink} sw={1.7} delay={0.6} dur={1.0} op={0.6} />
      <L d="M113 42 L118 48 L128 36" stroke={green} sw={2.2} delay={1.8} dur={0.7} op={0.95} />

      {/* Floating + icons = adding records */}
      {[{ x: 58, y: 108, delay: 1.9 }, { x: 274, y: 122, delay: 2.0 }, { x: 48, y: 200, delay: 2.1 }].map(({ x, y, delay }, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay, duration: 0.4, type: "spring" }}>
          <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke={green} strokeWidth="1.6" strokeLinecap="round" />
          <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={green} strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>
      ))}

      {/* Badge */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.55, ease: "easeOut" }}>
        <rect x="82" y="272" width="158" height="28" rx="14"
          fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />
        <text x="161" y="291" textAnchor="middle" fill="var(--primary)"
          fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">
          ✦ Your health, your data
        </text>
      </motion.g>

      <Dot cx={22} cy={55} delay={2.5} /><Dot cx={306} cy={95} delay={2.6} /><Dot cx={308} cy={268} delay={2.7} />
    </svg>
  );
}

// ─── Panel wrapper — shared layout ────────────────────────────────────────────
function PanelShell({ headline, sub, steps, Illustration }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 py-10"
      style={{ background: "var(--background)", borderRight: "1px solid var(--border)" }}>

      {/* Headline */}
      <motion.div className="text-center mb-6 w-full"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <span className="inline-block text-[10px] font-bold tracking-[0.16em] uppercase mb-2.5"
          style={{ color: "var(--primary)" }}>
          BetaCare
        </span>
        <h2 className="text-[1.15rem] font-extrabold leading-snug"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: "var(--foreground)" }}>
          {headline}
        </h2>
        {sub && (
          <p className="text-xs mt-1.5 leading-relaxed"
            style={{ color: "var(--muted-foreground)", maxWidth: 220, margin: "6px auto 0" }}>
            {sub}
          </p>
        )}
      </motion.div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center w-full">
        <Illustration />
      </div>

      {/* Step badges */}
      {steps && (
        <motion.div className="flex items-center gap-4 mt-6 pb-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.6 }}>
          {steps.map(({ num, label }) => (
            <div key={num} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: "var(--secondary)", color: "var(--primary)", border: "1.5px solid var(--border)" }}>
                {num}
              </div>
              <span className="text-[9px] font-medium text-center leading-tight"
                style={{ color: "var(--muted-foreground)" }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Four exported panels ─────────────────────────────────────────────────────

export function DoctorLoginPanel() {
  return (
    <PanelShell
      headline={"Your patients.\nYour dashboard."}
      sub="Pick up right where you left off."
      Illustration={DoctorLoginIllustration}
    />
  );
}

export function DoctorRegisterPanel() {
  return (
    <PanelShell
      headline={"Verify once.\nPractice digitally."}
      Illustration={DoctorRegisterIllustration}
      steps={[
        { num: "01", label: "Details" },
        { num: "02", label: "MDCN" },
        { num: "03", label: "Face" },
      ]}
    />
  );
}

export function PatientLoginPanel() {
  return (
    <PanelShell
      headline={"Your records.\nAlways with you."}
      sub="Access your full health history in seconds."
      Illustration={PatientLoginIllustration}
    />
  );
}

export function PatientRegisterPanel() {
  return (
    <PanelShell
      headline={"One profile.\nAll your care."}
      sub="Free forever. Works on WhatsApp & web."
      Illustration={PatientRegisterIllustration}
      steps={[
        { num: "01", label: "Profile" },
        { num: "02", label: "Verify" },
        { num: "03", label: "Done" },
      ]}
    />
  );
}

// ─── ILLUSTRATION 5: Hospital Login — modern hospital building facade ─────────
function HospitalLoginIllustration() {
  const ink = "var(--foreground)";
  const green = "var(--primary)";
  const faint = "var(--border)";

  return (
    <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[290px] mx-auto" aria-label="Hospital dashboard integration">

      {/* Ground */}
      <L d="M20 230 Q160 224 300 230" stroke={faint} sw={2} delay={0} dur={0.7} op={1} />

      {/* Main tower of Hospital */}
      <L d="M110 220 L110 90 Q110 84 116 84 L204 84 Q210 84 210 90 L210 220" stroke={ink} sw={1.8} delay={0.1} dur={1.1} op={0.65} />

      {/* Left wing */}
      <L d="M50 222 L50 140 Q50 134 56 134 L110 134" stroke={ink} sw={1.8} delay={0.3} dur={0.8} op={0.65} />

      {/* Right wing */}
      <L d="M210 134 L264 134 Q270 134 270 140 L270 222" stroke={ink} sw={1.8} delay={0.4} dur={0.8} op={0.65} />

      {/* Medical Cross in center of main tower */}
      <L d="M160 110 L160 134" stroke={green} sw={2.8} delay={1.0} dur={0.6} op={0.9} />
      <L d="M148 122 L172 122" stroke={green} sw={2.8} delay={1.1} dur={0.6} op={0.9} />

      {/* Main entrance door */}
      <L d="M142 220 L142 195 Q142 190 148 190 L172 190 Q178 190 178 195 L178 220" stroke={ink} sw={1.5} delay={0.8} dur={0.6} op={0.5} />

      {/* Wing Windows */}
      {[156, 178, 200].map((y, i) => (
        <g key={y}>
          {/* Left wing windows */}
          <L d={`M68 ${y} L86 ${y}`} stroke={faint} sw={1.2} delay={0.6 + i * 0.1} dur={0.4} op={0.8} />
          {/* Right wing windows */}
          <L d={`M234 ${y} L252 ${y}`} stroke={faint} sw={1.2} delay={0.7 + i * 0.1} dur={0.4} op={0.8} />
        </g>
      ))}

      {/* Main tower windows grid */}
      {[152, 172].map((y, i) => (
        <g key={y}>
          <L d={`M124 ${y} L138 ${y}`} stroke={faint} sw={1.2} delay={0.9 + i * 0.1} dur={0.4} op={0.8} />
          <L d={`M182 ${y} L196 ${y}`} stroke={faint} sw={1.2} delay={1.0 + i * 0.1} dur={0.4} op={0.8} />
        </g>
      ))}

      {/* Pulse / network wave radiating from hospital */}
      <L d="M102 70 Q70 65 60 90 Q50 115 80 120" stroke={green} sw={1.2} delay={1.5} dur={1.0} op={0.4} strokeDasharray="3 3" />
      <L d="M218 70 Q250 65 260 90 Q270 115 240 120" stroke={green} sw={1.2} delay={1.6} dur={1.0} op={0.4} strokeDasharray="3 3" />

      {/* Floating badge: "Enterprise" */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.55, ease: "easeOut" }}>
        <rect x="96" y="24" width="128" height="28" rx="14"
          fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />
        <text x="160" y="42" textAnchor="middle" fill="var(--primary)"
          fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">
          ✦ Enterprise Portal
        </text>
      </motion.g>

      <Dot cx={30} cy={60} delay={2.1} /><Dot cx={292} cy={80} delay={2.2} /><Dot cx={26} cy={242} delay={2.3} />
    </svg>
  );
}

// ─── ILLUSTRATION 6: Hospital Register — hospital building + verification checklist ─
function HospitalRegisterIllustration() {
  const ink = "var(--foreground)";
  const green = "var(--primary)";
  const faint = "var(--border)";

  return (
    <svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[290px] mx-auto" aria-label="Hospital verification and credential checks">

      {/* Ground */}
      <L d="M20 260 Q160 254 300 260" stroke={faint} sw={2} delay={0} dur={0.7} op={1} />

      {/* Document / CAC License on left */}
      <L d="M50 100 L50 244 Q50 250 56 250 L164 250 Q170 250 170 244 L170 100 Q170 94 164 94 L56 94 Q50 94 50 100Z" stroke={ink} sw={1.7} delay={0.2} dur={1.1} op={0.65} />
      {/* Document lines */}
      <L d="M66 116 L154 116" stroke={faint} sw={1.3} delay={0.6} dur={0.4} op={1} />
      <L d="M66 132 L154 132" stroke={faint} sw={1.1} delay={0.7} dur={0.4} op={1} />
      <L d="M66 148 L122 148" stroke={faint} sw={1.1} delay={0.8} dur={0.4} op={1} />
      <L d="M66 164 L138 164" stroke={faint} sw={1.1} delay={0.9} dur={0.4} op={1} />

      {/* Big verification stamp on document */}
      <C cx={138} cy={206} r={20} stroke={green} sw={1.5} delay={1.1} dur={0.6} op={0.8} />
      <L d="M126 206 L134 214 L152 196" stroke={green} sw={2.4} delay={1.5} dur={0.7} op={0.95} />

      {/* Hospital icon/building on the right side, partially behind/next to document */}
      <L d="M196 250 L196 150 Q196 144 202 144 L268 144 Q274 144 274 150 L274 250" stroke={ink} sw={1.6} delay={0.4} dur={0.9} op={0.5} />
      {/* Medical cross on right-side building */}
      <L d="M235 166 L235 186" stroke={green} sw={2.2} delay={1.2} dur={0.5} op={0.8} />
      <L d="M225 176 L245 176" stroke={green} sw={2.2} delay={1.3} dur={0.5} op={0.8} />
      {/* Windows on right-side building */}
      <L d="M210 210 L224 210" stroke={faint} sw={1} delay={1.0} dur={0.3} op={0.7} />
      <L d="M246 210 L260 210" stroke={faint} sw={1} delay={1.1} dur={0.3} op={0.7} />
      <L d="M210 230 L224 230" stroke={faint} sw={1} delay={1.2} dur={0.3} op={0.7} />
      <L d="M246 230 L260 230" stroke={faint} sw={1} delay={1.3} dur={0.3} op={0.7} />

      {/* Floating checkmarks / stars */}
      <Dot cx={30} cy={70} delay={1.8} />
      <Dot cx={296} cy={110} delay={1.9} />
      <Dot cx={286} cy={230} delay={2.0} />

      {/* Floating badge */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.55, ease: "easeOut" }}>
        <rect x="80" y="24" width="160" height="28" rx="14"
          fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />
        <text x="160" y="42" textAnchor="middle" fill="var(--primary)"
          fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">
          ✦ Secured Verification
        </text>
      </motion.g>
    </svg>
  );
}

export function HospitalLoginPanel() {
  return (
    <PanelShell
      headline={"Your dashboard.\nYour network."}
      sub="Manage patients, staff, and integrations."
      Illustration={HospitalLoginIllustration}
    />
  );
}

export function HospitalRegisterPanel() {
  return (
    <PanelShell
      headline={"Integrate once.\nScale care digitally."}
      Illustration={HospitalRegisterIllustration}
      steps={[
        { num: "01", label: "Details" },
        { num: "02", label: "Admin" },
        { num: "03", label: "CAC" },
      ]}
    />
  );
}
