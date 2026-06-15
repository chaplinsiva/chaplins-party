import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase, type Profile } from "@/lib/supabase";
import logoImg from "@/assets/logo1cut.png";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

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
  const [validationErrors, setValidationErrors] = useState<{
    mobile_number?: boolean;
    constituency?: boolean;
    place?: boolean;
    full_name?: boolean;
    voter_id?: boolean;
  }>({});
  const [downloading, setDownloading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  const userId = user?.id;

  // Fetch profile + stats
  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoadingProfile(true);

    const [profileRes, statsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("site_stats").select("value").eq("key", "total_members").single(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (statsRes.data) setTotalMembers(statsRes.data.value);
    setLoadingProfile(false);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check if profile is incomplete (missing required fields)
  const isProfileIncomplete = !loadingProfile && (
    !profile.full_name?.trim() ||
    !profile.mobile_number?.trim() ||
    !profile.constituency?.trim() ||
    !profile.place?.trim() ||
    !profile.voter_id?.trim()
  );

  const isLocked = !loadingProfile && profile.profile_completed === true && !isProfileIncomplete;

  // Save profile
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || isLocked) return;

    // Validate required fields
    const errors: { mobile_number?: boolean; constituency?: boolean; place?: boolean; full_name?: boolean; voter_id?: boolean } = {};
    if (!profile.full_name?.trim()) errors.full_name = true;
    if (!profile.mobile_number?.trim()) errors.mobile_number = true;
    if (!profile.constituency?.trim()) errors.constituency = true;
    if (!profile.place?.trim()) errors.place = true;
    if (!profile.voter_id?.trim()) errors.voter_id = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setToast({ type: "error", msg: "Please fill in all required fields: Full Name, Mobile, Constituency, Place, and Voter ID." });
      return;
    }

    setValidationErrors({});
    setSaving(true);
    setToast(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name || null,
        district: profile.place || null, // Keep compatibility for district
        state: profile.state || null,
        instagram_handle: profile.instagram_handle || null,
        telegram_handle: profile.telegram_handle || null,
        favorite_book: profile.favorite_book || null,
        why_join: profile.why_join || null,
        age_range: profile.age_range || null,
        mobile_number: profile.mobile_number || null,
        constituency: profile.constituency || null,
        place: profile.place || null,
        voter_id: profile.voter_id || null,
        profile_completed: true, // Lock the profile!
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      let msg = error.message;
      if (error.code === "23505" || error.message.includes("unique constraint") || error.message.includes("voter_id")) {
        msg = "This Voter ID (EPIC) Number is already registered by another member.";
      }
      setToast({ type: "error", msg });
    } else {
      setToast({ type: "success", msg: "Profile submitted and locked successfully." });
      fetchData();
    }
  }

  function updateField(field: keyof Profile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  const handleDownloadCard = async () => {
    const cardElement = document.getElementById("membership-card");
    if (!cardElement) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(cardElement, {
        pixelRatio: 4,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });

      const pdfWidth = 85.6;
      const pdfHeight = 54;
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "NONE");
      
      const memberNumStr = profile.cpi_code 
        ? `CPI-${String(profile.cpi_code).padStart(5, "0")}`
        : "MEMBER";
        
      pdf.save(`CPI-MemberCard-${memberNumStr}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setToast({ type: "error", msg: "Failed to generate member card PDF. Please try again." });
    } finally {
      setDownloading(false);
    }
  };

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

        {/* ── Incomplete Profile Alert ── */}
        {isProfileIncomplete && (
          <div className="mb-16 relative overflow-hidden border border-amber-500/40 bg-amber-500/5">
            <div className="absolute inset-0 scanlines opacity-5" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 md:p-8">
              {/* Icon */}
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 border border-amber-500/50 bg-amber-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              {/* Text */}
              <div className="flex-1">
                <h3 className="font-display text-lg md:text-xl tracking-tight text-amber-300">
                  Profile Incomplete
                </h3>
                <p className="mt-1 text-sm text-amber-200/70 leading-relaxed">
                  Your <strong className="text-amber-200">Full Name</strong>, <strong className="text-amber-200">Mobile Number</strong>, <strong className="text-amber-200">Constituency</strong>, <strong className="text-amber-200">Place</strong>, and <strong className="text-amber-200">Voter ID (EPIC)</strong> are required.
                  Please scroll down and fill them in to lock your profile and generate your card.
                </p>
              </div>
              {/* CTA */}
              <a
                href="#profile-mobile"
                className="flex-shrink-0 inline-flex items-center px-6 py-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-amber-500/30 transition-colors"
              >
                Complete Now →
              </a>
            </div>
          </div>
        )}

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
            Full Name, Mobile Number, Constituency, Place, and Voter ID are required. Other fields are optional. Once submitted, details cannot be edited.
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Form Column */}
            <form onSubmit={handleSave} className="lg:col-span-2 order-2 lg:order-1">
              {isLocked && (
                <div className="mb-8 font-mono text-xs tracking-wider px-4 py-3 border text-amber-400 bg-amber-400/10 border-amber-400/20">
                  SECURE STATUS: Your profile details have been submitted and locked. Re-editing is disabled.
                </div>
              )}
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
                  <span className="ml-2 font-mono text-[9px] tracking-[0.2em] text-red-400 uppercase font-semibold">
                    Required
                  </span>
                  <input
                    id="profile-fullname"
                    type="text"
                    value={profile.full_name || ""}
                    disabled={isLocked}
                    onChange={(e) => {
                      updateField("full_name", e.target.value);
                      if (e.target.value.trim()) setValidationErrors((prev) => ({ ...prev, full_name: false }));
                    }}
                    placeholder="Your full name"
                    className={`mt-4 w-full bg-transparent border-0 border-b outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed border-border" : "focus:border-foreground border-border"
                    } ${
                      validationErrors.full_name
                        ? "border-red-400 focus:border-red-400"
                        : ""
                    }`}
                  />
                  {validationErrors.full_name && (
                    <span className="mt-2 block font-mono text-[10px] tracking-[0.2em] text-red-400">
                      Full name is required
                    </span>
                  )}
                </label>

                {/* Constituency — REQUIRED */}
                <label className="block bg-background p-6">
                  <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                    Constituency
                  </span>
                  <span className="ml-2 font-mono text-[9px] tracking-[0.2em] text-red-400 uppercase font-semibold">
                    Required
                  </span>
                  <input
                    id="profile-constituency"
                    type="text"
                    value={profile.constituency || ""}
                    disabled={isLocked}
                    onChange={(e) => {
                      updateField("constituency", e.target.value);
                      if (e.target.value.trim()) setValidationErrors((prev) => ({ ...prev, constituency: false }));
                    }}
                    placeholder="Your assembly constituency"
                    className={`mt-4 w-full bg-transparent border-0 border-b outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed border-border" : "focus:border-foreground border-border"
                    } ${
                      validationErrors.constituency
                        ? "border-red-400 focus:border-red-400"
                        : ""
                    }`}
                  />
                  {validationErrors.constituency && (
                    <span className="mt-2 block font-mono text-[10px] tracking-[0.2em] text-red-400">
                      Constituency is required
                    </span>
                  )}
                </label>

                {/* Place — REQUIRED */}
                <label className="block bg-background p-6">
                  <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                    Place (City/Town)
                  </span>
                  <span className="ml-2 font-mono text-[9px] tracking-[0.2em] text-red-400 uppercase font-semibold">
                    Required
                  </span>
                  <input
                    id="profile-place"
                    type="text"
                    value={profile.place || ""}
                    disabled={isLocked}
                    onChange={(e) => {
                      updateField("place", e.target.value);
                      if (e.target.value.trim()) setValidationErrors((prev) => ({ ...prev, place: false }));
                    }}
                    placeholder="City / Village / Town"
                    className={`mt-4 w-full bg-transparent border-0 border-b outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed border-border" : "focus:border-foreground border-border"
                    } ${
                      validationErrors.place
                        ? "border-red-400 focus:border-red-400"
                        : ""
                    }`}
                  />
                  {validationErrors.place && (
                    <span className="mt-2 block font-mono text-[10px] tracking-[0.2em] text-red-400">
                      Place is required
                    </span>
                  )}
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
                    disabled={isLocked}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="Tamil Nadu"
                    className={`mt-4 w-full bg-transparent border-0 border-b border-border outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed" : "focus:border-foreground"
                    }`}
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
                    disabled={isLocked}
                    onChange={(e) => updateField("age_range", e.target.value)}
                    className={`mt-4 w-full bg-transparent border-0 border-b border-border outline-none py-2 text-base text-foreground transition-colors appearance-none cursor-pointer ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed" : "focus:border-foreground"
                    }`}
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

                {/* Mobile Number — REQUIRED */}
                <label className="block bg-background p-6">
                  <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                    Mobile Number
                  </span>
                  <span className="ml-2 font-mono text-[9px] tracking-[0.2em] text-red-400 uppercase font-semibold">
                    Required
                  </span>
                  <input
                    id="profile-mobile"
                    type="tel"
                    value={profile.mobile_number || ""}
                    disabled={isLocked}
                    onChange={(e) => {
                      updateField("mobile_number", e.target.value);
                      if (e.target.value.trim()) setValidationErrors((prev) => ({ ...prev, mobile_number: false }));
                    }}
                    placeholder="e.g. +91 98765 43210"
                    className={`mt-4 w-full bg-transparent border-0 border-b outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed border-border" : "focus:border-foreground border-border"
                    } ${
                      validationErrors.mobile_number
                        ? "border-red-400 focus:border-red-400"
                        : ""
                    }`}
                  />
                  {validationErrors.mobile_number && (
                    <span className="mt-2 block font-mono text-[10px] tracking-[0.2em] text-red-400">
                      Mobile number is required
                    </span>
                  )}
                </label>

                {/* Voter ID — REQUIRED */}
                <label className="block bg-background p-6">
                  <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                    Voter ID (EPIC) Number
                  </span>
                  <span className="ml-2 font-mono text-[9px] tracking-[0.2em] text-red-400 uppercase font-semibold">
                    Required
                  </span>
                  <input
                    id="profile-voterid"
                    type="text"
                    value={profile.voter_id || ""}
                    disabled={isLocked}
                    onChange={(e) => {
                      updateField("voter_id", e.target.value);
                      if (e.target.value.trim()) setValidationErrors((prev) => ({ ...prev, voter_id: false }));
                    }}
                    placeholder="Your Voter ID number"
                    className={`mt-4 w-full bg-transparent border-0 border-b outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed border-border" : "focus:border-foreground border-border"
                    } ${
                      validationErrors.voter_id
                        ? "border-red-400 focus:border-red-400"
                        : ""
                    }`}
                  />
                  {validationErrors.voter_id && (
                    <span className="mt-2 block font-mono text-[10px] tracking-[0.2em] text-red-400">
                      Voter ID is required
                    </span>
                  )}
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
                    disabled={isLocked}
                    onChange={(e) => updateField("instagram_handle", e.target.value)}
                    placeholder="@handle"
                    className={`mt-4 w-full bg-transparent border-0 border-b border-border outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed" : "focus:border-foreground"
                    }`}
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
                    disabled={isLocked}
                    onChange={(e) => updateField("telegram_handle", e.target.value)}
                    placeholder="@handle"
                    className={`mt-4 w-full bg-transparent border-0 border-b border-border outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed" : "focus:border-foreground"
                    }`}
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
                    disabled={isLocked}
                    onChange={(e) => updateField("favorite_book", e.target.value)}
                    placeholder="Title — Author"
                    className={`mt-4 w-full bg-transparent border-0 border-b border-border outline-none py-2 text-base placeholder:text-muted-foreground/50 transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed" : "focus:border-foreground"
                    }`}
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
                    disabled={isLocked}
                    onChange={(e) => updateField("why_join", e.target.value)}
                    placeholder="Three honest sentences are enough."
                    rows={4}
                    className={`mt-4 w-full bg-transparent border-0 border-b border-border outline-none py-2 text-base placeholder:text-muted-foreground/50 resize-none transition-colors ${
                      isLocked ? "text-muted-foreground cursor-not-allowed border-dashed" : "focus:border-foreground"
                    }`}
                  />
                </label>
              </div>

              <button
                id="profile-save"
                type="submit"
                disabled={saving || isLocked}
                className="mt-8 w-full md:w-auto px-12 py-5 bg-foreground text-background text-xs tracking-[0.35em] font-medium uppercase transition-all hover:bg-fog disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : isLocked ? "Profile Submitted & Locked" : "Submit & Lock Profile →"}
              </button>
            </form>

            {/* Sticky Card Column */}
            <div className="lg:col-span-1 lg:sticky lg:top-28 flex flex-col items-center lg:items-stretch gap-6 order-1 lg:order-2">
              <div className="w-full">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">02</span>
                  <span className="h-px flex-1 max-w-[60px] bg-border" />
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground">
                    Your Card
                  </span>
                </div>
                <h3 className="font-display text-2xl tracking-tight mb-2">
                  Membership <span className="text-fog">Identity.</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time preview of your membership card. Fill in details on the left to see live updates.
                </p>
              </div>

              {/* Outer Card Frame */}
              <div className="w-full max-w-[380px] bg-background border border-white/5 p-1.5 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                <div className="relative group overflow-hidden border border-border">
                  <div
                    id="membership-card"
                    className="relative w-full aspect-[1.586] bg-[#080808] flex flex-col justify-between p-5 overflow-hidden text-[#fcfcfc] border border-white/10 select-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 85%)`,
                      // Override all oklch-containing variables locally to bypass html2canvas errors
                      ['--background' as any]: '#080808',
                      ['--foreground' as any]: '#fcfcfc',
                      ['--card' as any]: '#0b0c0e',
                      ['--card-foreground' as any]: '#fcfcfc',
                      ['--popover' as any]: '#0b0c0e',
                      ['--popover-foreground' as any]: '#fcfcfc',
                      ['--primary' as any]: '#fcfcfc',
                      ['--primary-foreground' as any]: '#080808',
                      ['--secondary' as any]: '#1a1a1b',
                      ['--secondary-foreground' as any]: '#fcfcfc',
                      ['--muted' as any]: '#1a1a1b',
                      ['--muted-foreground' as any]: '#8a8a8f',
                      ['--accent' as any]: '#2a2a2b',
                      ['--accent-foreground' as any]: '#fcfcfc',
                      ['--destructive' as any]: '#ef4444',
                      ['--destructive-foreground' as any]: '#fcfcfc',
                      ['--border' as any]: '#2e3035',
                      ['--input' as any]: '#2e3035',
                      ['--ring' as any]: '#ef4444',
                      ['--ink' as any]: '#050505',
                      ['--ash' as any]: '#6b7280',
                      ['--fog' as any]: '#cbd5e1',
                      ['--color-background' as any]: '#080808',
                      ['--color-foreground' as any]: '#fcfcfc',
                      ['--color-card' as any]: '#0b0c0e',
                      ['--color-card-foreground' as any]: '#fcfcfc',
                      ['--color-popover' as any]: '#0b0c0e',
                      ['--color-popover-foreground' as any]: '#fcfcfc',
                      ['--color-primary' as any]: '#fcfcfc',
                      ['--color-primary-foreground' as any]: '#080808',
                      ['--color-secondary' as any]: '#1a1a1b',
                      ['--color-secondary-foreground' as any]: '#fcfcfc',
                      ['--color-muted' as any]: '#1a1a1b',
                      ['--color-muted-foreground' as any]: '#8a8a8f',
                      ['--color-accent' as any]: '#2a2a2b',
                      ['--color-accent-foreground' as any]: '#fcfcfc',
                      ['--color-destructive' as any]: '#ef4444',
                      ['--color-destructive-foreground' as any]: '#fcfcfc',
                      ['--color-border' as any]: '#2e3035',
                      ['--color-input' as any]: '#2e3035',
                      ['--color-ring' as any]: '#ef4444',
                      ['--color-ink' as any]: '#050505',
                      ['--color-ash' as any]: '#6b7280',
                      ['--color-fog' as any]: '#cbd5e1',
                    }}
                  >
                    {/* Grain & Scanlines overlay inside the card */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]" />
                    
                    {/* Card Header */}
                    <div className="flex items-start justify-between w-full z-10">
                      <div className="flex items-center gap-2">
                        <img src={logoImg} alt="" className="h-7 w-7 rounded-full border border-white/10" />
                        <div>
                          <div className="font-display text-[9px] tracking-[0.15em] leading-none uppercase text-[#fcfcfc]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            CHAPLIN'S PARTY OF INDIA
                          </div>
                          <div className="text-[5px] font-mono tracking-[0.2em] text-[#8a8a8f] mt-0.5 uppercase" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                            FOR CHANGE, NOT NEXT.
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 border border-[#22c55e]/30 bg-[#22c55e]/5 px-1.5 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] flicker animate-pulse" />
                        <span className="font-mono text-[5px] tracking-widest text-[#22c55e] uppercase font-bold" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                          ACTIVE
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex justify-between items-end w-full mt-auto z-10">
                      {/* Left side: Member Info */}
                      <div className="flex flex-col gap-2 max-w-[65%]">
                        <div>
                          <div className="text-[5px] font-mono tracking-[0.2em] text-[#8a8a8f] uppercase" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                            MEMBER IDENTITY
                          </div>
                          <div className="font-display text-sm font-semibold tracking-wide text-[#fcfcfc] uppercase truncate mt-0.5 max-w-[200px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {profile.full_name?.trim() || "YOUR NAME"}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          <div>
                            <div className="text-[4px] font-mono tracking-[0.2em] text-[#8a8a8f] uppercase" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                              CONSTITUENCY
                            </div>
                            <div className="font-mono text-[8px] tracking-wide text-[#fcfcfc] uppercase truncate" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                              {profile.constituency?.trim() || "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-[4px] font-mono tracking-[0.2em] text-[#8a8a8f] uppercase" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                              STATE
                            </div>
                            <div className="font-mono text-[8px] tracking-wide text-[#fcfcfc] uppercase truncate" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                              {profile.state?.trim() || "—"}
                            </div>
                          </div>
                          <div>
                            <div className="text-[4px] font-mono tracking-[0.2em] text-[#8a8a8f] uppercase" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                              ROLE
                            </div>
                            <div className="font-mono text-[8px] tracking-wide text-[#fcfcfc] uppercase truncate" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                              {profile.role || "MEMBER"}
                            </div>
                          </div>
                          <div>
                            <div className="text-[4px] font-mono tracking-[0.2em] text-[#8a8a8f] uppercase" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                              JOINED
                            </div>
                            <div className="font-mono text-[8px] tracking-wide text-[#fcfcfc]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                              {profile.created_at
                                ? new Date(profile.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }).toUpperCase()
                                : "PENDING"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Verification QR Code & Member Number */}
                      <div className="flex flex-col items-end gap-1.5">
                        {profile.cpi_code ? (
                          <div className="bg-[#ffffff] p-0.5 rounded-[1px] opacity-90 transition-opacity hover:opacity-100">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`${window.location.origin}/verify/CPI-${String(profile.cpi_code).padStart(5, "0")}`)}`}
                              alt="Verification QR Code"
                              className="h-10 w-10"
                              crossOrigin="anonymous"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-[#1a1a1b] flex items-center justify-center border border-white/5 font-mono text-[5px] text-[#8a8a8f]">
                            QR
                          </div>
                        )}
                        <div className="font-mono text-[6px] tracking-[0.25em] text-[#8a8a8f] uppercase leading-none" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
                          {profile.cpi_code
                            ? `CPI-${String(profile.cpi_code).padStart(5, "0")}`
                            : "CPI-*****"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download CTA Button */}
              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={downloading}
                className="w-full max-w-[380px] py-4 bg-foreground text-background text-xs tracking-[0.25em] font-mono font-medium uppercase transition-all hover:bg-fog disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {downloading ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-background animate-pulse" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download Card (PDF)
                  </>
                )}
              </button>
            </div>
          </div>
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
