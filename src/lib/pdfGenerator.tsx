import jsPDF from 'jspdf';
import { CVData } from '@/types/cv';

export async function generatePDFBuffer(cvData: CVData): Promise<Buffer> {
  try {
    const doc = new jsPDF();
    const { personalInfo, experiences, education, skills, projects, languages, certifications, themeColor } = cvData;
    const color = themeColor || '#2563eb';
    
    // Convert hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 37, g: 99, b: 235 };
    };
    
    const rgb = hexToRgb(color);
    let yPosition = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Helper function to add new page if needed
    const checkPageBreak = (neededSpace: number) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };
    
    // Header - Name and Title
    doc.setFontSize(24);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.setFont('helvetica', 'bold');
    const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Nom Prénom';
    doc.text(fullName, margin, yPosition);
    yPosition += 10;
    
    if (personalInfo.title) {
      doc.setFontSize(14);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(personalInfo.title, margin, yPosition);
      yPosition += 8;
    }
    
    // Contact Information
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const contactInfo: string[] = [];
    if (personalInfo.email) contactInfo.push(personalInfo.email);
    if (personalInfo.phone) contactInfo.push(personalInfo.phone);
    const locationText = [personalInfo.city, personalInfo.country].filter(Boolean).join(', ');
    if (locationText) {
      contactInfo.push(locationText);
    } else if (personalInfo.address) {
      contactInfo.push(personalInfo.address);
    }
    if (personalInfo.linkedin) contactInfo.push(personalInfo.linkedin);
    if (personalInfo.github) contactInfo.push(personalInfo.github);
    if (personalInfo.website) contactInfo.push(personalInfo.website);
    if (contactInfo.length > 0) {
      const contactLines = doc.splitTextToSize(contactInfo.join(' • '), pageWidth - 2 * margin);
      doc.text(contactLines, margin, yPosition);
      yPosition += contactLines.length * 5 + 1;
    }
    
    // Line under header
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    // Summary
    if (personalInfo.summary) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFont('helvetica', 'bold');
      doc.text('PROFIL', margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(personalInfo.summary, pageWidth - 2 * margin);
      doc.text(summaryLines, margin, yPosition);
      yPosition += summaryLines.length * 5 + 8;
    }
    
    // Experience
    if (experiences && experiences.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFont('helvetica', 'bold');
      doc.text('EXPÉRIENCE PROFESSIONNELLE', margin, yPosition);
      yPosition += 8;
      
      experiences.forEach((exp, index) => {
        checkPageBreak(25);
        
        // Position and Date
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.position, margin, yPosition);
        
        const dateText = `${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}`;
        const dateWidth = doc.getTextWidth(dateText);
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
        yPosition += 5;
        
        // Company and Location
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text(`${exp.company}${exp.location ? ' • ' + exp.location : ''}`, margin, yPosition);
        yPosition += 5;
        
        // Description
        if (exp.description) {
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          const descLines = doc.splitTextToSize(exp.description, pageWidth - 2 * margin);
          doc.text(descLines, margin, yPosition);
          yPosition += descLines.length * 4 + 6;
        }
        
        yPosition += 3;
      });
    }
    
    // Education
    if (education && education.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFont('helvetica', 'bold');
      doc.text('FORMATION', margin, yPosition);
      yPosition += 8;
      
      education.forEach((edu) => {
        checkPageBreak(20);
        
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree, margin, yPosition);
        
        const dateText = `${edu.startDate} - ${edu.current ? 'Présent' : edu.endDate}`;
        const dateWidth = doc.getTextWidth(dateText);
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
        yPosition += 5;
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text(`${edu.institution}${edu.location ? ' • ' + edu.location : ''}`, margin, yPosition);
        yPosition += 5;
        
        if (edu.field) {
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          doc.text(edu.field, margin, yPosition);
          yPosition += 5;
        }
        
        yPosition += 3;
      });
    }
    
    // Skills
    if (skills && skills.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPÉTENCES', margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      const skillsText = skills.map(s => s.name).join(' • ');
      const skillLines = doc.splitTextToSize(skillsText, pageWidth - 2 * margin);
      doc.text(skillLines, margin, yPosition);
      yPosition += skillLines.length * 4 + 8;
    }
    
    // Languages
    if (languages && languages.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFont('helvetica', 'bold');
      doc.text('LANGUES', margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      languages.forEach((lang) => {
        checkPageBreak(8);
        doc.text(`${lang.name} - ${lang.level}`, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 3;
    }
    
    // Projects
    if (projects && projects.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFont('helvetica', 'bold');
      doc.text('PROJETS', margin, yPosition);
      yPosition += 8;
      
      projects.forEach((project) => {
        checkPageBreak(20);
        
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(project.name, margin, yPosition);
        yPosition += 5;
        
        if (project.description) {
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          doc.setFont('helvetica', 'normal');
          const projLines = doc.splitTextToSize(project.description, pageWidth - 2 * margin);
          doc.text(projLines, margin, yPosition);
          yPosition += projLines.length * 4 + 2;
        }
        
        if (project.technologies && project.technologies.length > 0) {
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          doc.text(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition);
          yPosition += 5;
        }
        
        yPosition += 3;
      });
    }
    
    // Certifications
    if (certifications && certifications.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICATIONS', margin, yPosition);
      yPosition += 8;
      
      certifications.forEach((cert) => {
        checkPageBreak(15);
        
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(cert.name, margin, yPosition);
        yPosition += 5;
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text(`${cert.issuer} • ${cert.date}`, margin, yPosition);
        yPosition += 6;
      });
    }
    
    // Footer
    const footerY = pageHeight - 10;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Généré par CV Builder', pageWidth / 2, footerY, { align: 'center' });
    
    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
