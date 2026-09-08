import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";
import Brand from "../components/Brand";
import SectionLabel from "../components/SectionLabel";
import { colors } from "../theme/colors";
import { clearWebFocus } from "../utils/webFocus";

const RANKING_DATA = [
  { id: "valentina", name: "Valentina", footprint: 32.4 },
  { id: "jeifre", name: "Jeifre", footprint: 28.7, me: true },
  { id: "mateo", name: "Mateo", footprint: 24.9 },
  { id: "sofia", name: "Sofía", footprint: 21.8 },
  { id: "daniel", name: "Daniel", footprint: 18.6 },
  { id: "laura", name: "Laura", footprint: 15.2 }
];

export default function RankingScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const [selectedId, setSelectedId] = useState("jeifre");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  const ranking = useMemo(
    () =>
      [...RANKING_DATA]
        .sort((a, b) => Number(a.footprint) - Number(b.footprint))
        .map((item, index) => ({ ...item, position: index + 1 })),
    []
  );

  const selected = ranking.find((item) => item.id === selectedId) || ranking[0];
  const me = ranking.find((item) => item.me) || ranking[0];
  const leader = ranking[0];
  const average = ranking.reduce((sum, item) => sum + item.footprint, 0) / ranking.length;
  const distanceToLeader = Math.max(0, me.footprint - leader.footprint);
  const leaderProgress = leader.footprint > 0 ? 1 : 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const openSelected = (id) => {
    setSelectedId(id);
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <Animated.View
            style={[
              styles.shell,
              desktop && styles.shellDesktop,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.header}>
              <Brand compact />
              <TouchableOpacity
                activeOpacity={0.82}
                style={styles.backButton}
                onPress={() => {
                  clearWebFocus();
                  navigation.navigate("Home");
                }}
              >
                <Text style={styles.backArrow}>←</Text>
                <Text style={styles.backText}>INICIO</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.hero}>
              <SectionLabel>COMPETENCIA AMBIENTAL</SectionLabel>
              <View style={styles.heroTitleRow}>
                <View style={styles.heroTextBlock}>
                  <Text style={styles.title}>Ranking EcoTracker</Text>
                  <Text style={styles.subtitle}>
                    La menor huella de CO₂ ocupa la mejor posición. Toca un usuario para ver su detalle.
                  </Text>
                </View>
                <View style={styles.periodBadge}>
                  <Text style={styles.periodBadgeTop}>PERÍODO</Text>
                  <Text style={styles.periodBadgeValue}>7 DÍAS</Text>
                </View>
              </View>
            </View>

            <View style={[styles.statsGrid, desktop && styles.statsGridDesktop]}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>TU POSICIÓN</Text>
                <Text style={styles.statValue}>#{me.position}</Text>
                <Text style={styles.statHint}>de {ranking.length} usuarios</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>TU HUELLA</Text>
                <Text style={styles.statValue}>{me.footprint.toFixed(1)}</Text>
                <Text style={styles.statHint}>KG CO₂ · SEMANA</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>AL #1</Text>
                <Text style={styles.statValue}>{distanceToLeader.toFixed(1)}</Text>
                <Text style={styles.statHint}>KG CO₂ DE DIFERENCIA</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>PROMEDIO</Text>
                <Text style={styles.statValue}>{average.toFixed(1)}</Text>
                <Text style={styles.statHint}>KG CO₂ · GRUPO</Text>
              </View>
            </View>

            <View style={[styles.podiumSection, desktop && styles.podiumSectionDesktop]}>
              <View style={styles.sectionHeader}>
                <View>
                  <SectionLabel>LÍDERES</SectionLabel>
                  <Text style={styles.sectionTitle}>Top 3 de la semana</Text>
                </View>
                <Text style={styles.sectionHint}>Menor huella = mejor posición</Text>
              </View>

              <View style={styles.podium}>
                {[ranking[1], ranking[0], ranking[2]].map((item) => {
                  const podiumRank = item.position;
                  const isFirst = podiumRank === 1;
                  const isSelected = selected.id === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.84}
                      style={[
                        styles.podiumItem,
                        isFirst && styles.podiumFirst,
                        isSelected && styles.podiumSelected,
                        !isFirst && styles.podiumSide
                      ]}
                      onPress={() => openSelected(item.id)}
                    >
                      <View style={[styles.podiumRank, isFirst && styles.podiumRankFirst]}>
                        <Text style={[styles.podiumRankText, isFirst && styles.podiumRankTextFirst]}>
                          #{podiumRank}
                        </Text>
                      </View>
                      <View style={styles.podiumAvatar}>
                        <Text style={styles.podiumAvatarText}>
                          {item.name.slice(0, 1).toUpperCase()}
                        </Text>
                      </View>
                      <Text numberOfLines={1} style={styles.podiumName}>
                        {item.name}{item.me ? " · Tú" : ""}
                      </Text>
                      <Text style={styles.podiumImpact}>{item.footprint.toFixed(1)}</Text>
                      <Text style={styles.podiumUnit}>KG CO₂</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.selectedCard}>
              <View style={styles.selectedTop}>
                <View>
                  <SectionLabel>USUARIO SELECCIONADO</SectionLabel>
                  <Text style={styles.selectedName}>
                    {selected.name}{selected.me ? " · Tú" : ""}
                  </Text>
                </View>
                <View style={styles.selectedPosition}>
                  <Text style={styles.selectedPositionLabel}>POSICIÓN</Text>
                  <Text style={styles.selectedPositionValue}>#{selected.position}</Text>
                </View>
              </View>

              <View style={styles.selectedMetrics}>
                <View style={styles.selectedMetric}>
                  <Text style={styles.selectedMetricLabel}>HUELLA SEMANAL</Text>
                  <Text style={styles.selectedMetricValue}>{selected.footprint.toFixed(1)} KG CO₂</Text>
                </View>
                <View style={styles.selectedMetricDivider} />
                <View style={styles.selectedMetric}>
                  <Text style={styles.selectedMetricLabel}>VS. PROMEDIO</Text>
                  <Text
                    style={[
                      styles.selectedMetricValue,
                      selected.footprint <= average
                        ? styles.positiveMetric
                        : styles.neutralMetric
                    ]}
                  >
                    {Math.abs(selected.footprint - average).toFixed(1)} KG
                    {selected.footprint <= average ? " MENOS" : " MÁS"}
                  </Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.max(8, Math.min(100, (leaderProgress && (selected.footprint / Math.max(ranking[ranking.length - 1].footprint, 1))) * 100))}%`
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressHint}>
                {selected.position === 1
                  ? "Es la huella más baja del grupo."
                  : `${(selected.footprint - leader.footprint).toFixed(1)} kg CO₂ por encima del líder.`}
              </Text>
            </View>

            <View style={styles.listCard}>
              <View style={styles.sectionHeader}>
                <View>
                  <SectionLabel>CLASIFICACIÓN</SectionLabel>
                  <Text style={styles.sectionTitle}>Huella semanal</Text>
                </View>
                <View style={styles.listBadge}>
                  <Text style={styles.listBadgeText}>{ranking.length} USUARIOS</Text>
                </View>
              </View>

              <View style={styles.rows}>
                {ranking.map((item) => {
                  const active = item.id === selected.id;
                  const percentage =
                    (item.footprint / Math.max(ranking[ranking.length - 1].footprint, 1)) * 100;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.82}
                      style={[styles.row, active && styles.rowActive]}
                      onPress={() => openSelected(item.id)}
                    >
                      <View
                        style={[
                          styles.rankBadge,
                          item.position <= 3 && styles.rankBadgeTop,
                          active && styles.rankBadgeActive
                        ]}
                      >
                        <Text
                          style={[
                            styles.rankNumber,
                            item.position <= 3 && styles.rankNumberTop,
                            active && styles.rankNumberActive
                          ]}
                        >
                          {item.position}
                        </Text>
                      </View>

                      <View style={styles.userBlock}>
                        <View style={styles.userNameRow}>
                          <Text style={styles.userName}>
                            {item.name}{item.me ? " · Tú" : ""}
                          </Text>
                          {item.me && (
                            <View style={styles.meBadge}>
                              <Text style={styles.meBadgeText}>TÚ</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.userPosition}>
                          {item.position === 1 ? "MENOR HUELLA" : `POSICIÓN ${item.position}`}
                        </Text>
                        <View style={styles.miniTrack}>
                          <View style={[styles.miniFill, { width: `${percentage}%` }]} />
                        </View>
                      </View>

                      <View style={styles.scoreBlock}>
                        <Text style={styles.score}>{item.footprint.toFixed(1)}</Text>
                        <Text style={styles.scoreUnit}>KG CO₂</Text>
                      </View>

                      <Text style={styles.rowArrow}>{active ? "−" : "+"}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalAccent} />
              <View style={styles.goalContent}>
                <Text style={styles.goalLabel}>OBJETIVO</Text>
                <Text style={styles.goalTitle}>Mejora tu posición reduciendo tu huella.</Text>
                <Text style={styles.goalText}>
                  Registra tus comidas y viajes para mantener actualizado tu impacto semanal y subir posiciones.
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>ECOTRACKER</Text>
              <View style={styles.footerLine} />
              <Text style={styles.footerText}>02 / RANKING</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 20,
    paddingBottom: 34
  },
  shell: {
    width: "100%",
    maxWidth: 820,
    alignSelf: "center"
  },
  shellDesktop: { maxWidth: 1180 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28
  },
  backButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 11,
    backgroundColor: colors.white10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  backArrow: { color: colors.accent, fontSize: 16, fontWeight: "900" },
  backText: {
    color: colors.textMuted,
    fontSize: 6.7,
    fontWeight: "900",
    letterSpacing: 0.9
  },

  hero: { marginBottom: 18 },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 6
  },
  heroTextBlock: { flex: 1 },
  title: {
    color: colors.cream,
    fontSize: 32,
    lineHeight: 37,
    fontWeight: "900",
    letterSpacing: -0.8
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 10.5,
    lineHeight: 16,
    maxWidth: 760,
    marginTop: 7
  },
  periodBadge: {
    minWidth: 92,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.primary10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center"
  },
  periodBadgeTop: {
    color: colors.textMuted,
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  periodBadgeValue: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 3,
    letterSpacing: 0.8
  },

  statsGrid: {
    gap: 10,
    marginBottom: 14
  },
  statsGridDesktop: {
    flexDirection: "row"
  },
  statCard: {
    flex: 1,
    minHeight: 105,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.cocoa,
    borderWidth: 1,
    borderColor: colors.border
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 6.8,
    fontWeight: "900",
    letterSpacing: 1
  },
  statValue: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 10,
    letterSpacing: -0.8
  },
  statHint: {
    color: colors.textMuted,
    fontSize: 7.3,
    marginTop: 2
  },

  podiumSection: {
    marginBottom: 14,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border
  },
  podiumSectionDesktop: {
    paddingHorizontal: 22
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14
  },
  sectionTitle: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 3
  },
  sectionHint: {
    color: colors.textMuted,
    fontSize: 7.3,
    marginTop: 3
  },
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10
  },
  podiumItem: {
    flex: 1,
    minHeight: 168,
    borderRadius: 19,
    backgroundColor: colors.cocoa,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 12
  },
  podiumFirst: {
    minHeight: 190,
    backgroundColor: colors.surface,
    borderColor: colors.accent
  },
  podiumSide: {
    transform: [{ translateY: 10 }]
  },
  podiumSelected: {
    borderColor: colors.accent
  },
  podiumRank: {
    position: "absolute",
    top: 10,
    left: 10,
    minWidth: 35,
    height: 25,
    paddingHorizontal: 8,
    borderRadius: 9,
    backgroundColor: colors.white10,
    justifyContent: "center",
    alignItems: "center"
  },
  podiumRankFirst: {
    backgroundColor: colors.gold12
  },
  podiumRankText: {
    color: colors.textMuted,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.7
  },
  podiumRankTextFirst: {
    color: colors.accent
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9
  },
  podiumAvatarText: {
    color: colors.accent,
    fontSize: 19,
    fontWeight: "900"
  },
  podiumName: {
    color: colors.cream,
    fontSize: 10.5,
    fontWeight: "900",
    maxWidth: "100%"
  },
  podiumImpact: {
    color: colors.accent,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 8
  },
  podiumUnit: {
    color: colors.textMuted,
    fontSize: 5.8,
    fontWeight: "900",
    marginTop: 1
  },

  selectedCard: {
    marginBottom: 14,
    padding: 18,
    borderRadius: 23,
    backgroundColor: colors.cocoa,
    borderWidth: 1,
    borderColor: colors.accent
  },
  selectedTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16
  },
  selectedName: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 3
  },
  selectedPosition: {
    alignItems: "flex-end"
  },
  selectedPositionLabel: {
    color: colors.textMuted,
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  selectedPositionValue: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 2
  },
  selectedMetrics: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16
  },
  selectedMetric: {
    flex: 1
  },
  selectedMetricDivider: {
    width: 1,
    height: 33,
    backgroundColor: colors.border,
    marginHorizontal: 16
  },
  selectedMetricLabel: {
    color: colors.textMuted,
    fontSize: 6.2,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  selectedMetricValue: {
    color: colors.cream,
    fontSize: 12.5,
    fontWeight: "900",
    marginTop: 4
  },
  positiveMetric: { color: colors.accent },
  neutralMetric: { color: colors.gold },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: colors.white10,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: colors.accent
  },
  progressHint: {
    color: colors.textMuted,
    fontSize: 7.3,
    marginTop: 6
  },

  listCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18
  },
  listBadge: {
    paddingHorizontal: 9,
    minHeight: 25,
    borderRadius: 8,
    backgroundColor: colors.primary10,
    justifyContent: "center",
    alignItems: "center"
  },
  listBadgeText: {
    color: colors.accent,
    fontSize: 6.2,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  rows: { gap: 8 },
  row: {
    minHeight: 86,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.cocoa,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center"
  },
  rowActive: {
    borderColor: colors.accent,
    backgroundColor: colors.primary10
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  rankBadgeTop: {
    backgroundColor: colors.gold12
  },
  rankBadgeActive: {
    backgroundColor: colors.primary18
  },
  rankNumber: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "900"
  },
  rankNumberTop: {
    color: colors.accent
  },
  rankNumberActive: {
    color: colors.accent
  },
  userBlock: { flex: 1 },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  userName: {
    color: colors.cream,
    fontSize: 11.5,
    fontWeight: "900"
  },
  meBadge: {
    paddingHorizontal: 6,
    minHeight: 17,
    borderRadius: 6,
    backgroundColor: colors.gold12,
    justifyContent: "center"
  },
  meBadgeText: {
    color: colors.accent,
    fontSize: 5.5,
    fontWeight: "900",
    letterSpacing: 0.7
  },
  userPosition: {
    color: colors.textMuted,
    fontSize: 6.3,
    fontWeight: "900",
    letterSpacing: 0.7,
    marginTop: 3
  },
  miniTrack: {
    width: "100%",
    maxWidth: 270,
    height: 5,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: colors.white10,
    overflow: "hidden"
  },
  miniFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: colors.accent
  },
  scoreBlock: {
    alignItems: "flex-end",
    minWidth: 78,
    marginLeft: 8
  },
  score: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900"
  },
  scoreUnit: {
    color: colors.textMuted,
    fontSize: 6,
    fontWeight: "900",
    marginTop: 1
  },
  rowArrow: {
    width: 22,
    textAlign: "right",
    color: colors.accent,
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8
  },

  goalCard: {
    marginTop: 14,
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.cocoa,
    borderWidth: 1,
    borderColor: colors.border
  },
  goalAccent: {
    width: 4,
    backgroundColor: colors.accent
  },
  goalContent: {
    flex: 1,
    padding: 17
  },
  goalLabel: {
    color: colors.accent,
    fontSize: 6.4,
    fontWeight: "900",
    letterSpacing: 0.9
  },
  goalTitle: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4
  },
  goalText: {
    color: colors.textMuted,
    fontSize: 8.5,
    lineHeight: 14,
    marginTop: 5,
    maxWidth: 760
  },

  footer: {
    marginTop: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 9
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 6.5,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.white10
  }
});
