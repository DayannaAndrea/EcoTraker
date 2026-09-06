import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export default function AnimatedBackground({ children }) {
  const a = useRef(new Animated.Value(0)).current;
  const b = useRef(new Animated.Value(0)).current;
  const c = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = [
      Animated.loop(Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: 11000, useNativeDriver: false }),
        Animated.timing(a, { toValue: 0, duration: 11000, useNativeDriver: false })
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(b, { toValue: 1, duration: 14000, useNativeDriver: false }),
        Animated.timing(b, { toValue: 0, duration: 14000, useNativeDriver: false })
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(c, { toValue: 1, duration: 12500, useNativeDriver: false }),
        Animated.timing(c, { toValue: 0, duration: 12500, useNativeDriver: false })
      ]))
    ];
    loops.forEach(loop => loop.start());
    return () => {
      loops.forEach(loop => loop.stop());
      [a, b, c].forEach(value => value.stopAnimation());
    };
  }, [a, b, c]);

  const ax = a.interpolate({ inputRange: [0, 1], outputRange: [-18, 30] });
  const ay = a.interpolate({ inputRange: [0, 1], outputRange: [-8, 25] });
  const bx = b.interpolate({ inputRange: [0, 1], outputRange: [20, -28] });
  const by = b.interpolate({ inputRange: [0, 1], outputRange: [18, -22] });
  const cx = c.interpolate({ inputRange: [0, 1], outputRange: [12, -18] });
  const cy = c.interpolate({ inputRange: [0, 1], outputRange: [-18, 22] });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.background, colors.backgroundSoft, colors.surface, colors.primaryDark]}
        start={{ x: 0, y: 0.12 }}
        end={{ x: 1, y: 0.88 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(15,33,24,0)", "rgba(15,33,24,0.18)", "rgba(15,33,24,0.62)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(244,241,222,0.05)", "rgba(244,241,222,0)", "rgba(15,33,24,0.24)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.noPointer, styles.orb, styles.one, { transform: [{ translateX: ax }, { translateY: ay }] }]} />
      <Animated.View style={[styles.noPointer, styles.orb, styles.two, { transform: [{ translateX: bx }, { translateY: by }] }]} />
      <Animated.View style={[styles.noPointer, styles.orb, styles.three, { transform: [{ translateX: cx }, { translateY: cy }] }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  noPointer: { pointerEvents: "none" },
  root: { flex: 1, backgroundColor: colors.primary, overflow: "hidden" },
  orb: { position: "absolute", borderRadius: 999 },
  one: { width: 360, height: 360, top: -220, left: -150, backgroundColor: colors.cream, opacity: 0.12 },
  two: { width: 440, height: 440, bottom: -280, right: -180, backgroundColor: colors.cocoa, opacity: 0.26 },
  three: { width: 230, height: 230, top: "42%", right: -150, backgroundColor: colors.gold, opacity: 0.10 }
});
