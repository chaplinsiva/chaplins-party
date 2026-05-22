import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import logoImg from "@/assets/logo1cut.png";

export const Route = createFileRoute("/leader-exam")({
  head: () => ({
    meta: [
      { title: "Leader Exam — Chaplin's Party of India" },
      {
        name: "description",
        content:
          "Prove your ideology. The Chaplin's Party of India Leadership Exam tests your understanding of history, economics, and social responsibility.",
      },
    ],
  }),
  component: LeaderExamPage,
});

const MOCK_QUESTIONS = [
  {
    num: "01",
    tag: "ECONOMICS",
    q: "Both capitalism and communism are necessary forces — one drives innovation, the other demands equity. Can a society survive with only one?",
    status: "queued",
  },
  {
    num: "02",
    tag: "HISTORY",
    q: "The French Revolution gave the world liberty, equality, and fraternity — but also the Reign of Terror. When does revolution become tyranny?",
    status: "queued",
  },
  {
    num: "03",
    tag: "SECULARISM",
    q: "Religion provides moral structure; secularism ensures no single morality dominates. How do you govern a nation of a thousand beliefs?",
    status: "queued",
  },
  {
    num: "04",
    tag: "MEDIA & TRUTH",
    q: "In an era of misinformation, who decides what is true — the government, the media, or the people? And what happens when all three lie?",
    status: "queued",
  },
  {
    num: "05",
    tag: "LEADERSHIP",
    q: "A leader who never reads is dangerous. A leader who only reads is useless. What makes a leader worth following?",
    status: "queued",
  },
];

const INDIA_STATES_DATA: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool", "Anantapur", "Chittoor"],
  "Arunachal Pradesh": ["Arunachal West", "Arunachal East"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Kokrajhar", "Barpeta"],
  "Bihar": ["Patna Sahib", "Darbhanga", "Muzaffarpur", "Gaya", "Bhagalpur", "Nalanda", "Saran", "Purnia"],
  "Chhattisgarh": ["Raipur", "Durg", "Bilaspur", "Bastar", "Surguja", "Rajnandgaon", "Janjgir-Champa"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad West", "Gandhinagar", "Surat", "Vadodara", "Rajkot", "Jamnagar", "Bhavnagar", "Kutch"],
  "Haryana": ["Gurgaon", "Faridabad", "Rohtak", "Ambala", "Kurukshetra", "Hisar", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Hamirpur", "Mandi", "Kangra"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Hazaribagh", "Dumka", "Singhbhum", "Palamu"],
  "Karnataka": ["Bangalore South", "Bangalore Central", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Shimoga", "Bellary"],
  "Kerala": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur", "Kollam", "Wayanad", "Palakkad", "Kannur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Chhindwara", "Rewa", "Sagar"],
  "Maharashtra": ["Mumbai South", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati"],
  "Manipur": ["Inner Manipur", "Outer Manipur"],
  "Meghalaya": ["Shillong", "Tura"],
  "Mizoram": ["Mizoram (ST)"],
  "Nagaland": ["Nagaland"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Puri", "Sambalpur", "Rourkela", "Balasore", "Berhampur"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Firozpur", "Gurdaspur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Barmer"],
  "Sikkim": ["Sikkim"],
  "Tamil Nadu": ["Chennai South", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Thoothukudi", "Vellore", "Kanyakumari"],
  "Telangana": ["Hyderabad", "Secunderabad", "Karimnagar", "Warangal", "Nizamabad", "Khammam", "Nalgonda"],
  "Tripura": ["Tripura West", "Tripura East"],
  "Uttar Pradesh": ["Varanasi", "Lucknow", "Amethi", "Rae Bareli", "Noida", "Kanpur", "Gorakhpur", "Mathura", "Allahabad"],
  "Uttarakhand": ["Haridwar", "Tehri Garhwal", "Nainital-Udhamsingh Nagar", "Almora", "Garhwal"],
  "West Bengal": ["Kolkata South", "Darjeeling", "Asansol", "Howrah", "Siliguri", "Kharagpur", "Barrackpore", "Murshidabad"],
  "Andaman and Nicobar Islands": ["Andaman and Nicobar Islands"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman and Diu"],
  "Delhi": ["New Delhi", "South Delhi", "East Delhi", "Chandni Chowk", "North East Delhi", "West Delhi", "North West Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag-Rajouri", "Baramulla", "Udhampur"],
  "Ladakh": ["Ladakh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Puducherry"]
};

const POSITIONS_DATA = [
  {
    id: "MP",
    title: "Member of Parliament (MP)",
    desc: "Represent your constituency in the Lok Sabha. Champion the party's 'Change, Not Next' principles on national television and legislation drafts.",
    examFocus: "National Governance, Constitutional Law, Macroeconomics, Geopolitics, and Public Policy."
  },
  {
    id: "MLA",
    title: "Member of Legislative Assembly (MLA)",
    desc: "Serve in your state legislative assembly. Champion local policy reforms, educational programs, and infrastructure transformation.",
    examFocus: "State Budgets, Local Administration, Social Welfare Programs, and Grassroots Economics."
  },
  {
    id: "COORDINATOR",
    title: "District Coordinator",
    desc: "Lead and organize volunteers, manage local party offices, coordinate public libraries, and organize grassroots events.",
    examFocus: "Community Organizing, Crisis Management, Local Grievance Redressal, and Literacy Campaigns."
  },
  {
    id: "YOUTH_SPEAKER",
    title: "Youth Speaker & Envoy",
    desc: "Represent the party's vision on campus panels, youth assemblies, and digital media platforms. Lead student debate rings.",
    examFocus: "Public Rhetoric, Youth Demographics, Modern Education Systems, and Ethical Media Management."
  },
  {
    id: "STRATEGIST",
    title: "Campaign Strategist",
    desc: "Architect the ground strategy, digital communications, poster designs, and public policy agendas.",
    examFocus: "Data-Driven Public Outreach, Political History, Electoral Systems, and Digital Ethics."
  }
];

interface SavedTicket {
  state: string;
  constituency: string;
  positionId: string;
  positionTitle: string;
  candidateId: string;
  registeredAt: string;
}

function LeaderExamPage() {
  const [interestCount, setInterestCount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Wizard state management
  const [wizardStep, setWizardStep] = useState(0); // 0: State, 1: Constituency, 2: Position, 3: Review
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [confirmingParticipation, setConfirmingParticipation] = useState(false);
  const [savedTicket, setSavedTicket] = useState<SavedTicket | null>(null);
  const [tempCandidateId, setTempCandidateId] = useState("");

  // Check localStorage to see if the user already has a saved ticket
  useEffect(() => {
    const cachedTicket = localStorage.getItem("leader_exam_ticket");
    if (cachedTicket) {
      try {
        const ticketObj = JSON.parse(cachedTicket);
        setSavedTicket(ticketObj);
        setSubmitted(true);
      } catch (e) {
        console.error("Error parsing cached ticket", e);
      }
    }
  }, []);

  // Fetch current interest count
  useEffect(() => {
    supabase
      .from("site_stats")
      .select("value")
      .eq("key", "leader_exam_interest")
      .single()
      .then(({ data }) => {
        if (data) setInterestCount(data.value);
      });
  }, []);

  // Helper to generate temporary candidate ID
  useEffect(() => {
    if (selectedState && selectedPosition) {
      const statePart = selectedState.substring(0, 3).toUpperCase().replace(/\s/g, "");
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setTempCandidateId(`CPI-IND-${statePart}-${selectedPosition}-${randomNum}`);
    }
  }, [selectedState, selectedPosition]);

  async function handleReady() {
    if (submitted || submitting) return;
    if (!selectedState || !selectedConstituency || !selectedPosition) return;
    setSubmitting(true);

    let newCount = interestCount;

    // Only increment database interest count if not already done by this browser
    if (localStorage.getItem("leader_exam_counter_incremented") !== "true") {
      const { data, error } = await supabase.rpc("increment_leader_interest");
      if (!error && data !== null) {
        newCount = data;
        setInterestCount(data);
      }
      localStorage.setItem("leader_exam_counter_incremented", "true");
    }

    const ticketObj: SavedTicket = {
      state: selectedState,
      constituency: selectedConstituency,
      positionId: selectedPosition,
      positionTitle: POSITIONS_DATA.find((p) => p.id === selectedPosition)?.title || selectedPosition,
      candidateId: tempCandidateId || `CPI-IND-DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    localStorage.setItem("leader_exam_interest", "true");
    localStorage.setItem("leader_exam_ticket", JSON.stringify(ticketObj));
    setSavedTicket(ticketObj);
    setSubmitted(true);
    setSubmitting(false);
    setConfirmingParticipation(false);
  }

  function handleReset() {
    localStorage.removeItem("leader_exam_interest");
    localStorage.removeItem("leader_exam_ticket");
    setSavedTicket(null);
    setSubmitted(false);
    setWizardStep(0);
    setSelectedState("");
    setSelectedConstituency("");
    setSelectedPosition("");
    setSearchQuery("");
    setAgreedTerms(false);
    setConfirmingParticipation(false);
  }

  // Filter states
  const filteredStates = Object.keys(INDIA_STATES_DATA).filter((state) =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/85 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 min-[380px]:px-6 md:px-12 py-5">
          <Link to="/" className="group flex items-center gap-3">
            <img
              src={logoImg}
              alt="Chaplin's Party Logo"
              className="h-8 w-8 rounded-full border border-border group-hover:border-foreground transition-colors duration-300"
            />
            <div>
              <div className="font-display text-[10px] min-[380px]:text-xs sm:text-sm md:text-base tracking-[0.18em] min-[380px]:tracking-[0.25em] leading-none">
                CHAPLIN'S PARTY OF INDIA
              </div>
              <div className="mt-1 font-mono text-[7px] min-[380px]:text-[9px] md:text-[10px] tracking-[0.2em] min-[380px]:tracking-[0.3em] text-muted-foreground">
                FOR CHANGE, NOT NEXT.
              </div>
            </div>
          </Link>
          <Link
            to="/"
            className="font-mono text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.25em] uppercase text-foreground border border-border px-2.5 sm:px-4 py-1 sm:py-1.5 hover:bg-secondary transition-colors"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="px-6 md:px-12 py-16 md:py-24 max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-20">
          <div className="flex items-center gap-6 mb-8">
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
              09
            </span>
            <span className="h-px flex-1 max-w-[80px] bg-border" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground">
              Leadership Track
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[6vw] leading-[0.9] tracking-[-0.04em]">
            Prove your
            <br />
            <span className="text-fog">ideology.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Becoming a position holder in Chaplin's Party is not about popularity
            or connections. It's about{" "}
            <span className="text-foreground">understanding</span> — of history,
            economics, social systems, and human responsibility.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 border border-border px-6 py-3">
            <span className="h-2 w-2 rounded-full bg-foreground flicker" />
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-foreground/80">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Question Queue */}
        <div className="mb-20">
          <div className="flex items-center gap-6 mb-10">
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
              ···
            </span>
            <span className="h-px flex-1 max-w-[80px] bg-border" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground">
              Sample Questions in Queue
            </span>
          </div>

          <p className="mb-8 text-sm text-muted-foreground max-w-xl leading-relaxed">
            The exam will test your ideological understanding through
            open-ended questions. Here's a preview of what to expect — no
            right or wrong answers, only depth of thought.
          </p>

          <div className="border border-border divide-y divide-border">
            {MOCK_QUESTIONS.map((item) => (
              <div
                key={item.num}
                className="group p-6 md:p-8 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 mt-1">
                    <span className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground">
                      Q.{item.num}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-foreground/60 border border-border px-2 py-0.5">
                        {item.tag}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
                      {item.q}
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      LOCKED
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 ml-2">
              MORE QUESTIONS LOADING...
            </span>
          </div>
        </div>

        {/* Interactive Candidacy & Election Showcase */}
        <div id="election-showcase" className="border border-border bg-background relative overflow-hidden">
          <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
          
          {submitted && savedTicket ? (
            /* Final Official Nominee Dashboard Card */
            <div className="p-8 md:p-20 text-center space-y-12 animate-[count-fade_1.5s_ease-out_both]">
              {/* Big Gorgeous Fade-in COMING SOON screen */}
              <div className="space-y-6 animate-[count-fade_1.2s_ease-out_both]">
                <div className="inline-flex items-center gap-3 border border-border px-6 py-2">
                  <span className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground">
                    ELECTION PREVIEW ENGAGED
                  </span>
                </div>
                
                <h2 className="font-display text-5xl md:text-8xl tracking-tighter uppercase leading-[0.85] text-balance">
                  COMING<br/>
                  <span className="text-fog">SOON.</span>
                </h2>
                
                <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase max-w-xl mx-auto leading-relaxed">
                  Ideological examination track is preparing for the <span className="text-foreground font-bold">{savedTicket.constituency} ({savedTicket.state})</span> seat.
                  <br />
                  <span className="text-[10px] text-muted-foreground/60 block mt-2">
                    Nominee ID: {savedTicket.candidateId} • Targeted Position: {savedTicket.positionTitle}
                  </span>
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button 
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-background border border-border text-foreground text-[10px] tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors font-medium font-mono"
                >
                  ← Change Seat & Edit Selections
                </button>
              </div>

              {interestCount !== null && (
                <div className="text-center font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase pt-8 border-t border-border/45 max-w-xs mx-auto">
                  {interestCount.toLocaleString()} candidates registered
                </div>
              )}
            </div>
          ) : (
            /* Interactive Candidacy Wizard Form */
            <div className="p-6 md:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-foreground/80">ELECTION & CANDIDACY SHOWCASE</span>
                </div>
                <h2 className="font-display text-3xl tracking-tight">Candidacy Mock Nomination</h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                  Select your state, constituency, and targeted position to generate your custom election nominee ticket and preview the exam progression.
                </p>
              </div>

              {/* Progress Bar Indicators */}
              <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                {[
                  { step: 0, label: "STATE" },
                  { step: 1, label: "CONSTITUENCY" },
                  { step: 2, label: "POSITION" },
                  { step: 3, label: "CONFIRMATION" }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div
                      className={`h-6 w-6 rounded-full border flex items-center justify-center font-mono text-[10px] transition-all duration-300 ${
                        wizardStep === s.step
                          ? "border-foreground bg-foreground text-background font-bold shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                          : wizardStep > s.step
                          ? "border-foreground bg-foreground/10 text-foreground font-semibold"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {s.step + 1}
                    </div>
                    <span
                      className={`hidden md:inline font-mono text-[9px] tracking-widest transition-all duration-300 ${
                        wizardStep === s.step ? "text-foreground font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Select State/UT */}
              {wizardStep === 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h3 className="font-display text-xl tracking-tight">Choose India State / Union Territory</h3>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">STEP 01 OF 04</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Search State or Union Territory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-foreground mb-6"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar border border-border/60 p-3 bg-secondary/5">
                    {filteredStates.map((stateName) => {
                      const seats = INDIA_STATES_DATA[stateName] || [];
                      return (
                        <button
                          key={stateName}
                          onClick={() => {
                            setSelectedState(stateName);
                            setSelectedConstituency("");
                            setWizardStep(1);
                          }}
                          className="p-4 border border-border hover:border-foreground text-left transition-all group hover:bg-secondary/35 flex justify-between items-center"
                        >
                          <div>
                            <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase block mb-1">STATE</span>
                            <span className="font-display text-sm tracking-wide text-foreground group-hover:text-fog transition-colors font-medium">
                              {stateName}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] tracking-widest text-foreground border border-border px-2 py-0.5 font-bold bg-background">
                            {seats.length} SEATS
                          </span>
                        </button>
                      );
                    })}
                    {filteredStates.length === 0 && (
                      <div className="col-span-full py-8 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        No States found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Select Constituency */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setWizardStep(0)}
                      className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border px-3 py-1 bg-background"
                    >
                      ← Back to States
                    </button>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">STEP 02 OF 04</span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl tracking-tight">
                      Select Lok Sabha Constituency in <span className="text-fog">{selectedState}</span>
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                      Choose the MP seat you wish to represent in the showcase
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-border/60 bg-secondary/5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {INDIA_STATES_DATA[selectedState]?.map((constituency) => (
                      <button
                        key={constituency}
                        onClick={() => {
                          setSelectedConstituency(constituency);
                          setWizardStep(2);
                        }}
                        className="p-3 border border-border hover:border-foreground text-center transition-all font-mono text-[10px] tracking-wider uppercase hover:bg-secondary/35 font-bold bg-background"
                      >
                        {constituency}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Select Targeted Position */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border px-3 py-1 bg-background"
                    >
                      ← Back to Seats
                    </button>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">STEP 03 OF 04</span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl tracking-tight">Select Targeted Party Position</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                      Each role requires specific ideological understanding and carries localized responsibilities
                    </p>
                  </div>

                  <div className="space-y-3">
                    {POSITIONS_DATA.map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => {
                          setSelectedPosition(pos.id);
                          setWizardStep(3);
                        }}
                        className="w-full p-4 md:p-5 border border-border hover:border-foreground text-left transition-all group hover:bg-secondary/25 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background"
                      >
                        <div className="flex-1 space-y-1">
                          <h4 className="font-display text-base md:text-lg tracking-tight text-foreground group-hover:text-fog transition-colors font-medium">
                            {pos.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                            {pos.desc}
                          </p>
                          <div className="pt-2 font-mono text-[9px] text-foreground/80 tracking-wide uppercase">
                            <span className="border border-border/80 px-2 py-0.5 bg-secondary/15">
                              EXAM FOCUS: {pos.examFocus || pos.focus}
                            </span>
                          </div>
                        </div>
                        <div className="font-mono text-[9px] tracking-widest text-muted-foreground group-hover:text-foreground border border-border px-3 py-1.5 uppercase self-start md:self-center font-bold bg-background">
                          SELECT →
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Draft Ticket Preview & Lock-in */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border px-3 py-1 bg-background"
                    >
                      ← Back to Positions
                    </button>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">STEP 04 OF 04</span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl tracking-tight">Verify Draft Nomination Ticket</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                      Please confirm your selections. Registering locks in your candidacy preview.
                    </p>
                  </div>

                  {/* Carbon-Copy styled preview card */}
                  <div className="border border-dashed border-border bg-secondary/10 p-6 md:p-8 relative rounded-sm font-mono text-xs text-foreground max-w-xl mx-auto shadow-lg space-y-6">
                    <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-muted-foreground tracking-widest">
                      DRAFT TICKET
                    </div>
                    
                    <div className="text-center border-b border-dashed border-border pb-4">
                      <h4 className="font-display text-lg tracking-wider text-foreground mb-1">CHAPLIN'S PARTY OF INDIA</h4>
                      <p className="text-[9px] text-muted-foreground tracking-widest">OFFICIAL ELECTION CANDIDACY DRAFT</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-y-2.5 gap-x-2 text-[11px] py-2 border-b border-dashed border-border">
                      <div className="text-muted-foreground">CANDIDATE ID:</div>
                      <div className="col-span-2 text-foreground font-bold tracking-wider">{tempCandidateId}</div>
                      
                      <div className="text-muted-foreground">SELECTED STATE:</div>
                      <div className="col-span-2 text-foreground font-bold uppercase">{selectedState}</div>
                      
                      <div className="text-muted-foreground">CONSTITUENCY:</div>
                      <div className="col-span-2 text-foreground font-bold uppercase">{selectedConstituency}</div>
                      
                      <div className="text-muted-foreground">TARGET OFFICE:</div>
                      <div className="col-span-2 text-foreground font-bold uppercase font-sans">
                        {POSITIONS_DATA.find((p) => p.id === selectedPosition)?.title}
                      </div>
                      
                      <div className="text-muted-foreground">PORTAL STATUS:</div>
                      <div className="col-span-2 text-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-border" />
                        ● DRAFT UNREGISTERED
                      </div>
                    </div>

                    <div className="text-[9px] text-muted-foreground leading-relaxed">
                      * DISCLAIMER: This dashboard serves as an interactive mock showcasing upcoming Lok Sabha election progress and leadership exam tracks (Coming Soon).
                    </div>
                  </div>

                  {/* Submission and agreement checkbox */}
                  <div className="max-w-xl mx-auto space-y-6 pt-2">
                    {!confirmingParticipation && (
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={agreedTerms}
                          onChange={(e) => setAgreedTerms(e.target.checked)}
                          className="mt-1 h-3.5 w-3.5 border border-border bg-background focus:ring-0 text-foreground accent-foreground cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-muted-foreground leading-relaxed uppercase tracking-wider group-hover:text-foreground transition-colors select-none">
                          I agree to lock in this constituency draft and undergo the ideological review when the exam portal officially launches.
                        </span>
                      </label>
                    )}

                    {confirmingParticipation ? (
                      <div className="border border-border p-5 space-y-4 bg-secondary/5 animate-[count-fade_0.4s_ease-out_both]">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-center text-foreground font-bold">
                          ★ CONFIRM PARTICIPATION?
                        </p>
                        <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider leading-relaxed">
                          Are you sure you want to confirm your participation in the {selectedConstituency} seat? This action will finalize your draft ticket.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => setConfirmingParticipation(false)}
                            className="flex-1 py-3 border border-border text-[9px] tracking-widest uppercase hover:bg-secondary transition-colors font-bold bg-background"
                          >
                            ← Cancel
                          </button>
                          <button
                            onClick={handleReady}
                            disabled={submitting}
                            className="flex-1 py-3 bg-foreground text-background text-[9px] tracking-widest uppercase hover:bg-fog transition-all font-bold border border-border"
                          >
                            {submitting ? "Registering..." : "Yes, Confirm →"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingParticipation(true)}
                        disabled={!agreedTerms}
                        className="w-full py-4 bg-foreground text-background text-xs tracking-[0.35em] font-bold uppercase transition-all hover:bg-fog disabled:opacity-30 disabled:cursor-not-allowed border border-border"
                      >
                        Register Draft & Get Exam Ticket →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Chaplin's Party of India — Leadership Track
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
