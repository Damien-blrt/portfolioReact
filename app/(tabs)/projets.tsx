/**
 * Projets Screen - Giant Cards Grid (layout haut et étroit côte à côte)
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView, View, Text, Image, StyleSheet, Pressable,
  Animated, Platform, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { projects } from '@/constants/data';



const projectImages: Record<string, any> = {
  jardinageons: require('@/assets/images/Jardinageons.png'),
  artistbot: require('@/assets/images/artistbot.png'),
  pokerandom: require('@/assets/images/Pokerandom.png'),
};

const COLUMN_WIDTH = 418; // slightly smaller to fit better side-by-side

function ProjectCardComp({ project, animStyle, isTabletOrWeb }: any) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Animated.View style={[
      styles.cardWrap, 
      isTabletOrWeb && { flexBasis: `calc(33.333% - ${Spacing.xxl}px)` as any },
      !isTabletOrWeb && { flexBasis: '100%', minWidth: '100%' },
      animStyle
    ]}>
      <Pressable
        style={({ pressed }) => [
          styles.projectCard,
          pressed && styles.projectCardPressed,
          isHovered && styles.projectCardHovered
        ]}
        onPress={() => router.push(`/project/${project.id}`)}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        accessibilityRole="button"
      >
        <View style={styles.projectImageContainer}>
          <Image source={projectImages[project.id]} style={styles.projectImage} resizeMode="contain" />
        </View>

        <View style={styles.projectInfo}>
          <View style={styles.cardTopBar}>
            <Text style={styles.projectSubtitle}>{project.subtitle}</Text>
          </View>

          <Text style={styles.projectTitle} numberOfLines={2} adjustsFontSizeToFit>{project.title}</Text>
          <Text style={styles.projectContext} numberOfLines={3}>{project.context}</Text>

          <View style={styles.techTagsWrapper}>
            {project.techStack.slice(0, 4).map((tech: string, tIndex: number) => (
              <View key={tIndex} style={styles.techTag}>
                <Text style={styles.techTagText}>{tech}</Text>
              </View>
            ))}
            {project.techStack.length > 4 && (
              <View style={[styles.techTag, styles.techTagMore]}>
                <Text style={[styles.techTagText, styles.techTagMoreText]}>+{project.techStack.length - 4}</Text>
              </View>
            )}
          </View>

          <View style={[styles.viewBtnWrapper, isHovered && styles.viewBtnWrapperHovered]}>
            <Text style={styles.viewBtnText}>Voir le détail</Text>
            {isHovered && (
              <Text style={styles.viewBtnIcon}> 👁️</Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ProjetsScreen() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isTabletOrWeb = SCREEN_WIDTH > 800;
  const isMobile = SCREEN_WIDTH < 640;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const projectAnims = useRef(projects.map(() => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(60),
  }))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    projectAnims.forEach((anim, index) => {
      Animated.parallel([
        Animated.timing(anim.opacity, { toValue: 1, duration: 700, delay: 250 + index * 180, useNativeDriver: true }),
        Animated.timing(anim.translateY, { toValue: 0, duration: 700, delay: 250 + index * 180, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View style={[
        styles.header, 
        isTabletOrWeb && { flexDirection: 'row', alignItems: 'center' },
        { opacity: fadeAnim }
      ]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLabel}>RÉALISATIONS</Text>
          <Text style={styles.headerTitle}>Mes projets</Text>
        </View>
        <Text style={styles.headerDescription}>
          Sélection de projets illustrant mes compétences techniques et ma passion pour le développement.
        </Text>
      </Animated.View>

      <View style={styles.grid}>
        {projects.map((project, index) => (
          <ProjectCardComp
            key={project.id}
            project={project}
            isTabletOrWeb={isTabletOrWeb}
            animStyle={{
              opacity: projectAnims[index].opacity,
              transform: [{ translateY: projectAnims[index].translateY }]
            }}
          />
        ))}
      </View>

      <View style={{ height: Spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: {
    paddingTop: Platform.OS === 'web' ? 120 : 140,
    paddingBottom: Spacing.xxxl
  },

  /* Header */
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.xxl,
  },
  headerLeft: { flex: 1, minWidth: 250 },
  headerLabel: {
    fontSize: FontSizes.md,
    letterSpacing: 4,
    color: Colors.accent,
    fontWeight: '800',
    marginBottom: Spacing.sm,
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
    flex: 1.5,
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    lineHeight: FontSizes.xl * 1.5,
    minWidth: 300,
  },

  /* Grid */
  grid: {
    padding: Spacing.xxl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxl,
    justifyContent: 'center',
  },

  cardWrap: {
    minWidth: COLUMN_WIDTH,
  },

  projectCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
    height: 540, // Reduced from 600
    flexDirection: 'column',
    ...(Platform.OS === 'web'
      ? { shadowColor: Colors.shadowMedium, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 20, cursor: 'pointer', transition: 'all 0.3s ease' }
      : { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }),
  },
  projectCardHovered: {
    borderColor: Colors.accent,
    ...(Platform.OS === 'web' && { transform: [{ translateY: -4 }] })
  },
  projectCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },

  projectImageContainer: {
    height: '40%',
    backgroundColor: Colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: Spacing.xl,
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  mobileOverlayImage: {
    width: '35%',
    height: '110%',
    position: 'absolute',
    right: Spacing.md,
    bottom: -15,
  },

  projectInfo: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between', // Push button to bottom
  },
  cardTopBar: {
    marginBottom: Spacing.sm,
  },
  projectSubtitle: {
    fontSize: FontSizes.sm,
    letterSpacing: 2,
    color: Colors.accent,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  projectTitle: {
    fontSize: FontSizes.xxl, // Reduced from xxxl
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    height: FontSizes.xxl * 1.3, // Fixed height for 1 line, or bounds
    ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
  },
  projectContext: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    lineHeight: FontSizes.lg * 1.4,
    marginBottom: Spacing.md,
    flex: 1, // Let it fill available space before tags
  },

  techTagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  techTag: {
    backgroundColor: Colors.tagBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  techTagText: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: '700' },
  techTagMore: {
    backgroundColor: Colors.accentSubtle,
    borderColor: Colors.borderAccent,
  },
  techTagMoreText: { color: Colors.accent },

  viewBtnWrapper: {
    backgroundColor: Colors.bgDark,
    borderWidth: 2,
    borderColor: Colors.borderAccent,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtnWrapperHovered: {
    backgroundColor: Colors.accent,
  },
  viewBtnText: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  viewBtnIcon: {
    fontSize: FontSizes.xl,
    marginLeft: Spacing.sm,
  }
});
