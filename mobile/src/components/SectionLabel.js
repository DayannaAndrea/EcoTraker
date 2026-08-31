import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function SectionLabel({ children }) {
  return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: colors.mint,
    fontSize: 7.5,
    fontWeight: "900",
    letterSpacing: 1.7
  }
});
