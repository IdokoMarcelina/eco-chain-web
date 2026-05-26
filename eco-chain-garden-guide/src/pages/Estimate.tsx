import { useEffect, useState } from "react"
import {
  Wallet,
  TrendingUp,
  Download,
  RefreshCw,
  MapPin,
  Ruler,
  DollarSign,
  Leaf,
  Building2,
  Zap,
  Globe,
  PiggyBank,
  BarChart3,
  Lightbulb,
  Target,
  ChevronRight,
} from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { toast } from "sonner"
import {
  apiEstimateForm,
  apiSaveEstimate,
  apiDownloadReport,
} from "@/services/costApi"

const StatCard = ({ title, amount, icon: Icon, color, subtitle }: any) => (
  <div className="bg-card rounded-[24px] shadow-soft p-6 flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: `${color}20` }}
      >
        <Icon color={color} size={22} />
      </div>
      {subtitle && (
        <span className="text-xs text-on-surface-variant">{subtitle}</span>
      )}
    </div>
    <div className="text-sm text-on-surface-variant">{title}</div>
    <div className="text-[28px] font-bold mt-1" style={{ color }}>
      {amount}
    </div>
  </div>
)

const BreakdownBar = ({ label, value, max, color, currency }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium" style={{ color }}>{currency}{value?.toLocaleString()}</span>
    </div>
    <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${(value / max) * 100}%`, background: color }}
      />
    </div>
  </div>
)

const UpgradeCard = ({ items, icon: Icon, color, title }: any) => (
  <div className="bg-card rounded-[24px] shadow-soft p-6">
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: `${color}20` }}
      >
        <Icon color={color} size={18} />
      </div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <ul className="space-y-3">
      {items?.map((item: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
          <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

const powerOptions = [
  { value: "Solar", label: "Solar" },
  { value: "Generator", label: "Generator" },
  { value: "Grid", label: "Grid" },
  { value: "Hybrid", label: "Hybrid (Solar + Grid)" },
  { value: "Off-Grid", label: "Off-Grid Complete" },
]

const buildingTypes = [
  { value: "Bungalow", label: "Bungalow" },
  { value: "Duplex", label: "Duplex" },
  { value: "Mansion", label: "Mansion" },
  { value: "Apartment", label: "Apartment" },
  { value: "Commercial", label: "Commercial" },
]

const ecoLevels = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
]

const countries = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "Ghana", label: "Ghana" },
  { value: "Kenya", label: "Kenya" },
  { value: "South Africa", label: "South Africa" },
  { value: "Tanzania", label: "Tanzania" },
]

const Estimate = () => {
  const [country, setCountry] = useState("Nigeria")
  const [city, setCity] = useState("Lagos")
  const [houseType, setHouseType] = useState("Duplex")
  const [rooms, setRooms] = useState("4")
  const [size, setSize] = useState("120")
  const [ecoLevel, setEcoLevel] = useState("High")
  const [budget, setBudget] = useState("")
  const [powerPreference, setPowerPreference] = useState("Hybrid")

  const [result, setResult] = useState<any>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const style = document.createElement("style")
    style.id = "eco-print-styles"
    style.textContent = `
      @media print {
        nav, header, .sidebar, .lg\\:ml-\\[220px\\] > div > div:first-child,
        button, .sticky { display: none !important; }
        body { background: #fff !important; }
        .lg\\:ml-\\[220px\\] { margin-left: 0 !important; }
        [class*="bg-card"] { break-inside: avoid; box-shadow: none !important; border: 1px solid #ddd !important; }
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  const currencySymbol = (code: string) =>
    ({ NGN: "₦", USD: "$", KES: "KSh", GHS: "GH₵", ZAR: "R", TZS: "TSh" })[code] || `$${code}`

  const fmt = (n: number, cur = "USD") => `${currencySymbol(cur)}${n?.toLocaleString() ?? "--"}`

  async function loadData() {
    try {
      setLoading(true)
      const data = await apiEstimateForm({
        houseType,
        country,
        city,
        size: Number(size),
        rooms: Number(rooms),
        ecoLevel,
        powerPreference,
        budget: budget ? Number(budget) : 0,
      })
      setResult(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-[40px] font-bold text-primary">
          Construction Cost Estimator
        </h1>
        <p className="mt-3 max-w-[650px] text-on-surface-variant">
          See upfront construction costs and compare long-term eco savings.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-[24px] shadow-soft p-6">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">Project Details</h2>
                <p className="text-sm text-on-surface-variant">Fill in the details below to get an estimate</p>
              </div>
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-sm font-medium">Country</label>
                <div className="relative mt-2">
                  <Globe size={16} className="absolute left-4 top-4 text-on-surface-variant z-10" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {countries.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <div className="relative mt-2">
                  <MapPin size={16} className="absolute left-4 top-4 text-on-surface-variant" />
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Building Type</label>
                <div className="relative mt-2">
                  <Building2 size={16} className="absolute left-4 top-4 text-on-surface-variant z-10" />
                  <select
                    value={houseType}
                    onChange={(e) => setHouseType(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {buildingTypes.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Rooms</label>
                <div className="relative mt-2">
                  <Building2 size={16} className="absolute left-4 top-4 text-on-surface-variant z-10" />
                  <select
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {[1,2,3,4,5,6].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Size (sq m)</label>
                <div className="relative mt-2">
                  <Ruler size={16} className="absolute left-4 top-4 text-on-surface-variant" />
                  <input
                    type="number"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Eco Level</label>
                <div className="relative mt-2">
                  <Leaf size={16} className="absolute left-4 top-4 text-on-surface-variant z-10" />
                  <select
                    value={ecoLevel}
                    onChange={(e) => setEcoLevel(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {ecoLevels.map((e) => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Budget ($)</label>
                <div className="relative mt-2">
                  <DollarSign size={16} className="absolute left-4 top-4 text-on-surface-variant" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Power Preference</label>
                <div className="relative mt-2">
                  <Zap size={16} className="absolute left-4 top-4 text-on-surface-variant z-10" />
                  <select
                    value={powerPreference}
                    onChange={(e) => setPowerPreference(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {powerOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="mt-6 h-12 px-8 bg-secondary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Estimating..." : "Estimate Cost"}
            </button>
          </div>

          {result && (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                <StatCard
                  title="Total Construction Cost"
                  amount={fmt(result.totalCost, result.currency)}
                  icon={Wallet}
                  color="#061b0e"
                  subtitle={result.currency}
                />
                <StatCard
                  title="5-Year Total Savings"
                  amount={fmt(result.fiveYearSavings?.totalSavings, result.currency)}
                  icon={PiggyBank}
                  color="#94492c"
                  subtitle="Energy + Water + Maintenance"
                />
              </div>

              <div className="bg-card rounded-[24px] shadow-soft p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "#1a5c3a20" }}
                  >
                    <BarChart3 color="#1a5c3a" size={18} />
                  </div>
                  <h3 className="font-semibold">Cost Breakdown</h3>
                </div>
                <div className="space-y-4">
                  <BreakdownBar
                    label="Materials"
                    value={result.breakdown?.materials ?? 0}
                    max={result.totalCost}
                    color="#1a5c3a"
                    currency={currencySymbol(result.currency)}
                  />
                  <BreakdownBar
                    label="Labour"
                    value={result.breakdown?.labor ?? 0}
                    max={result.totalCost}
                    color="#2d6b5e"
                    currency={currencySymbol(result.currency)}
                  />
                  <BreakdownBar
                    label="Eco Features"
                    value={result.breakdown?.ecoFeatures ?? 0}
                    max={result.totalCost}
                    color="#8a9a5b"
                    currency={currencySymbol(result.currency)}
                  />
                </div>
              </div>

              <div className="bg-card rounded-[24px] shadow-soft p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "#94492c20" }}
                  >
                    <TrendingUp color="#94492c" size={18} />
                  </div>
                  <h3 className="font-semibold">5-Year Savings Breakdown</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Energy", value: result.fiveYearSavings?.energySavings, color: "#e8a838" },
                    { label: "Water", value: result.fiveYearSavings?.waterSavings, color: "#3b82c4" },
                    { label: "Maintenance", value: result.fiveYearSavings?.maintenanceSavings, color: "#8a9a5b" },
                  ].map((s) => (
                    <div key={s.label} className="bg-surface-container rounded-xl p-4 text-center">
                      <div className="text-xs text-on-surface-variant mb-1">{s.label}</div>
                      <div className="text-lg font-bold" style={{ color: s.color }}>
                        {fmt(s.value ?? 0, result.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-card rounded-[24px] shadow-soft p-6 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#2d6b5e20" }}
                  >
                    <Target color="#2d6b5e" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-on-surface-variant">Estimated ROI</div>
                    <div className="text-[28px] font-bold" style={{ color: "#2d6b5e" }}>
                      {result.roiEstimate || "--"}
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-[24px] shadow-soft p-6 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#8a9a5b20" }}
                  >
                    <BarChart3 color="#8a9a5b" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-on-surface-variant">Recommendation Score</div>
                    <div className="text-[28px] font-bold" style={{ color: "#8a9a5b" }}>
                      {result.recommendationScore ?? "--"}
                      <span className="text-base font-normal text-on-surface-variant">/10</span>
                    </div>
                  </div>
                </div>
              </div>

              <UpgradeCard
                title="Suggested Upgrades"
                icon={Lightbulb}
                color="#4a7c59"
                items={result.suggestedUpgrades}
              />

              <UpgradeCard
                title="Key Assumptions"
                icon={Leaf}
                color="#6b4e3a"
                items={result.keyAssumptions}
              />
            </>
          )}
        </div>

        <div>
          <div className="sticky top-24 bg-primary-container rounded-[24px] p-6 text-white">
            <h3 className="text-xl font-semibold">Export Cost Report</h3>
            <p className="mt-3 text-white/70">
              Generate PDF summary for banks or housing programmes.
            </p>
            <button
              onClick={() => window.print()}
              className="mt-6 w-full h-12 bg-secondary rounded-xl flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Print Report
            </button>
            <button
              onClick={async () => {
                try {
                  await apiSaveEstimate({
                    form: { country, city, houseType, rooms, size, ecoLevel, powerPreference, budget },
                    result,
                  })
                  toast.success("Saved to profile")
                } catch {
                  toast.error("Failed to save")
                }
              }}
              className="mt-3 w-full h-12 bg-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
            >
              Save to Profile
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Estimate
