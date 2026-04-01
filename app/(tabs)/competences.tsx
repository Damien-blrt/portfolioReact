/**
 * Compétences Screen - Éléments immenses, 2/3 colonnes avec grande hauteur
 */
import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { skillCategories, languageSkills } from '@/constants/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTabletOrWeb = SCREEN_WIDTH > 800;

export default function CompetencesScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const categoryAnims = useRef(skillCategories.map(() => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(40),
  }))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    categoryAnims.forEach((anim, index) => {
      Animated.parallel([
        Animated.timing(anim.opacity, { toValue: 1, duration: 600, delay: 200 + index * 150, useNativeDriver: true }),
        Animated.timing(anim.translateY, { toValue: 0, duration: 600, delay: 200 + index * 150, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header Immense */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerLabel}>EXPERTISE</Text>
          <Text style={styles.headerTitle}>Compétences techniques</Text>
        </View>
        <Text style={styles.headerDescription}>
          Technologies et langages acquis au cours de ma formation et mes projets.
        </Text>
      </Animated.View>

      {/* Skills en colonnes très hautes */}
      <View style={styles.skillsGrid}>
        {skillCategories.map((category, index) => (
          <Animated.View
            key={index}
            style={[
              styles.skillCard,
              { opacity: categoryAnims[index].opacity, transform: [{ translateY: categoryAnims[index].translateY }] },
            ]}
          >
            <View style={styles.skillCardHeader}>
              <View style={styles.skillCardDot} />
              <Text style={styles.skillCategoryTitle}>{category.title}</Text>
            </View>
            <View style={styles.skillsList}>
              {category.skills.map((skill, sIndex) => (
                <View key={sIndex} style={styles.skillItemRow}>
                  <View style={styles.skillBullet} />
                  <Text style={styles.skillItemText}>{skill}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Langues Immense */}
      <View style={styles.languageSection}>
        <View style={styles.langHeader}>
          <Text style={styles.headerLabel}>LANGUES</Text>
          <Text style={styles.langTitle}>{languageSkills.title}</Text>
          <View style={styles.langDivider} />
        </View>

        <View style={styles.languageCard}>
          <View style={styles.langRow}>
            <Text style={styles.languageFlag}>🇬🇧</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>Anglais</Text>
              <Text style={styles.languageLevel}>Niveau avancé</Text>
            </View>
            <View style={styles.languageBadge}>
              <Text style={styles.languageBadgeText}>90%</Text>
            </View>
          </View>
          <View style={styles.progressBg}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.languageDescription}>{languageSkills.description}</Text>
        </View>
      </View>

      <View style={{ height: Spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: {
    paddingTop: Platform.OS === 'web' ? 140 : 160,
    paddingBottom: Spacing.xxxl
  },

  /* Header */
  header: {
    paddingHorizontal: Spacing.xxxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: isTabletOrWeb ? 'row' : 'column',
    alignItems: isTabletOrWeb ? 'center' : 'flex-start',
    gap: Spacing.xxxl,
  },
  headerTextWrap: { flex: 1, minWidth: 300 },
  headerLabel: {
    fontSize: FontSizes.md,
    letterSpacing: 6,
    color: Colors.accent,
    fontWeight: '800',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FontSizes.display,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  headerDescription: {
    flex: 1,
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    lineHeight: FontSizes.xl * 1.5,
    minWidth: 280,
  },

  /* Skills grid en layout vertical = 2/3 colonnes */
  skillsGrid: {
    padding: Spacing.xxxl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxl,
    justifyContent: 'center',
  },
  skillCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    borderWidth: 2,
    borderColor: Colors.border,
    flexBasis: isTabletOrWeb ? `calc(33.333% - ${Spacing.xxl}px)` as any : '100%',
    minWidth: 308,
    minHeight: 360,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { shadowColor: Colors.shadowMedium, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 30 }
      : { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 15 }),
  },
  skillCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderSubtle,
  },
  skillCardDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
  },
  skillCategoryTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  skillsList: { gap: Spacing.md },
  skillItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.lg,
  },
  skillBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.textMuted,
  },
  skillItemText: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    flex: 1,
  },

  /* Langues Immense */
  languageSection: {
    paddingHorizontal: Spacing.xxxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
  },
  langHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  langTitle: {
    fontSize: FontSizes.display,
    fontWeight: '800',
    color: Colors.textPrimary,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  langDivider: {
    width: 120,
    height: 6,
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  languageCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxxl,
    borderWidth: 2,
    borderColor: Colors.border,
    ...(Platform.OS === 'web'
      ? { shadowColor: Colors.shadowMedium, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 30 }
      : { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 15 }),
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  languageFlag: { fontSize: FontSizes.display },
  languageInfo: { flex: 1 },
  languageName: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  languageLevel: { fontSize: FontSizes.lg, color: Colors.textMuted, marginTop: Spacing.xs },
  languageBadge: {
    backgroundColor: Colors.accentSubtle,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.borderAccent,
  },
  languageBadgeText: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.accent },
  progressBg: {
    height: 12,
    backgroundColor: Colors.borderSubtle,
    borderRadius: 6,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    width: '90%',
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 6,
  },
  languageDescription: {
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    lineHeight: FontSizes.xl * 1.6,
  },
});
