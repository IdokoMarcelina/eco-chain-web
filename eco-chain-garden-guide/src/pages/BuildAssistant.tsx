import { useState } from "react"
import {
  Hammer,
  Lightbulb,
  RefreshCw,
  MapPin,
  Ruler,
  DollarSign,
  Leaf,
  Home,
  Building2,
  Zap,
  Globe,
} from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import {
  apiGetBuildSuggestions,
  apiGetMaterialAlternatives,
  apiGetBuildPlan,
} from "@/services/buildApi"

const SuggestionCard = ({ title, items, icon: Icon, color }: any) => (
  <div className="bg-card rounded-[24px] shadow-soft p-6">
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center"
      style={{ background: `${color}20` }}
    >
      <Icon color={color} />
    </div>
    <h3 className="text-lg font-semibold mt-5 mb-3">{title}</h3>
    <ul className="space-y-2">
      {items?.map((item: string, i: number) => (
        <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
          <Leaf size={14} className="mt-0.5 shrink-0" style={{ color }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

const powerOptions = [
  { value: "solar", label: "Solar" },
  { value: "generator", label: "Generator" },
  { value: "grid", label: "Grid" },
  { value: "hybrid", label: "Hybrid (Solar + Grid)" },
  { value: "off-grid", label: "Off-Grid Complete" },
]

const buildingTypes = [
  { value: "bungalow", label: "Bungalow" },
  { value: "duplex", label: "Duplex" },
  { value: "mansion", label: "Mansion" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
]

const ecoLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const countries = [
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
  { value: "TZ", label: "Tanzania" },
]

const BuildAssistant = () => {
  const [activeTab, setActiveTab] = useState<"suggestions" | "materials" | "plan">("suggestions")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const [country, setCountry] = useState("NG")
  const [city, setCity] = useState("Lagos")
  const [buildingType, setBuildingType] = useState("duplex")
  const [rooms, setRooms] = useState("4")
  const [sizeSqm, setSizeSqm] = useState("120")
  const [ecoLevel, setEcoLevel] = useState("high")
  const [budget, setBudget] = useState("")
  const [power, setPower] = useState("hybrid")
  const [material, setMaterial] = useState("")

  const getPayload = () => ({
    country,
    city,
    building_type: buildingType,
    rooms: Number(rooms),
    size_sqm: Number(sizeSqm),
    eco_level: ecoLevel,
    budget: budget ? Number(budget) : undefined,
    power,
  })

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    try {
      let data
      switch (activeTab) {
        case "suggestions":
          data = await apiGetBuildSuggestions(getPayload())
          break
        case "materials":
          data = await apiGetMaterialAlternatives({
            material,
            eco_preference: ecoLevel === "high" ? "low-carbon" : "standard",
          })
          break
        case "plan":
          data = await apiGetBuildPlan(getPayload())
          break
      }
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-[40px] font-bold text-primary">Build Assistant</h1>
        <p className="mt-3 max-w-[650px] text-on-surface-variant">
          Smart eco-building recommendations, material alternatives, and project planning — all in one place.
        </p>
      </header>

      <div className="flex gap-2 mb-8 p-1 bg-surface-container rounded-xl w-fit">
        {[
          { key: "suggestions", label: "Suggestions", icon: Lightbulb },
          { key: "materials", label: "Materials", icon: Hammer },
          { key: "plan", label: "Build Plan", icon: Home },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key as any); setResult(null) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === key ? "bg-primary text-white" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-[24px] shadow-soft p-6">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">
                  {activeTab === "suggestions" && "Get Build Suggestions"}
                  {activeTab === "materials" && "Find Eco Material Alternatives"}
                  {activeTab === "plan" && "Create a Build Plan"}
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Fill in the details below
                </p>
              </div>
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {activeTab === "materials" ? (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Current Material</label>
                  <div className="relative mt-2">
                    <Hammer size={16} className="absolute left-4 top-4 text-on-surface-variant" />
                    <input
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="e.g. concrete, steel, bamboo"
                      className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <>
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
                        value={buildingType}
                        onChange={(e) => setBuildingType(e.target.value)}
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
                    <input
                      type="number"
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className="w-full h-12 mt-2 rounded-xl border bg-surface-container px-4 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Size (sq m)</label>
                    <div className="relative mt-2">
                      <Ruler size={16} className="absolute left-4 top-4 text-on-surface-variant" />
                      <input
                        type="number"
                        value={sizeSqm}
                        onChange={(e) => setSizeSqm(e.target.value)}
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
                        value={power}
                        onChange={(e) => setPower(e.target.value)}
                        className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                      >
                        {powerOptions.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 h-12 px-8 bg-secondary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>

          {result && (
            <div className="bg-card rounded-[24px] shadow-soft p-6">
              <h2 className="font-semibold mb-4">Results</h2>
              <pre className="text-sm text-on-surface-variant whitespace-pre-wrap font-sans">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="bg-primary-container rounded-[24px] p-6 text-white">
              <DollarSign size={24} className="mb-3" />
              <h3 className="text-lg font-semibold">Why Use Build Assistant?</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <Leaf size={14} className="mt-0.5 shrink-0" />
                  Discover low-carbon material alternatives
                </li>
                <li className="flex items-start gap-2">
                  <Leaf size={14} className="mt-0.5 shrink-0" />
                  Get budget-optimised building suggestions
                </li>
                <li className="flex items-start gap-2">
                  <Leaf size={14} className="mt-0.5 shrink-0" />
                  Generate custom eco build plans
                </li>
                <li className="flex items-start gap-2">
                  <Leaf size={14} className="mt-0.5 shrink-0" />
                  Compare cost vs. sustainability trade-offs
                </li>
              </ul>
            </div>

            <SuggestionCard
              title="Popular Alternatives"
              icon={Lightbulb}
              color="#94492c"
              items={[
                "Bamboo reinforcement instead of steel",
                "Compressed earth blocks for walls",
                "Recycled plastic lumber for decking",
                "Thatch or green roofing systems",
              ]}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default BuildAssistant
