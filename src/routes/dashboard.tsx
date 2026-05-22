import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase, type Profile } from "@/lib/supabase";
import logoImg from "@/assets/logo1cut.png";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Chaplin's Party of India" },
      {
        name: "description",
        content: "Your Chaplin's Party of India member dashboard. Update your profile and track the movement.",
      },
    ],
  }),
  component: DashboardPage,
});

const AGE_RANGES = ["Under 18", "18–24", "25–34", "35–44", "45+"];

function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  // Fetch profile + stats
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoadingProfile(true);

    const [profileRes, statsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("site_stats").select("value").eq("key", "total_members").single(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (statsRes.data) setTotalMembers(statsRes.data.value);
    setLoadingProfile(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save profile
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setToast(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name || null,
        district: profile.district || null,
        state: profile.state || null,
        instagram_handle: profile.instagram_handle || null,
        telegram_handle: profile.telegram_handle || null,
        favorite_book: profile.favorite_book || null,
        why_join: profile.why_join || null,
        age_range: profile.age_range || null,
        mobile_number: profile.mobile_number || null,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setToast({ type: "error", msg: error.message });
    } else {
      setToast({ type: "success", msg: "Profile updated successfully." });
      setTimeout(() => setToast(null), 4000);
    }
  }

  function updateField(field: keyof Profile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  // Loading states
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-mono text-xs tracking-[0.35em] text-muted-foreground uppercase animate-pulse">
          Authenticating...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/85 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 min-[380px]:px-6 md:px-12 py-5">
          <Link to="/" className="group flex items-center gap-3">
            <img src={logoImg} alt="Chaplin's Party Logo" className="h-8 w-8 rounded-full border border-border group-hover:border-foreground transition-colors duration-300" />
            <div>
              <div className="font-display text-[10px] min-[380px]:text-xs sm:text-sm md:text-base tracking-[0.18em] min-[380px]:tracking-[0.25em] leading-none">
                CHAPLIN'S PARTY OF INDIA
              </div>
              <div className="mt-1 font-mono text-[7px] min-[380px]:text-[9px] md:text-[10px] tracking-[0.2em] min-[380px]:tracking-[0.3em] text-muted-foreground">
                FOR CHANGE, NOT NEXT.
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-6">
            <Link
              to="/leader-exam"
              className="font-mono text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.25em] uppercase bg-foreground text-background px-2.5 sm:px-4 py-1.5 sm:py-2 hover:bg-fog hover:text-black transition-colors duration-300 text-center font-medium"
            >
              <span className="sm:hidden">Leader</span>
              <span className="hidden sm:inline">Become a Leader</span>
            </Link>
            <span className="hidden md:inline font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              {user?.email}
            </span>
            <button
              id="signout-btn"
              onClick={handleSignOut}
              className="font-mono text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.3em] uppercase border border-border px-2.5 sm:px-4 py-1.5 sm:py-2 hover:bg-secondary transition-colors font-medium"
            >
              <span className="sm:hidden">Exit</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 md:px-12 py-12 md:py-20 max-w-5xl mx-auto">
        {/* Stats banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border mb-16">
          <div className="bg-background p-8 flex flex-col justify-between min-h-[160px]">
            <span className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
              Total Members
            </span>
            <span className="font-display text-5xl md:text-6xl tracking-[-0.04em] count-fade">
              {loadingProfile ? "—" : totalMembers.toLocaleString()}
            </span>
          </div>
          <div className="bg-background p-8 flex flex-col justify-between min-h-[160px]">
            <span className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
              Your Role
            </span>
            <span className="font-display text-3xl tracking-[-0.03em] capitalize">
              {profile.role || "member"}
            </span>
          </div>
          <div className="bg-background p-8 flex flex-col justify-between min-h-[160px]">
            <span className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
              Status
            </span>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 flicker" />
              <span className="font-display text-3xl tracking-[-0.03em]">Active</span>
            </div>
          </div>
        </div>

        {/* Leader CTA Banner */}
        <div className="border border-border bg-secondary/30 p-8 md:p-10 mb-16 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute inset-0 scanlines opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground flicker" />
              <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground">
                LEADERSHIP PATH
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-2">
              Ready to help shape the <span className="text-fog">movement?</span>
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Tomorrow's leaders are tested on history, economics, and ethics. Prove your ideological depth and join our candidate pool.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <Link
              to="/leader-exam"
              className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background text-xs tracking-[0.3em] font-mono font-medium uppercase transition-all hover:bg-fog"
            >
              Become a Leader →
            </Link>
          </div>
        </div>

        {/* Profile Form */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">01</span>
            <span className="h-px flex-1 max-w-[80px] bg-border" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground">
              Your Profile
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl leading-[0.95] tracking-[-0.04em] mb-2">
            Tell us about <span className="text-fog">yourself.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            All fields except email are optional. Update anytime.
          </p>
        </div>

        {/* Toast notification */}
        {toast && (
          <div
            className={`mb-8 font-mono text-xs tracking-wider px-4 py-3 border ${
              toast.type === "success"
                ? "text-green-400 bg-green-400/10 border-green-400/20"
                : "text-red-400 bg-red-400/10 border-red-400/20"
            }`}
          >
            {toast.msg}
          </div>
        )}

        {loadingProfile ? (
          <div className="border border-border p-12 text-center">
            <div className="font-mono text-xs tracking-[0.35em] text-muted-foreground uppercase animate-pulse">
              Loading profile...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
              {/* Email — read only */}
              <label className="block bg-background p-6 md:col-span-2">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Email
                </span>
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="mt-4 w-full bg-transparent border-0 border-b border-border outline-none py-2 text-base text-muted-foreground cursor-not-allowed"
                />
              </label>

              {/* Full Name */}
              <label className="block bg-background p-6">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Full Name
                </span>
                <input
                  id="profile-fullname"
                  type="text"
                  value={profile.full_name || ""}
                  onChange={(e) => updateField("full_name", e.target.value)}
                  placeholder="Your full name"
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
                />
              </label>

              {/* District */}
              <label className="block bg-background p-6">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  District
                </span>
                <input
                  id="profile-district"
                  type="text"
                  value={profile.district || ""}
                  onChange={(e) => updateField("district", e.target.value)}
                  placeholder="City / district"
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
                />
              </label>

              {/* State */}
              <label className="block bg-background p-6">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  State
                </span>
                <input
                  id="profile-state"
                  type="text"
                  value={profile.state || ""}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="Tamil Nadu"
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
                />
              </label>

              {/* Age Range */}
              <label className="block bg-background p-6">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Age Range
                </span>
                <select
                  id="profile-age"
                  value={profile.age_range || ""}
                  onChange={(e) => updateField("age_range", e.target.value)}
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base text-foreground transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-background text-muted-foreground">
                    Select age range
                  </option>
                  {AGE_RANGES.map((r) => (
                    <option key={r} value={r} className="bg-background text-foreground">
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              {/* Mobile Number */}
              <label className="block bg-background p-6">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Mobile Number
                </span>
                <span className="ml-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
                  Optional
                </span>
                <input
                  id="profile-mobile"
                  type="tel"
                  value={profile.mobile_number || ""}
                  onChange={(e) => updateField("mobile_number", e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
                />
              </label>

              {/* Instagram */}
              <label className="block bg-background p-6">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Instagram Handle
                </span>
                <input
                  id="profile-instagram"
                  type="text"
                  value={profile.instagram_handle || ""}
                  onChange={(e) => updateField("instagram_handle", e.target.value)}
                  placeholder="@handle"
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
                />
              </label>

              {/* Telegram */}
              <label className="block bg-background p-6">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Telegram Handle
                </span>
                <input
                  id="profile-telegram"
                  type="text"
                  value={profile.telegram_handle || ""}
                  onChange={(e) => updateField("telegram_handle", e.target.value)}
                  placeholder="@handle"
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
                />
              </label>

              {/* Favorite Book */}
              <label className="block bg-background p-6 md:col-span-2">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Favorite Book
                </span>
                <input
                  id="profile-book"
                  type="text"
                  value={profile.favorite_book || ""}
                  onChange={(e) => updateField("favorite_book", e.target.value)}
                  placeholder="Title — Author"
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors"
                />
              </label>

              {/* Why Join */}
              <label className="block bg-background p-6 md:col-span-2">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Why do you want change?
                </span>
                <textarea
                  id="profile-why"
                  value={profile.why_join || ""}
                  onChange={(e) => updateField("why_join", e.target.value)}
                  placeholder="Three honest sentences are enough."
                  rows={4}
                  className="mt-4 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-2 text-base placeholder:text-muted-foreground/50 resize-none transition-colors"
                />
              </label>
            </div>

            <button
              id="profile-save"
              type="submit"
              disabled={saving}
              className="mt-8 w-full md:w-auto px-12 py-5 bg-foreground text-background text-xs tracking-[0.35em] font-medium uppercase transition-all hover:bg-fog disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Update Profile →"}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
          </div>
          <Link
            to="/"
            className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
