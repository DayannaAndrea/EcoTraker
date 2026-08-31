import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Line
} from "react-native-svg";
import { colors } from "../theme/colors";

export default function ProfessionalChart({ data }) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(290, Math.min(width - 78, 610));
  const chartHeight = 220;
  const padX = 10;
  const padTop = 18;
  const padBottom = 31;
  const plotWidth = chartWidth - padX * 2;
  const plotHeight = chartHeight - padTop - padBottom;
  const max = Math.max(...data.map(item => item.value)) * 1.18;

  const points = data.map((item, index) => {
    const x = padX + (plotWidth * index) / (data.length - 1);
    const y = padTop + plotHeight - (item.value / max) * plotHeight;
    return { ...item, x, y };
  });

  const line = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const midX = (prev.x + point.x) / 2;
    return `${path} C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  const area = `${line} L ${points[points.length - 1].x} ${chartHeight - padBottom} L ${points[0].x} ${chartHeight - padBottom} Z`;

  return (
    <View style={[styles.wrap, { width: chartWidth }]}>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.mint} stopOpacity="0.22" />
            <Stop offset="1" stopColor={colors.mint} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {[0, 1, 2, 3].map(level => {
          const y = padTop + (plotHeight * level) / 3;
          return (
            <Line
              key={level}
              x1={padX}
              y1={y}
              x2={chartWidth - padX}
              y2={y}
              stroke="rgba(197,235,217,0.09)"
              strokeWidth="1"
            />
          );
        })}

        <Path d={area} fill="url(#areaFill)" />
        <Path
          d={line}
          fill="none"
          stroke={colors.mint}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map(point => (
          <Circle
            key={`point-${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r="5.5"
            fill={colors.nightSoft}
            stroke={colors.mint}
            strokeWidth="2.5"
          />
        ))}
      </Svg>

      <View style={styles.labels}>
        {points.map(point => (
          <View key={`label-${point.x}-${point.y}`} style={styles.labelBlock}>
            <Text style={styles.value}>{point.value.toFixed(1)}</Text>
            <Text style={styles.label}>{point.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "center"
  },
  labels: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  labelBlock: {
    alignItems: "center",
    width: 35
  },
  value: {
    color: "#82A596",
    fontSize: 7.5,
    fontWeight: "800"
  },
  label: {
    color: "#6F8B80",
    fontSize: 7.5,
    fontWeight: "900",
    marginTop: 3
  }
});
