import type { TeamMember } from "@/types/content";

// DUMMY: 4 Mock team members matching design Part 2
export const mockTeamData: TeamMember[] = [
  {
    id: "ahmed-khan",
    name: "Ahmed Khan", // DUMMY
    role: "Team Supervisor", // DUMMY
    photo: {
      src: "/images/placeholder/team-ahmed.png", // DUMMY
      alt: "Ahmed Khan - Team Supervisor at JUBU Cleaning Service",
      width: 600,
      height: 600
    },
    bio: "Over 8 years of hospitality and commercial cleaning team leadership in Dubai.", // DUMMY
    order: 1,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rahim-uddin",
    name: "Rahim Uddin", // DUMMY
    role: "Senior Cleaner", // DUMMY
    photo: {
      src: "/images/placeholder/team-rahim.png", // DUMMY
      alt: "Rahim Uddin - Senior Cleaner at JUBU Cleaning Service",
      width: 600,
      height: 600
    },
    bio: "Expert in deep villa sanitization, floor scrubbing, and post-construction cleaning.", // DUMMY
    order: 2,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "sara-ali",
    name: "Sara Ali", // DUMMY
    role: "Home Cleaning Specialist", // DUMMY
    photo: {
      src: "/images/placeholder/team-sara.png", // DUMMY
      alt: "Sara Ali - Home Cleaning Specialist at JUBU Cleaning Service",
      width: 600,
      height: 600
    },
    bio: "Specialist in luxury residential apartments, delicate fabric care, and kitchen hygiene.", // DUMMY
    order: 3,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "imran-sheikh",
    name: "Imran Sheikh", // DUMMY
    role: "Deep Cleaning Technician", // DUMMY
    photo: {
      src: "/images/placeholder/team-imran.png", // DUMMY
      alt: "Imran Sheikh - Deep Cleaning Technician at JUBU Cleaning Service",
      width: 600,
      height: 600
    },
    bio: "Certified technician operating specialized steam extraction and industrial vacuums.", // DUMMY
    order: 4,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];
