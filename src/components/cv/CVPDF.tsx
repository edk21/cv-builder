import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';

// Register fonts if needed
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#64748b',
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  contact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  contactItem: {
    fontSize: 8,
    color: '#64748b',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#2563eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
    marginBottom: 8,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  itemSubtitle: {
    color: '#64748b',
    fontSize: 10,
  },
  itemDate: {
    fontSize: 9,
    color: '#94a3b8',
  },
  description: {
    marginTop: 4,
    lineHeight: 1.4,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 8,
  },
});

export const CVPDF = ({ data }: { data: CVData }) => {
  const { personalInfo, experiences, education, skills, projects, languages, certifications, themeColor } = data;
  
  const headerStyle = [styles.header, { borderBottomColor: themeColor || '#2563eb' }];
  const nameStyle = [styles.name, { color: themeColor || '#2563eb' }];
  const sectionTitleStyle = [styles.sectionTitle, { color: themeColor || '#2563eb' }];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={headerStyle}>
          <View style={styles.headerLeft}>
            <Text style={nameStyle}>{personalInfo.firstName} {personalInfo.lastName}</Text>
            {personalInfo.title ? <Text style={styles.title}>{personalInfo.title}</Text> : null}
            
            <View style={styles.contact}>
              {personalInfo.email ? <Text style={styles.contactItem}>{personalInfo.email}</Text> : null}
              {personalInfo.phone ? <Text style={styles.contactItem}>{personalInfo.phone}</Text> : null}
              {personalInfo.city ? <Text style={styles.contactItem}>{personalInfo.city}, {personalInfo.country}</Text> : null}
            </View>
          </View>
          
          {personalInfo.showPhoto && personalInfo.photo ? (
            <Image src={personalInfo.photo} style={styles.photo} />
          ) : null}
        </View>

        {/* Summary */}
        {personalInfo.summary ? (
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>Profil</Text>
            <Text style={styles.description}>{personalInfo.summary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {(experiences && experiences.length > 0) ? (
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>Expérience Professionnelle</Text>
            {experiences.map((exp, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position || 'Poste'}</Text>
                  <Text style={styles.itemDate}>
                    {(exp.startDate || '').toString()} - {exp.current ? 'Présent' : (exp.endDate || '').toString()}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company || 'Entreprise'}{exp.location ? ` | ${exp.location}` : ''}</Text>
                {exp.description ? <Text style={styles.description}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Education */}
        {(education && education.length > 0) ? (
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>Formation</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree || 'Diplôme'} {edu.field ? `en ${edu.field}` : ''}</Text>
                  <Text style={styles.itemDate}>
                    {(edu.startDate || '').toString()} - {edu.current ? 'En cours' : (edu.endDate || '').toString()}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution || 'Établissement'}{edu.location ? ` | ${edu.location}` : ''}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {(skills && skills.length > 0) ? (
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>Compétences</Text>
            <View style={styles.skillsList}>
              {skills.map((skill, i) => (
                <Text key={i} style={styles.skillTag}>{skill.name || ''}</Text>
              ))}
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};
