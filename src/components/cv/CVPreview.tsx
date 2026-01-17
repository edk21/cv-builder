"use client";

import { formatDate } from "@/lib/utils";
import { useCVStore } from "@/store/cvStore";
import { useTranslation } from "@/store/languageStore";
import {
  LuGithub as Github,
  LuGlobe as Globe,
  LuLinkedin as Linkedin,
  LuMail as Mail,
  LuMapPin as MapPin,
  LuPhone as Phone,
} from "react-icons/lu";

export function CVPreview() {
  const { cvData } = useCVStore();
  const { t } = useTranslation();
  const { personalInfo, experiences, education, skills, projects, languages, certifications } = cvData;

  // Template Modern - Design épuré avec une colonne
  // Also serves as the default fallback
  const isModern = cvData.templateId === "modern" || !["classic", "minimal", "creative", "tech"].includes(cvData.templateId || "");

  if (isModern) {
    return (
      <div
        className="a4-page p-8 text-slate-800 text-sm"
        style={{ "--theme-color": cvData.themeColor } as React.CSSProperties}
      >
        {/* Header */}
        <header className="border-b-2 pb-6 mb-6 border-(--theme-color)">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-(--theme-color)">
                {personalInfo.firstName || t("cv.placeholder.firstName")} {personalInfo.lastName || t("cv.placeholder.lastName")}
              </h1>
              {personalInfo.title && (
                <p className="text-lg text-slate-600 mt-1">{personalInfo.title}</p>
              )}
            </div>
            {personalInfo.showPhoto !== false && personalInfo.photo && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-(--theme-color) ml-4 shrink-0">
                <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-600">
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 text-(--theme-color)">
              {t("cv.profile")}
            </h2>
            <p className="text-slate-600 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)">
              {t("cv.experience")}
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.position || t("cv.placeholder.position")}</h3>
                      <p className="text-slate-600">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">
                      {formatDate(exp.startDate)} - {exp.current ? t("cv.present") : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 mt-2 text-xs leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)">
              {t("cv.education")}
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree} {edu.field && `en ${edu.field}`}</h3>
                      <p className="text-slate-600">{edu.institution}{edu.location && ` • ${edu.location}`}</p>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">
                      {formatDate(edu.startDate)} - {edu.current ? t("cv.present") : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-slate-600 mt-2 text-xs">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)">
              {t("cv.skills")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 rounded-full text-xs bg-(--theme-color)/10 text-(--theme-color)"
                >
                  {skill.name || t("cv.placeholder.skill")}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)">
              {t("cv.projects")}
            </h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.name || t("cv.placeholder.project")}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs hover:underline text-(--theme-color)"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Demo</span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs hover:underline text-(--theme-color)"
                      >
                        <Github className="w-3 h-3" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-slate-600 text-xs mt-1">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      Technologies: {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)">
              {t("cv.languages")}
            </h2>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang) => (
                <div key={lang.id} className="text-xs">
                  <span className="font-medium">{lang.name || t("cv.placeholder.language")}</span>
                  <span className="text-slate-500 ml-2">({lang.level})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)">
              {t("cv.certifications")}
            </h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && <span className="text-slate-600"> - {cert.issuer}</span>}
                  {cert.date && <span className="text-slate-500 float-right">{formatDate(cert.date)}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Template Minimal - Design minimaliste avec beaucoup d'espace blanc
  if (cvData.templateId === "minimal") {
    return (
      <div
        className="a4-page p-12 text-slate-900 text-sm"
        style={{ "--theme-color": cvData.themeColor } as React.CSSProperties}
      >
        {/* Header - Centré et épuré */}
        <header className="text-center mb-12">
          {personalInfo.showPhoto !== false && personalInfo.photo && (
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border border-slate-200">
              <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-4xl font-light tracking-wide mb-2">
            {personalInfo.firstName || t("cv.placeholder.firstName")} {personalInfo.lastName || t("cv.placeholder.lastName")}
          </h1>
          {personalInfo.title && (
            <p className="text-base text-slate-500 font-light mt-2">{personalInfo.title}</p>
          )}

          {/* Contact Info - Ligne simple */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-slate-500 font-light">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo.city || personalInfo.country) && (
              <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
            )}
          </div>
        </header>

        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-10">
            <p className="text-slate-700 leading-relaxed text-center max-w-2xl mx-auto">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-normal uppercase tracking-widest mb-6 text-slate-400 border-b border-slate-200 pb-2">
              {t("cv.experience")}
            </h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-normal text-base">{exp.position || t("cv.placeholder.position")}</h3>
                    <p className="text-slate-600 text-xs mt-1">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    {exp.description && (
                      <p className="text-slate-500 text-xs mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-light">
                    {formatDate(exp.startDate)} - {exp.current ? t("cv.present") : formatDate(exp.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-normal uppercase tracking-widest mb-6 text-slate-400 border-b border-slate-200 pb-2">
              {t("cv.education")}
            </h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-normal text-base">{edu.degree} {edu.field && `- ${edu.field}`}</h3>
                    <p className="text-slate-600 text-xs mt-1">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                    {edu.description && (
                      <p className="text-slate-500 text-xs mt-2">{edu.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-light">
                    {formatDate(edu.startDate)} - {edu.current ? t("cv.present") : formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-normal uppercase tracking-widest mb-6 text-slate-400 border-b border-slate-200 pb-2">
              {t("cv.skills")}
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 text-xs border border-slate-300 text-slate-700"
                >
                  {skill.name || t("cv.placeholder.skill")}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-normal uppercase tracking-widest mb-6 text-slate-400 border-b border-slate-200 pb-2">
              {t("cv.projects")}
            </h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-normal text-base">{project.name || t("cv.placeholder.project")}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs hover:underline text-slate-500"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Demo</span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs hover:underline text-slate-500"
                      >
                        <Github className="w-3 h-3" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-slate-500 text-xs mt-1">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1">{project.technologies.join(" • ")}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-xs font-normal uppercase tracking-widest mb-6 text-slate-400 border-b border-slate-200 pb-2">
              {t("cv.languages")}
            </h2>
            <div className="flex flex-wrap gap-6 text-xs">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <span className="text-slate-700">{lang.name || t("cv.placeholder.language")}</span>
                  <span className="text-slate-400 ml-2">({lang.level})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-normal uppercase tracking-widest mb-6 text-slate-400 border-b border-slate-200 pb-2">
              {t("cv.certifications")}
            </h2>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between gap-4 text-xs">
                  <div>
                    <span className="font-medium text-slate-700">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-500 block">{cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-slate-400 font-light">{formatDate(cert.date)}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Template Classic - Design classique avec sidebar colorée
  if (cvData.templateId === "classic") {
    return (
      <div
        className="a4-page flex text-slate-800 text-sm"
        style={{ "--theme-color": cvData.themeColor } as React.CSSProperties}
      >
        {/* Left Sidebar */}
        <div
          className="w-1/3 p-6 text-white bg-(--theme-color)"
        >
          {/* Photo */}
          {personalInfo.showPhoto !== false && personalInfo.photo && (
            <div className="mb-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-white/50 mx-auto">
                <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Name */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold leading-tight">
              {personalInfo.firstName || t("cv.placeholder.firstName")}
            </h1>
            <h1 className="text-2xl font-bold leading-tight">
              {personalInfo.lastName || t("cv.placeholder.lastName")}
            </h1>
            {personalInfo.title && (
              <p className="text-sm opacity-90 mt-2">{personalInfo.title}</p>
            )}
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-75">
              {t("cv.contact")}
            </h2>
            <div className="space-y-2 text-xs">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 opacity-75" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 opacity-75" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 opacity-75" />
                  <span>
                    {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 opacity-75" />
                  <span className="break-all">LinkedIn</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 opacity-75" />
                  <span className="break-all">GitHub</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 opacity-75" />
                  <span className="break-all">Portfolio</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-75">
                {t("cv.skills")}
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="text-xs mb-1">{skill.name || t("cv.placeholder.skill")}</div>
                    <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{
                          width:
                            skill.level === "expert"
                              ? "100%"
                              : skill.level === "avance"
                                ? "80%"
                                : skill.level === "intermediaire"
                                  ? "60%"
                                  : "40%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-75">
                {t("cv.languages")}
              </h2>
              <div className="space-y-1 text-xs">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span>{lang.name || t("cv.placeholder.language")}</span>
                    <span className="opacity-75">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-75">
                {t("cv.certifications")}
              </h2>
              <div className="space-y-3 text-xs">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="font-medium">{cert.name}</div>
                    <div className="opacity-75 text-[10px] mt-0.5">
                      {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-6">
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-2 text-(--theme-color)"
              >
                {t("cv.profile")}
              </h2>
              <p className="text-slate-600 text-xs leading-relaxed">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)"
              >
                {t("cv.experience")}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-(--theme-color)">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-(--theme-color)" />
                    <div className="text-xs text-slate-500 mb-1">
                      {formatDate(exp.startDate)} - {exp.current ? t("cv.present") : formatDate(exp.endDate)}
                    </div>
                    <h3 className="font-semibold text-sm">{exp.position || t("cv.placeholder.position")}</h3>
                    <p className="text-slate-600 text-xs">{exp.company}</p>
                    {exp.description && (
                      <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)"
              >
                {t("cv.education")}
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2 border-(--theme-color)">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-(--theme-color)" />
                    <div className="text-xs text-slate-500 mb-1">
                      {formatDate(edu.startDate)} - {edu.current ? t("cv.present") : formatDate(edu.endDate)}
                    </div>
                    <h3 className="font-semibold text-sm">
                      {edu.degree} {edu.field && `- ${edu.field}`}
                    </h3>
                    <p className="text-slate-600 text-xs">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3 text-(--theme-color)"
              >
                {t("cv.projects")}
              </h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{project.name || t("cv.placeholder.project")}</h3>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs hover:underline text-(--theme-color)"
                          aria-label={`Demo of ${project.name}`}
                        >
                          <Globe className="w-3 h-3" />
                          <span>Demo</span>
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs hover:underline text-(--theme-color)"
                          aria-label={`GitHub repository of ${project.name}`}
                        >
                          <Github className="w-3 h-3" />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-slate-600 text-xs mt-1">{project.description}</p>
                    )}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-xs bg-(--theme-color)/10 text-(--theme-color)"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // Template Creative - Design créatif et audacieux
  if (cvData.templateId === "creative") {
    return (
      <div
        className="a4-page p-6 text-slate-800 text-sm relative overflow-hidden"
        style={{ "--theme-color": cvData.themeColor } as React.CSSProperties}
      >
        {/* Background accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl bg-(--theme-color)"
        />
        <div
          className="absolute bottom-0 left-0 w-24 h-24 opacity-10 rounded-full blur-2xl bg-(--theme-color)"
        />

        {/* Header with creative layout */}
        <header className="relative mb-8 pb-6 border-b-4 border-(--theme-color)">
          <div className="flex items-start justify-between">
            <div className="flex flex-row items-center gap-4">
              {personalInfo.showPhoto !== false && personalInfo.photo && (
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-(--theme-color) shadow-lg shrink-0">
                  <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2 text-(--theme-color)">
                  {personalInfo.firstName || t("cv.placeholder.firstName")}
                </h1>
                <h1 className="text-4xl font-bold mb-2 text-(--theme-color)">
                  {personalInfo.lastName || t("cv.placeholder.lastName")}
                </h1>
                {personalInfo.title && (
                  <p className="text-lg text-slate-600 mt-2 font-medium">{personalInfo.title}</p>
                )}
              </div>
            </div>
            {/* Contact in a box */}
            <div className="bg-slate-50 p-4 rounded-lg border-2 border-(--theme-color)">
              <div className="space-y-2 text-xs">
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-(--theme-color)" />
                    <span className="text-slate-700">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-(--theme-color)" />
                    <span className="text-slate-700">{personalInfo.phone}</span>
                  </div>
                )}
                {(personalInfo.city || personalInfo.country) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-(--theme-color)" />
                    <span className="text-slate-700">
                      {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Two columns layout */}
        <div className="grid grid-cols-2 gap-6 relative">
          {/* Left column */}
          <div className="space-y-6">
            {/* Summary */}
            {personalInfo.summary && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded bg-(--theme-color) text-white">
                  {t("cv.profile")}
                </h2>
                <p className="text-slate-600 text-xs leading-relaxed">{personalInfo.summary}</p>
              </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded bg-(--theme-color) text-white">
                  {t("cv.experience")}
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-6">
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-(--theme-color)" />
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-sm">{exp.position || t("cv.placeholder.position")}</h3>
                          <p className="text-slate-600 text-xs">{exp.company}</p>
                        </div>
                        <span className="text-xs text-slate-500 shrink-0 font-medium">
                          {formatDate(exp.startDate)} - {exp.current ? t("cv.present") : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded bg-(--theme-color) text-white">
                  {t("cv.education")}
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="relative pl-6">
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-(--theme-color)" />
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-sm">{edu.degree} {edu.field && `- ${edu.field}`}</h3>
                          <p className="text-slate-600 text-xs">{edu.institution}</p>
                        </div>
                        <span className="text-xs text-slate-500 shrink-0 font-medium">
                          {formatDate(edu.startDate)} - {edu.current ? t("cv.present") : formatDate(edu.endDate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded bg-(--theme-color) text-white">
                  {t("cv.skills")}
                </h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">{skill.name || t("cv.placeholder.skill")}</span>
                        <span className="text-xs text-slate-500">{skill.level}</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-(--theme-color)"
                          style={{
                            width:
                              skill.level === "expert"
                                ? "100%"
                                : skill.level === "avance"
                                  ? "80%"
                                  : skill.level === "intermediaire"
                                    ? "60%"
                                    : "40%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded bg-(--theme-color) text-white">
                  {t("cv.projects")}
                </h2>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="p-3 rounded-lg border-2 border-(--theme-color)">
                      <h3 className="font-bold text-sm mb-1">{project.name || t("cv.placeholder.project")}</h3>
                      {project.description && (
                        <p className="text-slate-600 text-xs mt-1">{project.description}</p>
                      )}
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-xs bg-(--theme-color)/20 text-(--theme-color) font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded bg-(--theme-color) text-white">
                  {t("cv.languages")}
                </h2>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center p-2 rounded bg-(--theme-color)/10">
                      <span className="text-xs font-medium">{lang.name || t("cv.placeholder.language")}</span>
                      <span className="text-xs font-bold text-(--theme-color)">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded bg-(--theme-color) text-white">
                  {t("cv.certifications")}
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="p-2 border-l-2 border-(--theme-color)">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-700 block">{cert.name}</span>
                        {cert.date && <span className="text-[10px] text-slate-500">{formatDate(cert.date)}</span>}
                      </div>
                      {cert.issuer && <span className="text-xs text-slate-600">{cert.issuer}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to Modern
  // Template Tech - Design technique et structuré
  if (cvData.templateId === "tech") {
    return (
      <div
        className="a4-page p-8 text-slate-800 text-sm font-sans bg-slate-50"
        style={{ "--theme-color": cvData.themeColor } as React.CSSProperties}
      >
        {/* Header style terminal */}
        <header className="bg-slate-900 text-white p-6 rounded-lg mb-8 shadow-xs">
          <div className="flex justify-between items-start">
            <div className="flex flex-row items-center gap-6">
              {personalInfo.showPhoto !== false && personalInfo.photo && (
                <div className="w-20 h-20 overflow-hidden border border-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.3)] shrink-0">
                  <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover grayscale brightness-110 contrast-125" />
                </div>
              )}
              <div>
                <h1
                  className="text-3xl font-mono font-bold mb-2"
                  style={{ color: "#4ade80" }} // keeping the terminal green if requested, or use theme color
                >
                  {">"} {personalInfo.firstName || t("cv.placeholder.firstName")} {personalInfo.lastName || t("cv.placeholder.lastName")}
                  <span className="animate-pulse">_</span>
                </h1>
                {personalInfo.title && (
                  <p className="text-lg text-slate-400 font-mono">{personalInfo.title}</p>
                )}
              </div>
            </div>
            
            <div className="text-right text-xs font-mono text-slate-400 space-y-1">
              {personalInfo.email && (
                <div className="flex items-center justify-end gap-2">
                  <span>{personalInfo.email}</span>
                  <Mail className="w-3 h-3" />
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center justify-end gap-2">
                  <span>{personalInfo.phone}</span>
                  <Phone className="w-3 h-3" />
                </div>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <div className="flex items-center justify-end gap-2">
                  <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
                  <MapPin className="w-3 h-3" />
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center justify-end gap-2">
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-green-400" aria-label="Portfolio">Portfolio</a>
                  <Globe className="w-3 h-3" />
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center justify-end gap-2">
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-green-400" aria-label="GitHub">GitHub</a>
                  <Github className="w-3 h-3" />
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center justify-end gap-2">
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-green-400" aria-label="LinkedIn">LinkedIn</a>
                  <Linkedin className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="col-span-8 space-y-8">
            {/* Experience */}
            {experiences.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-200 pb-2">
                   <span className="text-xl font-bold font-mono text-(--theme-color)">#</span>
                   <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
                    {t("cv.experience")}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200 hover:border-slate-400 transition-colors">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base text-slate-900">
                          {exp.position || t("cv.placeholder.position")}
                        </h3>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {formatDate(exp.startDate)} - {exp.current ? t("cv.present") : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="text-sm font-semibold mb-2 text-(--theme-color)">
                        @{exp.company}
                      </div>
                      {exp.description && (
                        <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-200 pb-2">
                   <span className="text-xl font-bold font-mono text-(--theme-color)">#</span>
                   <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
                    {t("cv.projects")}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white p-4 rounded border border-slate-200 shadow-xs">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900">{project.name || t("cv.placeholder.project")}</h3>
                        <div className="flex gap-2">
                          {project.url && (
                             <a
                               href={project.url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-slate-400 hover:text-slate-800"
                               aria-label={`Demo de ${project.name || t("cv.placeholder.project")}`}
                             >
                               <Globe className="w-4 h-4" />
                             </a>
                          )}
                          {project.github && (
                             <a
                               href={project.github}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-slate-400 hover:text-slate-800"
                               aria-label={`Depot GitHub de ${project.name || t("cv.placeholder.project")}`}
                             >
                               <Github className="w-4 h-4" />
                             </a>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-slate-600 text-xs mb-3">{project.description}</p>
                      )}
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] font-mono border border-(--theme-color)/25 text-(--theme-color) bg-(--theme-color)/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-8">
             {/* Summary */}
             {personalInfo.summary && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-lg font-bold font-mono text-(--theme-color)">{"//"}</span>
                   <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    {t("cv.profile")}
                  </h2>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed font-mono bg-slate-100 p-3 rounded">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-lg font-bold font-mono text-(--theme-color)">{"//"}</span>
                   <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    {t("cv.skills")}
                  </h2>
                </div>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-700">{skill.name || t("cv.placeholder.skill")}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-(--theme-color)"
                          style={{
                            width:
                              skill.level === "expert"
                                ? "100%"
                                : skill.level === "avance"
                                  ? "80%"
                                  : skill.level === "intermediaire"
                                    ? "60%"
                                    : "40%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-lg font-bold font-mono text-(--theme-color)">{"//"}</span>
                   <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    {t("cv.education")}
                  </h2>
                </div>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-sm text-slate-900 border-l-2 pl-2 border-(--theme-color)">
                        {edu.degree}
                      </h3>
                      <div className="text-xs text-slate-600 pl-2.5 mt-1">
                        {edu.field}
                      </div>
                      <div className="text-xs text-slate-500 pl-2.5 mt-0.5 font-mono">
                        {edu.institution}
                      </div>
                      <div className="text-[10px] text-slate-400 pl-2.5 mt-0.5">
                        {formatDate(edu.startDate)} - {edu.current ? t("cv.present") : formatDate(edu.endDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-lg font-bold font-mono text-(--theme-color)">{"//"}</span>
                   <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    {t("cv.languages")}
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between text-xs border border-slate-200 p-2 rounded bg-white">
                      <span className="font-medium">{lang.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded text-white bg-(--theme-color)">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-lg font-bold font-mono text-(--theme-color)">{"//"}</span>
                   <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    {t("cv.certifications")}
                  </h2>
                </div>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="font-mono text-xs">
                      <div className="text-green-600 font-bold">{cert.name}</div>
                      <div className="text-slate-500 text-[10px]">
                        {cert.issuer} {cert.date && <span className="text-slate-400">[{formatDate(cert.date)}]</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to Modern if nothing matched (handled by the first if block)
  return null;
}
