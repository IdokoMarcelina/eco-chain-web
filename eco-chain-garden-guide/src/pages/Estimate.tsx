import { useState } from "react"
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
  Hammer,
} from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import {
  apiEstimateCost,
  apiTcoProjection,
  apiGetMaterials,
  apiDownloadReport,
} from "@/services/costApi"

const CostCard = ({
  title,
  amount,
  icon: Icon,
  subtitle,
  color,
}: any) => (
  <div className="bg-card rounded-[24px] shadow-soft p-6">
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center"
      style={{ background: `${color}20` }}
    >
      <Icon color={color} />
    </div>
    <div className="mt-5">
      <div className="text-sm text-on-surface-variant">{title}</div>
      <h2 className="text-[34px] font-bold mt-2 text-primary">{amount}</h2>
      <p className="text-sm mt-2 text-on-surface-variant">{subtitle}</p>
    </div>
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

const Estimate = () => {
  const [country, setCountry] = useState("NG")
  const [city, setCity] = useState("Lagos")
  const [buildingType, setBuildingType] = useState("duplex")
  const [rooms, setRooms] = useState("4")
  const [sizeSqm, setSizeSqm] = useState("120")
  const [ecoLevel, setEcoLevel] = useState("high")
  const [budget, setBudget] = useState("")
  const [power, setPower] = useState("hybrid")

  const [estimate, setEstimate] = useState<any>()
  const [projection, setProjection] = useState<any>()
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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

  async function loadData() {
    try {
      setLoading(true)
      const payload = getPayload()
      const estimateData = await apiEstimateCost(payload)
      setEstimate(estimateData)
      const projectionData = await apiTcoProjection({
        ...payload,
        projection_years: 5,
      })
      setProjection(projectionData)
      const materialData = await apiGetMaterials(country, city, "wall")
      setMaterials(materialData)
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
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="mt-6 h-12 px-8 bg-secondary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Estimating..." : "Estimate Cost"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <CostCard
              title="Construction Cost"
              amount={`$ ${estimate?.total_cost || "--"}`}
              subtitle="Materials + Labour"
              icon={Wallet}
              color="#061b0e"
            />
            <CostCard
              title="5-Year Savings"
              amount={`$ ${projection?.total_savings || "--"}`}
              subtitle={`Payback ${projection?.payback_months || "--"} months`}
              icon={TrendingUp}
              color="#94492c"
            />
          </div>

          <div className="bg-card rounded-[24px] shadow-soft p-6">
            <h2 className="font-semibold mb-4">Market Material Rates</h2>
            <div className="space-y-4">
              {materials.map((m: any) => (
                <div
                  key={m.id}
                  className="flex justify-between bg-surface-container rounded-xl p-4"
                >
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-on-surface-variant">
                      Carbon: {m.carbon_score}
                    </div>
                  </div>
                  <div>$ {m.price_per_unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-24 bg-primary-container rounded-[24px] p-6 text-white">
            <h3 className="text-xl font-semibold">Export Cost Report</h3>
            <p className="mt-3 text-white/70">
              Generate PDF summary for banks or housing programmes.
            </p>
            <button
              onClick={() => apiDownloadReport("")}
              className="mt-6 w-full h-12 bg-secondary rounded-xl flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Print / Share
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Estimate
