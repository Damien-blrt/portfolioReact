/**
 * Compétences Screen - Éléments immenses, 2/3 colonnes avec grande hauteur
 */
import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated, Platform, useWindowDimensions } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { skillCategories, languageSkills } from '@/constants/data';



export default function CompetencesScreen() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isTabletOrWeb = SCREEN_WIDTH > 800;
  const isMobile = SCREEN_WIDTH < 640;

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
        <View style={[styles.headerContent, isTabletOrWeb && { flexDirection: 'row', alignItems: 'center', gap: Spacing.xxxl }]}>
          <View style={[styles.headerTextWrap, isTabletOrWeb && { minWidth: 500 }]}>
            <Text style={[styles.headerLabel, !isMobile && { fontSize: FontSizes.md, letterSpacing: 6 }]}>EXPERTISE</Text>
            <Text style={[styles.headerTitle, !isMobile && { fontSize: FontSizes.display }]}>Compétences techniques</Text>
          </View>
          <Text style={[styles.headerDescription, !isMobile && { fontSize: FontSizes.xl, minWidth: 280 }]}>
            Technologies et langages acquis au cours de ma formation et mes projets.
          </Text>
        </View>
      </Animated.View>

      {/* Skills Grid */}
      <View style={[styles.skillsGrid, !isMobile && { padding: Spacing.xxxl, gap: Spacing.xxl }]}>
        {skillCategories.map((category, index) => (
          <Animated.View
            key={index}
            style={[
              styles.skillCard,
              !isMobile && { padding: Spacing.xxl, minWidth: 308, minHeight: 360 },
              isTabletOrWeb && { flexBasis: `calc(33.333% - ${Spacing.xxl}px)` as any },
              { opacity: categoryAnims[index].opacity, transform: [{ translateY: categoryAnims[index].translateY }] },
            ]}
          >
            <View style={[styles.skillCardHeader, !isMobile && { marginBottom: Spacing.xl, paddingBottom: Spacing.xl }]}>
              <View style={styles.skillCardDot} />
              <Text style={[styles.skillCategoryTitle, !isMobile && { fontSize: FontSizes.xl }]}>{category.title}</Text>
            </View>
            <View style={styles.skillsList}>
              {category.skills.map((skill, sIndex) => (
                <View key={sIndex} style={styles.skillItemRow}>
                  <View style={styles.skillBullet} />
                  <Text style={[styles.skillItemText, !isMobile && { fontSize: FontSizes.lg }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Langues Section */}
      <View style={[styles.languageSection, !isMobile && { paddingHorizontal: Spacing.xxxl }]}>
        <View style={styles.langHeader}>
          <Text style={styles.headerLabel}>LANGUES</Text>
          <Text style={[styles.langTitle, !isMobile && { fontSize: FontSizes.display }, isMobile && { fontSize: FontSizes.xxxl }]}>{languageSkills.title}</Text>
          <View style={styles.langDivider} />
        </View>

        <View style={[styles.languageCard, !isMobile && { padding: Spacing.xxxl }]}>
          <View style={[styles.langRow, !isMobile && { flexDirection: 'row', alignItems: 'center', gap: Spacing.xl, marginBottom: Spacing.xxl }]}>
            <Text style={styles.languageFlag}>🇬🇧</Text>
            <View style={[styles.languageInfo, isMobile && { width: '100%' }]}>
              <Text style={[styles.languageName, !isMobile && { fontSize: FontSizes.xxl }, isMobile && { fontSize: FontSizes.xl }]}>Anglais</Text>
              <Text style={styles.languageLevel}>Niveau avancé</Text>
            </View>
            <View style={styles.languageBadge}>
              <Text style={[styles.languageBadgeText, !isMobile && { fontSize: FontSizes.xl }, isMobile && { fontSize: FontSizes.lg }]}>90%</Text>
            </View>
          </View>
          <View style={styles.progressBg}>
            <View style={styles.progressFill} />
          </View>
          <Text style={[styles.languageDescription, !isMobile && { fontSize: FontSizes.xl }, isMobile && { fontSize: FontSizes.md }]}>{languageSkills.description}</Text>
        </View>
      </View>

      <View style={{ height: Spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: {
    paddingTop: Platform.OS === 'web' ? 120 : 130,
    paddingBottom: Spacing.xxxl
  },

  /* Header */
  header: {
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    flexDirection: 'column',
    gap: Spacing.lg,
  },
  headerTextWrap: { flex: 1 },
  headerLabel: {
    fontSize: FontSizes.sm,
    letterSpacing: 4,
    color: Colors.accent,
    fontWeight: '800',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  headerDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: FontSizes.md * 1.5,
    width: '100%',
  },

  /* Skills grid */
  skillsGrid: {
    padding: Spacing.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    justifyContent: 'center',
  },
  skillCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    flexBasis: '100%',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { shadowColor: Colors.shadowMedium, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 30 }
      : { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 15 }),
  },
  skillCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
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
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
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
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    flex: 1,
  },

  /* Langues */
  languageSection: {
    paddingHorizontal: Spacing.xl,
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
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    ...(Platform.OS === 'web'
      ? { shadowColor: Colors.shadowMedium, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 30 }
      : { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 15 }),
  },
  langRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  languageFlag: { fontSize: FontSizes.display },
  languageInfo: { flex: 1, marginVertical: Spacing.sm },
  languageName: { fontWeight: '800', color: Colors.textPrimary },
  languageLevel: { color: Colors.textMuted, marginTop: Spacing.xs },
  languageBadge: {
    backgroundColor: Colors.accentSubtle,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.borderAccent,
  },
  languageBadgeText: { fontWeight: '800', color: Colors.accent },
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
    color: Colors.textSecondary,
    lineHeight: FontSizes.md * 1.6,
  },
});
