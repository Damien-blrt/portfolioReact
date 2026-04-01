import { Tabs } from 'expo-router';
import Head from 'expo-router/head';
import React, { useState } from 'react';
import {
  Platform,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useWindowDimensions } from 'react-native';

/* ---------- Custom Tab Bar (top) ---------- */
function TopTabBar({ state, descriptors, navigation }: any) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isMobileView = SCREEN_WIDTH < 768; // Slightly larger breakpoint for better feel
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { name: 'index', label: 'Accueil' },
    { name: 'competences', label: 'Compétences' },
    { name: 'parcours', label: 'Parcours' },
    { name: 'projets', label: 'Projets' },
  ];

  const handlePress = (route: any, isFocused: boolean) => {
    setMenuOpen(false);
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
    <View style={styles.navBarWrapper}>
      <View style={[styles.navBar, isMobileView && { height: 70, paddingHorizontal: Spacing.lg }]}>
        {/* Brand */}
        <Text style={[styles.navBrand]}>DB</Text>

        {/* Desktop Nav Items */}
        {!isMobileView ? (
          <View style={styles.navItems}>
            {state.routes.map((route: any, index: number) => {
              const tab = tabs.find((t) => t.name === route.name);
              if (!tab) return null;
              const isFocused = state.index === index;

              return (
                <Pressable
                  key={route.key}
                  onPress={() => handlePress(route, isFocused)}
                  style={({ pressed }) => [
                    styles.navItem,
                    isFocused && styles.navItemActive,
                    pressed && styles.navItemPressed,
                  ]}
                >
                  <Text style={[styles.navLabel, isFocused && styles.navLabelActive]}>
                    {tab.label}
                  </Text>
                  {isFocused && <View style={styles.navActiveBar} />}
                </Pressable>
              );
            })}
          </View>
        ) : (
          /* Mobile Menu Toggle */
          <Pressable
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.menuToggle}
          >
            <Text style={styles.menuToggleIcon}>{menuOpen ? '✕' : '☰'}</Text>
          </Pressable>
        )}
      </View>

      {/* Mobile Menu Overlay */}
      {isMobileView && menuOpen && (
        <View style={styles.mobileMenu}>
          {state.routes.map((route: any, index: number) => {
            const tab = tabs.find((t) => t.name === route.name);
            if (!tab) return null;
            const isFocused = state.index === index;

            return (
              <Pressable
                key={route.key}
                onPress={() => handlePress(route, isFocused)}
                style={[
                  styles.mobileMenuItem,
                  isFocused && styles.mobileMenuItemActive
                ]}
              >
                <Text style={[styles.mobileMenuLabel, isFocused && styles.mobileMenuLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <>
      <Head>
        <title>Damien BALLERAT</title>
      </Head>
      <Tabs
        tabBar={(props) => <TopTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Accueil — Damien BALLERAT' }} />
        <Tabs.Screen name="competences" options={{ title: 'Compétences — Damien BALLERAT' }} />
        <Tabs.Screen name="parcours" options={{ title: 'Parcours — Damien BALLERAT' }} />
        <Tabs.Screen name="projets" options={{ title: 'Projets — Damien BALLERAT' }} />
      </Tabs>
    </>
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
  menuToggle: {
    marginLeft: 'auto',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.lg,
  },
  menuToggleIcon: {
    fontSize: 32,
    color: Colors.accent,
  },
  mobileMenu: {
    backgroundColor: Colors.bgDark,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    gap: Spacing.md,
    ...Platform.select({
      web: { boxShadow: '0 10px 20px rgba(0,0,0,0.5)' } as any,
      default: { elevation: 10 },
    }),
  },
  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  mobileMenuItemActive: {
    backgroundColor: 'rgba(212, 163, 115, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
  },
  mobileMenuEmoji: {
    fontSize: 24,
  },
  mobileMenuLabel: {
    fontSize: FontSizes.lg,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mobileMenuLabelActive: {
    color: Colors.accentLight,
    fontWeight: '800',
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
