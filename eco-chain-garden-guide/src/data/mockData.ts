export type PlantMatch = {
  id: string;
  name: string;
  scientific: string;
  match: number;
  badge: { label: string; tone: "green" | "terracotta" };
  image: string;
  tags: string[];
  care: { water: string; sun: string };
};

export const plantMatches: PlantMatch[] = [
  {
    id: "aloe",
    name: "Aloe Arborescens",
    scientific: "Krantz Aloe",
    match: 98,
    badge: { label: "High Impact", tone: "green" },
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
    tags: ["DROUGHT RESISTANT", "MEDICINAL"],
    care: { water: "Water once every 2 weeks", sun: "Loves full morning sun" },
  },
  {
    id: "strelitzia",
    name: "Strelitzia Reginae",
    scientific: "Bird of Paradise",
    match: 92,
    badge: { label: "Pollinator", tone: "green" },
    image: "https://images.unsplash.com/photo-1597912038638-a64e1bdc890e?w=800&q=80",
    tags: ["WIND HARDY", "EVERGREEN"],
    care: { water: "Moderate watering weekly", sun: "Ideal for partial shade" },
  },
  {
    id: "protea",
    name: "Protea Cynaroides",
    scientific: "King Protea",
    match: 85,
    badge: { label: "Signature", tone: "terracotta" },
    image: "https://images.unsplash.com/photo-1591127045203-1ca1f4c6f1bd?w=800&q=80",
    tags: ["LOAMY SOIL", "FIRE RESISTANT"],
    care: { water: "Requires well-drained soil", sun: "Requires bright, open spaces" },
  },
];

export type MyPlant = {
  id: string;
  name: string;
  scientific: string;
  image: string;
  lastWatered: string;
  tag: string;
};

export const myPlants: MyPlant[] = [
  {
    id: "1",
    name: "Aloe Vera",
    scientific: "Aloe barbadensis",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80",
    lastWatered: "3 days ago",
    tag: "Xeriscape",
  },
  {
    id: "2",
    name: "Snake Plant",
    scientific: "Sansevieria trifasciata",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=600&q=80",
    lastWatered: "1 week ago",
    tag: "Low Light",
  },
  {
    id: "3",
    name: "Bird of Paradise",
    scientific: "Strelitzia reginae",
    image: "https://images.unsplash.com/photo-1597912038638-a64e1bdc890e?w=600&q=80",
    lastWatered: "Yesterday",
    tag: "Tropical",
  },
  {
    id: "4",
    name: "King Protea",
    scientific: "Protea cynaroides",
    image: "https://images.unsplash.com/photo-1591127045203-1ca1f4c6f1bd?w=600&q=80",
    lastWatered: "5 days ago",
    tag: "Native",
  },
];

export type CareTask = {
  id: string;
  title: string;
  due: string;
  status: "overdue" | "upcoming";
};

export const careTasks: CareTask[] = [
  { id: "1", title: "Water the Aloe Vera collection", due: "Today", status: "overdue" },
  { id: "2", title: "Prune Bird of Paradise leaves", due: "Tomorrow", status: "upcoming" },
  { id: "3", title: "Feed compost to King Protea", due: "Fri, May 2", status: "upcoming" },
  { id: "4", title: "Check soil pH in front bed", due: "Sun, May 4", status: "upcoming" },
];
