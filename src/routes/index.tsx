import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import heroFigure from "@/assets/hero-figure.jpg";
import cityImg from "@/assets/city.jpg";
import educationImg from "@/assets/education.jpg";
import libraryImg from "@/assets/library.jpg";
import debateImg from "@/assets/debate.jpg";
import logoImg from "@/assets/logo1cut.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chaplin's Party of India — For Change, Not Next." },
      {
        name: "description",
        content:
          "A Gen Z ideological movement built on education, awareness, secularism, and disciplined debate. Build ideology before influence.",
      },
      { property: "og:title", content: "Chaplin's Party of India — For Change, Not Next." },
      {
        property: "og:description",
        content:
          "A generation that studies history, questions systems, and believes reform begins through education.",
      },
    ],
  }),
  component: Index,
});

const NAV = [
  ["Home", "#home"],
  ["Ideology", "#ideology"],
  ["Manifesto", "#manifesto"],
  ["Reading Room", "#reading"],
  ["Debate Culture", "#debate"],
  ["Community", "#community"],
  ["Join", "#join"],
] as const;

function Index() {
  const [time, setTime] = useState("");
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
          " UTC"
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch live member count
  useEffect(() => {
    supabase
      .from("site_stats")
      .select("value")
      .eq("key", "total_members")
      .single()
      .then(({ data }) => {
        if (data) setMemberCount(data.value);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Nav />

      {/* HERO */}
      <section id="home" className="relative min-h-screen w-full overflow-hidden grain">
        <img
          src={heroFigure}
          alt="Anonymous figure in long coat standing on a foggy city street at night"
          className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale"
          width={1280}
          height={720}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-0 scanlines" />

        {/* CCTV markers */}
        <div className="absolute top-24 left-6 md:left-10 font-mono text-[10px] tracking-[0.3em] text-fog/70 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-foreground flicker" />
          REC · CH.07 · {time}
        </div>
        <div className="absolute top-24 right-6 md:right-10 font-mono text-[10px] tracking-[0.3em] text-fog/70 text-right">
          51.5074° N / 0.1278° W
          <br />
          ISO 1600 · 35MM
        </div>

        <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 md:px-12 pb-20 md:pb-24 pt-40">
          <div className="max-w-5xl">
            <div className="mb-8 font-mono text-[11px] tracking-[0.35em] text-fog/80 uppercase">
              ACT I — A Generation Awakens
            </div>
            <h1 className="font-display text-[14vw] md:text-[9vw] leading-[0.88] tracking-[-0.04em] text-balance">
              For the People.
              <br />
              <span className="text-fog">By the Gen Z.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-xl md:text-2xl font-light tracking-tight text-foreground/90">
              Build ideology before influence.
            </p>
            <p className="mt-6 max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
              A generation that studies history, questions systems, respects humanity, and believes
              reform begins through education, awareness, and disciplined thought.
            </p>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#ideology"
                className="group inline-flex items-center justify-center px-5 sm:px-8 py-3 sm:py-4 bg-foreground text-background text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] font-medium uppercase transition-all hover:bg-fog"
              >
                Read our Ideology First
                <span className="ml-2 sm:ml-3 transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#join"
                className="group inline-flex items-center justify-center px-5 sm:px-8 py-3 sm:py-4 border border-border text-foreground text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] font-medium uppercase transition-all hover:border-foreground"
              >
                Join the Movement
                <span className="ml-2 sm:ml-3 transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* ── Live Member Counter — centered, b&w ── */}
            {memberCount !== null && (
              <div className="mt-10 sm:mt-14 flex justify-center w-full">
                <LiveMemberCounter target={memberCount} />
              </div>
            )}
          </div>
        </div>

        {/* bottom ticker */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm overflow-hidden">
          <div className="flex marquee whitespace-nowrap py-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            {Array(2)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex shrink-0">
                  {[
                    "Education over manipulation",
                    "Secularism",
                    "Civic responsibility",
                    "Peaceful reform",
                    "Argue with data",
                    "Speak with dignity",
                    "Knowledge creates responsibility",
                    "For change, not next",
                  ].map((t) => (
                    <span key={t} className="px-8 flex items-center gap-8">
                      {t} <span className="text-foreground">✕</span>
                    </span>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* SECTION 1 — CORE PHILOSOPHY */}
      <section id="ideology" className="relative px-6 md:px-12 py-32 md:py-48">
        <SectionLabel num="01" label="Core Philosophy" />
        <div className="mt-12 grid grid-cols-12 gap-8">
          <h2 className="col-span-12 md:col-span-8 font-display text-5xl md:text-8xl leading-[0.95] tracking-[-0.04em] text-balance">
            Break the wall.
            <br />
            <span className="text-fog">Not the person.</span>
          </h2>
          <p className="col-span-12 md:col-span-4 md:col-start-9 text-base md:text-lg text-muted-foreground leading-relaxed self-end">
            We do not believe people should survive through dependency alone. We believe people
            should rise through education, awareness, equal opportunity, and independent thinking.
          </p>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
          {[
            ["Avoid Language Imposition", "Every language carries a culture. No state should force one tongue over another."],
            ["Speak OBC, SC, ST Politics", "Represent the majority, not the elite. Ground-level justice over boardroom policy."],
            ["Be Rationalist, Not Pseudo-Scientific", "Believe in God or be atheist — but never spread superstition. Think with evidence, even in faith."],
            ["Social Justice", "Equal standing before law, opportunity, and dignity."],
            ["Secularism", "The state must remain neutral. Belief is personal."],
            ["Civic Responsibility", "Citizenship is not a slogan. It is a daily practice."],
            ["Education Reform", "Schools that teach thought, not obedience."],
            ["Historical Awareness", "Read what was buried. Question what was taught."],
            ["Peaceful Reform", "No bricks. No fires. Only sustained pressure of reason."],
          ].map(([title, desc], i) => (
            <div
              key={title}
              className="group relative border-r border-b border-border p-8 md:p-10 min-h-[260px] transition-colors hover:bg-secondary"
            >
              <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-8 font-display text-2xl md:text-3xl tracking-tight">{title}</h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div className="absolute bottom-8 right-8 text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          ))}
        </div>

        {/* Ideological Statement — Principles Over Personalities */}
        <div className="mt-32 md:mt-48 relative grain border-t border-border pt-24 md:pt-32">
          <div className="relative z-10 px-6 md:px-12 pb-12">
            <blockquote className="font-display text-5xl md:text-7xl lg:text-[8vw] leading-[0.92] tracking-[-0.04em] text-balance max-w-6xl">
              "Do not worship leaders.
              <br />
              <span className="text-fog">Worship ideology, ethics, and truth."</span>
            </blockquote>

            <div className="mt-20 md:mt-28 grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-8">
                <p className="text-base md:text-lg text-muted-foreground leading-[1.8] text-balance">
                  We believe modern politics has become trapped in personality worship. Societies become weaker when people stop questioning leaders and start defending individuals blindly.
                </p>
                <p className="mt-6 text-base md:text-lg text-muted-foreground leading-[1.8] text-balance">
                  Chaplin's Party does not exist to create political celebrities. No leader should become greater than the ideology itself. Every person in the movement — including leadership — must remain open to criticism, accountability, historical analysis, and ethical questioning.
                </p>
                <p className="mt-6 text-base md:text-lg text-muted-foreground leading-[1.8] text-balance">
                  We believe ideas should survive through logic, evidence, humanity, and social responsibility — not through emotional attachment to powerful individuals.
                </p>
                <div className="mt-10 space-y-1">
                  <p className="font-display text-xl md:text-2xl tracking-tight">Leadership is temporary.</p>
                  <p className="font-display text-xl md:text-2xl tracking-tight">Ideology is permanent.</p>
                  <p className="font-display text-xl md:text-2xl tracking-tight text-fog">Awareness is more important than popularity.</p>
                </div>
                <p className="mt-10 text-base md:text-lg text-muted-foreground leading-[1.8] text-balance">
                  A healthy society is built when citizens think independently instead of following political fan culture. We encourage every individual to question respectfully, study deeply, debate intelligently, and support principles over personalities.
                </p>
                <p className="mt-6 text-base md:text-lg text-muted-foreground leading-[1.8] text-balance">
                  The movement must always remain bigger than the individual.
                </p>
              </div>
            </div>

            <div className="mt-20 md:mt-28">
              <p className="font-mono text-xs tracking-[0.35em] text-foreground uppercase">
                "Question everyone. Understand everything."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — CAPITALISM VS COMMUNISM */}
      <section id="manifesto" className="relative border-t border-border">
        <SectionLabel num="02" label="Two Doctrines, One Conversation" className="px-6 md:px-12 pt-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border mt-12 min-h-[60vh]">
          <div className="relative p-10 md:p-16 border-b md:border-b-0 md:border-r border-border bg-foreground text-background">
            <div className="font-mono text-[10px] tracking-[0.35em]">LEFT PANEL</div>
            <h3 className="mt-12 font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.04em]">
              Capitalism creates innovation.
            </h3>
            <div className="mt-16 space-y-2 font-mono text-xs">
              <Bar label="Innovation index" value={88} dark />
              <Bar label="Inequality coefficient" value={71} dark />
              <Bar label="Civic depth" value={34} dark />
            </div>
          </div>
          <div className="relative p-10 md:p-16">
            <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground">
              RIGHT PANEL
            </div>
            <h3 className="mt-12 font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.04em]">
              Communism demands equality.
            </h3>
            <div className="mt-16 space-y-2 font-mono text-xs">
              <Bar label="Innovation index" value={42} />
              <Bar label="Inequality coefficient" value={28} />
              <Bar label="Civic depth" value={66} />
            </div>
          </div>
        </div>
        <div className="border-t border-border px-6 md:px-12 py-20 md:py-28 text-center">
          <p className="font-display text-2xl md:text-4xl leading-snug tracking-tight max-w-4xl mx-auto text-balance">
            We believe society must discuss both critically — instead of blindly worshipping either
            side.
          </p>
        </div>
      </section>

      {/* SECTION 3 — EDUCATION OVER DEPENDENCY */}
      <section className="relative border-t border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[60vh] lg:min-h-[90vh] order-2 lg:order-1">
            <img
              src={educationImg}
              alt="Students reading in a classroom"
              loading="lazy"
              width={1920}
              height={1080}
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-background/30 mix-blend-multiply" />
          </div>
          <div className="px-6 md:px-12 py-24 lg:py-32 order-1 lg:order-2 lg:border-l border-border">
            <SectionLabel num="03" label="Education Over Dependency" />
            <h2 className="mt-10 font-display text-4xl md:text-6xl leading-[0.95] tracking-[-0.04em] text-balance">
              Do not keep people dependent.
              <br />
              <span className="text-fog">Remove the barriers that stop them.</span>
            </h2>
            <ul className="mt-14 divide-y divide-border border-y border-border">
              {[
                "Unconditional access to education",
                "Equal opportunity",
                "Critical thinking",
                "Skill development",
                "Awareness over manipulation",
                "Empower people through knowledge",
              ].map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline justify-between py-5 text-base md:text-lg"
                >
                  <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground mr-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{item}</span>
                  <span className="text-muted-foreground">→</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4 — READING & HISTORY ROOM */}
      <section id="reading" className="relative border-t border-border">
        <div className="relative min-h-[50vh]">
          <img
            src={libraryImg}
            alt="A lone reader in a vast dark library"
            loading="lazy"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60" />
          <div className="relative px-6 md:px-12 py-24 md:py-32 max-w-5xl">
            <SectionLabel num="04" label="Reading & History Room" />
            <blockquote className="mt-10 font-display text-3xl md:text-5xl leading-tight tracking-[-0.03em] text-balance">
              “A society that stops reading becomes easy to manipulate.”
            </blockquote>
          </div>
        </div>

        <div className="px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-border border-y border-border">
          {[
            ["Political History", "Hobsbawm · Arendt · Snyder"],
            ["Philosophy", "Camus · Sen · Hannah Arendt"],
            ["Economics", "Piketty · Sen · Stiglitz"],
            ["Constitutional Awareness", "Granville · Ambedkar"],
            ["Social Reform", "Freire · King · Fanon"],
          ].map(([title, authors], i) => (
            <article
              key={title}
              className="bg-background p-8 group hover:bg-secondary transition-colors min-h-[280px] flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground">
                  VOL. {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-10 font-display text-2xl tracking-tight">{title}</h3>
              </div>
              <p className="text-xs text-muted-foreground tracking-wider mt-8">{authors}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 5 — DEBATE CULTURE */}
      <section id="debate" className="relative border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 px-6 md:px-12 py-24 lg:py-32">
            <SectionLabel num="05" label="Debate Culture" />
            <h2 className="mt-10 font-display text-5xl md:text-7xl leading-[0.92] tracking-[-0.04em] text-balance">
              Argue with data.
              <br />
              <span className="text-fog">Speak with dignity.</span>
            </h2>
            <div className="mt-16 space-y-px bg-border border border-border">
              {[
                ["No violence.", "Physical or rhetorical. Both disqualify."],
                ["No hate speech.", "Identity is not an argument to dismantle."],
                ["Evidence-based discussion.", "A claim without a source is a feeling."],
                ["Respectful disagreement.", "Sharpen the idea, not the person."],
                ["Ideology through knowledge,", "not shouting."],
              ].map(([rule, sub], i) => (
                <div
                  key={rule}
                  className="bg-background grid grid-cols-12 items-baseline gap-4 p-6"
                >
                  <span className="col-span-2 font-mono text-xs tracking-[0.3em] text-muted-foreground">
                    R.{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 md:col-span-4 font-display text-xl md:text-2xl">
                    {rule}
                  </span>
                  <span className="col-span-12 md:col-span-6 text-muted-foreground text-sm">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-full lg:border-l border-border">
            <img
              src={debateImg}
              alt="Empty discussion room under a single lamp"
              loading="lazy"
              width={1920}
              height={1080}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-background/30" />
          </div>
        </div>
      </section>

      {/* SECTION 6 — LEADERSHIP */}
      <section className="relative border-t border-border px-6 md:px-12 py-32">
        <SectionLabel num="06" label="Leadership System" />
        <div className="mt-12 grid grid-cols-12 gap-8">
          <p className="col-span-12 md:col-span-8 font-display text-3xl md:text-5xl leading-[1.05] tracking-[-0.03em] text-balance">
            All leaders are selected through ideological interviews, ethics, discipline, knowledge,
            and civic understanding —{" "}
            <span className="text-muted-foreground">
              not through personal closeness or favoritism.
            </span>
          </p>
        </div>
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border">
          {[
            "Transparent Recruitment",
            "Ideological Interviews",
            "Reading Culture",
            "Civic Ethics",
            "Disciplined Leadership",
          ].map((s, i) => (
            <div key={s} className="bg-background p-8 min-h-[200px] flex flex-col justify-between">
              <span className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground">
                STAGE {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="font-display text-xl tracking-tight">{s}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — COMMUNITY */}
      <section id="community" className="relative border-t border-border overflow-hidden">
        <div className="absolute inset-0">
          <img src={cityImg} alt="" aria-hidden className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        </div>
        <div className="relative px-6 md:px-12 py-32">
          <SectionLabel num="07" label="Community" />
          <h2 className="mt-10 font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.04em] text-balance max-w-4xl">
            A thoughtful youth movement,{" "}
            <span className="text-fog">measured in pages read, not posts shared.</span>
          </h2>
          <div className="mt-20 border border-border bg-background p-12 md:p-20 text-center count-fade">
            <span className="font-display text-7xl md:text-[12vw] leading-none tracking-[-0.04em]">
              {memberCount !== null ? memberCount.toLocaleString() : "—"}
            </span>
            <div className="mt-6 font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
              Members Connected
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — JOIN */}
      <section id="join" className="relative border-t border-border px-6 md:px-12 py-32">
        <SectionLabel num="08" label="Enlist" />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-5xl md:text-7xl leading-[0.92] tracking-[-0.04em]">
              Join the
              <br />
              movement.
            </h2>
            <p className="mt-8 text-muted-foreground max-w-md">
              We are not collecting followers. We are inviting students of society. Write to us as
              you would write to a future you respect.
            </p>
            <p className="mt-10 font-mono text-xs tracking-[0.35em] text-foreground uppercase">
              Knowledge creates responsibility.
            </p>
          </div>

          <div className="lg:col-span-7 lg:border-l border-border lg:pl-12">
            <p className="text-muted-foreground mb-8">
              Create your account in seconds. Fill in your profile later.
            </p>
            <Link
              to="/signup"
              className="group inline-flex items-center justify-center px-12 py-5 bg-foreground text-background text-xs tracking-[0.35em] font-medium uppercase transition-all hover:bg-fog"
            >
              Create Account
              <span className="ml-3 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <div className="mt-6">
              <span className="text-sm text-muted-foreground">Already a member? </span>
              <Link
                to="/login"
                className="text-sm text-foreground underline underline-offset-4 hover:text-fog transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Nav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [memberName, setMemberName] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch profile name for logged-in users
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.full_name) setMemberName(data.full_name);
        });
    } else {
      setMemberName(null);
    }
  }, [user]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 min-[380px]:px-6 md:px-12 py-5">
        <a href="#home" className="group flex items-center gap-3">
          <img src={logoImg} alt="Chaplin's Party Logo" className="h-8 w-8 rounded-full border border-border group-hover:border-foreground transition-colors duration-300" />
          <div>
            <div className="font-display text-[10px] min-[380px]:text-xs sm:text-sm md:text-base tracking-[0.18em] min-[380px]:tracking-[0.25em] leading-none">
              CHAPLIN'S PARTY OF INDIA
            </div>
            <div className="mt-1 font-mono text-[7px] min-[380px]:text-[9px] md:text-[10px] tracking-[0.2em] min-[380px]:tracking-[0.3em] text-muted-foreground">
              FOR CHANGE, NOT NEXT.
            </div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {memberName || user.email?.split("@")[0]}
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/75 border border-border px-2 py-0.5 uppercase flex items-center gap-1.5 bg-secondary/10">
                  <img src={logoImg} alt="Brand Logo" className="h-3 w-3 rounded-full border border-border/30" />
                  Member
                </span>
              </div>
              <Link
                to="/leader-exam"
                className="font-mono text-[11px] tracking-[0.25em] uppercase bg-foreground text-background px-4 py-1.5 hover:bg-fog hover:text-black transition-colors duration-300"
              >
                Become a Leader
              </Link>
              <Link
                to="/dashboard"
                className="font-mono text-[11px] tracking-[0.25em] uppercase text-foreground border border-border px-4 py-1.5 hover:bg-secondary transition-colors"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-mono text-[11px] tracking-[0.25em] uppercase text-foreground border border-border px-4 py-1.5 hover:bg-secondary transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          className="lg:hidden font-mono text-[9px] min-[380px]:text-[11px] tracking-[0.2em] min-[380px]:tracking-[0.3em] uppercase border border-border px-2.5 min-[380px]:px-4 py-1.5 min-[380px]:py-2"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="flex flex-col">
            {NAV.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-6 py-4 border-b border-border font-mono text-xs tracking-[0.3em] uppercase"
              >
                {label}
              </a>
            ))}
            {user ? (
              <>
                <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase">
                    {memberName || user.email?.split("@")[0]}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/75 border border-border px-2 py-0.5 uppercase flex items-center gap-1.5 bg-secondary/10">
                    <img src={logoImg} alt="Brand Logo" className="h-3 w-3 rounded-full border border-border/30" />
                    Member
                  </span>
                </div>
                <div className="px-6 py-4 border-b border-border">
                  <Link
                    to="/leader-exam"
                    onClick={() => setOpen(false)}
                    className="block w-full py-3 bg-foreground text-background font-mono text-xs tracking-[0.3em] uppercase text-center hover:bg-fog transition-colors"
                  >
                    Become a Leader
                  </Link>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="px-6 py-4 border-b border-border font-mono text-xs tracking-[0.3em] uppercase text-foreground"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-6 py-4 border-b border-border font-mono text-xs tracking-[0.3em] uppercase text-foreground"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function SectionLabel({
  num,
  label,
  className = "",
}: {
  num: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">{num}</span>
      <span className="h-px flex-1 max-w-[80px] bg-border" />
      <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground">
        {label}
      </span>
    </div>
  );
}

function Bar({ label, value, dark = false }: { label: string; value: number; dark?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase mb-2">
        <span className={dark ? "text-background/70" : "text-muted-foreground"}>{label}</span>
        <span>{value}</span>
      </div>
      <div className={`h-px w-full ${dark ? "bg-background/30" : "bg-border"}`}>
        <div
          className={`h-px ${dark ? "bg-background" : "bg-foreground"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ── Animated live member counter for the hero ── */
function LiveMemberCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated || target <= 0) return;

    const duration = 2200;
    const startTime = performance.now();

    function easeOutExpo(t: number) {
      return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    let raf: number;
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [hasAnimated, target]);

  const formatted = count.toLocaleString();

  return (
    <div
      ref={ref}
      className="hero-counter-card relative flex flex-col items-center text-center"
    >
      {/* Outer breathing ring */}
      <div className="absolute inset-0 hero-counter-ring pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-8 sm:px-14 md:px-20 py-6 sm:py-8 border border-foreground/15 bg-background/50 backdrop-blur-md">
        {/* Live dot row */}
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <span className="relative flex h-2 w-2">
            <span className="hero-pulse-ring absolute inline-flex h-full w-full rounded-full bg-foreground/70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.4em] text-foreground/60 uppercase">
            Live Count
          </span>
        </div>

        {/* Big number */}
        <span className="font-display text-5xl sm:text-7xl md:text-8xl tracking-[-0.04em] leading-none tabular-nums text-foreground hero-count-glow">
          {formatted}
        </span>

        {/* Label */}
        <span className="mt-3 sm:mt-4 font-mono text-[8px] sm:text-[10px] tracking-[0.4em] text-foreground/40 uppercase">
          Members &amp; Growing
        </span>

        {/* Divider */}
        <div className="mt-4 sm:mt-5 w-12 h-px bg-foreground/15" />

        {/* Tagline */}
        <span className="mt-3 sm:mt-4 font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-fog/60 uppercase">
          You are not alone. Join the movement.
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block bg-background p-6 ${className}`}>
      <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
      />
    </label>
  );
}

function FieldArea({
  label,
  name,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block bg-background p-6 ${className}`}>
      <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
        {label}
      </span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={4}
        className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 resize-none transition-colors"
      />
    </label>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border bg-background px-6 md:px-12 py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-6">
          <p className="font-display text-3xl md:text-5xl leading-[1.05] tracking-[-0.03em] text-balance">
            “We do not follow trends.
            <br />
            <span className="text-fog">We study society.”</span>
          </p>
          <div className="mt-12 flex items-center gap-4">
            <img src={logoImg} alt="Chaplin's Party Logo" className="h-10 w-10 rounded-full border border-border" />
            <p className="font-display text-2xl md:text-3xl tracking-[-0.03em]">
              For the People. By the Gen Z.
            </p>
          </div>
        </div>
        <div className="md:col-span-3 md:col-start-8">
          <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Index
          </div>
          <ul className="mt-6 space-y-3">
            {NAV.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-foreground/80 hover:text-foreground text-sm">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Correspondence
          </div>
          <p className="mt-6 text-sm text-foreground/80 leading-relaxed">
            <a href="mailto:partychaplin@gmail.com" className="hover:text-foreground hover:underline transition-colors">
              partychaplin@gmail.com
            </a>
          </p>
          <p className="mt-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            EST. MMXXVI · NO. 001
          </p>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
          © Chaplin's Party of India — A Reading Movement
        </div>
        <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
          Knowledge creates responsibility.
        </div>
      </div>
    </footer>
  );
}
