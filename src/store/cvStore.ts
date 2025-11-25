import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CVData,
  defaultCVData,
  Experience,
  Education,
  Skill,
  Project,
  Language,
  Certification,
  PersonalInfo,
} from "@/types/cv";
import { generateId } from "@/lib/utils";

interface CVStore {
  cvData: CVData;
  isDirty: boolean;
  activeSection: string;

  // Actions
  setCVData: (data: Partial<CVData>) => void;
  resetCVData: () => void;
  loadCVData: (data: CVData) => void;
  setActiveSection: (section: string) => void;
  setDirty: (dirty: boolean) => void;

  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  // Template & Theme
  setTemplate: (templateId: string) => void;
  setThemeColor: (color: string) => void;

  // Experiences
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (education: Education[]) => void;

  // Skills
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: defaultCVData,
      isDirty: false,
      activeSection: "personal",

      setCVData: (data) =>
        set((state) => ({
          cvData: { ...state.cvData, ...data },
          isDirty: true,
        })),

      resetCVData: () =>
        set({
          cvData: defaultCVData,
          isDirty: false,
        }),

      loadCVData: (data) =>
        set({
          cvData: data,
          isDirty: false,
        }),

      setActiveSection: (section) => set({ activeSection: section }),

      setDirty: (dirty) => set({ isDirty: dirty }),

      updatePersonalInfo: (info) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: { ...state.cvData.personalInfo, ...info },
          },
          isDirty: true,
        })),

      setTemplate: (templateId) =>
        set((state) => ({
          cvData: { ...state.cvData, templateId },
          isDirty: true,
        })),

      setThemeColor: (color) =>
        set((state) => ({
          cvData: { ...state.cvData, themeColor: color },
          isDirty: true,
        })),

      // Experiences
      addExperience: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: [
              ...state.cvData.experiences,
              {
                id: generateId(),
                company: "",
                position: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
                highlights: [],
              },
            ],
          },
          isDirty: true,
        })),

      updateExperience: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: state.cvData.experiences.map((exp) =>
              exp.id === id ? { ...exp, ...data } : exp
            ),
          },
          isDirty: true,
        })),

      removeExperience: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: state.cvData.experiences.filter((exp) => exp.id !== id),
          },
          isDirty: true,
        })),

      reorderExperiences: (experiences) =>
        set((state) => ({
          cvData: { ...state.cvData, experiences },
          isDirty: true,
        })),

      // Education
      addEducation: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: [
              ...state.cvData.education,
              {
                id: generateId(),
                institution: "",
                degree: "",
                field: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
              },
            ],
          },
          isDirty: true,
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.map((edu) =>
              edu.id === id ? { ...edu, ...data } : edu
            ),
          },
          isDirty: true,
        })),

      removeEducation: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.filter((edu) => edu.id !== id),
          },
          isDirty: true,
        })),

      reorderEducation: (education) =>
        set((state) => ({
          cvData: { ...state.cvData, education },
          isDirty: true,
        })),

      // Skills
      addSkill: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: [
              ...state.cvData.skills,
              {
                id: generateId(),
                name: "",
                level: "intermediaire",
              },
            ],
          },
          isDirty: true,
        })),

      updateSkill: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.map((skill) =>
              skill.id === id ? { ...skill, ...data } : skill
            ),
          },
          isDirty: true,
        })),

      removeSkill: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.filter((skill) => skill.id !== id),
          },
          isDirty: true,
        })),

      // Projects
      addProject: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: [
              ...state.cvData.projects,
              {
                id: generateId(),
                name: "",
                description: "",
                technologies: [],
              },
            ],
          },
          isDirty: true,
        })),

      updateProject: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.map((project) =>
              project.id === id ? { ...project, ...data } : project
            ),
          },
          isDirty: true,
        })),

      removeProject: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.filter((project) => project.id !== id),
          },
          isDirty: true,
        })),

      // Languages
      addLanguage: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: [
              ...state.cvData.languages,
              {
                id: generateId(),
                name: "",
                level: "B1",
              },
            ],
          },
          isDirty: true,
        })),

      updateLanguage: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.map((lang) =>
              lang.id === id ? { ...lang, ...data } : lang
            ),
          },
          isDirty: true,
        })),

      removeLanguage: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.filter((lang) => lang.id !== id),
          },
          isDirty: true,
        })),

      // Certifications
      addCertification: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: [
              ...state.cvData.certifications,
              {
                id: generateId(),
                name: "",
                issuer: "",
                date: "",
              },
            ],
          },
          isDirty: true,
        })),

      updateCertification: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: state.cvData.certifications.map((cert) =>
              cert.id === id ? { ...cert, ...data } : cert
            ),
          },
          isDirty: true,
        })),

      removeCertification: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: state.cvData.certifications.filter(
              (cert) => cert.id !== id
            ),
          },
          isDirty: true,
        })),
    }),
    {
      name: "cv-builder-storage",
      partialize: (state) => ({ cvData: state.cvData }),
    }
  )
);

