import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export default function AnimatedBackground({ variant = "default", children }) {
  const mintX = useRef(new Animated.Value(0)).current;
  const mintY = useRef(new Animated.Value(0)).current;
  const purpleX = useRef(new Animated.Value(0)).current;
  const purpleY = useRef(new Animated.Value(0)).current;
  const blueX = useRef(new Animated.Value(0)).current;
  const blueY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = [
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(mintX, { toValue: 34, duration: 5200, useNativeDriver: false }),
            Animated.timing(mintY, { toValue: 24, duration: 5200, useNativeDriver: false })
          ]),
          Animated.parallel([
            Animated.timing(mintX, { toValue: -10, duration: 4600, useNativeDriver: false }),
            Animated.timing(mintY, { toValue: 0, duration: 4600, useNativeDriver: false })
          ]),
          Animated.parallel([
            Animated.timing(mintX, { toValue: 0, duration: 4000, useNativeDriver: false }),
            Animated.timing(mintY, { toValue: 0, duration: 4000, useNativeDriver: false })
          ])
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(purpleX, { toValue: -30, duration: 6500, useNativeDriver: false }),
            Animated.timing(purpleY, { toValue: -22, duration: 6500, useNativeDriver: false })
          ]),
          Animated.parallel([
            Animated.timing(purpleX, { toValue: 18, duration: 5600, useNativeDriver: false }),
            Animated.timing(purpleY, { toValue: 10, duration: 5600, useNativeDriver: false })
          ]),
          Animated.parallel([
            Animated.timing(purpleX, { toValue: 0, duration: 4400, useNativeDriver: false }),
            Animated.timing(purpleY, { toValue: 0, duration: 4400, useNativeDriver: false })
          ])
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(blueX, { toValue: -22, duration: 5800, useNativeDriver: false }),
            Animated.timing(blueY, { toValue: 26, duration: 5800, useNativeDriver: false })
          ]),
          Animated.parallel([
            Animated.timing(blueX, { toValue: 25, duration: 6000, useNativeDriver: false }),
            Animated.timing(blueY, { toValue: -15, duration: 6000, useNativeDriver: false })
          ]),
          Animated.parallel([
            Animated.timing(blueX, { toValue: 0, duration: 4200, useNativeDriver: false }),
            Animated.timing(blueY, { toValue: 0, duration: 4200, useNativeDriver: false })
          ])
        ])
      )
    ];

    loops.forEach(loop => loop.start());

    return () => {
      loops.forEach(loop => loop.stop());
      [mintX, mintY, purpleX, purpleY, blueX, blueY].forEach(value => value.stopAnimation());
    };
  }, [mintX, mintY, purpleX, purpleY, blueX, blueY]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={
          variant === "login"
            ? [colors.night, "#0C211B", "#16233A"]
            : ["#071613", "#0C201B", "#111E2C"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.noPointer,
          styles.glowMint,
          { transform: [{ translateX: mintX }, { translateY: mintY }, { scale: 1.04 }] }
        ]}
      />

      <Animated.View
        style={[
          styles.noPointer,
          styles.glowPurple,
          { transform: [{ translateX: purpleX }, { translateY: purpleY }, { scale: 1.05 }] }
        ]}
      />

      <Animated.View
        style={[
          styles.noPointer,
          styles.glowBlue,
          { transform: [{ translateX: blueX }, { translateY: blueY }, { scale: 1.03 }] }
        ]}
      />

      <View style={[styles.noPointer, styles.grain]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.night,
    overflow: "hidden"
  },
  noPointer: {
    pointerEvents: "none"
  },
  glowMint: {
    position: "absolute",
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "#155542",
    opacity: 0.28,
    top: -235,
    left: -175
  },
  glowPurple: {
    position: "absolute",
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "#40306F",
    opacity: 0.21,
    bottom: -240,
    right: -170
  },
  glowBlue: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#1C496C",
    opacity: 0.16,
    top: "38%",
    right: -180
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.015)"
  }
});
