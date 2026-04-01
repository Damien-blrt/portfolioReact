import { Tabs } from 'expo-router';
import React from 'react';
import {
  Platform,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

/* ---------- Custom Tab Bar (top) ---------- */
function TopTabBar({ state, descriptors, navigation }: any) {
  const tabs = [
    { name: 'index', label: 'Accueil' },
    { name: 'competences', label: 'Compétences' },
    { name: 'parcours', label: 'Parcours' },
    { name: 'projets', label: 'Projets' },
  ];

  return (
    <View style={styles.navBarWrapper}>
      <View style={styles.navBar}>
        {/* Brand */}
        <Text style={styles.navBrand}>DB</Text>

        {/* Nav items */}
        <View style={styles.navItems}>
          {state.routes.map((route: any, index: number) => {
            const tab = tabs.find((t) => t.name === route.name);
            if (!tab) return null;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={({ pressed }) => [
                  styles.navItem,
                  isFocused && styles.navItemActive,
                  pressed && styles.navItemPressed,
                ]}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
              >
                <Text style={styles.navEmoji}>{tab.emoji}</Text>
                <Text style={[styles.navLabel, isFocused && styles.navLabelActive]}>
                  {tab.label}
                </Text>
                {isFocused && <View style={styles.navActiveBar} />}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TopTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      sceneContainerStyle={{ backgroundColor: Colors.bgPrimary }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil — Damien BALLERAT' }} />
      <Tabs.Screen name="competences" options={{ title: 'Compétences — Damien BALLERAT' }} />
      <Tabs.Screen name="parcours" options={{ title: 'Parcours — Damien BALLERAT' }} />
      <Tabs.Screen name="projets" options={{ title: 'Projets — Damien BALLERAT' }} />
    </Tabs>
  );
}

const NAV_HEIGHT = Platform.OS === 'ios' ? 100 : 80;

const styles = StyleSheet.create({
  navBarWrapper: {
    ...Platform.select({
      web: { position: 'fixed', top: 0, width: '100%' },
      default: { position: 'absolute', top: 0, left: 0, right: 0 },
    }),
    zIndex: 9999,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgDark,
    height: NAV_HEIGHT,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    // Shadow
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 8 },
      web: { boxShadow: '0 4px 20px rgba(0,0,0,0.3)' } as any,
    }),
    gap: Spacing.lg,
  },
  navBrand: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 2,
    width: 60,
  },
  navItems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    position: 'relative',
    minWidth: 100,
  },
  navItemActive: {
    backgroundColor: 'rgba(69, 52, 64, 0.15)',
  },
  navItemPressed: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    opacity: 0.85,
  },
  navEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  navLabelActive: {
    color: Colors.accentLight,
    fontWeight: '800',
  },
  navActiveBar: {
    position: 'absolute',
    bottom: -1,
    left: '20%',
    right: '20%',
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
});
