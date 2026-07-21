// ============================================================
// LoadingSkeleton — 骨架屏加载占位
// ============================================================

import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, DimensionValue } from "react-native";
import { colors, radius, shadow } from "../../theme/theme";

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: object;
}

function SkeletonBlock({ width = "100%", height = 16, borderRadius = radius.sm, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: colors.gray[200], opacity }, style]}
    />
  );
}

/** StatCard 骨架 */
export function StatCardSkeleton() {
  return (
    <View style={[styles.card, { width: 160 }]}>
      <SkeletonBlock width={80} height={14} />
      <SkeletonBlock width={120} height={30} style={{ marginTop: 8 }} />
      <SkeletonBlock width="100%" height={2} style={{ marginTop: 10 }} />
      <SkeletonBlock width={60} height={12} style={{ marginTop: 6 }} />
    </View>
  );
}

/** SessionCard 骨架 */
export function SessionCardSkeleton() {
  return (
    <View style={[styles.card, { height: 140 }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <SkeletonBlock width={100} height={18} />
        <SkeletonBlock width={50} height={20} borderRadius={radius.full} />
      </View>
      <SkeletonBlock width={140} height={28} style={{ marginTop: 10 }} />
      <SkeletonBlock width="100%" height={40} style={{ marginTop: 12 }} />
    </View>
  );
}

/** 表格行骨架 */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 12, paddingHorizontal: 16, gap: 12 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBlock key={i} width={i === 0 ? 60 : 50 + Math.random() * 40} height={14} />
      ))}
    </View>
  );
}

/** 列表骨架 (多行) */
export function ListSkeleton({ rows = 5, variant = "card" }: { rows?: number; variant?: "card" | "row" }) {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) =>
        variant === "card" ? <SessionCardSkeleton key={i} /> : <TableRowSkeleton key={i} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    padding: 16,
    gap: 4,
    ...shadow.sm,
  },
});
