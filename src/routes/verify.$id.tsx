import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Profile } from "@/lib/supabase";
import logoImg from "@/assets/logo1cut.png";

export const Route = createFileRoute("/verify/$id")({
  head: () => ({
    meta: [
      { title: "Verify Member — Chaplin's Party of India" },
      {
        name: "description",
        content: "Verify Chaplin's Party of India membership authenticity.",
      },
    ],
  }),
  component: VerifyMemberPage,
});

function VerifyMemberPage() {
  const { id } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyMember() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from("member_verification").select("*");
        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(id)) {
          query = query.eq("id", id);
        } else {
          const cpiCodeMatch = id.match(/^(?:CPI-)?0*(\d+)$/i);
          if (cpiCodeMatch) {
            const codeNum = parseInt(cpiCodeMatch[1], 10);
            query = query.eq("cpi_code", codeNum);
          } else {
            setError("Invalid verification code format.");
            setLoading(false);
            return;
          }
        }

        const { data, error: fetchError } = await query.single();

        if (fetchError || !data) {
          setError("Member not found or invalid signature. This identity is not verified.");
        } else if (!data.full_name?.trim() || !data.cpi_code) {
          setError("This membership profile is incomplete. Name and CPI code must be present to be verified.");
        } else {
          setProfile(data as Profile);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("An error occurred during verification check.");
      } finally {
        setLoading(false);
      }
    }

    verifyMember();
  }, [id]);

  return (
    <div className="relative min-h-screen flex items-center justify-center grain overflow-hidden bg-[#080808] text-[#fcfcfc]">
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute inset-0 scanlines opacity-5" />

      {/* CCTV accent */}
      <div className="absolute top-6 left-6 md:left-10 font-mono text-[9px] tracking-[0.3em] text-[#8a8a8f] flex items-center gap-2 z-10">
        <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] flicker" />
        VERIFICATION PROTOCOL · LIVE
      </div>
      
      <div className="relative z-10 w-full max-w-xl px-6 py-12">
        {/* Header Branding */}
        <Link to="/" className="group flex items-center gap-3 mb-12 justify-center">
          <img src={logoImg} alt="Chaplin's Party Logo" className="h-9 w-9 rounded-full border border-[#2e3035] group-hover:border-[#fcfcfc] transition-colors duration-300" />
          <div className="text-left">
            <div className="font-display text-xs tracking-[0.25em] leading-none">
              CHAPLIN'S PARTY OF INDIA
            </div>
            <div className="mt-1 font-mono text-[8px] tracking-[0.3em] text-[#8a8a8f]">
              FOR CHANGE, NOT NEXT.
            </div>
          </div>
        </Link>

        {loading ? (
          <div className="border border-[#2e3035] bg-[#0b0c0e] p-12 text-center shadow-2xl">
            <div className="font-mono text-xs tracking-[0.35em] text-[#8a8a8f] uppercase animate-pulse">
              Running verification query...
            </div>
          </div>
        ) : error ? (
          <div className="border border-red-500/30 bg-red-950/10 p-8 md:p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/[0.02] scanlines pointer-events-none" />
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <h2 className="font-display text-2xl tracking-tight text-red-400 mb-3">
              Verification Failed
            </h2>
            <p className="text-sm font-mono text-red-300/80 leading-relaxed max-w-md mx-auto mb-8">
              {error}
            </p>
            <Link to="/" className="inline-block font-mono text-[10px] tracking-[0.3em] uppercase bg-[#fcfcfc] text-[#080808] px-6 py-3 hover:bg-[#8a8a8f] transition-colors">
              Return Home
            </Link>
          </div>
        ) : profile ? (
          <div className="border border-[#22c55e]/30 bg-[#22c55e]/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[#22c55e]/[0.01] scanlines pointer-events-none" />
            
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] flicker">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3a3.745 3.745 0 013.068 1.593 3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl tracking-tight text-[#22c55e] mb-1">
                Identity Verified
              </h2>
              <div className="font-mono text-[9px] tracking-[0.35em] text-[#22c55e] uppercase leading-none font-bold">
                ACTIVE MEMBER
              </div>
            </div>

            {/* Verification Table */}
            <div className="border border-[#2e3035] bg-black/50 divide-y divide-[#2e3035] font-mono text-xs mb-8">
              <div className="grid grid-cols-3 p-4">
                <span className="text-[#8a8a8f] uppercase tracking-wider text-[10px]">Name</span>
                <span className="col-span-2 text-[#fcfcfc] font-display text-sm tracking-wide uppercase font-semibold">{profile.full_name || "MEMBER"}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-[#8a8a8f] uppercase tracking-wider text-[10px]">Member No.</span>
                <span className="col-span-2 text-[#fcfcfc] font-semibold">
                  CPI-{String(profile.cpi_code || 0).padStart(5, "0")}
                </span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-[#8a8a8f] uppercase tracking-wider text-[10px]">Role</span>
                <span className="col-span-2 text-[#fcfcfc] capitalize">{profile.role || "member"}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-[#8a8a8f] uppercase tracking-wider text-[10px]">Constituency</span>
                <span className="col-span-2 text-[#fcfcfc] uppercase">{profile.constituency || "—"}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-[#8a8a8f] uppercase tracking-wider text-[10px]">Place</span>
                <span className="col-span-2 text-[#fcfcfc] uppercase">{profile.place || "—"}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-[#8a8a8f] uppercase tracking-wider text-[10px]">State</span>
                <span className="col-span-2 text-[#fcfcfc] uppercase">{profile.state || "—"}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-[#8a8a8f] uppercase tracking-wider text-[10px]">Member Since</span>
                <span className="col-span-2 text-[#fcfcfc]">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </span>
              </div>
            </div>

            <div className="text-center font-mono text-[9px] tracking-[0.2em] text-[#8a8a8f]/60 uppercase mb-8">
              Verified via cryptographic signature matching records.
            </div>

            <div className="flex justify-center">
              <Link to="/" className="font-mono text-[10px] tracking-[0.3em] uppercase bg-[#fcfcfc] text-[#080808] px-6 py-3 hover:bg-[#8a8a8f] transition-colors">
                ← Go to Homepage
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
