import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowLeft, CheckCircle, Navigation } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1: Identity & Location
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Step 2: Farm & Agriculture Details
  const [acres, setAcres] = useState("");
  const [ownershipType, setOwnershipType] = useState("owned");
  const [crops, setCrops] = useState("");
  const [season, setSeason] = useState("kharif");
  const [irrigationSource, setIrrigationSource] = useState("rainfed");
  const [soilType, setSoilType] = useState("loam");
  const [farmingYears, setFarmingYears] = useState("");

  // Step 3: Financial Background
  const [loanAmount, setLoanAmount] = useState("");
  const [loanSource, setLoanSource] = useState("none");
  const [insuranceStatus, setInsuranceStatus] = useState("no");
  const [insuranceScheme, setInsuranceScheme] = useState("");
  const [incomeBand, setIncomeBand] = useState("<1L");
  const [lossHistory, setLossHistory] = useState("no");
  const [lossSeasons, setLossSeasons] = useState("");
  const [dependents, setDependents] = useState("");

  const handleGetLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLoadingLocation(false);
        },
        () => {
          setCoords({ lat: 28.6139, lng: 77.209 });
          setLoadingLocation(false);
        }
      );
    } else {
      setCoords({ lat: 28.6139, lng: 77.209 });
      setLoadingLocation(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FCF8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl rounded-[32px] border border-white/80 bg-white px-8 py-12 shadow-2xl shadow-slate-200/70">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-[#2E7D32] shadow-inner">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Onboarding complete</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Thank you for registering. Your data is ready for the Financial Risk Agent, and KhetSeva will now generate smarter predictions for your farm.
            </p>
            <Link
              to="/"
              className="inline-flex w-full justify-center rounded-full bg-[#2E7D32] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200/40 hover:bg-[#1F5F23] transition"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FCF8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl shadow-slate-200/70">
        <div className="relative px-6 py-10 md:px-12 md:py-14">
          <div className="absolute -right-16 top-16 h-44 w-44 rounded-full bg-[#E8F4EB] blur-3xl" />
          <div className="absolute -left-16 bottom-16 h-52 w-52 rounded-full bg-[#D7F0D7] blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#2E7D32] transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                <Leaf className="h-4 w-4 text-[#2E7D32]" />
                KhetSeva
              </div>
            </div>

            <div className="mb-10 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.35em] text-[#2E7D32]">3-step farmer onboarding</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                Build your farm profile for smarter risk prediction.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Complete identity, farm and financial details once. KhetSeva then uses this data to power financial risk analysis for your agriculture portfolio.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <div className={`rounded-full px-4 py-3 text-center ${step === 1 ? "bg-[#F1F9F2] text-[#2E7D32] shadow-sm" : "bg-slate-50"}`}>
                Identity
              </div>
              <div className={`rounded-full px-4 py-3 text-center ${step === 2 ? "bg-[#F1F9F2] text-[#2E7D32] shadow-sm" : "bg-slate-50"}`}>
                Farm
              </div>
              <div className={`rounded-full px-4 py-3 text-center ${step === 3 ? "bg-[#F1F9F2] text-[#2E7D32] shadow-sm" : "bg-slate-50"}`}>
                Financials
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Full name</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Arjun Singh"
                        required
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Phone number</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        required
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">PIN code</span>
                      <input
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="124001"
                        required
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Password / PIN</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a secure login PIN"
                        required
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-[#F8FCF8] p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">GPS coordinates</p>
                        <p className="mt-2 text-sm text-slate-600">Use browser location to capture farm coordinates.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={loadingLocation}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-[#2E7D32] hover:text-[#2E7D32] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Navigation className="h-4 w-4 text-[#2E7D32]" />
                        <span>{loadingLocation ? "Locating..." : "Capture Location"}</span>
                      </button>
                    </div>
                    <div className="mt-4 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800">
                      {coords.lat ? `${coords.lat.toFixed(4)}°, ${coords.lng?.toFixed(4)}°` : "No coordinates captured yet."}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#2E7D32] py-4 text-sm font-semibold text-white shadow-lg shadow-green-200/30 transition hover:bg-[#1F5F23]"
                  >
                    Continue to Farm Details
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Land size (acres)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={acres}
                        onChange={(e) => setAcres(e.target.value)}
                        placeholder="5.5"
                        required
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Ownership type</span>
                      <select
                        value={ownershipType}
                        onChange={(e) => setOwnershipType(e.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      >
                        <option value="owned">Owned</option>
                        <option value="leased">Leased</option>
                        <option value="sharecropper">Sharecropper</option>
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Crops grown</span>
                    <input
                      value={crops}
                      onChange={(e) => setCrops(e.target.value)}
                      placeholder="Soybean, Wheat"
                      required
                      className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                    />
                  </label>

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Season</span>
                      <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      >
                        <option value="kharif">Kharif</option>
                        <option value="rabi">Rabi</option>
                        <option value="both">Both</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Irrigation source</span>
                      <select
                        value={irrigationSource}
                        onChange={(e) => setIrrigationSource(e.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      >
                        <option value="rainfed">Rainfed</option>
                        <option value="canal">Canal</option>
                        <option value="borewell">Borewell</option>
                        <option value="drip">Drip</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Soil type</span>
                      <select
                        value={soilType}
                        onChange={(e) => setSoilType(e.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      >
                        <option value="loam">Loam</option>
                        <option value="black">Black</option>
                        <option value="red">Red</option>
                        <option value="alluvial">Alluvial</option>
                        <option value="sandy">Sandy</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Years farming</span>
                      <input
                        type="number"
                        min="0"
                        value={farmingYears}
                        onChange={(e) => setFarmingYears(e.target.value)}
                        placeholder="12"
                        required
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full border border-slate-200 bg-white py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-[#2E7D32] py-4 text-sm font-semibold text-white shadow-lg shadow-green-200/30 transition hover:bg-[#1F5F23]"
                    >
                      Continue to Financials
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Loan amount</span>
                      <input
                        type="number"
                        min="0"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="50000"
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Loan source</span>
                      <select
                        value={loanSource}
                        onChange={(e) => setLoanSource(e.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      >
                        <option value="none">None</option>
                        <option value="bank">Bank</option>
                        <option value="kcc">KCC</option>
                        <option value="moneylender">Moneylender</option>
                      </select>
                    </label>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Crop insurance</span>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setInsuranceStatus("yes")}
                        className={`rounded-full border py-3 text-sm font-semibold transition ${insuranceStatus === "yes" ? "border-[#2E7D32] bg-[#EBF7EC] text-[#1F5F23]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                      >Yes</button>
                      <button
                        type="button"
                        onClick={() => setInsuranceStatus("no")}
                        className={`rounded-full border py-3 text-sm font-semibold transition ${insuranceStatus === "no" ? "border-[#2E7D32] bg-[#EBF7EC] text-[#1F5F23]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                      >No</button>
                    </div>
                  </div>

                  {insuranceStatus === "yes" && (
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Insurance scheme</span>
                      <input
                        value={insuranceScheme}
                        onChange={(e) => setInsuranceScheme(e.target.value)}
                        placeholder="PMFBY"
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Income band</span>
                      <select
                        value={incomeBand}
                        onChange={(e) => setIncomeBand(e.target.value)}
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      >
                        <option value="<1L">Below ₹1L</option>
                        <option value="1-3L">₹1L - ₹3L</option>
                        <option value="3-5L">₹3L - ₹5L</option>
                        <option value="5L+">Above ₹5L</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Dependents</span>
                      <input
                        type="number"
                        min="0"
                        value={dependents}
                        onChange={(e) => setDependents(e.target.value)}
                        placeholder="4"
                        required
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Past crop loss</span>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setLossHistory("yes")}
                        className={`rounded-full border py-3 text-sm font-semibold transition ${lossHistory === "yes" ? "border-[#2E7D32] bg-[#EBF7EC] text-[#1F5F23]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                      >Yes</button>
                      <button
                        type="button"
                        onClick={() => setLossHistory("no")}
                        className={`rounded-full border py-3 text-sm font-semibold transition ${lossHistory === "no" ? "border-[#2E7D32] bg-[#EBF7EC] text-[#1F5F23]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                      >No</button>
                    </div>
                  </div>

                  {lossHistory === "yes" && (
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Last 2 loss seasons</span>
                      <input
                        value={lossSeasons}
                        onChange={(e) => setLossSeasons(e.target.value)}
                        placeholder="Kharif 2024, Rabi 2024"
                        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
                      />
                    </label>
                  )}

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-full border border-slate-200 bg-white py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-[#2E7D32] py-4 text-sm font-semibold text-white shadow-lg shadow-green-200/30 transition hover:bg-[#1F5F23]"
                    >
                      Finish Signup
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
