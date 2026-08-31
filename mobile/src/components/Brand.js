import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function Brand({ compact = false }) {
  return (
    <View style={styles.row}>
      <Image
        source={require("../../assets/images/ecotracker-logo.png")}
        style={[styles.logo, compact && styles.logoCompact]}
        resizeMode="contain"
      />
      <View>
        <Text style={[styles.name, compact && styles.nameCompact]}>ECOTRACKER</Text>
        <Text style={styles.sub}>PERSONAL IMPACT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14
  },
  logoCompact: {
    width: 39,
    height: 39,
    borderRadius: 12
  },
  name: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2
  },
  nameCompact: {
    fontSize: 10.5
  },
  sub: {
    color: colors.textMuted,
    fontSize: 6.5,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 2
  }
});
