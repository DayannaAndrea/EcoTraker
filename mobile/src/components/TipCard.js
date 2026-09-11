import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const CATEGORY_LABELS = {
  alimentacion: "ALIMENTACIÓN",
  alimentación: "ALIMENTACIÓN",
  transporte: "TRANSPORTE",
  travel: "TRANSPORTE",
  food: "ALIMENTACIÓN"
};

export default function TipCard({ recommendation }) {
  if (!recommendation?.tip || !recommendation?.category) return null;

  const categoryKey = String(recommendation.category).trim().toLowerCase();
  const categoryLabel = CATEGORY_LABELS[categoryKey] || String(recommendation.category).toUpperCase();
  const impact = Number(recommendation.impact);
  const hasImpact = Number.isFinite(impact);

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>TIP AMBIENTAL</Text>
            <Text style={styles.title}>Recomendación para ti</Text>
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{categoryLabel}</Text>
          </View>
        </View>

        {hasImpact && (
          <View style={styles.impactRow}>
            <Text style={styles.impactValue}>{impact.toFixed(1)}</Text>
            <Text style={styles.impactUnit}>KG CO₂ · 7 DÍAS</Text>
          </View>
        )}

        <Text style={styles.tip}>{String(recommendation.tip).trim()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginTop: 18,
    borderRadius: 24,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden"
  },
  accentBar: {
    width: 5,
    backgroundColor: colors.accent
  },
  content: {
    flex: 1,
    padding: 18
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  kicker: {
    color: colors.accent,
    fontSize: 6.8,
    fontWeight: "900",
    letterSpacing: 1.1
  },
  title: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4
  },
  categoryPill: {
    paddingHorizontal: 9,
    minHeight: 25,
    borderRadius: 8,
    backgroundColor: colors.gold12,
    justifyContent: "center",
    alignItems: "center"
  },
  categoryText: {
    color: colors.accent,
    fontSize: 6.3,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  impactRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 7,
    marginTop: 14
  },
  impactValue: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.7
  },
  impactUnit: {
    color: colors.textMuted,
    fontSize: 6.6,
    fontWeight: "900",
    letterSpacing: 0.7
  },
  tip: {
    color: colors.textSoft,
    fontSize: 10.4,
    lineHeight: 17,
    marginTop: 8
  }
});
