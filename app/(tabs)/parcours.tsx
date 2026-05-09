/**
 * Parcours Screen - Horizontal Timeline Cards layout (côte à côte, style piliers)
 */
import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Animated, Platform, useWindowDimensions } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { parcours } from '@/constants/data';
import HoneycombBackground from '@/components/HoneycombBackground';



const images: Record<string, any> = {
  iut: require('@/assets/images/iut.png'),
  lycee: require('@/assets/images/images.jpeg'),
  vietnam: require('@/assets/images/vietnam.png'),
};

export default function ParcoursScreen() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isTabletOrWeb = SCREEN_WIDTH > 800;
  const isMobile = SCREEN_WIDTH < 640;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const entryAnims = useRef(parcours.entries.map(() => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(80),
  }))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    entryAnims.forEach((anim, index) => {
      Animated.parallel([
        Animated.timing(anim.opacity, { toValue: 1, duration: 700, delay: 300 + index * 200, useNativeDriver: true }),
        Animated.timing(anim.translateY, { toValue: 0, duration: 700, delay: 300 + index * 200, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header Immense avec fond honeycomb */}
      <View style={styles.headerWrapper}>
        <HoneycombBackground />
        <Animated.View style={[styles.header, { opacity: fadeAnim }, isMobile && { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.xl }]}>
          <Text style={[styles.headerLabel, isMobile && { fontSize: FontSizes.sm, letterSpacing: 4 }]}>FORMATION</Text>
          <Text style={[styles.headerTitle, isMobile && { fontSize: FontSizes.display }]}>{parcours.title}</Text>
          <View style={styles.headerDivider} />
        </Animated.View>
      </View>

      {/* Horizontal style timeline - side by side blocks */}
      <View style={[styles.timelineHorizontal, isMobile && { padding: Spacing.xl }]}>
        {parcours.entries.map((entry, index) => (
          <Animated.View
            key={index}
            style={[
              styles.timelineEntryColumn,
              !isMobile && { minWidth: COLUMN_WIDTH },
              isTabletOrWeb && { flexBasis: `calc(33.333% - ${Spacing.xxxl}px)` as any },
              isMobile && { width: '100%' },
              { opacity: entryAnims[index].opacity, transform: [{ translateY: entryAnims[index].translateY }] },
            ]}
          >
            {/* Haut : l'image et l'année */}
            <View style={[styles.entryCardTop, isMobile && { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg }]}>
              <View style={[styles.imageWrap, isMobile && { width: 120, height: 120, borderRadius: 60 }]}>
                <Image source={images[entry.image]} style={[styles.entryImage, isMobile && { width: 80, height: 80 }]} resizeMode="contain" />
              </View>
              <View style={[styles.entryBadge, isMobile && { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm }]}>
                <Text style={[styles.entryBadgeText, isMobile && { fontSize: FontSizes.md }]}>{entry.period}</Text>
              </View>
            </View>

            {/* Séparateur pour l'esthétique */}
            <View style={styles.entryMidLine} />

            {/* Bas : texte */}
            <View style={[styles.entryCardBottom, isMobile && { padding: Spacing.xl }]}>
              <Text style={[styles.entryInstitution, isMobile && { fontSize: FontSizes.xl }]}>{entry.institution}</Text>
              <Text style={[styles.entryDescription, isMobile && { fontSize: FontSizes.lg, lineHeight: FontSizes.lg * 1.6 }]}>{entry.description}</Text>
            </View>

          </Animated.View>
        ))}

        {/* But professionnel rajouté comme carte supplémentaire dans le flow horizontal */}
        <Animated.View style={[
          styles.goalCard,
          !isMobile && { minWidth: COLUMN_WIDTH },
          isTabletOrWeb && { flexBasis: `calc(33.333% - ${Spacing.xxxl}px)` as any },
          isMobile && { width: '100%', padding: Spacing.xl },
          { opacity: fadeAnim }
        ]}>
          <Text style={[styles.goalIcon, isMobile && { fontSize: 60 }]}>🎯</Text>
          <Text style={[styles.goalTitle, isMobile && { fontSize: FontSizes.xxl }]}>Projet pro.</Text>
          <View style={styles.entryMidLineDark} />
          <Text style={[styles.goalText, isMobile && { fontSize: FontSizes.lg, lineHeight: FontSizes.lg * 1.6 }]}>{parcours.futureGoal}</Text>
        </Animated.View>

      </View>

      <View style={{ height: Spacing.xxxl }} />
    </ScrollView>
  );
}

const COLUMN_WIDTH = 495;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: {
    paddingTop: Platform.OS === 'web' ? 140 : 160,
    paddingBottom: Spacing.xxxl
  },

  /* Header wrapper — fond honeycomb + contenu */
  headerWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(154, 115, 143, 0.2)',
  },
  /* Header — transparent, au-dessus du canvas */
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 1,
    position: 'relative',
  },
  headerLabel: {
    fontSize: FontSizes.lg,
    letterSpacing: 8,
    color: Colors.accentLight,
    fontWeight: '800',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FontSizes.hero,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    textAlign: 'center',
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  headerDivider: {
    width: 200,
    height: 8,
    backgroundColor: 'rgba(154, 115, 143, 0.3)',
    marginTop: Spacing.xl,
    borderRadius: 4,
  },

  /* Timeline horizontale et géante */
  timelineHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.xxl,
    gap: Spacing.xxl,
    justifyContent: 'center',
  },

  /* Card Colonne : env 25% de chaque avec layout vertical énorme (70% hauteur) */
  timelineEntryColumn: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { shadowColor: Colors.shadowMedium, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 1, shadowRadius: 40 }
      : { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 15 }),
    flexDirection: 'column',
  },

  /* Ligne visuelle verticale (Optionnel, au centre) */
  entryMidLine: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.accent,
    opacity: 0.8,
  },

  entryCardTop: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.bgSecondary,
    gap: Spacing.md,
  },
  imageWrap: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: Colors.border,
    ...(Platform.OS === 'web' ? { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } as any : {}),
  },
  entryImage: { width: 100, height: 100 },
  entryBadge: {
    backgroundColor: Colors.accentSubtle,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.borderAccent,
  },
  entryBadgeText: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  entryCardBottom: {
    padding: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  entryInstitution: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  entryDescription: {
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    lineHeight: FontSizes.xl * 1.6,
    textAlign: 'center',
  },

  /* Goal card incorporée pareil */
  goalCard: {
    backgroundColor: Colors.bgDark,
    borderRadius: BorderRadius.xl,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.xl,
    ...(Platform.OS === 'web'
      ? { shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 1, shadowRadius: 40 }
      : { elevation: 8 }),
  },
  entryMidLineDark: {
    width: 100,
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginVertical: Spacing.md,
  },
  goalIcon: { fontSize: 80 },
  goalTitle: {
    fontSize: FontSizes.display,
    fontWeight: '800',
    color: Colors.textLight,
    textAlign: 'center',
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  goalText: {
    fontSize: FontSizes.xl,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: FontSizes.xl * 1.6,
    textAlign: 'center',
  },
});
