/**
 * Project Detail Screen - Full project page
 * Anthropic-inspired: clean sections, architectural diagrams, warm palette
 */
import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { projects, Project } from '@/constants/data';

const projectImages: Record<string, any> = {
  jardinageons: require('@/assets/images/Jardinageons.png'),
  artistbot: require('@/assets/images/Pokerandom.png'),
  pokerandom: require('@/assets/images/Pokerandom.png'),
};

const galleryImages: Record<string, any[]> = {
  jardinageons: [
    require('@/assets/images/JardinageonsPhp.png'),
    require('@/assets/images/jardinageonsapI.png'),
  ],
  pokerandom: [
    require('@/assets/images/PokerandomExample.png'),
  ],
};

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!project) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Projet non trouvé</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          style={styles.backNav}
          hitSlop={10}
        >
          <Text style={styles.backNavText}>← Retour aux projets</Text>
        </Pressable>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroImageContainer}>
            <Image
              source={projectImages[project.id]}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.projectSubtitle}>{project.subtitle}</Text>
          <Text style={styles.projectTitle}>{project.title}</Text>

          {/* Tech Stack */}
          <View style={styles.techTags}>
            {project.techStack.map((tech, index) => (
              <View key={index} style={styles.techTag}>
                <Text style={styles.techTagText}>{tech}</Text>
              </View>
            ))}
          </View>

          {/* GitHub Link */}
          {project.githubUrl && (
            <Pressable
              style={styles.githubLink}
              onPress={() => Linking.openURL(project.githubUrl!)}
            >
              <Text style={styles.githubLinkText}>
                Voir le code source sur GitHub →
              </Text>
            </Pressable>
          )}
        </View>

        {/* Context */}
        <Section title="Contexte">
          <Text style={styles.bodyText}>{project.context}</Text>
        </Section>

        {/* Objective */}
        <Section title="Objectif">
          <Text style={styles.bodyText}>{project.objective}</Text>
        </Section>

        {/* Architecture */}
        {project.architecture && (
          <Section title="Architecture technique">
            <View style={styles.archGrid}>
              {project.architecture.items.map((item, index) => (
                <View key={index} style={styles.archCard}>
                  <View style={styles.archCardDot} />
                  <Text style={styles.archCardTitle}>{item.title}</Text>
                  <Text style={styles.archCardDesc}>{item.description}</Text>
                </View>
              ))}
            </View>
            {project.architecture.benefit && (
              <View style={styles.benefitBox}>
                <Text style={styles.benefitText}>
                  {project.architecture.benefit}
                </Text>
              </View>
            )}
          </Section>
        )}

        {/* Work Done */}
        <Section title="Travail réalisé" bgAlt>
          <View style={styles.workGrid}>
            {project.workItems.map((item, index) => (
              <View key={index} style={styles.workCard}>
                <Text style={styles.workCardTitle}>{item.title}</Text>
                <View style={styles.workCardDivider} />
                {item.items.map((subItem, sIndex) => (
                  <View key={sIndex} style={styles.workItemRow}>
                    <Text style={styles.workItemBullet}>▸</Text>
                    <Text style={styles.workItemText}>{subItem}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </Section>

        {/* Gallery */}
        {galleryImages[project.id] && galleryImages[project.id].length > 0 && (
          <Section title="Captures d'écran">
            <View style={styles.galleryGrid}>
              {galleryImages[project.id].map((img, index) => (
                <View key={index} style={styles.galleryItem}>
                  <Image
                    source={img}
                    style={styles.galleryImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* Results */}
        <Section title="Résultats" bgAlt>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Compétences développées</Text>
            <Text style={styles.bodyText}>{project.results.skills}</Text>
          </View>
          <View style={[styles.resultCard, { marginTop: Spacing.md }]}>
            <Text style={styles.resultLabel}>Ce que ce projet m'a appris</Text>
            <Text style={styles.bodyText}>{project.results.learnings}</Text>
          </View>
        </Section>

        <View style={{ height: Spacing.xxxl }} />
      </Animated.View>
    </ScrollView>
  );
}

// Reusable Section Component
function Section({
  title,
  children,
  bgAlt = false,
}: {
  title: string;
  children: React.ReactNode;
  bgAlt?: boolean;
}) {
  return (
    <View style={[styles.section, bgAlt && styles.sectionAlt]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  notFound: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  // Back Navigation
  backNav: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backNavText: {
    fontSize: FontSizes.sm,
    color: Colors.accent,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.accentSubtle,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    color: Colors.accent,
    fontWeight: '600',
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  heroImageContainer: {
    width: 160,
    height: 160,
    backgroundColor: Colors.bgSecondary,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroImage: {
    width: 120,
    height: 120,
  },
  projectSubtitle: {
    fontSize: FontSizes.xs,
    letterSpacing: 3,
    color: Colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  projectTitle: {
    fontSize: FontSizes.display,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: Spacing.lg,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },

  // Tech tags
  techTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  techTag: {
    backgroundColor: Colors.tagBg,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.tagBorder,
  },
  techTagText: {
    fontSize: FontSizes.xs,
    color: Colors.tagText,
    fontWeight: '500',
  },

  // GitHub Link
  githubLink: {
    backgroundColor: Colors.bgDark,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  githubLinkText: {
    color: Colors.textLight,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },

  // Section
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  sectionAlt: {
    backgroundColor: Colors.bgSecondary,
  },
  sectionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  sectionDivider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.accent,
    marginBottom: Spacing.lg,
    borderRadius: 1,
  },

  // Body text
  bodyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 26,
  },

  // Architecture Grid
  archGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  archCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...(Platform.OS === 'web'
      ? {
          shadowColor: Colors.shadowLight,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 4,
        }
      : {
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        }),
  },
  archCardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginBottom: Spacing.sm,
  },
  archCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  archCardDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Benefit Box
  benefitBox: {
    backgroundColor: Colors.accentSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  benefitText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 26,
    fontStyle: 'italic',
  },

  // Work Grid
  workGrid: {
    gap: Spacing.md,
  },
  workCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  workCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  workCardDivider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginBottom: Spacing.sm,
  },
  workItemRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  workItemBullet: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  workItemText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    flex: 1,
  },

  // Gallery
  galleryGrid: {
    gap: Spacing.md,
  },
  galleryItem: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  galleryImage: {
    width: '100%',
    height: 250,
    borderRadius: BorderRadius.sm,
  },

  // Results
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
});
