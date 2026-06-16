import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import logoImg from "@/assets/logo1cut.png";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Chaplin's Party of India" },
      {
        name: "description",
        content:
          "Create a new password for your Chaplin's Party of India account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { user, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: authError } = await updatePassword(password);
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
  }

  // Cyberpunk style loading screen while checking auth session state
  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center grain overflow-hidden bg-background">
        <div className="absolute inset-0 scanlines" />
        <div className="relative z-10 text-center font-mono text-xs tracking-[0.35em] text-muted-foreground uppercase">
          <span className="h-2 w-2 rounded-full bg-foreground flicker inline-block mr-3 align-middle" />
          Verifying secure link authorization...
        </div>
      </div>
    );
  }

  // If not authenticated, recovery token is invalid or user is not logged in
  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center grain overflow-hidden bg-background">
        <div className="absolute inset-0 scanlines" />
        <div className="relative z-10 w-full max-w-lg px-6 text-center">
          <div className="mb-8 font-mono text-[10px] tracking-[0.35em] text-red-400 uppercase">
            SECURE CHANNEL · INVALID OR EXPIRED SESSION
          </div>
          <h1 className="font-display text-3xl leading-none tracking-tight mb-4">
            Authorization Failed.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
            Your recovery link may have expired or is invalid. Please request a new recovery link.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              to="/forgot-password"
              className="px-12 py-5 bg-foreground text-background text-xs tracking-[0.35em] font-medium uppercase transition-all hover:bg-fog text-center"
            >
              Request New Link
            </Link>
            <Link
              to="/login"
              className="text-sm text-foreground underline underline-offset-4 hover:text-fog transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center grain overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 scanlines" />

      {/* CCTV accent */}
      <div className="absolute top-6 left-6 md:left-10 font-mono text-[10px] tracking-[0.35em] text-muted-foreground flex items-center gap-2 z-10">
        <span className="h-2 w-2 rounded-full bg-foreground flicker" />
        SECURE CHANNEL · PASSWORD UPDATE
      </div>
      <div className="absolute top-6 right-6 md:right-10 font-mono text-[10px] tracking-[0.35em] text-muted-foreground text-right z-10">
        ENCRYPTED · AES-256
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Header */}
        <Link to="/" className="group flex items-center gap-3 mb-12">
          <img
            src={logoImg}
            alt="Chaplin's Party Logo"
            className="h-10 w-10 rounded-full border border-border group-hover:border-foreground transition-colors duration-300"
          />
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
            AUTH — SET NEW PASSWORD
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-[0.92] tracking-[-0.04em]">
            Establish
            <br />
            <span className="text-fog">credentials.</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
            Enter a new password for account validation. Make it secure.
          </p>
        </div>

        {/* Form or Success Screen */}
        {success ? (
          <div className="border border-border bg-background/50 backdrop-blur-sm p-8 text-center">
            <div className="font-mono text-xs tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-6 mb-6">
              <span className="block font-bold mb-2 uppercase text-sm">
                Password Restored
              </span>
              Your password has been updated successfully.
            </div>
            <Link
              to="/dashboard"
              className="inline-block w-full text-center px-12 py-5 bg-foreground text-background text-xs tracking-[0.35em] font-medium uppercase transition-all hover:bg-fog"
            >
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="border border-border bg-background">
              <label className="block p-6 border-b border-border">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  New Password
                </span>
                <input
                  id="reset-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
                />
              </label>

              <label className="block p-6">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Confirm Password
                </span>
                <input
                  id="reset-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
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
              id="reset-submit"
              type="submit"
              disabled={submitting}
              className="mt-8 w-full px-12 py-5 bg-foreground text-background text-xs tracking-[0.35em] font-medium uppercase transition-all hover:bg-fog disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Password →"}
            </button>
          </form>
        )}

        <div className="mt-12 font-mono text-[10px] tracking-[0.35em] text-muted-foreground/60 text-center uppercase">
          Build ideology before influence.
        </div>
      </div>
    </div>
  );
}
