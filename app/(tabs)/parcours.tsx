/**
 * Parcours Screen - Horizontal Timeline Cards layout (côte à côte, style piliers)
 */
import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { parcours } from '@/constants/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTabletOrWeb = SCREEN_WIDTH > 800;

const images: Record<string, any> = {
  iut: require('@/assets/images/iut.png'),
  lycee: require('@/assets/images/images.jpeg'),
};

export default function ParcoursScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const entryAnims = parcours.entries.map(() => ({
    opacity: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(80)).current,
  }));

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

      {/* Header Immense */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerLabel}>FORMATION</Text>
        <Text style={styles.headerTitle}>{parcours.title}</Text>
        <View style={styles.headerDivider} />
      </Animated.View>

      {/* Horizontal style timeline - side by side blocks */}
      <View style={styles.timelineHorizontal}>
        {parcours.entries.map((entry, index) => (
          <Animated.View
            key={index}
            style={[
              styles.timelineEntryColumn,
              { opacity: entryAnims[index].opacity, transform: [{ translateY: entryAnims[index].translateY }] },
            ]}
          >
            {/* Haut : l'image et l'année */}
            <View style={styles.entryCardTop}>
              <View style={styles.imageWrap}>
                <Image source={images[entry.image]} style={styles.entryImage} resizeMode="contain" />
              </View>
              <View style={styles.entryBadge}>
                <Text style={styles.entryBadgeText}>{entry.period}</Text>
              </View>
            </View>

            {/* Séparateur pour l'esthétique */}
            <View style={styles.entryMidLine} />

            {/* Bas : texte */}
            <View style={styles.entryCardBottom}>
              <Text style={styles.entryInstitution}>{entry.institution}</Text>
              <Text style={styles.entryDescription}>{entry.description}</Text>
            </View>

          </Animated.View>
        ))}

        {/* But professionnel rajouté comme carte supplémentaire dans le flow horizontal */}
        <Animated.View style={[styles.goalCard, { opacity: fadeAnim }]}>
          <Text style={styles.goalIcon}>🎯</Text>
          <Text style={styles.goalTitle}>Projet pro.</Text>
          <View style={styles.entryMidLineDark} />
          <Text style={styles.goalText}>{parcours.futureGoal}</Text>
        </Animated.View>

      </View>

      <View style={{ height: Spacing.xxxl }} />
    </ScrollView>
  );
}

const COLUMN_WIDTH = 450;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: {
    paddingTop: Platform.OS === 'web' ? 140 : 160,
    paddingBottom: Spacing.xxxl
  },

  /* Header */
  header: {
    paddingHorizontal: Spacing.xxxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: FontSizes.lg,
    letterSpacing: 8,
    color: Colors.accent,
    fontWeight: '800',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FontSizes.hero,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
    textAlign: 'center',
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  headerDivider: {
    width: 200,
    height: 8,
    backgroundColor: Colors.border,
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
    flexBasis: isTabletOrWeb ? `calc(33.333% - ${Spacing.xxxl}px)` as any : '100%',
    minWidth: COLUMN_WIDTH,
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
    flex: 1, // Pour pousser la taille
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
    flex: 1.5,
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
    flexBasis: isTabletOrWeb ? `calc(33.333% - ${Spacing.xxxl}px)` as any : '100%',
    minWidth: COLUMN_WIDTH,
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
