import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  contact: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 5,
  },
  contactItem: {
    fontSize: 9,
    color: '#64748b',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 3,
    marginBottom: 10,
  },
  description: {
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 3,
  },
  itemDate: {
    fontSize: 9,
    color: '#94a3b8',
  },
  itemDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#475569',
    marginTop: 3,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    fontSize: 9,
    color: '#334155',
    backgroundColor: '#f1f5f9',
    padding: '4 8',
    borderRadius: 3,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  languageName: {
    fontSize: 10,
    color: '#334155',
  },
  languageLevel: {
    fontSize: 9,
    color: '#64748b',
  },
});

export const CVPDF = ({ data }: { data: CVData }) => {
  const { personalInfo, themeColor, experiences, education, skills, projects, languages, certifications } = data;
  const color = themeColor || '#2563eb';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: color }]}>
          <Text style={[styles.name, { color: color }]}>
            {`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Nom Prénom'}
          </Text>
          
          {personalInfo.title && (
            <Text style={styles.title}>{personalInfo.title}</Text>
          )}

          <View style={styles.contact}>
            {personalInfo.email && (
              <Text style={styles.contactItem}>{personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactItem}>{personalInfo.phone}</Text>
            )}
            {personalInfo.address && (
              <Text style={styles.contactItem}>{personalInfo.address}</Text>
            )}
          </View>
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: color }]}>PROFIL</Text>
            <Text style={styles.description}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: color }]}>EXPÉRIENCE PROFESSIONNELLE</Text>
            {experiences.map((exp, index) => (
              <View key={exp.id || index} style={styles.experienceItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                </Text>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: color }]}>FORMATION</Text>
            {education.map((edu, index) => (
              <View key={edu.id || index} style={styles.experienceItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemDate}>
                    {edu.startDate} - {edu.current ? 'Présent' : edu.endDate}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {edu.institution}{edu.location ? ` • ${edu.location}` : ''}
                </Text>
                {edu.field && (
                  <Text style={styles.itemDescription}>{edu.field}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: color }]}>COMPÉTENCES</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={skill.id || index} style={styles.skillItem}>
                  {skill.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: color }]}>LANGUES</Text>
            {languages.map((lang, index) => (
              <View key={lang.id || index} style={styles.languageItem}>
                <Text style={styles.languageName}>{lang.name}</Text>
                <Text style={styles.languageLevel}>{lang.level}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: color }]}>PROJETS</Text>
            {projects.map((project, index) => (
              <View key={project.id || index} style={styles.experienceItem}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                {project.description && (
                  <Text style={styles.itemDescription}>{project.description}</Text>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={styles.itemDescription}>
                    Technologies: {project.technologies.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: color }]}>CERTIFICATIONS</Text>
            {certifications.map((cert, index) => (
              <View key={cert.id || index} style={styles.experienceItem}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                <Text style={styles.itemSubtitle}>
                  {cert.issuer} • {cert.date}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        <Text style={{ marginTop: 20, fontSize: 8, color: '#94a3b8', textAlign: 'center' }}>
          Généré par CV Builder
        </Text>
      </Page>
    </Document>
  );
};
