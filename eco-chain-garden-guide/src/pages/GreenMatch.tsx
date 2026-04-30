import { useState } from "react";
import {
  SlidersHorizontal, MapPin, Sun, Cloud, Search, LayoutGrid, SlidersHorizontal as FilterIcon,
  Droplets, ChevronDown, Leaf, Flower2, Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { plantMatches, type PlantMatch } from "@/data/mockData";

type SunMode = "full" | "partial";

const Toggle = ({
  active, onClick, icon: Icon, label,
}: { active: boolean; onClick: () => void; icon: any; label: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 h-11 rounded-lg flex items-center justify-center gap-2 text-label-md transition-colors border ${
      active
        ? "bg-primary-container text-white border-primary-container"
        : "bg-surface-container text-on-surface border-outline-variant hover:border-primary/40"
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

const BadgeChip = ({ tone, label }: { tone: PlantMatch["badge"]["tone"]; label: string }) => {
  const Icon = label === "Pollinator" ? Flower2 : label === "Signature" ? Sparkles : Leaf;
  const color = tone === "terracotta" ? "hsl(17 55% 38%)" : "hsl(138 53% 6%)";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold backdrop-blur"
      style={{ background: "rgba(255,255,255,0.92)", color }}
    >
      <Icon size={12} style={{ color }} /> {label}
    </span>
  );
};

const PlantCard = ({ plant, loading }: { plant: PlantMatch; loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-card rounded-card shadow-soft overflow-hidden animate-pulse">
        <div className="h-[200px] bg-surface-container" />
        <div className="p-5 space-y-3">
          <div className="h-5 w-2/3 bg-surface-container rounded" />
          <div className="h-3 w-1/3 bg-surface-container rounded" />
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-surface-container rounded-full" />
            <div className="h-5 w-20 bg-surface-container rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card rounded-card shadow-soft overflow-hidden hover:shadow-card hover:scale-[1.01] transition-all">
      <div className="relative h-[200px]">
        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-3 left-3">
          <BadgeChip tone={plant.badge.tone} label={plant.badge.label} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-headline-md text-primary leading-tight">{plant.name}</h3>
            <p className="text-caption text-on-surface-variant italic mt-0.5">{plant.scientific}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-headline-md text-secondary leading-none">{plant.match}%</div>
            <div className="text-caption text-on-surface-variant mt-1">Match</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {plant.tags.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-surface-container text-caption text-on-surface-variant tracking-wide">
              {t}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-body-md text-on-surface">
            <Droplets size={14} className="text-secondary shrink-0" /> {plant.care.water}
          </div>
          <div className="flex items-center gap-2 text-body-md text-on-surface">
            <Sun size={14} className="text-secondary shrink-0" /> {plant.care.sun}
          </div>
        </div>
      </div>
    </div>
  );
};

const PendingCard = () => (
  <div className="rounded-card border-[1.5px] border-dashed border-outline-variant flex flex-col items-center justify-center text-center p-6" style={{ background: "#f5f3ee" }}>
    <div className="flex gap-1.5 mb-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
    <div className="text-label-md text-on-surface-variant">More Matches Pending</div>
    <p className="text-caption text-on-surface-variant mt-2 max-w-[220px]">
      Adjust your environmental factors to unlock 12+ other native recommendations.
    </p>
  </div>
);

const GreenMatch = () => {
  const [sun, setSun] = useState<SunMode>("partial");
  const [soil, setSoil] = useState("Lateritic (Red Clay)");
  const [water, setWater] = useState(75); // 0=Moderate, 100=Ultra Low
  const [loading, setLoading] = useState(false);

  const runMatch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-headline-lg text-primary">Green Match</h1>
        <p className="text-body-md text-on-surface-variant mt-2 max-w-[560px]">
          Discover native African flora perfectly adapted to your sustainable Eco-Chain residence. Input your environmental factors to begin.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT */}
        <div className="lg:w-[300px] shrink-0 space-y-4">
          <div className="bg-card rounded-card shadow-soft p-6">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal size={20} className="text-primary" />
              <h2 className="text-headline-md text-on-surface">Environmental Factors</h2>
            </div>

            {/* Plot location */}
            <div className="mb-5">
              <label className="text-label-md text-on-surface block mb-1.5">Plot Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  className="w-full h-11 pl-10 pr-3 bg-surface-container border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary"
                  placeholder="e.g. Nairobi, Kenya"
                />
              </div>
            </div>

            {/* Sun */}
            <div className="mb-5">
              <label className="text-label-md text-on-surface block mb-1.5">Sun Exposure</label>
              <div className="flex gap-2">
                <Toggle active={sun === "full"} onClick={() => setSun("full")} icon={Sun} label="Full Sun" />
                <Toggle active={sun === "partial"} onClick={() => setSun("partial")} icon={Cloud} label="Partial" />
              </div>
            </div>

            {/* Soil */}
            <div className="mb-5">
              <label className="text-label-md text-on-surface block mb-1.5">Soil Condition</label>
              <div className="relative">
                <select
                  value={soil}
                  onChange={(e) => setSoil(e.target.value)}
                  className="w-full h-11 px-3 pr-9 bg-surface-container border border-outline-variant rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary appearance-none"
                >
                  {["Lateritic (Red Clay)", "Loamy", "Sandy", "Clay", "Peat"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            {/* Water */}
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-label-md text-on-surface">Water<br />Conservation</span>
                <span className="text-label-md text-secondary text-right">Xeriscape<br />Priority</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={water}
                onChange={(e) => setWater(Number(e.target.value))}
                className="eco-slider"
                style={{ ["--val" as any]: `${water}%` }}
              />
              <div className="flex justify-between text-caption text-on-surface-variant uppercase tracking-wider mt-2">
                <span>Moderate</span>
                <span>Ultra Low</span>
              </div>
            </div>

            <button
              onClick={runMatch}
              className="w-full h-[52px] bg-primary text-white rounded-lg text-label-md inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Search size={16} /> Match My Garden
            </button>
          </div>

          {/* Eco tip */}
          <div className="rounded-card p-5 bg-primary-container">
            <div className="text-label-md mb-1.5" style={{ color: "#8a9a5b" }}>Eco-Tip</div>
            <p className="text-body-md text-white/80 leading-relaxed">
              Native plants use up to 80% less water than non-native species and support local biodiversity contours.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-caption text-secondary uppercase tracking-[0.15em] font-semibold">Recommended Matches</div>
              <h2 className="text-headline-lg text-primary mt-1">Native Flora for You</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
                <LayoutGrid size={16} />
              </button>
              <button className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
                <FilterIcon size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plantMatches.map((p) => (
              <PlantCard key={p.id} plant={p} loading={loading} />
            ))}
            <PendingCard />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GreenMatch;
