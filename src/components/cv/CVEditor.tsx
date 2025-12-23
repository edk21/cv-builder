"use client";

import { useCVStore } from "@/store/cvStore";
import { useTranslation } from "@/store/languageStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TagsInput } from "@/components/ui/tags-input";
import {
  LuUser as User,
  LuBriefcase as Briefcase,
  LuGraduationCap as GraduationCap,
  LuLightbulb as Lightbulb,
  LuFolderKanban as FolderKanban,
  LuLanguages as Languages,
  LuPlus as Plus,
  LuTrash2 as Trash2,
  LuGripVertical as GripVertical,
  LuAward as Award,
} from "react-icons/lu";

export function CVEditor() {
  const { t } = useTranslation();
  const {
    cvData,
    activeSection,
    setActiveSection,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addCertification,
    updateCertification,
    removeCertification,
  } = useCVStore();

  const skillLevelOptions = [
    { value: "debutant", label: t("editor.skills.beginner") },
    { value: "intermediaire", label: t("editor.skills.intermediate") },
    { value: "avance", label: t("editor.skills.advanced") },
    { value: "expert", label: t("editor.skills.expert") },
  ];

  const languageLevelOptions = [
    { value: "A1", label: "A1" },
    { value: "A2", label: "A2" },
    { value: "B1", label: "B1" },
    { value: "B2", label: "B2" },
    { value: "C1", label: "C1" },
    { value: "C2", label: "C2" },
    { value: "natif", label: t("editor.languages.native") },
  ];

  return (
    <div className="h-full overflow-auto">
      <Tabs value={activeSection} onValueChange={setActiveSection} defaultValue="personal">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3">
          <TabsList className="w-full flex-wrap h-auto gap-1">
            <TabsTrigger value="personal" className="gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("editor.tab.profile")}</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("editor.tab.experience")}</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("editor.tab.education")}</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("editor.tab.skills")}</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-1.5">
              <FolderKanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("editor.tab.projects")}</span>
            </TabsTrigger>
            <TabsTrigger value="languages" className="gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("editor.tab.languages")}</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("editor.tab.certifications")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 space-y-4">
          {/* Personal Info Tab */}
          <TabsContent value="personal" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t("editor.personal.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t("editor.personal.firstName")}
                    placeholder="Jean"
                    value={cvData.personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
                  />
                  <Input
                    label={t("editor.personal.lastName")}
                    placeholder="Dupont"
                    value={cvData.personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
                  />
                </div>
                <Input
                  label={t("editor.personal.jobTitle")}
                  placeholder="Développeur Full Stack"
                  value={cvData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t("editor.personal.email")}
                    type="email"
                    placeholder="jean@example.com"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  />
                  <Input
                    label={t("editor.personal.phone")}
                    placeholder="+33 6 12 34 56 78"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  />
                </div>
                <Input
                  label={t("editor.personal.address")}
                  placeholder="123 rue de la Paix"
                  value={cvData.personalInfo.address}
                  onChange={(e) => updatePersonalInfo({ address: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label={t("editor.personal.city")}
                    placeholder="Paris"
                    value={cvData.personalInfo.city}
                    onChange={(e) => updatePersonalInfo({ city: e.target.value })}
                  />
                  <Input
                    label={t("editor.personal.postalCode")}
                    placeholder="75001"
                    value={cvData.personalInfo.postalCode}
                    onChange={(e) => updatePersonalInfo({ postalCode: e.target.value })}
                  />
                  <Input
                    label={t("editor.personal.country")}
                    placeholder="France"
                    value={cvData.personalInfo.country}
                    onChange={(e) => updatePersonalInfo({ country: e.target.value })}
                  />
                </div>
                <Textarea
                  label={t("editor.personal.summary")}
                  placeholder={t("editor.personal.summaryPlaceholder")}
                  value={cvData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t("editor.personal.links")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label={t("editor.personal.linkedin")}
                  placeholder="https://linkedin.com/in/votre-profil"
                  value={cvData.personalInfo.linkedin || ""}
                  onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                />
                <Input
                  label={t("editor.personal.github")}
                  placeholder="https://github.com/votre-profil"
                  value={cvData.personalInfo.github || ""}
                  onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                />
                <Input
                  label={t("editor.personal.website")}
                  placeholder="https://votre-site.com"
                  value={cvData.personalInfo.website || ""}
                  onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="mt-0 space-y-4">
            {cvData.experiences.map((exp, index) => (
              <Card key={exp.id} className="relative group">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical className="w-4 h-4 text-slate-400" />
                </div>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">
                    {t("editor.experience.title")} {index + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeExperience(exp.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t("editor.experience.company")}
                      placeholder="Nom de l'entreprise"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, { company: e.target.value })
                      }
                    />
                    <Input
                      label={t("editor.experience.position")}
                      placeholder="Titre du poste"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(exp.id, { position: e.target.value })
                      }
                    />
                  </div>
                  <Input
                    label={t("editor.experience.location")}
                    placeholder="Paris, France"
                    value={exp.location}
                    onChange={(e) =>
                      updateExperience(exp.id, { location: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t("editor.experience.startDate")}
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { startDate: e.target.value })
                      }
                    />
                    <Input
                      label={t("editor.experience.endDate")}
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { endDate: e.target.value })
                      }
                      disabled={exp.current}
                    />
                  </div>
                  <Checkbox
                    label={t("editor.experience.current")}
                    checked={exp.current}
                    onChange={(e) =>
                      updateExperience(exp.id, {
                        current: (e.target as HTMLInputElement).checked,
                      })
                    }
                  />
                  <Textarea
                    label={t("editor.experience.description")}
                    placeholder={t("editor.experience.descPlaceholder")}
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, { description: e.target.value })
                    }
                  />
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={addExperience}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("editor.experience.add")}
            </Button>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="mt-0 space-y-4">
            {cvData.education.map((edu, index) => (
              <Card key={edu.id} className="relative group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{t("editor.education.title")} {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeEducation(edu.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label={t("editor.education.institution")}
                    placeholder="Nom de l'école ou université"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, { institution: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t("editor.education.degree")}
                      placeholder="Master, Licence..."
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, { degree: e.target.value })
                      }
                    />
                    <Input
                      label={t("editor.education.field")}
                      placeholder="Informatique, Commerce..."
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(edu.id, { field: e.target.value })
                      }
                    />
                  </div>
                  <Input
                    label={t("editor.education.location")}
                    placeholder="Paris, France"
                    value={edu.location}
                    onChange={(e) =>
                      updateEducation(edu.id, { location: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t("editor.education.startDate")}
                      type="month"
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(edu.id, { startDate: e.target.value })
                      }
                    />
                    <Input
                      label={t("editor.education.endDate")}
                      type="month"
                      value={edu.endDate}
                      onChange={(e) =>
                        updateEducation(edu.id, { endDate: e.target.value })
                      }
                      disabled={edu.current}
                    />
                  </div>
                  <Checkbox
                    label={t("editor.education.current")}
                    checked={edu.current}
                    onChange={(e) =>
                      updateEducation(edu.id, {
                        current: (e.target as HTMLInputElement).checked,
                      })
                    }
                  />
                  <Textarea
                    label={t("editor.education.description")}
                    placeholder={t("editor.education.descPlaceholder")}
                    value={edu.description}
                    onChange={(e) =>
                      updateEducation(edu.id, { description: e.target.value })
                    }
                  />
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={addEducation}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("editor.education.add")}
            </Button>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t("editor.skills.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cvData.skills.map((skill) => (
                  <div key={skill.id} className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder={t("editor.skills.name")}
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(skill.id, { name: e.target.value })
                        }
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        options={skillLevelOptions}
                        value={skill.level}
                        onChange={(e) =>
                          updateSkill(skill.id, {
                            level: e.target.value as typeof skill.level,
                          })
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={addSkill}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("editor.skills.add")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-0 space-y-4">
            {cvData.projects.map((project, index) => (
              <Card key={project.id} className="relative group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{t("editor.projects.title")} {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label={t("editor.projects.name")}
                    placeholder="Mon super projet"
                    value={project.name}
                    onChange={(e) =>
                      updateProject(project.id, { name: e.target.value })
                    }
                  />
                  <Textarea
                    label={t("editor.projects.description")}
                    placeholder={t("editor.projects.descPlaceholder")}
                    value={project.description}
                    onChange={(e) =>
                      updateProject(project.id, { description: e.target.value })
                    }
                  />
                  <TagsInput
                    label={t("editor.projects.technologies")}
                    placeholder={t("editor.projects.technologiesPlaceholder")}
                    hint={t("editor.projects.technologiesHint")}
                    value={project.technologies}
                    onChange={(technologies) =>
                      updateProject(project.id, { technologies })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t("editor.projects.url")}
                      placeholder="https://mon-projet.com"
                      value={project.url || ""}
                      onChange={(e) =>
                        updateProject(project.id, { url: e.target.value })
                      }
                    />
                    <Input
                      label={t("editor.projects.github")}
                      placeholder="https://github.com/..."
                      value={project.github || ""}
                      onChange={(e) =>
                        updateProject(project.id, { github: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={addProject}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("editor.projects.add")}
            </Button>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t("editor.languages.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cvData.languages.map((lang) => (
                  <div key={lang.id} className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder={t("editor.languages.name")}
                        value={lang.name}
                        onChange={(e) =>
                          updateLanguage(lang.id, { name: e.target.value })
                        }
                      />
                    </div>
                    <div className="w-48">
                      <Select
                        options={languageLevelOptions}
                        value={lang.level}
                        onChange={(e) =>
                          updateLanguage(lang.id, {
                            level: e.target.value as typeof lang.level,
                          })
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() => removeLanguage(lang.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={addLanguage}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("editor.languages.add")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="mt-0 space-y-4">
            {cvData.certifications.map((cert, index) => (
              <Card key={cert.id} className="relative group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{t("editor.certifications.title")} {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeCertification(cert.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label={t("editor.certifications.name")}
                    placeholder="AWS Certified Solutions Architect"
                    value={cert.name}
                    onChange={(e) =>
                      updateCertification(cert.id, { name: e.target.value })
                    }
                  />
                  <Input
                    label={t("editor.certifications.issuer")}
                    placeholder="Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) =>
                      updateCertification(cert.id, { issuer: e.target.value })
                    }
                  />
                  <Input
                    label={t("editor.certifications.date")}
                    type="month"
                    value={cert.date}
                    onChange={(e) =>
                      updateCertification(cert.id, { date: e.target.value })
                    }
                  />
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={addCertification}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("editor.certifications.add")}
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
