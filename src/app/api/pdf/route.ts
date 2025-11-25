import { NextRequest, NextResponse } from "next/server";
import { CVData } from "@/types/cv";

// Note: This is a placeholder for PDF generation.
// In production, you would use @react-pdf/renderer on the server side
// or a service like Puppeteer/Playwright to generate PDFs from HTML.

export async function POST(request: NextRequest) {
  try {
    const cvData: CVData = await request.json();

    // Generate HTML for the CV
    const html = generateCVHTML(cvData);

    // For now, return HTML that can be printed as PDF
    // In production, you'd use a PDF library here
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${cvData.name || "cv"}.html"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}

function generateCVHTML(cvData: CVData): string {
  const { personalInfo, experiences, education, skills, projects, languages } = cvData;
  const themeColor = cvData.themeColor || "#2563eb";

  const formatDate = (date: string): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.firstName} ${personalInfo.lastName} - CV</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #334155;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
      background: white;
    }
    
    .header {
      border-bottom: 3px solid ${themeColor};
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .name {
      font-size: 28pt;
      font-weight: bold;
      color: ${themeColor};
      margin-bottom: 5px;
    }
    
    .title {
      font-size: 14pt;
      color: #64748b;
    }
    
    .contact {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 10px;
      font-size: 9pt;
      color: #64748b;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${themeColor};
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .item {
      margin-bottom: 15px;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 5px;
    }
    
    .item-title {
      font-weight: 600;
      font-size: 11pt;
    }
    
    .item-subtitle {
      color: #64748b;
      font-size: 10pt;
    }
    
    .item-date {
      font-size: 9pt;
      color: #94a3b8;
      white-space: nowrap;
    }
    
    .item-description {
      font-size: 10pt;
      color: #64748b;
      margin-top: 5px;
    }
    
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .skill-tag {
      background: ${themeColor}15;
      color: ${themeColor};
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 9pt;
    }
    
    .languages-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .language-item {
      font-size: 10pt;
    }
    
    .language-level {
      color: #94a3b8;
      margin-left: 5px;
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .page {
        margin: 0;
        padding: 15mm;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="name">${personalInfo.firstName || "Prénom"} ${personalInfo.lastName || "Nom"}</div>
      ${personalInfo.title ? `<div class="title">${personalInfo.title}</div>` : ""}
      <div class="contact">
        ${personalInfo.email ? `<span class="contact-item">📧 ${personalInfo.email}</span>` : ""}
        ${personalInfo.phone ? `<span class="contact-item">📱 ${personalInfo.phone}</span>` : ""}
        ${personalInfo.city || personalInfo.country ? `<span class="contact-item">📍 ${[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>` : ""}
        ${personalInfo.linkedin ? `<span class="contact-item">💼 LinkedIn</span>` : ""}
        ${personalInfo.github ? `<span class="contact-item">💻 GitHub</span>` : ""}
      </div>
    </header>

    ${personalInfo.summary ? `
    <section class="section">
      <h2 class="section-title">Profil</h2>
      <p class="item-description">${personalInfo.summary}</p>
    </section>
    ` : ""}

    ${experiences.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Expérience professionnelle</h2>
      ${experiences.map(exp => `
        <div class="item">
          <div class="item-header">
            <div>
              <div class="item-title">${exp.position || "Poste"}</div>
              <div class="item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ""}</div>
            </div>
            <div class="item-date">${formatDate(exp.startDate)} - ${exp.current ? "Présent" : formatDate(exp.endDate)}</div>
          </div>
          ${exp.description ? `<p class="item-description">${exp.description}</p>` : ""}
        </div>
      `).join("")}
    </section>
    ` : ""}

    ${education.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Formation</h2>
      ${education.map(edu => `
        <div class="item">
          <div class="item-header">
            <div>
              <div class="item-title">${edu.degree}${edu.field ? ` en ${edu.field}` : ""}</div>
              <div class="item-subtitle">${edu.institution}${edu.location ? ` • ${edu.location}` : ""}</div>
            </div>
            <div class="item-date">${formatDate(edu.startDate)} - ${edu.current ? "Présent" : formatDate(edu.endDate)}</div>
          </div>
          ${edu.description ? `<p class="item-description">${edu.description}</p>` : ""}
        </div>
      `).join("")}
    </section>
    ` : ""}

    ${skills.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Compétences</h2>
      <div class="skills-list">
        ${skills.map(skill => `<span class="skill-tag">${skill.name || "Compétence"}</span>`).join("")}
      </div>
    </section>
    ` : ""}

    ${projects.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Projets</h2>
      ${projects.map(project => `
        <div class="item">
          <div class="item-title">${project.name || "Projet"}</div>
          ${project.description ? `<p class="item-description">${project.description}</p>` : ""}
          ${project.technologies.length > 0 ? `
            <div class="skills-list" style="margin-top: 5px;">
              ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join("")}
            </div>
          ` : ""}
        </div>
      `).join("")}
    </section>
    ` : ""}

    ${languages.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Langues</h2>
      <div class="languages-list">
        ${languages.map(lang => `
          <span class="language-item">
            <strong>${lang.name || "Langue"}</strong>
            <span class="language-level">(${lang.level})</span>
          </span>
        `).join("")}
      </div>
    </section>
    ` : ""}
  </div>
  
  <script>
    // Auto print when opened
    // window.print();
  </script>
</body>
</html>
  `.trim();
}

