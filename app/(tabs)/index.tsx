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
  useWindowDimensions,
  Animated,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { personalInfo, aboutCards, qualities } from '@/constants/data';
import HoneycombBackground from '@/components/HoneycombBackground';
import BasketballShotAnimation from '@/components/BasketballShotAnimation';



export default function HomeScreen() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isTabletOrWeb = SCREEN_WIDTH > 800;
  const isMobile = SCREEN_WIDTH < 640;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef(aboutCards.map(() => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(40),
  }))).current;

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

      {/* Hero immense avec fond honeycomb animé */}
      <View style={styles.heroWrapper}>
        {/* Fond animé — alvéoles hexagonales interactives */}
        <HoneycombBackground />

        {/* Contenu du hero — au-dessus du canvas */}
        <Animated.View style={[
          styles.hero,
          isTabletOrWeb && { flexDirection: 'row', gap: Spacing.xxl },
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Image source={require('@/assets/images/f1.jpg')} style={styles.heroImage} resizeMode="cover" />
          <View style={[
            styles.heroText,
            isTabletOrWeb && { flex: 1, alignItems: 'flex-start' },
            !isTabletOrWeb && { alignItems: 'center' }
          ]}>
            <Text style={styles.heroLabel}>PORTFOLIO</Text>
            <Text style={[styles.heroName, !isTabletOrWeb && { textAlign: 'center' }]}>{personalInfo.name}</Text>
            <Text style={[styles.heroTitle, !isTabletOrWeb && { textAlign: 'center' }]} numberOfLines={2}>{personalInfo.title}</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroEmail}>{personalInfo.email}</Text>
          </View>
        </Animated.View>
      </View>

      {/* Section À propos */}
      <View style={styles.section}>
        <View style={{ position: 'relative', marginBottom: 40 }}>
          {/* Animation décorative basket (définit la hauteur de 250px) */}
          <BasketballShotAnimation />

          {/* Le titre est superposé exactement par-dessus l'animation */}
          <View style={[styles.sectionHeader, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', marginBottom: 0, zIndex: 10, pointerEvents: 'none' as any }]}>
            <Text style={styles.sectionLabel}>À PROPOS</Text>
            <Text style={styles.sectionTitle}>Me connaître</Text>
            <View style={styles.sectionDivider} />
          </View>
        </View>

        <View style={styles.cardsRow}>
          {aboutCards.map((card, index) => (
            <Animated.View
              key={index}
              style={[
                styles.aboutCard,
                isTabletOrWeb && { flexBasis: `calc(33.333% - ${Spacing.xl}px)` as any },
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

      {/* Section Qualités */}
      <View style={styles.qualitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>QUALITÉS</Text>
          <Text style={styles.sectionTitle}>{qualities.title}</Text>
          <View style={styles.sectionDivider} />
        </View>

        <View style={[styles.qualitiesRow, isTabletOrWeb && { flexDirection: 'row' }]}>
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

  /* Wrapper du hero — contient le fond honeycomb + le contenu */
  heroWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(154, 115, 143, 0.2)',
  },

  /* Hero immense — maintenant transparent, au-dessus du canvas */
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxxl,
    backgroundColor: 'transparent',
    minHeight: 450,
    // Le contenu est au-dessus du fond honeycomb
    zIndex: 1,
    position: 'relative',
  },
  heroImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 6,
    borderColor: Colors.accentLight,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 60px rgba(154, 115, 143, 0.15)' } as any
      : { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }),
  },
  heroText: {
    maxWidth: 900,
  },
  heroLabel: {
    fontSize: FontSizes.md,
    letterSpacing: 6,
    color: Colors.accentLight,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  heroName: {
    fontSize: FontSizes.hero,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    lineHeight: FontSizes.hero * 1.1,
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  heroTitle: {
    fontSize: FontSizes.xl,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: Spacing.sm,
    fontWeight: '500',
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
    color: Colors.accentLight,
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
    flexBasis: '100%',
    minWidth: 308,
    minHeight: 315,
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
