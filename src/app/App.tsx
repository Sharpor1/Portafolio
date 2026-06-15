import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const BLINK_CHAR = "█";

function useTyping(text: string, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

function Cursor({ visible = true }: { visible?: boolean }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  if (!visible) return null;
  return <span style={{ opacity: on ? 1 : 0 }}>{BLINK_CHAR}</span>;
}

function TerminalBox({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`border border-[#00ff41] bg-[#050f05] ${className}`}
      style={{ boxShadow: "0 0 8px #00ff4133, inset 0 0 8px #00ff4108" }}
    >
      {title && (
        <div className="border-b border-[#00ff41] px-3 md:px-4 py-2 text-[#00ff41] tracking-widest uppercase text-xs md:text-sm">
          {title}
        </div>
      )}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}

function NavBar({ active, onNav }: { active: string; onNav: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const sections = ["INICIO", "EXPERIENCIA", "PROYECTOS", "HABILIDADES", "CONTACTO"];

  function handleNav(section: string) {
    onNav(section);
    setOpen(false);
  }

  const navBtnClass = (s: string) =>
    `tracking-widest text-xs transition-all duration-200 min-h-[44px] px-4 py-2 flex items-center justify-center ${
      active === s
        ? "text-black bg-[#00ff41]"
        : "text-[#00ff41] hover:text-black hover:bg-[#00ff41]"
    }`;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#00ff41] bg-black"
      style={{ boxShadow: "0 2px 12px #00ff4133" }}
    >
      <div className="flex items-center px-4 md:px-6 py-3 gap-4">
        <span
          className="text-[#00ff41] tracking-widest cursor-pointer shrink-0"
          style={{ fontFamily: "'VT323', monospace", fontSize: "clamp(1rem, 4vw, 1.4rem)" }}
          onClick={() => handleNav("INICIO")}
        >
          $MARLON_NILO
        </span>
        <div className="flex-1" />
        <div className="hidden md:flex gap-2 items-center">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => handleNav(s)}
              className={navBtnClass(s)}
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="md:hidden text-[#00ff41] px-2 py-1 border border-[#00ff41] tracking-widest text-xs"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {open ? "[ X ]" : "[ ≡ ]"}
        </button>
      </div>
      {open && (
        <div
          className="md:hidden border-t border-[#00ff41] bg-black px-4 py-2 flex flex-col"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => handleNav(s)}
              className={`${navBtnClass(s)} text-left py-2.5 border-b border-[#00ff4133] last:border-b-0`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

function SystemBootLog({ onComplete }: { onComplete?: () => void }) {
  const line1 = useTyping("> Inicializando sistema...", 25, 0);
  const line2 = useTyping("> Cargando perfil: MARLON_NILO", 25, 500);
  const line3 = useTyping("> Estado: ACTIVO", 25, 900);
  const line4 = useTyping("> Última ubicación: Chile", 25, 1300);

  useEffect(() => {
    if (!line4.done || !onComplete) return;
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [line4.done, onComplete]);

  return (
    <div
      className="text-[#00ff41] text-sm leading-7"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      <div>{line1.displayed}{!line1.done && <Cursor />}</div>
      {line2.displayed && (
        <div>{line2.displayed}{!line2.done && <Cursor />}</div>
      )}
      {line3.displayed && (
        <div>{line3.displayed}{!line3.done && <Cursor />}</div>
      )}
      {line4.displayed && (
        <div>{line4.displayed}{!line4.done && <Cursor />}</div>
      )}
      {line4.done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-[#00aa2a]">{">"} Sistema listo.</div>
        </motion.div>
      )}
    </div>
  );
}

function MobileBootSplash({ onComplete }: { onComplete: () => void }) {
  const handleComplete = useCallback(() => onComplete(), [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />
      <div className="relative w-full max-w-lg">
        <TerminalBox title="SYSTEM_BOOT — v2.0.26">
          <SystemBootLog onComplete={handleComplete} />
        </TerminalBox>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const isMobile = useIsMobile();
  const [mobileSplashDone, setMobileSplashDone] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (isMobile) setShowSplash(true);
    else setShowSplash(false);
  }, [isMobile]);

  const showHeroContent = !isMobile || mobileSplashDone;

  return (
    <section
      id="INICIO"
      className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-20 md:pt-24 pb-16 md:pb-24"
    >
      <AnimatePresence onExitComplete={() => setMobileSplashDone(true)}>
        {showSplash && isMobile && (
          <MobileBootSplash key="boot-splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Scanlines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Boot log — solo desktop */}
        <div className="hidden md:block md:col-span-2">
          <TerminalBox title="SYSTEM_BOOT — v2.0.26">
            <SystemBootLog />
          </TerminalBox>
        </div>

        {/* Programador card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showHeroContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: isMobile ? 0.2 : 0.8 }}
        >
          <TerminalBox title="FICHA_PROGRAMADOR // ID: MN-2001">
            <div
              className="text-[#00ff41]"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              <div className="border border-[#00ff41] w-full aspect-square max-w-[180px] mx-auto mb-4 flex items-center justify-center overflow-hidden bg-black relative"
                style={{ boxShadow: "0 0 12px #00ff4155" }}>
                <img 
                  src="/assets/profile.jpg" 
                  alt="Marlon Nilo"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
                  }}
                />
              </div>
              <div className="text-xs space-y-1 text-[#00cc33]">
                <div><span className="text-[#00ff41]">NOMBRE:</span> Marlon Nilo Estefania</div>
                <div><span className="text-[#00ff41]">ROL:</span> Analista Programador</div>
                <div><span className="text-[#00ff41]">NACIMIENTO:</span> 14/05/2001</div>
                <div><span className="text-[#00ff41]">INGLES:</span> C1 (Avanzado)</div>
                <div><span className="text-[#00ff41]">FORMACION:</span> INACAP (2024–presente)</div>
                <div><span className="text-[#00ff41]">ESTADO:</span> <span className="bg-[#00ff41] text-black px-1">ACTIVO</span></div>
              </div>
            </div>
          </TerminalBox>
        </motion.div>

        {/* Bio + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showHeroContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: isMobile ? 0.4 : 1.2 }}
          className="flex flex-col gap-4"
        >
          <TerminalBox title="DESCRIPCION">
            <p
              className="text-[#00cc33] text-sm leading-6"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              Desarrollador en formación, estudiante de Ingeniería Informática en INACAP. Con experiencia previa en atención al cliente (6 años), ahora enfocado en construir soluciones web modernas y funcionales. Siempre aprendiendo, siempre ejecutando.
            </p>
          </TerminalBox>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "VER_PROYECTOS", href: "#PROYECTOS" },
              { label: "DESCARGAR_CV", href: "/assets/MarlonNiloCV.pdf", download: true },
              {
                label: "LINKEDIN",
                href: "https://www.linkedin.com/in/marlon-nilo-a29b05305/",
              },
            ].map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                download={btn.download ? true : undefined}
                target={btn.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="block border border-[#00ff41] text-[#00ff41] text-center py-2 tracking-widest text-sm hover:bg-[#00ff41] hover:text-black transition-all duration-200"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  boxShadow: "0 0 6px #00ff4133",
                }}
              >
                {btn.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  const timeline = [
    { 
      id: "2024_001",
      year: "2024", 
      title: "Ingreso a INACAP",
      event: "Ingreso a INACAP — carrera Ingeniería en Informática", 
      type: "edu",
      details: "Inicio de la carrera de Ingeniería en Informática en INACAP. Aprendizaje de fundamentos de programación, estructuras de datos y desarrollo web moderno.",
      skills: ["Programación", "Estructuras de datos", "HTML/CSS", "JavaScript", "SQL"]
    },
    { 
      id: "2026_001",
      year: "2026", 
      title: "Freelancer Independiente",
      event: "Inicio como Freelancer Independiente", 
      type: "work",
      details: "Transición a trabajo independiente como desarrollador. Ofreciendo servicios de desarrollo web a clientes, construcción de soluciones full-stack y consultoría tecnológica.",
      skills: ["React", "TypeScript", "Node.js", "Full-stack", "Client Communication"]
    },
    { 
      id: "2022_001",
      year: "2022-2026", 
      title: "Atención al Cliente",
      event: "Experiencia profesional en atención al cliente (6 años)", 
      type: "work",
      details: "6 años trabajando en atención al cliente en restaurante. Gestión de pedidos, administración de caja, coordinación operativa y desarrollo de habilidades de comunicación efectiva bajo presión.",
      skills: ["Atención al cliente", "Gestión operativa", "Comunicación", "Resolución de conflictos", "Liderazgo"]
    },
  ];

  const [selected, setSelected] = useState<typeof timeline[0] | null>(null);

  return (
    <section id="EXPERIENCIA" className="py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader cmd="cat historial_actividad.log" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#00ff41] bg-[#050f05]"
          style={{ boxShadow: "0 0 8px #00ff4133, inset 0 0 8px #00ff4108" }}>
          
          {/* Timeline List */}
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-[#00ff41]">
            <div
              className="border-b border-[#00ff41] px-4 py-2 text-[#00aa2a] text-xs tracking-widest"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              HISTORIAL/ — {timeline.length} entradas
            </div>
            {timeline.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left px-4 py-3 border-b border-[#00ff4133] flex flex-col gap-1 transition-all duration-150 ${
                  selected?.id === item.id
                    ? "bg-[#00ff41] text-black"
                    : "text-[#00ff41] hover:bg-[#001a00]"
                }`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                <span className="text-xs opacity-60">{item.year}</span>
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <div
            className="md:col-span-2 p-4 md:p-6 min-h-[200px] md:min-h-[420px]"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-[#00cc33] text-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[#00ff41] tracking-widest text-base font-medium">{selected.title}</div>
                    <div className="text-xs text-[#00aa2a] mt-1">
                      {selected.year} • {selected.type === "edu" ? "Educación" : selected.type === "project" ? "Proyecto" : "Experiencia"}
                    </div>
                  </div>
                  <span className="text-[#00ff41] shrink-0 text-sm">
                    {selected.type === "edu" ? "[EDU]" : selected.type === "project" ? "[PRJ]" : "[JOB]"}
                  </span>
                </div>

                <div className="border-t border-[#00ff4133] pt-4">
                  <div className="text-[#00ff41] text-xs opacity-70 mb-2">DESCRIPCION</div>
                  <p>{selected.details}</p>
                </div>

                <div className="border-t border-[#00ff4133] pt-4">
                  <div className="text-[#00ff41] text-xs opacity-70 mb-2">COMPETENCIAS</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((skill) => (
                      <span
                        key={skill}
                        className="border border-[#00ff41] text-[#00ff41] px-2 py-1 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-[#00aa2a] text-sm flex items-center justify-center h-full opacity-60">
                <span>{">"} selecciona un evento del historial<Cursor /></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    id: "PRJ_001",
    name: "Portfolio Terminal",
    desc: "Portfolio personal con estética de terminal CRT retro. Diseñado y desarrollado completamente por mí. Incluye animaciones de tipeo, navegación interactiva y secciones dinámicas.",
    tags: ["React", "Tailwind CSS", "TypeScript", "Motion"],
    status: "ACTIVO",
    year: "2026",
    url: "#",
    contribution: "100%"
  },
  {
    id: "PRJ_002",
    name: "Sistema de Gestión de Biblioteca",
    desc: "Aplicación completa para gestión de biblioteca. Permite generar préstamos, transacciones, llevar estadísticas del proyecto y manejar membresías. Yo desarrollé el frontend completo.",
    tags: ["React", "Node.js", "PostgreSQL", "REST APIs"],
    status: "COMPLETADO",
    year: "2025",
    url: "https://github.com/Sharpor1/sistema-biblioteca",
    contribution: "50% (Frontend)"
  },
];

function ProjectsSection() {
  const [selected, setSelected] = useState<(typeof PROJECTS)[0] | null>(null);

  return (
    <section id="PROYECTOS" className="py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader cmd="ls -la proyectos/" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#00ff41] bg-[#050f05]"
          style={{ boxShadow: "0 0 8px #00ff4133, inset 0 0 8px #00ff4108" }}>
          {/* List */}
          <div className="border-b md:border-b-0 md:border-r border-[#00ff41]">
            <div
              className="border-b border-[#00ff41] px-4 py-2 text-[#00aa2a] text-xs tracking-widest"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              PROYECTOS/ — {PROJECTS.length} entradas
            </div>
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left px-4 py-3 border-b border-[#00ff4133] flex gap-3 items-start transition-all duration-150 ${
                  selected?.id === p.id
                    ? "bg-[#00ff41] text-black"
                    : "text-[#00ff41] hover:bg-[#001a00]"
                }`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                <span className="text-xs opacity-60 shrink-0 mt-0.5">{p.id}</span>
                <span className="text-sm">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div
            className="p-4 md:p-6 min-h-[200px] md:min-h-[420px]"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-[#00cc33] text-sm space-y-3"
              >
                <div className="text-[#00ff41] tracking-widest break-words">{selected.name}</div>
                <div className="text-xs text-[#00aa2a]">ID: {selected.id} | AÑO: {selected.year}</div>
                {selected.contribution && (
                  <div className="text-xs text-[#00aa2a]">CONTRIBUCION: {selected.contribution}</div>
                )}
                <div className="border-t border-[#00ff4133] pt-3">{selected.desc}</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selected.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-[#00ff41] text-[#00ff41] px-2 py-0.5 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 items-center text-xs">
                  <span className="text-[#00aa2a]">ESTADO:</span>
                  <span
                    className={`px-2 py-0.5 ${
                      selected.status === "ACTIVO" || selected.status === "ENTREGADO" || selected.status === "COMPLETADO"
                        ? "bg-[#00ff41] text-black"
                        : "border border-[#00ff41] text-[#00ff41]"
                    }`}
                  >
                    {selected.status}
                  </span>
                </div>
                {selected.url !== "#" && (
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-[#00ff41] text-center py-1 text-xs tracking-widest hover:bg-[#00ff41] hover:text-black transition-all"
                  >
                    VER_PROYECTO →
                  </a>
                )}
              </motion.div>
            ) : (
              <div className="text-[#00aa2a] text-sm flex items-center justify-center h-full opacity-60">
                <span>{">"} selecciona un proyecto<Cursor /></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const SKILLS = {
  Frontend: ["React", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
  Backend: ["Node.js", "PHP", "Python", "REST APIs"],
  "Bases de datos": ["MySQL", "MongoDB", "PostgreSQL"],
  Varias: ["Git", "GitHub", "VS Code", "Ingles C1 (avanzado)", "Linux"],
};

function SkillsSection() {
  return (
    <section
      id="HABILIDADES"
      className="py-16 md:py-28 px-4 md:px-6"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeader cmd="cat habilidades.json" />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {Object.entries(SKILLS).map(([cat, items]) => (
            <TerminalBox
              key={cat}
              title={cat.toUpperCase().replace(/ /g, "_")}
            >
              {/* MOBILE */}
              <div
                className="md:hidden text-[#00cc33] text-sm leading-7"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                {items.map((skill, index) => (
                  <span key={skill}>
                    {skill}

                    {index !== items.length - 1 && (
                      <span className="text-[#00aa2a]">
                        {" // "}
                      </span>
                    )}
                  </span>
                ))}
              </div>

              {/* DESKTOP */}
              <div className="hidden md:flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="border border-[#00ff41] bg-[#001a00] text-[#00ff41] px-3 py-1 text-sm"
                    style={{
                      fontFamily:
                        "'Share Tech Mono', monospace",
                      boxShadow:
                        "0 0 4px #00ff4122",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </TerminalBox>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [typing, setTyping] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `> Enviando mensaje de ${formState.name}...\n> Conectando con servidor...\n> Mensaje entregado. ✓`;
    let i = 0;
    setTyping("");
    const interval = setInterval(() => {
      i++;
      setTyping(msg.slice(0, i));
      if (i >= msg.length) {
        clearInterval(interval);
        setSent(true);
      }
    }, 20);
  }

  return (
    <section id="CONTACTO" className="py-16 md:py-28 px-4 md:px-6 pb-28 md:pb-40">
      <div className="max-w-4xl mx-auto">
        <SectionHeader cmd="ssh marlonnilodev@gmail.com" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TerminalBox title="CANALES_DISPONIBLES">
            <div
              className="text-[#00cc33] text-sm space-y-4"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {[
                { label: "LINKEDIN", value: "marlon-nilo-a29b05305", href: "https://www.linkedin.com/in/marlon-nilo-a29b05305/" },
                { label: "GITHUB", value: "Sharpor1", href: "https://github.com/Sharpor1" },
                { label: "EMAIL", value: "marlonnilodev@gmail.com", href: "mailto:marlonnilodev@gmail.com" },
                { label: "WHATSAPP", value: "+56 9 3199 9176", href: "https://wa.me/56931999176" },
                { label: "UBICACION", value: "Chile", href: null },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-[#00aa2a] text-xs">{item.label}</span>
                  {item.href && item.href !== "#" ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block w-fit text-[#00ff41] text-sm px-2.5 py-1.5 border border-[#00ff4166] bg-[#001a00] hover:bg-[#00ff41] hover:text-black hover:border-[#00ff41] transition-all duration-200"
                      style={{ boxShadow: "0 0 4px #00ff4122" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-[#00ff41] text-sm">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </TerminalBox>

          <TerminalBox title="ENVIAR_MENSAJE">
            {sent ? (
              <div
                className="text-[#00cc33] text-xs whitespace-pre-line leading-6"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {typing}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-3"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {(
                  [
                    { id: "name", label: "NOMBRE", type: "text" },
                    { id: "email", label: "EMAIL", type: "email" },
                  ] as const
                ).map((field) => (
                  <div key={field.id}>
                    <label className="text-[#00aa2a] text-xs block mb-1">
                      {">"} {field.label}:
                    </label>
                    <input
                      type={field.type}
                      value={formState[field.id]}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, [field.id]: e.target.value }))
                      }
                      required
                      className="w-full bg-transparent border border-[#00ff4166] text-[#00ff41] px-2 py-1 text-sm outline-none focus:border-[#00ff41] transition-colors"
                      style={{ caretColor: "#00ff41" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[#00aa2a] text-xs block mb-1">
                    {">"} MENSAJE:
                  </label>
                  <textarea
                    value={formState.message}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, message: e.target.value }))
                    }
                    required
                    rows={3}
                    className="w-full bg-transparent border border-[#00ff4166] text-[#00ff41] px-2 py-1 text-sm outline-none focus:border-[#00ff41] transition-colors resize-none"
                    style={{ caretColor: "#00ff41" }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full border border-[#00ff41] text-[#00ff41] py-2 text-sm tracking-widest hover:bg-[#00ff41] hover:text-black transition-all duration-200"
                >
                  ENVIAR_{">>"}
                </button>
              </form>
            )}
          </TerminalBox>
        </div>
      </div>

      <div
        className="max-w-4xl mx-auto mt-12 text-center text-[#00aa2a] text-xs"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        © 2026 Marlon Nilo — Todos los derechos reservados
        <br />
        <span className="opacity-50">// construido con React + Tailwind CSS v4</span>
      </div>
    </section>
  );
}

function SectionHeader({ cmd }: { cmd: string }) {
  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[#00aa2a] text-xs md:text-sm mb-3 break-all">
        <span className="text-[#00ff41] shrink-0">marlon@portfolio</span>
        <span className="shrink-0">:</span>
        <span className="text-[#00cc33] shrink-0">~</span>
        <span className="shrink-0">$</span>
        <span className="text-[#00ff41]">{cmd}</span>
      </div>
      <div className="w-full border-t border-[#00ff4155] mb-6" />
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      className="w-full max-w-4xl mx-auto flex items-center gap-2 md:gap-4 py-2 px-4 md:px-6"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      <div className="flex-1 border-t-2 border-[#00ff41]" style={{ boxShadow: "0 0 6px #00ff4166" }} />
      <span className="text-[#00ff41] text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] px-2 border border-[#00ff41] py-1 shrink-0"
        style={{ boxShadow: "0 0 8px #00ff4144" }}>
        // {label} //
      </span>
      <div className="flex-1 border-t-2 border-[#00ff41]" style={{ boxShadow: "0 0 6px #00ff4166" }} />
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("INICIO");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("section[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleNav(section: string) {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="min-h-screen bg-black text-[#00ff41] overflow-x-hidden"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* Global CRT glow */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,255,65,0.04) 100%)",
        }}
      />

      <NavBar active={activeSection} onNav={handleNav} />

      <main>
        <HeroSection />
        <SectionDivider label="SOBRE_MI" />
        <AboutSection />
        <SectionDivider label="PROYECTOS" />
        <ProjectsSection />
        <SectionDivider label="HABILIDADES" />
        <SkillsSection />
        <SectionDivider label="CONTACTO" />
        <ContactSection />
      </main>
    </div>
  );
}
