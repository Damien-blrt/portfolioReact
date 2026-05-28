/**
 * Contact Screen - Page de contact premium avec formulaire et infos
 * Même esthétique mauve/plum que le reste du portfolio
 */
import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, View, Text, TextInput, StyleSheet, Pressable,
    Animated, Platform, useWindowDimensions, Linking,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { personalInfo } from '@/constants/data';
import HoneycombBackground from '@/components/HoneycombBackground';
import { supabase } from '@/hooks/supabase';



/* ─── Données de contact ─────────────────────────────────── */
const contactMethods = [
    {
        label: 'Email',
        value: personalInfo.email,
        action: `mailto:${personalInfo.email}`,
    },
    {
        label: 'Localisation',
        value: personalInfo.location,
        action: null,
    },
    {
        label: 'Disponibilité',
        value: 'Recherche alternance 2026/2027',
        action: null,
    },
];

export default function ContactScreen() {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const isTabletOrWeb = SCREEN_WIDTH > 800;
    const isMobile = SCREEN_WIDTH < 640;

    /* ── Animations d'entrée ── */
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cardAnims = useRef(contactMethods.map(() => ({
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(40),
    }))).current;
    const formAnim = useRef(new Animated.Value(0)).current;
    const formSlide = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        cardAnims.forEach((anim, index) => {
            Animated.parallel([
                Animated.timing(anim.opacity, { toValue: 1, duration: 600, delay: 200 + index * 150, useNativeDriver: true }),
                Animated.timing(anim.translateY, { toValue: 0, duration: 600, delay: 200 + index * 150, useNativeDriver: true }),
            ]).start();
        });
        Animated.parallel([
            Animated.timing(formAnim, { toValue: 1, duration: 700, delay: 500, useNativeDriver: true }),
            Animated.timing(formSlide, { toValue: 0, duration: 700, delay: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    /* ── État du formulaire ── */
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) || email.trim() === '';
    };

    const handleSubmit = async () => {
        if (!isValidEmail(formData.email)) {
            setEmailError('Adresse email invalide');
            return;
        }
        setEmailError(null);
        const { error } = await supabase
            .from('messages_contact')
            .insert({
                nom: formData.name,
                email: formData.email,
                message: formData.message,
            });

        if (!error) {
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSubmitted(false), 3000);
        } else {
            console.error('Erreur Supabase:', error.message);
        }
    };

    const isFormValid = formData.name.trim() && formData.message.trim();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

            {/* Header avec fond honeycomb */}
            <View style={styles.headerWrapper}>
                <HoneycombBackground />
                <Animated.View style={[
                    styles.header,
                    isTabletOrWeb && { flexDirection: 'row', alignItems: 'center' },
                    { opacity: fadeAnim }
                ]}>
                    <View style={styles.headerLeft}>
                        <Text style={[styles.headerLabel, isMobile && { fontSize: FontSizes.sm, letterSpacing: 4 }]}>CONTACT</Text>
                        <Text style={[styles.headerTitle, isMobile && { fontSize: FontSizes.xxxl }]}>Me contacter</Text>
                    </View>
                    <Text style={[styles.headerDescription, isMobile && { fontSize: FontSizes.md }]}>
                        Une question, une proposition d'alternance ou simplement envie d'échanger ? N'hésitez pas à me contacter.
                    </Text>
                </Animated.View>
            </View>

            {/* Section formulaire + aside */}
            <Animated.View style={[
                styles.formSection,
                isMobile && { paddingHorizontal: Spacing.xl },
                { opacity: formAnim, transform: [{ translateY: formSlide }] }
            ]}>
                <View style={styles.formSectionHeader}>
                    <Text style={styles.sectionLabel}>FORMULAIRE</Text>
                    <Text style={[styles.sectionTitle, isMobile && { fontSize: FontSizes.xxl }]}>Envoyez-moi un message</Text>
                    <View style={styles.sectionDivider} />
                </View>

                <View style={[styles.formRow, isTabletOrWeb && { flexDirection: 'row' }]}>
                    {/* Formulaire */}
                    <View style={styles.formCard}>
                        {/* Nom */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nom complet</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    focusedField === 'name' && styles.textInputFocused,
                                ]}
                                placeholder="Votre nom"
                                placeholderTextColor={Colors.textMuted}
                                value={formData.name}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Adresse email <Text style={{ color: Colors.textMuted, fontWeight: '400' }}>(optionnel)</Text></Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    focusedField === 'email' && styles.textInputFocused,
                                    emailError && styles.textInputError,  // ← bordure rouge
                                ]}
                                placeholder="votre@email.com"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={(text) => {
                                    setFormData(prev => ({ ...prev, email: text }));
                                    if (emailError) setEmailError(null);
                                }}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                            />
                            {emailError && (
                                <Text style={styles.errorText}>{emailError}</Text>
                            )}
                        </View>

                        {/* Message */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Message</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    styles.textArea,
                                    focusedField === 'message' && styles.textInputFocused,
                                ]}
                                placeholder="Votre message..."
                                placeholderTextColor={Colors.textMuted}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                value={formData.message}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Bouton envoyer */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.submitButton,
                                !isFormValid && styles.submitButtonDisabled,
                                pressed && isFormValid && styles.submitButtonPressed,
                                submitted && styles.submitButtonSuccess,
                            ]}
                            onPress={handleSubmit}
                            disabled={!isFormValid}
                        >
                            <Text style={[
                                styles.submitButtonText,
                                !isFormValid && styles.submitButtonTextDisabled,
                            ]}>
                                {submitted ? '✓  Message envoyé !' : 'Envoyer le message'}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Aside - Informations complémentaires */}
                    <View style={styles.asideCard}>
                        <View style={styles.asideIconWrap}>
                            <Text style={styles.asideIcon}>🤝</Text>
                        </View>
                        <Text style={[styles.asideTitle, isMobile && { fontSize: FontSizes.xl }]}>Collaborons ensemble</Text>
                        <View style={styles.asideDivider} />
                        <Text style={styles.asideText}>
                            Je suis actuellement à la recherche d'une alternance pour l'année 2026/2027 dans tous les domaines informatiques
                        </Text>
                        <Text style={styles.asideText}>
                            Passionné par le développement, je suis ouvert à toute opportunité permettant de mettre en pratique mes compétences techniques.
                        </Text>

                    </View>
                </View>
            </Animated.View>

            <View style={{ height: Spacing.xxxl }} />
            {/* Cartes de contact */}
            <View style={[styles.contactCardsRow, isMobile && { padding: Spacing.xl }]}>
                {contactMethods.map((method, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.contactCard,
                            isTabletOrWeb && { flexBasis: `calc(33.333% - ${Spacing.xxl}px)` as any },
                            { opacity: cardAnims[index].opacity, transform: [{ translateY: cardAnims[index].translateY }] },
                        ]}
                    >
                        <Pressable
                            style={({ pressed }) => [
                                styles.contactCardInner,
                                pressed && method.action && styles.contactCardPressed,
                            ]}
                            onPress={() => method.action && Linking.openURL(method.action)}
                            disabled={!method.action}
                        >
                            <Text style={[styles.contactCardLabel, !isMobile && { fontSize: FontSizes.md }]}>{method.label}</Text>
                            <Text style={[styles.contactCardValue, !isMobile && { fontSize: FontSizes.lg }]}>{method.value}</Text>
                        </Pressable>
                    </Animated.View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgPrimary },
    content: {
        paddingTop: Platform.OS === 'web' ? 120 : 140,
        paddingBottom: Spacing.xxxl,
    },

    /* Header wrapper — fond honeycomb + contenu */
    headerWrapper: {
        position: 'relative',
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(154, 115, 143, 0.2)',
    },
    header: {
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.xl,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: Spacing.xxl,
        zIndex: 1,
        position: 'relative',
    },
    headerLeft: { flex: 1, minWidth: 250 },
    headerLabel: {
        fontSize: FontSizes.md,
        letterSpacing: 4,
        color: Colors.accentLight,
        fontWeight: '800',
        marginBottom: Spacing.sm,
        textTransform: 'uppercase',
    },
    headerTitle: {
        fontSize: FontSizes.display,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -1,
        ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
    },
    headerDescription: {
        flex: 1.5,
        fontSize: FontSizes.xl,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: FontSizes.xl * 1.5,
        minWidth: 300,
    },

    /* Cartes de contact */
    contactCardsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: Spacing.xxl,
        gap: Spacing.xxl,
        justifyContent: 'center',
    },
    contactCard: {
        flexBasis: '100%',
        minWidth: 280,
    },
    contactCardInner: {
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        gap: Spacing.sm,
        ...(Platform.OS === 'web'
            ? {
                shadowColor: Colors.shadowMedium,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 1,
                shadowRadius: 30,
                cursor: 'pointer' as any,
                transition: 'all 0.3s ease' as any,
            }
            : { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 15 }),
    },
    contactCardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    contactCardIcon: {
        fontSize: FontSizes.xxxl,
        marginBottom: Spacing.xs,
    },
    contactCardLabel: {
        fontSize: FontSizes.sm,
        letterSpacing: 3,
        color: Colors.accent,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    contactCardValue: {
        fontSize: FontSizes.md,
        color: Colors.textPrimary,
        fontWeight: '600',
        textAlign: 'center',
    },
    contactCardArrow: {
        marginTop: Spacing.sm,
        backgroundColor: Colors.accentSubtle,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.borderAccent,
    },
    contactCardArrowText: {
        fontSize: FontSizes.lg,
        color: Colors.accent,
        fontWeight: '800',
    },

    /* Section formulaire */
    formSection: {
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.section,
        paddingBottom: Spacing.xl,
    },
    formSectionHeader: {
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

    formRow: {
        gap: Spacing.xxl,
        alignItems: 'stretch',
    },
    formCard: {
        flex: 2,
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xxl,
        borderWidth: 2,
        borderColor: Colors.border,
        gap: Spacing.lg,
        ...(Platform.OS === 'web'
            ? { shadowColor: Colors.shadowMedium, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 30 }
            : { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 15 }),
    },

    inputGroup: {
        gap: Spacing.xs,
    },
    inputLabel: {
        fontSize: FontSizes.sm,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    textInput: {
        backgroundColor: Colors.bgSecondary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSizes.md,
        color: Colors.textPrimary,
        borderWidth: 2,
        borderColor: Colors.borderSubtle,
        ...(Platform.OS === 'web' ? { outlineStyle: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' } as any : {}),
    },
    textInputFocused: {
        borderColor: Colors.accent,
        ...(Platform.OS === 'web' ? { boxShadow: `0 0 0 3px ${Colors.accentSubtle}` } as any : {}),
    },
    textArea: {
        minHeight: 160,
        paddingTop: Spacing.md,
    },

    submitButton: {
        backgroundColor: Colors.bgDark,
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.sm,
        ...(Platform.OS === 'web' ? { cursor: 'pointer', transition: 'all 0.3s ease' } as any : {}),
    },
    submitButtonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    submitButtonDisabled: {
        backgroundColor: Colors.bgSecondary,
        borderWidth: 2,
        borderColor: Colors.borderSubtle,
    },
    submitButtonSuccess: {
        backgroundColor: '#2D5A3D',
    },
    submitButtonText: {
        fontSize: FontSizes.lg,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    submitButtonTextDisabled: {
        color: Colors.textMuted,
    },

    /* Aside */
    asideCard: {
        flex: 1,
        backgroundColor: Colors.bgDark,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xxl,
        gap: Spacing.md,
        ...(Platform.OS === 'web'
            ? { shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 1, shadowRadius: 40 }
            : { elevation: 8 }),
    },
    asideIconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(154, 115, 143, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: Spacing.sm,
        borderWidth: 2,
        borderColor: 'rgba(154, 115, 143, 0.25)',
    },
    asideIcon: {
        fontSize: FontSizes.xxxl,
    },
    asideTitle: {
        fontSize: FontSizes.xxl,
        fontWeight: '800',
        color: Colors.textLight,
        textAlign: 'center',
        ...(Platform.OS === 'web' ? { fontFamily: "Georgia, 'Times New Roman', serif" } : {}),
    },
    asideDivider: {
        width: 80,
        height: 4,
        backgroundColor: Colors.accent,
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: Spacing.sm,
    },
    asideText: {
        fontSize: FontSizes.md,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: FontSizes.md * 1.6,
        textAlign: 'center',
    },
    asideInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
    },
    asideInfoDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.accent,
    },
    asideInfoText: {
        fontSize: FontSizes.md,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '600',
        flex: 1,
    },
    errorText: {
        fontSize: FontSizes.sm,
        color: '#E05C5C',
        marginTop: Spacing.xs,
        fontWeight: '600',
    },
    textInputError: {
        borderColor: '#E05C5C',
    },
});
