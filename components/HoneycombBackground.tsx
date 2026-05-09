/**
 * HoneycombBackground.tsx
 * 
 * Fond animé avec grille d'alvéoles hexagonales interactives.
 * - Pattern hexagonale discrète visible dans tout le fond
 * - Les hexagones proches du curseur s'illuminent progressivement
 * - Effet fluide, premium, style Linear / Vercel / sci-fi UI
 * - Optimisé GPU via Canvas 2D + requestAnimationFrame
 * - Cleanup correct des listeners React
 * 
 * Bug fix: quand la souris quitte la zone, le glow s'estompe
 * en place au lieu de se déplacer vers une position hors-écran.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

// ─── Configuration ──────────────────────────────────────────
const HEX_SIZE = 28;                    // Rayon de chaque hexagone (px)
const HEX_GAP = 4;                      // Espacement entre hexagones
const GLOW_RADIUS = 200;                // Rayon d'influence du curseur (px)
const GLOW_INTENSITY = 0.65;            // Intensité maximale du glow (0-1)
const FADE_OUT_SPEED = 0.04;            // Vitesse de disparition du glow (0-1 par frame)
const FADE_IN_SPEED = 0.12;             // Vitesse d'apparition / lissage du mouvement

// Couleurs cohérentes avec le thème mauve/plum du portfolio
const BG_COLOR = '#2A1F27';             // Fond très sombre (proche de bgDark)
const HEX_STROKE_BASE = 'rgba(154, 115, 143, 0.08)';  // Contour discret au repos
const HEX_FILL_BASE = 'rgba(154, 115, 143, 0.02)';    // Remplissage quasi-invisible au repos
const GLOW_COLOR_PRIMARY = [120, 80, 110] as const;    // Accent principal (modifié par l'utilisateur)
const GLOW_COLOR_BRIGHT = [217, 101, 208] as const;    // Accent lumineux (modifié par l'utilisateur)

// ─── Types ──────────────────────────────────────────────────
interface HexCell {
  x: number;
  y: number;
}

// Compteur unique pour les IDs (support multi-instances)
let instanceCounter = 0;

// ─── Composant Principal ────────────────────────────────────
export default function HoneycombBackground() {
  // Sur mobile natif, on affiche un simple fond sombre
  if (Platform.OS !== 'web') {
    return <View style={styles.fallbackGradient} />;
  }

  return <HoneycombCanvas />;
}

// ─── Canvas Web Component ───────────────────────────────────
function HoneycombCanvas() {
  // ID unique pour retrouver le DOM element via data-testid
  const [uniqueId] = useState(() => `honeycomb-bg-${++instanceCounter}`);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Position actuelle du glow (interpolée, lissée)
  const mouseRef = useRef({ x: -1000, y: -1000 });
  // Position cible de la souris (mise à jour en temps réel)
  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  // Opacité globale du glow (1 = visible, 0 = invisible)
  const glowOpacityRef = useRef(0);
  // Est-ce que la souris est dans la zone ?
  const isMouseInsideRef = useRef(false);

  const hexGridRef = useRef<HexCell[]>([]);
  const animFrameRef = useRef<number>(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  const cleanupRef = useRef<(() => void) | null>(null);

  /**
   * Génère la grille hexagonale pour couvrir les dimensions données.
   */
  const buildGrid = useCallback((width: number, height: number): HexCell[] => {
    const cells: HexCell[] = [];
    const hexW = (HEX_SIZE + HEX_GAP) * Math.sqrt(3);
    const hexH = (HEX_SIZE + HEX_GAP) * 1.5;
    const cols = Math.ceil(width / hexW) + 2;
    const rows = Math.ceil(height / hexH) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const offsetX = row % 2 === 0 ? 0 : hexW / 2;
        cells.push({ x: col * hexW + offsetX, y: row * hexH });
      }
    }
    return cells;
  }, []);

  /**
   * Dessine un hexagone régulier (pointy-top).
   */
  const drawHexagon = useCallback((
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number, radius: number,
  ) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }, []);

  /**
   * Boucle de rendu — requestAnimationFrame.
   * Le glow utilise un système d'opacité au lieu de déplacer la position
   * hors-écran, ce qui empêche le "glissement" visible au mouseleave.
   */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = sizeRef.current.width;
    const h = sizeRef.current.height;
    if (w === 0 || h === 0) {
      animFrameRef.current = requestAnimationFrame(render);
      return;
    }

    // ── Gestion de l'opacité globale du glow ──
    if (isMouseInsideRef.current) {
      // Souris dedans → opacité monte vers 1
      glowOpacityRef.current = Math.min(1, glowOpacityRef.current + FADE_IN_SPEED);
    } else {
      // Souris dehors → opacité descend vers 0 (fondu en place)
      glowOpacityRef.current = Math.max(0, glowOpacityRef.current - FADE_OUT_SPEED);
    }

    const glowOpacity = glowOpacityRef.current;

    // ── Lissage de la position souris (seulement si la souris est dedans) ──
    if (isMouseInsideRef.current) {
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * FADE_IN_SPEED;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * FADE_IN_SPEED;
    }
    // Quand la souris est dehors, on garde la dernière position (pas de déplacement)

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // ── Clear + fond sombre ──
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    // ── Glow ambiant diffus sous le curseur (modulé par glowOpacity) ──
    if (glowOpacity > 0.01) {
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, GLOW_RADIUS * 1.8);
      g.addColorStop(0, `rgba(${GLOW_COLOR_BRIGHT.join(',')}, ${0.06 * glowOpacity})`);
      g.addColorStop(0.5, `rgba(${GLOW_COLOR_PRIMARY.join(',')}, ${0.03 * glowOpacity})`);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // ── Dessin des hexagones ──
    const grid = hexGridRef.current;
    for (let i = 0; i < grid.length; i++) {
      const hex = grid[i];
      const dx = hex.x - mx;
      const dy = hex.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const proximity = Math.max(0, 1 - dist / GLOW_RADIUS);
      // Intensité modulée par glowOpacity pour le fade-out en place
      const intensity = proximity * proximity * proximity * GLOW_INTENSITY * glowOpacity;

      if (intensity > 0.001) {
        // ── Hexagone illuminé ──
        const r = Math.round(GLOW_COLOR_PRIMARY[0] + (GLOW_COLOR_BRIGHT[0] - GLOW_COLOR_PRIMARY[0]) * proximity);
        const gVal = Math.round(GLOW_COLOR_PRIMARY[1] + (GLOW_COLOR_BRIGHT[1] - GLOW_COLOR_PRIMARY[1]) * proximity);
        const b = Math.round(GLOW_COLOR_PRIMARY[2] + (GLOW_COLOR_BRIGHT[2] - GLOW_COLOR_PRIMARY[2]) * proximity);

        drawHexagon(ctx, hex.x, hex.y, HEX_SIZE);
        ctx.fillStyle = `rgba(${r}, ${gVal}, ${b}, ${intensity * 0.35})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${r}, ${gVal}, ${b}, ${intensity * 0.8 + 0.05})`;
        ctx.lineWidth = 1 + intensity * 1.5;
        ctx.stroke();
      } else {
        // ── Hexagone au repos ──
        drawHexagon(ctx, hex.x, hex.y, HEX_SIZE);
        ctx.fillStyle = HEX_FILL_BASE;
        ctx.fill();
        ctx.strokeStyle = HEX_STROKE_BASE;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    animFrameRef.current = requestAnimationFrame(render);
  }, [drawHexagon]);

  useEffect(() => {
    // Court délai pour laisser React Native Web rendre le DOM
    const initTimeout = setTimeout(() => {
      // Trouver le noeud DOM via data-testid (React Native Web l'expose)
      const domElement = document.querySelector(`[data-testid="${uniqueId}"]`) as HTMLElement | null;
      if (!domElement) {
        console.warn('[HoneycombBackground] Container DOM element not found');
        return;
      }

      // Créer le canvas et l'injecter
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
      domElement.appendChild(canvas);
      canvasRef.current = canvas;

      // ── Redimensionnement ──
      const resize = () => {
        const rect = domElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sizeRef.current = { width: rect.width, height: rect.height };
        hexGridRef.current = buildGrid(rect.width, rect.height);
      };

      // ── Mouse tracking sur le parent (= heroWrapper / headerWrapper) ──
      const parentElement = domElement.parentElement;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = domElement.getBoundingClientRect();
        isMouseInsideRef.current = true;
        targetMouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };

      const handleMouseLeave = () => {
        // On ne touche PAS à targetMouseRef — la position reste figée
        // Le glow va simplement s'estomper en place grâce à glowOpacityRef
        isMouseInsideRef.current = false;
      };

      // ── Init ──
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(domElement);

      // Listener sur le parent pour capturer la souris au-dessus du contenu
      if (parentElement) {
        parentElement.addEventListener('mousemove', handleMouseMove);
        parentElement.addEventListener('mouseleave', handleMouseLeave);
      }

      animFrameRef.current = requestAnimationFrame(render);

      // ── Cleanup ──
      cleanupRef.current = () => {
        cancelAnimationFrame(animFrameRef.current);
        if (parentElement) {
          parentElement.removeEventListener('mousemove', handleMouseMove);
          parentElement.removeEventListener('mouseleave', handleMouseLeave);
        }
        resizeObserver.disconnect();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        canvasRef.current = null;
      };
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      cleanupRef.current?.();
    };
  }, [uniqueId, buildGrid, render]);

  return (
    <View
      style={styles.container}
      // testID est rendu comme data-testid dans le DOM par React Native Web
      testID={uniqueId}
    />
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  fallbackGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2A1F27',
  },
});
