import { Document, Page, Text, View, StyleSheet, Font, Link, Image } from '@react-pdf/renderer';
import { JSONResume } from '@/types/resume';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 9,
    lineHeight: 1.5,
    color: '#334155', // Slate 700
  },
  // Header
  header: {
    marginBottom: 25, // Increased from 20
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1', // Slate 300
    paddingBottom: 20, // Increased from 15
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerText: {
    flex: 1,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a', // Slate 900
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8, // Increased from 4
    lineHeight: 1.2, // Added line-height
  },
  label: {
    fontSize: 12,
    color: '#3b82f6', // Blue 500
    fontWeight: 500,
    marginBottom: 4,
    lineHeight: 1.4, // Added line-height
  },
  // Layout
  container: {
    flexDirection: 'row',
    gap: 20,
  },
  leftColumn: {
    width: '30%',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0', // Slate 200
  },
  rightColumn: {
    width: '70%',
  },
  // Sections
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 4,
  },
  // Content Items
  contactItem: {
    marginBottom: 6,
    fontSize: 9,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillName: {
    fontWeight: 700,
    marginBottom: 2,
    fontSize: 9,
  },
  skillList: {
    color: '#475569',
  },
  // Work Experience
  jobItem: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
  },
  jobCompany: {
    color: '#2563eb',
    fontWeight: 500,
  },
  jobDate: {
    color: '#64748b',
    fontSize: 9,
    textAlign: 'right',
  },
  jobSummary: {
    marginBottom: 4,
    color: '#475569',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    color: '#3b82f6',
  },
  bulletContent: {
    flex: 1,
  },
  // Education
  eduItem: {
    marginBottom: 8,
  },
});

interface CVPDFTemplateProps {
  data: JSONResume;
}

export function CVPDFTemplate({ data }: CVPDFTemplateProps) {
  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const volunteer = data.volunteer || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];
  const projects = data.projects || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {basics.image && (
            <Image 
              src={basics.image} 
              style={styles.photo} 
            />
          )}
          <View style={styles.headerText}>
            <Text style={styles.name}>{basics.name || 'Your Name'}</Text>
            {basics.label && <Text style={styles.label}>{basics.label}</Text>}
          </View>
        </View>

        <View style={styles.container}>
          {/* LEFT COLUMN */}
          <View style={styles.leftColumn}>
            {/* Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact</Text>
              {basics.email && (
                <View style={styles.contactItem}><Link src={`mailto:${basics.email}`} style={styles.link}>{basics.email}</Link></View>
              )}
              {basics.phone && (
                <View style={styles.contactItem}><Text>{basics.phone}</Text></View>
              )}
              {basics.location?.city && (
                <View style={styles.contactItem}><Text>{basics.location.city}, {basics.location.countryCode}</Text></View>
              )}
              {basics.url && (
                <View style={styles.contactItem}><Link src={basics.url} style={styles.link}>Portfolio</Link></View>
              )}
              {basics.profiles?.map((p, i) => (
                <View key={i} style={styles.contactItem}>
                  <Link src={p.url || ''} style={styles.link}>{p.network}</Link>
                </View>
              ))}
            </View>

            {/* Education */}
            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu, i) => (
                  <View key={i} style={styles.eduItem}>
                    <Text style={{ fontWeight: 700 }}>{edu.area}</Text>
                    <Text>{edu.institution}</Text>
                    <Text style={{ fontSize: 8, color: '#64748b' }}>{edu.startDate} - {edu.endDate}</Text>
                    {edu.score && <Text style={{ fontSize: 8 }}>GPA: {edu.score}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {skills.map((skill, i) => (
                  <View key={i} style={styles.skillCategory}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillList}>{skill.keywords?.join(', ')}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {languages.map((lang, i) => (
                  <View key={i} style={{ marginBottom: 4 }}>
                    <Text style={{ fontWeight: 700 }}>{lang.language}</Text>
                    <Text style={{ fontSize: 8, color: '#64748b' }}>{lang.fluency}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications (Small) */}
            {certificates.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {certificates.map((cert, i) => (
                  <View key={i} style={{ marginBottom: 4 }}>
                    <Text style={{ fontWeight: 700 }}>{cert.name}</Text>
                    <Text style={{ fontSize: 8 }}>{cert.issuer}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightColumn}>
            {/* Summary */}
            {basics.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text>{basics.summary}</Text>
              </View>
            )}

            {/* Work Experience */}
            {work.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {work.map((job, i) => (
                  <View key={i} style={styles.jobItem} wrap={false}>
                    <View style={styles.jobHeader}>
                      <View>
                        <Text style={styles.jobTitle}>{job.position}</Text>
                        <Text style={styles.jobCompany}>{job.name}</Text>
                      </View>
                      <Text style={styles.jobDate}>
                        {job.startDate} – {job.isCurrentRole ? 'Present' : job.endDate}
                      </Text>
                    </View>
                    {job.location && <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 2 }}>{job.location}</Text>}
                    
                    {job.highlights && job.highlights.filter(h => h).map((highlight, j) => (
                      <View key={j} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletContent}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {projects.map((proj, i) => (
                  <View key={i} style={styles.jobItem} wrap={false}>
                    <View style={styles.jobHeader}>
                      <Text style={styles.jobTitle}>{proj.name}</Text>
                      <Text style={styles.jobDate}>{proj.startDate} - {proj.endDate}</Text>
                    </View>
                    <Text style={[styles.jobSummary, { fontSize: 9 }]}>{proj.description}</Text>
                    {proj.highlights && proj.highlights.filter(h => h).map((highlight, j) => (
                      <View key={j} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletContent}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Volunteer - Only if space permits or if crucial */}
            {volunteer.length > 0 && (
               <View style={styles.section}>
               <Text style={styles.sectionTitle}>Volunteering</Text>
               {volunteer.map((vol, i) => (
                 <View key={i} style={styles.jobItem} wrap={false}>
                   <View style={styles.jobHeader}>
                     <Text style={styles.jobTitle}>{vol.position}</Text>
                     <Text style={styles.jobDate}>{vol.startDate} - {vol.endDate}</Text>
                   </View>
                   <Text style={[styles.jobCompany, { fontSize: 9 }]}>{vol.organization}</Text>
                   {vol.highlights && vol.highlights.filter(h => h).map((highlight, j) => (
                      <View key={j} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletContent}>{highlight}</Text>
                      </View>
                    ))}
                 </View>
               ))}
             </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
