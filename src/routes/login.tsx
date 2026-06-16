import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import logoImg from "@/assets/logo1cut.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Chaplin's Party of India" },
      {
        name: "description",
        content:
          "Sign in to your Chaplin's Party of India account. For change, not next.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: authError } = await signIn(email, password);
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    navigate({ to: "/dashboard" });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center grain overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 scanlines" />

      {/* CCTV accent */}
      <div className="absolute top-6 left-6 md:left-10 font-mono text-[10px] tracking-[0.3em] text-muted-foreground flex items-center gap-2 z-10">
        <span className="h-2 w-2 rounded-full bg-foreground flicker" />
        SECURE CHANNEL · AUTH
      </div>
      <div className="absolute top-6 right-6 md:right-10 font-mono text-[10px] tracking-[0.3em] text-muted-foreground text-right z-10">
        ENCRYPTED · AES-256
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Header */}
        <Link to="/" className="group flex items-center gap-3 mb-12">
          <img src={logoImg} alt="Chaplin's Party Logo" className="h-10 w-10 rounded-full border border-border group-hover:border-foreground transition-colors duration-300" />
          <div>
            <div className="font-display text-[10px] min-[380px]:text-xs sm:text-sm tracking-[0.18em] min-[380px]:tracking-[0.25em] leading-none">
              CHAPLIN'S PARTY OF INDIA
            </div>
            <div className="mt-1 font-mono text-[7px] min-[380px]:text-[8px] sm:text-[9px] tracking-[0.2em] min-[380px]:tracking-[0.3em] text-muted-foreground">
              FOR CHANGE, NOT NEXT.
            </div>
          </div>
        </Link>

        <div className="mb-10">
          <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase mb-4">
            AUTH — IDENTIFY
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-[0.92] tracking-[-0.04em]">
            Welcome
            <br />
            <span className="text-fog">back.</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
            Sign in to continue where you left off.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="border border-border">
            <label className="block bg-background p-6 border-b border-border">
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                Email
              </span>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
              />
            </label>

            <label className="block bg-background p-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Password
                </span>
                <Link
                  to="/forgot-password"
                  className="font-mono text-[10px] tracking-wider text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
              />
            </label>
          </div>

          {error && (
            <div className="mt-4 font-mono text-xs tracking-wider text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3">
              {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            disabled={submitting}
            className="mt-8 w-full px-12 py-5 bg-foreground text-background text-xs tracking-[0.35em] font-medium uppercase transition-all hover:bg-fog disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Authenticating..." : "Sign In →"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-sm text-muted-foreground">
            Not a member yet?{" "}
          </span>
          <Link
            to="/signup"
            className="text-sm text-foreground underline underline-offset-4 hover:text-fog transition-colors"
          >
            Join the movement
          </Link>
        </div>

        <div className="mt-12 font-mono text-[10px] tracking-[0.35em] text-muted-foreground/60 text-center uppercase">
          Build ideology before influence.
        </div>
      </div>
    </div>
  );
}
