/**
 * BasketballShotAnimation.tsx
 *
 * Premium SVG basketball shot animation — absolute overlay.
 * Silhouette athlétique + grande parabole au-dessus du titre.
 * SVG SMIL animateMotion pour le motion path du ballon.
 * Web only, boucle ~7.5s.
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';

const CYCLE_MS = 4000;
const C = '#9A738F';
const C_LIGHT = '#B892AC';
const C_FAINT = 'rgba(154, 115, 143, 0.12)';

export default function BasketballShotAnimation() {
  const { width: screenW, height: screenH } = useWindowDimensions();
  if (Platform.OS !== 'web') return null;
  // Désactiver l'animation sur téléphone (écran vertical ou petite largeur)
  if (screenW < 768 || screenH > screenW) return null;
  return <Scene />;
}

function Scene() {
  const containerRef = useRef<View>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [cycle, setCycle] = useState(0);

  // Mesurer les dimensions réelles de son propre conteneur
  useEffect(() => {
    const measure = () => {
      const el = document.querySelector('[data-testid="bball-container"]') as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        setDims({ w: rect.width, h: 250 }); // Fixons la hauteur à 250px pour le rendu inline
      }
    };
    // Mesurer après un court délai
    const t = setTimeout(measure, 200);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  // Relancer l'animation
  useEffect(() => {
    const id = setInterval(() => setCycle(c => c + 1), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const { w, h } = dims;
  if (w < 400 || h < 200) return (
    <View style={s.container} testID="bball-container" />
  );

  // ── Positions calculées dynamiquement ──

  // Départ de la balle : milieu de la première carte
  const startX = w / 6;
  const startY = h * 0.95;

  // Panier : au milieu de la dernière carte
  const rimCenterX = w * (5 / 6);
  const hoopY = h * 0.65;
  const rimCenterY = hoopY;
  const rimWidth = 40;
  const rimLeft = rimCenterX - rimWidth / 2;
  const rimRight = rimCenterX + rimWidth / 2;

  // La planche touche le côté droit de l'arceau
  const bbWidth = 6;
  const bbLeft = rimRight;
  const bbTop = hoopY - 35;
  const bbBot = hoopY + 45;

  // Le poteau est collé sur la planche
  const strokeW = 3;
  const bbX = bbLeft + strokeW / 2;

  // Arc : "en cloche", plus en hauteur
  const arcPeakX = w * 0.5;
  const arcPeakY = -h * 1;

  // Trajectoire quadratic bezier
  const trajPath = `M ${startX} ${startY} Q ${arcPeakX} ${arcPeakY}, ${rimCenterX} ${hoopY}`;

  return (
    <View style={s.container} testID="bball-container" pointerEvents="none">
      {w > 0 && (
        <svg
          key={cycle}
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <defs>
            <filter id={`gl${cycle}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <path id={`tp${cycle}`} d={trajPath} />
          </defs>

          {/* ══════════════════════════════════════════════════
            PANIER
        ══════════════════════════════════════════════════ */}
          <g opacity="0.6">
            {/* Poteau */}
            <line x1={bbX} y1={bbBot} x2={bbX} y2={h + 50}
              stroke={C} strokeWidth={strokeW} strokeLinecap="round" />
            {/* Backboard (touche le poteau et le cercle) */}
            <rect x={bbLeft} y={bbTop} width={bbWidth} height={bbBot - bbTop} rx="2" fill={C} />
            {/* Rim */}
            <line x1={rimLeft} y1={hoopY} x2={rimRight} y2={hoopY}
              stroke={C} strokeWidth="3" strokeLinecap="round">
              <animate attributeName="stroke" values={`${C};${C_LIGHT};${C}`}
                dur="0.5s" begin="1.4s" fill="freeze" />
              <animate attributeName="stroke-width" values="3;5;3"
                dur="0.5s" begin="1.4s" fill="freeze" />
            </line>
            {/* Filet */}
            <g opacity="0.55">
              {(() => {
                const rl = rimLeft + 2;
                const rr = rimRight - 2;
                const rm = (rl + rr) / 2;
                const nd = 35;
                return (
                  <>
                    <line x1={rl} y1={hoopY + 2} x2={rm - 5} y2={hoopY + nd} stroke={C} strokeWidth="0.8" />
                    <line x1={rm} y1={hoopY + 2} x2={rm} y2={hoopY + nd + 3} stroke={C} strokeWidth="0.8" />
                    <line x1={rr} y1={hoopY + 2} x2={rm + 5} y2={hoopY + nd} stroke={C} strokeWidth="0.8" />
                    <line x1={rl + 4} y1={hoopY + nd * 0.35} x2={rr - 4} y2={hoopY + nd * 0.35}
                      stroke={C} strokeWidth="0.5" />
                    <line x1={rl + 8} y1={hoopY + nd * 0.65} x2={rr - 8} y2={hoopY + nd * 0.65}
                      stroke={C} strokeWidth="0.5" />
                    <animateTransform attributeName="transform" type="translate"
                      values="0,0; 2,4; -1,2; 1,3; 0,0"
                      dur="0.6s" begin="1.35s" fill="freeze" />
                  </>
                );
              })()}
            </g>
          </g>

          {/* ── Trajectoire pointillée ── */}
          <path d={trajPath} stroke={C_FAINT} strokeWidth="1.2" fill="none"
            strokeDasharray="10 14" opacity="0">
            <animate attributeName="opacity" from="0" to="0.4" dur="0.3s" begin="0.3s" fill="freeze" />
            <animate attributeName="opacity" from="0.4" to="0" dur="0.8s" begin="1.6s" fill="freeze" />
          </path>

          {/* ══════════════════════════════════════════════════
            BALLON — suit la trajectoire via animateMotion
        ══════════════════════════════════════════════════ */}
          <g filter={`url(#gl${cycle})`}>
            <g opacity="0">
              <animate attributeName="opacity" from="0" to="0.8" dur="0.2s" begin="0.2s" fill="freeze" />
              <animate attributeName="opacity" from="0.8" to="0" dur="0.1s" begin="1.4s" fill="freeze" />
              <animateMotion
                dur="1.2s" begin="0.2s" fill="freeze"
                calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1"
              >
                <mpath href={`#tp${cycle}`} />
              </animateMotion>

              {/* Ballon de basket stylisé */}
              <circle cx="0" cy="0" r="12" fill="none" stroke={C} strokeWidth="2" />
              <line x1="-11" y1="0" x2="11" y2="0" stroke={C} strokeWidth="0.9" opacity="0.5" />
              <path d="M 0 -11 C -5 -4, -5 4, 0 11" stroke={C} strokeWidth="0.9" fill="none" opacity="0.5" />
              <path d="M 0 -11 C 5 -4, 5 4, 0 11" stroke={C} strokeWidth="0.9" fill="none" opacity="0.5" />

              {/* Rotation pendant le vol */}
              <animateTransform attributeName="transform" type="rotate"
                from="0" to="600" dur="1.2s" begin="0.2s" fill="freeze" additive="sum" />
            </g>
          </g>

          {/* ── Balle qui traverse le filet ── */}
          <circle cx={rimCenterX} cy={rimCenterY} r="11" fill={C} opacity="0">
            <animate attributeName="opacity" values="0;0.45;0.3;0" dur="0.3s" begin="1.4s" fill="freeze" />
            <animate attributeName="cy" from={rimCenterY} to={rimCenterY + 50} dur="0.3s" begin="1.4s" fill="freeze" />
            <animate attributeName="r" from="11" to="8" dur="0.3s" begin="1.4s" fill="freeze" />
          </circle>
        </svg>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: '100%',
    height: 250, // Espace inline réservé pour l'animation
    position: 'relative',
    overflow: 'visible',
    marginVertical: 10,
    ...(Platform.OS === 'web' ? { pointerEvents: 'none' } as any : {}),
  },
});
