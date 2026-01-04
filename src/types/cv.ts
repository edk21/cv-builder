export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  title: string;
  summary: string;
  linkedin?: string;
  github?: string;
  website?: string;
  photo?: string;
  showPhoto?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "debutant" | "intermediaire" | "avance" | "expert";
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface Language {
  id: string;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "natif";
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  url?: string;
}

export interface CVData {
  id?: string;
  userId?: string;
  name: string;
  templateId: string;
  themeColor: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "modern" | "classic" | "creative" | "minimal" | "professional" | "executive" | "compact" | "tech" | "academic";
}

export const defaultCVData: CVData = {
  name: "Mon CV",
  templateId: "modern",
  themeColor: "#2563eb",
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    title: "",
    summary: "",
    photo: "",
    showPhoto: false,
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  certifications: [],
};


// ... existing types ...

// Database Schema Types
// Database Schema Types
export interface CVDBSchema {
  id: string;
  user_id: string;
  name: string;        // map to 'name' column
  template_id: string; // map to 'template_id' column
  theme_color: string; // map to 'theme_color' column
  personal_info: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  created_at: string;
  updated_at: string;
}
