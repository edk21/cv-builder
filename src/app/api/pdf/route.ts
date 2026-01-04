import { NextRequest, NextResponse } from "next/server";
import { CVData } from "@/types/cv";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { checkSubscriptionLimits } from "@/lib/subscriptionService";

// Note: This is a placeholder for PDF generation.
// In production, you would use @react-pdf/renderer on the server side
// or a service like Puppeteer/Playwright to generate PDFs from HTML.

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    const cvData: CVData = await request.json();

    // If this is a saved CV (has an ID), verify ownership and check access
    if (cvData.id) {
      // Verify ownership
      const { data: existingCV } = await supabase
        .from("cvs")
        .select("user_id")
        .eq("id", cvData.id)
        .single();

      if (!existingCV || existingCV.user_id !== user.id) {
        return NextResponse.json(
          { error: "Non autorisé. Ce CV ne vous appartient pas." },
          { status: 403 }
        );
      }

      // Check subscription limits
      const limits = await checkSubscriptionLimits(user.id);

      // Get all user CVs to determine the index of this CV
      const { data: userCVs } = await supabase
        .from("cvs")
        .select("id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      const cvIndex = userCVs?.findIndex((cv) => cv.id === cvData.id) ?? -1;

      // Free users can only download their first CV (index 0)
      if (!limits.isPremium && cvIndex > 0) {
        return NextResponse.json(
          {
            error: "Téléchargement non autorisé",
            message:
              "Vous ne pouvez télécharger que votre premier CV en version gratuite. Passez à Premium pour télécharger tous vos CVs.",
          },
          { status: 403 }
        );
      }
    }

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

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param unsafe - The string to escape
 * @returns Escaped string safe for HTML insertion
 */
function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
  <title>${escapeHtml(personalInfo.firstName)} ${escapeHtml(personalInfo.lastName)} - CV</title>
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
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="name">${escapeHtml(personalInfo.firstName || "Prénom")} ${escapeHtml(personalInfo.lastName || "Nom")}</div>
          ${personalInfo.title ? `<div class="title">${escapeHtml(personalInfo.title)}</div>` : ""}
        </div>
        ${personalInfo.showPhoto !== false && personalInfo.photo ? `
          <div style="width: 80pt; height: 80pt; border-radius: 8px; overflow: hidden; border: 1px solid ${themeColor}; margin-left: 20px;">
            <img src="${personalInfo.photo}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        ` : ""}
      </div>
      <div class="contact">
        ${personalInfo.email ? `<span class="contact-item">📧 ${escapeHtml(personalInfo.email)}</span>` : ""}
        ${personalInfo.phone ? `<span class="contact-item">📱 ${escapeHtml(personalInfo.phone)}</span>` : ""}
        ${personalInfo.city || personalInfo.country ? `<span class="contact-item">📍 ${escapeHtml([personalInfo.city, personalInfo.country].filter(Boolean).join(", "))}</span>` : ""}
        ${personalInfo.linkedin ? `<span class="contact-item">💼 LinkedIn</span>` : ""}
        ${personalInfo.github ? `<span class="contact-item">💻 GitHub</span>` : ""}
      </div>
    </header>

    ${personalInfo.summary ? `
    <section class="section">
      <h2 class="section-title">Profil</h2>
      <p class="item-description">${escapeHtml(personalInfo.summary)}</p>
    </section>
    ` : ""}

    ${experiences.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Expérience professionnelle</h2>
      ${experiences.map(exp => `
        <div class="item">
          <div class="item-header">
            <div>
              <div class="item-title">${escapeHtml(exp.position || "Poste")}</div>
              <div class="item-subtitle">${escapeHtml(exp.company)}${exp.location ? ` • ${escapeHtml(exp.location)}` : ""}</div>
            </div>
            <div class="item-date">${formatDate(exp.startDate)} - ${exp.current ? "Présent" : formatDate(exp.endDate)}</div>
          </div>
          ${exp.description ? `<p class="item-description">${escapeHtml(exp.description)}</p>` : ""}
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
              <div class="item-title">${escapeHtml(edu.degree)}${edu.field ? ` en ${escapeHtml(edu.field)}` : ""}</div>
              <div class="item-subtitle">${escapeHtml(edu.institution)}${edu.location ? ` • ${escapeHtml(edu.location)}` : ""}</div>
            </div>
            <div class="item-date">${formatDate(edu.startDate)} - ${edu.current ? "Présent" : formatDate(edu.endDate)}</div>
          </div>
          ${edu.description ? `<p class="item-description">${escapeHtml(edu.description)}</p>` : ""}
        </div>
      `).join("")}
    </section>
    ` : ""}

    ${skills.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Compétences</h2>
      <div class="skills-list">
        ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill.name || "Compétence")}</span>`).join("")}
      </div>
    </section>
    ` : ""}

    ${projects.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Projets</h2>
      ${projects.map(project => `
        <div class="item">
          <div class="item-title">${escapeHtml(project.name || "Projet")}</div>
          ${project.description ? `<p class="item-description">${escapeHtml(project.description)}</p>` : ""}
          ${project.technologies.length > 0 ? `
            <div class="skills-list" style="margin-top: 5px;">
              ${project.technologies.map(tech => `<span class="skill-tag">${escapeHtml(tech)}</span>`).join("")}
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
            <strong>${escapeHtml(lang.name || "Langue")}</strong>
            <span class="language-level">(${escapeHtml(lang.level)})</span>
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

