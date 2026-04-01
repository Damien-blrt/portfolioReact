/**
 * Home Screen - Éléments très grands, bien espacés, layout côté à côté
 */
import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { personalInfo, aboutCards, qualities } from '@/constants/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTabletOrWeb = SCREEN_WIDTH > 800;

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = aboutCards.map(() => ({
    opacity: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(40)).current,
  }));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    cardAnims.forEach((anim, index) => {
      Animated.parallel([
        Animated.timing(anim.opacity, { toValue: 1, duration: 600, delay: 400 + index * 150, useNativeDriver: true }),
        Animated.timing(anim.translateY, { toValue: 0, duration: 600, delay: 400 + index * 150, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* ── Hero immense : photo et texte côte à côte ── */}
      <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Image source={require('@/assets/images/f1.jpg')} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroText}>
          <Text style={styles.heroLabel}>PORTFOLIO</Text>
          <Text style={styles.heroName}>{personalInfo.name}</Text>
          <Text style={styles.heroTitle} numberOfLines={2}>{personalInfo.title}</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroEmail}>{personalInfo.email}</Text>
        </View>
      </Animated.View>

      {/* ── Section À propos ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>À PROPOS</Text>
          <Text style={styles.sectionTitle}>Me connaître</Text>
          <View style={styles.sectionDivider} />
        </View>

        {/* Cartes immenses côte à côte (environ 25-30% de la largeur sur grand écran) */}
        <View style={styles.cardsRow}>
          {aboutCards.map((card, index) => (
            <Animated.View
              key={index}
              style={[
                styles.aboutCard,
                { opacity: cardAnims[index].opacity, transform: [{ translateY: cardAnims[index].translateY }] },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardBody}>
                {card.paragraphs.map((para, pIndex) => (
                  <Text key={pIndex} style={styles.cardParagraph}>{para}</Text>
                ))}
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Section Qualités ── */}
      <View style={styles.qualitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>QUALITÉS</Text>
          <Text style={styles.sectionTitle}>{qualities.title}</Text>
          <View style={styles.sectionDivider} />
        </View>

        <View style={styles.qualitiesRow}>
          <View style={styles.qualitiesLeft}>
            <Text style={styles.qualitiesIntro}>{qualities.intro}</Text>
            <View style={styles.achievementBox}>
              <Text style={styles.achievementTitle}>{qualities.achievement.title}</Text>
              <Text style={styles.achievementText}>{qualities.achievement.text}</Text>
            </View>
          </View>
          <View style={styles.qualitiesRight}>
            <Image
              source={require('@/assets/images/roman.png')}
              style={styles.qualitiesImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      <View style={{ height: Spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: {
    // Espace pour la barre de navigation fixée en haut
    paddingTop: Platform.OS === 'web' ? 120 : 140,
    paddingBottom: Spacing.xxxl
  },

  /* Hero immense */
  hero: {
    flexDirection: isTabletOrWeb ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxxl,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 450,
  },
  heroImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 6,
    borderColor: Colors.accent,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 10px 30px rgba(0,0,0,0.15)' } as any
      : { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20 }),
  },
  heroText: {
    flex: isTabletOrWeb ? 1 : undefined,
    alignItems: isTabletOrWeb ? 'flex-start' : 'center',
    maxWidth: 900,
  },
  heroLabel: {
    fontSize: FontSizes.md,
    letterSpacing: 6,
    color: Colors.accent,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  heroName: {
    fontSize: FontSizes.hero,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1.5,
    lineHeight: FontSizes.hero * 1.1,
    textAlign: isTabletOrWeb ? 'left' : 'center',
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  heroTitle: {
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontWeight: '500',
    textAlign: isTabletOrWeb ? 'left' : 'center',
  },
  heroDivider: {
    width: 120,
    height: 6,
    backgroundColor: Colors.accent,
    marginVertical: Spacing.xl,
    borderRadius: 3,
  },
  heroEmail: {
    fontSize: FontSizes.lg,
    color: Colors.accent,
    fontWeight: '600',
    letterSpacing: 1,
  },

  /* Section classique */
  section: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.section,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    letterSpacing: 5,
    color: Colors.accent,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.display,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -1,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  sectionDivider: {
    width: 100,
    height: 4,
    backgroundColor: Colors.border,
    marginTop: Spacing.md,
    borderRadius: 2,
  },

  /* Cards : immenses et les unes à côté des autres (flex row wrap) */
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xl,
    justifyContent: 'center',
  },
  aboutCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    // 25% to 30% des largeurs, environ
    flexBasis: isTabletOrWeb ? `calc(33.333% - ${Spacing.xl}px)` as any : '100%',
    minWidth: 280,
    minHeight: 350,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { shadowColor: Colors.shadowMedium, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 24 }
      : { elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cardIcon: { fontSize: FontSizes.xxl },
  cardTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  cardDivider: {
    height: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  cardParagraph: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    lineHeight: FontSizes.lg * 1.6,
    marginBottom: Spacing.md,
  },

  /* Qualités */
  qualitiesSection: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.section,
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  qualitiesRow: {
    flexDirection: isTabletOrWeb ? 'row' : 'column',
    gap: Spacing.xxxl,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  qualitiesLeft: {
    flex: 1,
    gap: Spacing.xl,
    justifyContent: 'center'
  },
  qualitiesRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qualitiesIntro: {
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    lineHeight: FontSizes.xl * 1.5,
    marginBottom: Spacing.lg,
  },
  achievementBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderLeftWidth: 6,
    borderLeftColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  achievementTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.accent,
    marginBottom: Spacing.sm,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  achievementText: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    lineHeight: FontSizes.lg * 1.5,
  },
  qualitiesImage: {
    width: '100%',
    height: 600,
    borderRadius: BorderRadius.xl,
  },
});
