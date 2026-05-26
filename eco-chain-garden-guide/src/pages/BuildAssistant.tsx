import { useEffect, useState } from "react"
import {
  Lightbulb,
  RefreshCw,
  DollarSign,
  Leaf,
  ChevronRight,
  Home,
  Sun,
  Compass,
  Maximize,
  BedDouble,
  Download,
  Wind,
  Thermometer,
  Award,
  Wallpaper,
  ArrowUp,
} from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { toast } from "sonner"
import { apiSaveEstimate } from "@/services/costApi"
import { apiGenerateLayout } from "@/services/buildApi"

const SectionCard = ({ title, icon: Icon, color, children }: any) => (
  <div className="bg-card rounded-[24px] shadow-soft p-6">
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${color}20` }}
      >
        <Icon color={color} size={18} />
      </div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    {children}
  </div>
)

const climateZones = [
  { value: "Sahel", label: "Sahel" },
  { value: "Tropical", label: "Tropical" },
]

const styles = [
  { value: "modern", label: "Modern" },
  { value: "traditional", label: "Traditional" },
  { value: "contemporary", label: "Contemporary" },
  { value: "minimalist", label: "Minimalist" },
  { value: "colonial", label: "Colonial" },
]

const orientations = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
]

const unsplashPool: Record<string, string[]> = {
  modern: ["1600585154340-be6161a56a0c", "1600596542815-ffad4c1539a9", "1564013799919-ab600027ffc6", "1580587771525-78b9dba3b914"],
  traditional: ["1570129477492-45c003edd2be", "1512917774080-9991f1c4c750", "1583608205776-bfd35f0d9f83", "1576941089067-2de3c901b732"],
  contemporary: ["1600607687939-ce8a6c25118c", "1613490493576-4d884d0e8bea", "1558036117-1b3f8a439571", "1549517045-bc93de630cc4"],
  minimalist: ["1502005229762-cf1b2da7c5d6", "1493809842364-78817add7ffb", "1484154218962-a197022b5858", "1459767129954-1b1c1f9b9ace"],
  rear: ["1558618666-fcd25c85cd64", "1416879595882-3373a0480b5b", "1504280390367-361c6d9f38f4", "1592595896551-12b371d546d5"],
}

const unsplashImg = (style: string, type = "exterior") => {
  const pool = type === "rear" ? unsplashPool.rear : (unsplashPool[style] || unsplashPool.modern)
  return `https://images.unsplash.com/photo-${pool[0]}?auto=format&fit=crop&w=600&h=350&q=80`
}

const roomColors = [
  "#1a5c3a", "#2d6b5e", "#8a9a5b", "#94492c",
  "#4a7c59", "#e8a838", "#3b82c4", "#6b4e3a",
]

function getRoomLayout(rooms: any[]) {
  const n = rooms.length
  const cols = n <= 4 ? 2 : 3
  const rows = Math.ceil(n / cols)

  const cellW = 180
  const cellH = 110
  const wall = 4
  const gap = 6
  const corridorW = 30

  const totalW = cols * cellW + (cols - 1) * gap + corridorW + wall * 2
  const totalH = rows * cellH + (rows - 1) * gap + wall * 2

  const positions: { x: number; y: number; w: number; h: number }[] = []

  rooms.forEach((_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const isRight = col >= Math.ceil(cols / 2)
    const colInSide = isRight ? col - Math.ceil(cols / 2) : col
    const sideCols = Math.ceil(cols / 2)

    const x = wall + (isRight ? corridorW + sideCols * (cellW + gap) : 0) + colInSide * (cellW + gap)
    const y = wall + row * (cellH + gap)

    let w = cellW
    let h = cellH
    if (n <= 2) { w = totalW - wall * 2 - corridorW; h = (totalH - wall * 2 - (rows - 1) * gap) / rows - 2 }
    if (n === 3) { if (i === 0) { w = totalW - wall * 2 - corridorW; h = cellH } }

    positions.push({ x, y, w, h })
  })

  return { positions, totalW, totalH, wall, corridorW }
}

const NorthArrow = ({ cx, cy }: { cx: number; cy: number }) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={16} fill="none" stroke="#666" strokeWidth={1} />
    <polygon points="0,-10 -5,4 0,-1 5,4" fill="#1a5c3a" />
    <text x={0} y={14} textAnchor="middle" fontSize={8} fill="#666" fontFamily="monospace">N</text>
  </g>
)

const Door = ({ x, y, w, h, side }: { x: number; y: number; w: number; h: number; side: "top" | "bottom" | "left" | "right" }) => {
  const doorW = 14
  const doorH = 10
  const wall = 4

  let dx: number, dy: number, ax: number, ay: number, sweep: number, rx: number, ry: number

  if (side === "top") {
    dx = x + w / 2 - doorW / 2; dy = y - wall / 2
    ax = dx + doorW; ay = dy
    rx = doorW; ry = doorW; sweep = 0
  } else if (side === "bottom") {
    dx = x + w / 2 - doorW / 2; dy = y + h + wall / 2 - doorH
    ax = dx; ay = dy + doorH
    rx = doorW; ry = doorW; sweep = 1
  } else if (side === "left") {
    dx = x - wall / 2; dy = y + h / 2 - doorW / 2
    ax = dx + doorH; ay = dy
    rx = doorW; ry = doorW; sweep = 0
  } else {
    dx = x + w + wall / 2 - doorH; dy = y + h / 2 - doorW / 2
    ax = dx; ay = dy + doorW
    rx = doorW; ry = doorW; sweep = 1
  }

  return (
    <g>
      <line x1={dx} y1={dy} x2={ax} y2={ay} stroke="#fff" strokeWidth={wall + 1} />
      <path d={`M${dx},${dy} A${rx},${ry} 0 0,${sweep} ${ax},${ay}`} fill="none" stroke="#1a5c3a" strokeWidth={1.2} />
      <circle cx={dx} cy={dy} r={1.5} fill="#1a5c3a" />
      <line x1={dx} y1={dy} x2={ax - (ax - dx) * 0.15} y2={ay - (ay - dy) * 0.15} stroke="#1a5c3a" strokeWidth={1} />
    </g>
  )
}

const Window = ({ x, y, w, h, side }: { x: number; y: number; w: number; h: number; side: "top" | "bottom" | "left" | "right" }) => {
  const wall = 4
  const winLen = 20
  const winOff = 4
  let x1: number, y1: number, x2: number, y2: number, ox1: number, oy1: number, ox2: number, oy2: number

  if (side === "top") {
    x1 = x + winOff; y1 = y - wall / 2; x2 = x + winOff + winLen; y2 = y - wall / 2
    ox1 = x1; oy1 = y1 - 3; ox2 = x2; oy2 = y2 - 3
  } else if (side === "bottom") {
    x1 = x + winOff; y1 = y + h + wall / 2; x2 = x + winOff + winLen; y2 = y + h + wall / 2
    ox1 = x1; oy1 = y1 + 3; ox2 = x2; oy2 = y2 + 3
  } else if (side === "left") {
    x1 = x - wall / 2; y1 = y + winOff; x2 = x - wall / 2; y2 = y + winOff + winLen
    ox1 = x1 - 3; oy1 = y1; ox2 = x2 - 3; oy2 = y2
  } else {
    x1 = x + w + wall / 2; y1 = y + winOff; x2 = x + w + wall / 2; y2 = y + winOff + winLen
    ox1 = x1 + 3; oy1 = y1; ox2 = x2 + 3; oy2 = y2
  }

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={wall + 1} />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82c4" strokeWidth={2} />
      <line x1={ox1} y1={oy1} x2={ox2} y2={oy2} stroke="#3b82c4" strokeWidth={1.5} />
    </g>
  )
}

const LayoutFloorPlan = ({ rooms, orientation: orient }: { rooms: any[]; orientation: string }) => {
  if (!rooms?.length) return null
  const { positions, totalW, totalH, wall } = getRoomLayout(rooms)
  const pad = 30
  const svgW = totalW + pad * 2
  const svgH = totalH + pad * 2 + 30

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[480px]" style={{ fontFamily: "monospace" }}>
        <rect x={0} y={0} width={svgW} height={svgH} fill="#f8f6f0" rx={8} />

        <NorthArrow cx={svgW - 28} cy={22} />

        <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fontSize={9} fill="#888" fontFamily="monospace">
          Scale: 1 sq m = 2 px &nbsp;|&nbsp; Total: {rooms.reduce((s, r) => s + r.area_sqm, 0)} sq m
        </text>

        <rect x={pad} y={pad} width={totalW} height={totalH} fill="none" stroke="#222" strokeWidth={wall} rx={3} />

        {positions.map((p, i) => (
          <g key={i}>
            {p.x > pad && (
              <line x1={p.x} y1={p.y - 2} x2={p.x} y2={p.y + p.h + 2} stroke="#222" strokeWidth={wall - 1} />
            )}
            {i > 0 && i % 2 === 0 && (
              <line x1={p.x - 2} y1={p.y} x2={p.x + p.w + 2} y2={p.y} stroke="#222" strokeWidth={wall - 1} />
            )}
          </g>
        ))}

        {positions.map((p, i) => {
          const c = roomColors[i % roomColors.length]
          return (
            <g key={`room-${i}`}>
              <rect x={p.x + 2} y={p.y + 2} width={p.w - 4} height={p.h - 4} fill={`${c}15`} rx={2} />
            </g>
          )
        })}

        {positions.map((p, i) => (
          <g key={`door-${i}`}>
            <Door x={p.x} y={p.y} w={p.w} h={p.h} side={i % 2 === 0 ? "right" : "left"} />
          </g>
        ))}

        {positions.map((p, i) => {
          const sides: ("top" | "bottom" | "left" | "right")[] = []
          if (i === 0 || i === 1) sides.push("top")
          if (i === positions.length - 1 || i === positions.length - 2) sides.push("bottom")
          if (i % 2 === 0) sides.push("left")
          else sides.push("right")
          return sides.map((side, si) => (
            <g key={`win-${i}-${si}`}>
              <Window x={p.x} y={p.y} w={p.w} h={p.h} side={side} />
            </g>
          ))
        })}

        {positions.map((p, i) => {
          const c = roomColors[i % roomColors.length]
          const room = rooms[i]
          return (
            <g key={`label-${i}`}>
              <text
                x={p.x + p.w / 2}
                y={p.y + p.h / 2 - 5}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill={c}
              >
                {room.name}
              </text>
              <text
                x={p.x + p.w / 2}
                y={p.y + p.h / 2 + 10}
                textAnchor="middle"
                fontSize={8}
                fill="#888"
              >
                {room.area_sqm} m²
              </text>
            </g>
          )
        })}
      </svg>

      <div className="flex items-center justify-center gap-1 mt-3 text-xs text-on-surface-variant">
        <ArrowUp size={12} />
        <span className="font-medium uppercase">{orient}</span>
      </div>
    </div>
  )
}

const VentilationDiagram = () => (
  <svg viewBox="0 0 200 110" className="w-full max-w-[200px] mx-auto mb-4">
    <rect x={10} y={50} width={180} height={55} fill="#3b82c408" stroke="#3b82c4" strokeWidth={2} rx={2} />
    <rect x={15} y={55} width={30} height={20} fill="none" stroke="#3b82c4" strokeWidth={1.5} rx={1} />
    <rect x={155} y={70} width={30} height={30} fill="none" stroke="#3b82c4" strokeWidth={1.5} rx={1} />
    <rect x={155} y={55} width={30} height={14} fill="none" stroke="#3b82c4" strokeWidth={1.5} strokeDasharray="2,2" rx={1} />
    <rect x={75} y={60} width={50} height={40} fill="#3b82c410" stroke="#3b82c4" strokeWidth={1.5} rx={1} />
    <text x={100} y={84} textAnchor="middle" fontSize={7} fill="#3b82c4" fontWeight={600}>interior</text>
    <path d="M45,50 Q60,30 80,45" fill="none" stroke="#3b82c4" strokeWidth={1.5} markerEnd="url(#arrow-blue)" />
    <path d="M80,50 Q100,25 120,45" fill="none" stroke="#3b82c4" strokeWidth={1.5} markerEnd="url(#arrow-blue)" />
    <path d="M120,50 Q140,30 160,45" fill="none" stroke="#3b82c4" strokeWidth={1.5} markerEnd="url(#arrow-blue)" />
    <path d="M55,50 L55,30" fill="none" stroke="#e8a838" strokeWidth={1.5} strokeDasharray="3,2" markerEnd="url(#arrow-sun)" />
    <path d="M100,50 L100,20" fill="none" stroke="#e8a838" strokeWidth={1.5} strokeDasharray="3,2" markerEnd="url(#arrow-sun)" />
    <path d="M145,50 L145,30" fill="none" stroke="#e8a838" strokeWidth={1.5} strokeDasharray="3,2" markerEnd="url(#arrow-sun)" />
    <text x={55} y={26} textAnchor="middle" fontSize={6} fill="#e8a838">heat</text>
    <text x={100} y={16} textAnchor="middle" fontSize={6} fill="#e8a838">heat</text>
    <text x={145} y={26} textAnchor="middle" fontSize={6} fill="#e8a838">heat</text>
    <text x={18} y={47} fontSize={6} fill="#3b82c4">inlet</text>
    <text x={148} y={47} fontSize={6} fill="#3b82c4">outlet</text>
    <defs>
      <marker id="arrow-blue" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#3b82c4" />
      </marker>
      <marker id="arrow-sun" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#e8a838" />
      </marker>
    </defs>
  </svg>
)

const PassiveSolarDiagram = () => (
  <svg viewBox="0 0 200 120" className="w-full max-w-[200px] mx-auto mb-4">
    <rect x={50} y={60} width={100} height={50} fill="#e8a83808" stroke="#e8a838" strokeWidth={2} rx={2} />
    <polygon points="100,15 50,60 150,60" fill="#e8a83815" stroke="#e8a838" strokeWidth={2} />
    <rect x={120} y={65} width={25} height={20} fill="#e8a83820" stroke="#e8a838" strokeWidth={1.5} rx={1} />
    <rect x={55} y={65} width={25} height={20} fill="#3b82c420" stroke="#3b82c4" strokeWidth={1.5} rx={1} />
    <text x={67} y={79} textAnchor="middle" fontSize={7} fill="#3b82c4" fontWeight={600}>window</text>
    <text x={132} y={79} textAnchor="middle" fontSize={7} fill="#e8a838" fontWeight={600}>mass</text>
    <text x={100} y={98} textAnchor="middle" fontSize={7} fill="#666">thermal floor</text>
    <line x1={50} y1={50} x2={50} y2={30} stroke="#e8a838" strokeWidth={2} strokeDasharray="3,2" />
    <line x1={100} y1={40} x2={100} y2={18} stroke="#e8a838" strokeWidth={2} strokeDasharray="3,2" />
    <line x1={150} y1={50} x2={150} y2={30} stroke="#e8a838" strokeWidth={2} strokeDasharray="3,2" />
    <polygon points="50,30 45,36 50,34 55,36" fill="#e8a838" />
    <polygon points="100,18 95,24 100,22 105,24" fill="#e8a838" />
    <polygon points="150,30 145,36 150,34 155,36" fill="#e8a838" />
    <text x={100} y={130} textAnchor="middle" fontSize={6} fill="#999">south-facing glazing for thermal gain</text>
  </svg>
)

const EcoGauge = ({ score }: { score: number }) => {
  const r = 32
  const circ = 2 * Math.PI * r
  const pct = Math.min(score / 10, 1)
  const strokeDash = circ * pct
  const cx = 40; const cy = 40

  return (
    <svg width={80} height={80} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#8a9a5b" strokeWidth={6}
        strokeDasharray={`${strokeDash} ${circ - strokeDash}`}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={14} fontWeight={700} fill="#8a9a5b">{score}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={8} fill="#999">/ 10</text>
    </svg>
  )
}

const MaterialStack = ({ element, suggestion }: { element: string; suggestion: string }) => {
  const layers: Record<string, [string, string][]> = {
    walls: [["#94492c", "Compressed Earth"], ["#8a9a5b", "Insulation"], ["#e8a838", "Plaster"]],
    roof: [["#94492c", "Clay Tiles"], ["#8a9a5b", "Insulation"], ["#e8a838", "Vapour Barrier"]],
    floor: [["#6b4e3a", "Stone"], ["#8a9a5b", "Damp Proof"], ["#e8a838", "Screed"]],
    foundation: [["#6b4e3a", "Concrete"], ["#8a9a5b", "Reinforcement"], ["#94492c", "Damp Proof"]],
  }
  const key = element.toLowerCase().includes("wall") ? "walls"
    : element.toLowerCase().includes("roof") ? "roof"
    : element.toLowerCase().includes("floor") ? "floor" : "foundation"
  const items = layers[key]

  return (
    <svg viewBox="0 0 160 50" className="w-full mt-2">
      {items.map(([col, label], i) => (
        <g key={i}>
          <rect x={10 + i * 50} y={10} width={44} height={30} fill={`${col}20`} stroke={col} strokeWidth={1.5} rx={3} />
          <text x={32 + i * 50} y={30} textAnchor="middle" fontSize={7} fontWeight={600} fill={col}>{label}</text>
        </g>
      ))}
      <text x={80} y={48} textAnchor="middle" fontSize={6} fill="#999">{suggestion.slice(0, 40)}</text>
    </svg>
  )
}

const BuildAssistant = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const [bedrooms, setBedrooms] = useState("4")
  const [climateZone, setClimateZone] = useState("Sahel")
  const [style, setStyle] = useState("modern")
  const [orientation, setOrientation] = useState("north")
  const [lotSizeSqm, setLotSizeSqm] = useState("120")
  const [budgetUsd, setBudgetUsd] = useState("")

  useEffect(() => {
    const style = document.createElement("style")
    style.id = "eco-print-styles"
    style.textContent = `
      @media print {
        nav, header, .sidebar, button, .sticky { display: none !important; }
        body { background: #fff !important; }
        .lg\\:ml-\\[220px\\] { margin-left: 0 !important; }
        [class*="bg-card"] { break-inside: avoid; box-shadow: none !important; border: 1px solid #ddd !important; }
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  const getFallbackLayout = (bd: number) => ({
    layout_description: "A passively cooled eco bungalow optimized for cross-ventilation and natural lighting, using locally sourced materials.",
    rooms: [
      { name: "Living Room", area_sqm: 35 },
      { name: "Kitchen & Dining", area_sqm: 22 },
      { name: "Master Bedroom", area_sqm: 24 },
      { name: "Ensuite Bath", area_sqm: 8 },
      ...Array.from({ length: Math.max(0, bd - 1) }, (_, i) => ({ name: `Bedroom ${i + 2}`, area_sqm: 16 })),
      { name: "Shared Bath", area_sqm: 8 },
      { name: "Veranda", area_sqm: 12 },
    ],
    ventilation_paths: ["North to south cross-ventilation through living areas", "High-level clerestory windows for stack effect", "Operable louvers on east and west facades"],
    passive_solar_notes: "South-facing glazing with deep overhangs for winter gain and summer shading. Thermal mass floor absorbs daytime heat.",
    eco_score: 8.5,
    eco_score_reasons: ["Optimized building orientation for passive solar gain", "Use of low-embodied-energy local materials", "Rainwater harvesting system integrated", "Cross-ventilation reduces mechanical cooling load"],
    material_hints: [
      { element: "Walls", suggestion: "Compressed Earth Bricks", reason: "Low embodied energy, excellent thermal mass, locally sourced." },
      { element: "Roof", suggestion: "Clay Tiles with Recycled Insulation", reason: "Breathable, durable, and natural cooling properties." },
      { element: "Floor", suggestion: "Polished Concrete with Fly Ash", reason: "Thermal storage for passive solar with reduced cement content." },
      { element: "Windows", suggestion: "Double-Glazed with Wooden Frames", reason: "Reduces heat gain while using sustainably sourced timber." },
    ],
  })

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    try {
      const payload = {
        bedrooms: Number(bedrooms),
        climate_zone: climateZone,
        style,
        orientation,
        lot_size_sqm: Number(lotSizeSqm),
        budget_usd: budgetUsd ? Number(budgetUsd) : 0,
      }
      const data = await apiGenerateLayout(payload)
      setResult(data)
    } catch (err: any) {
      console.warn("API failed — using simulation fallback.", err)
      setResult(getFallbackLayout(Number(bedrooms)))
      toast.success("Layout generated with eco-simulation data")
    } finally {
      setLoading(false)
    }
  }

  const styleKey = style?.toLowerCase() || "modern"

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-[40px] font-bold text-primary">Build Assistant</h1>
        <p className="mt-3 max-w-[650px] text-on-surface-variant">
          AI-powered eco-layout generation tailored to your climate, style, and budget.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-[24px] shadow-soft p-6">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">Layout Parameters</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Set your preferences for the AI-generated eco-layout
                </p>
              </div>
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-sm font-medium">Bedrooms</label>
                <div className="relative mt-2">
                  <BedDouble size={16} className="absolute left-4 top-4 text-on-surface-variant" />
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {[1,2,3,4,5,6].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Lot Size (sq m)</label>
                <div className="relative mt-2">
                  <Maximize size={16} className="absolute left-4 top-4 text-on-surface-variant" />
                  <input
                    type="number"
                    value={lotSizeSqm}
                    onChange={(e) => setLotSizeSqm(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Climate Zone</label>
                <div className="relative mt-2">
                  <Sun size={16} className="absolute left-4 top-4 text-on-surface-variant z-10" />
                  <select
                    value={climateZone}
                    onChange={(e) => setClimateZone(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {climateZones.map((z) => (
                      <option key={z.value} value={z.value}>{z.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Architectural Style</label>
                <div className="relative mt-2">
                  <Home size={16} className="absolute left-4 top-4 text-on-surface-variant z-10" />
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {styles.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Orientation</label>
                <div className="relative mt-2">
                  <Compass size={16} className="absolute left-4 top-4 text-on-surface-variant z-10" />
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm appearance-none"
                  >
                    {orientations.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Budget (USD)</label>
                <div className="relative mt-2">
                  <DollarSign size={16} className="absolute left-4 top-4 text-on-surface-variant" />
                  <input
                    type="number"
                    value={budgetUsd}
                    onChange={(e) => setBudgetUsd(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-11 h-12 rounded-xl border bg-surface-container px-4 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 h-12 px-8 bg-secondary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Layout"}
            </button>
          </div>

          {result && (
            <>
              <SectionCard title="Design Overview" icon={Lightbulb} color="#4a7c59">
                <img
                  src={unsplashImg(styleKey)}
                  alt="Exterior render"
                  className="w-full h-72 object-cover rounded-xl"
                  loading="lazy"
                />
                <p className="text-sm text-on-surface-variant leading-relaxed mt-4">
                  {result.layout_description}
                </p>
                <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-surface-container">
                  <div className="flex items-center gap-2 text-sm">
                    <Award size={16} color="#8a9a5b" />
                    <span className="text-on-surface-variant">Eco Score</span>
                    <span className="font-bold text-[#8a9a5b]">{result.eco_score}/10</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BedDouble size={16} color="#2d6b5e" />
                    <span className="text-on-surface-variant">Rooms</span>
                    <span className="font-bold text-[#2d6b5e]">{result.rooms?.length}</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Floor Plan" icon={Home} color="#061b0e">
                <LayoutFloorPlan rooms={result.rooms} orientation={orientation} />
              </SectionCard>

              <div className="grid sm:grid-cols-2 gap-6">
                <SectionCard title="Ventilation Paths" icon={Wind} color="#3b82c4">
                  <VentilationDiagram />
                  <ul className="space-y-2">
                    {result.ventilation_paths?.map((v: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <Wind size={14} className="mt-0.5 shrink-0" color="#3b82c4" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard title="Passive Solar" icon={Thermometer} color="#e8a838">
                  <PassiveSolarDiagram />
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {result.passive_solar_notes}
                  </p>
                </SectionCard>
              </div>

              <SectionCard title="Rear View" icon={Sun} color="#2d6b5e">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={unsplashImg(styleKey, "rear")}
                    alt="Rear view"
                    className="w-full sm:w-48 h-32 object-cover rounded-xl shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Rear elevation showcasing rainwater harvesting system, garden integration, and service access points.
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Eco Score Breakdown" icon={Award} color="#8a9a5b">
                <div className="flex items-center gap-4 mb-5">
                  <EcoGauge score={result.eco_score} />
                  <p className="text-sm text-on-surface-variant">Why this score was given:</p>
                </div>
                <ul className="space-y-2">
                  {result.eco_score_reasons?.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <Leaf size={14} className="mt-0.5 shrink-0" color="#8a9a5b" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard title="Material Recommendations" icon={Wallpaper} color="#94492c">
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.material_hints?.map((m: any, i: number) => (
                    <div key={i} className="bg-surface-container rounded-xl p-4">
                      <MaterialStack element={m.element} suggestion={m.suggestion} />
                      <div className="flex items-center gap-2 mb-1 mt-2">
                        <ChevronRight size={14} color="#94492c" />
                        <h4 className="font-medium text-sm">{m.element}</h4>
                      </div>
                      <p className="text-sm font-medium text-primary mb-1">{m.suggestion}</p>
                      <p className="text-xs text-on-surface-variant">{m.reason}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="bg-primary-container rounded-[24px] p-6 text-white">
              <Sun size={24} className="mb-3" />
              <h3 className="text-lg font-semibold">AI Layout Generator</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <Leaf size={14} className="mt-0.5 shrink-0" />
                  Optimised for your climate zone
                </li>
                <li className="flex items-start gap-2">
                  <Leaf size={14} className="mt-0.5 shrink-0" />
                  Passive cooling & solar orientation
                </li>
                <li className="flex items-start gap-2">
                  <Leaf size={14} className="mt-0.5 shrink-0" />
                  Local material recommendations
                </li>
                <li className="flex items-start gap-2">
                  <Leaf size={14} className="mt-0.5 shrink-0" />
                  Budget-aware design decisions
                </li>
              </ul>
            </div>

            {result && (
              <div className="bg-primary-container rounded-[24px] p-6 text-white">
                <h3 className="text-lg font-semibold">Export Report</h3>
                <p className="mt-2 text-sm text-white/70">
                  Print or save your layout.
                </p>
                <button
                  onClick={() => window.print()}
                  className="mt-4 w-full h-11 bg-secondary rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Download size={16} />
                  Print Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default BuildAssistant
