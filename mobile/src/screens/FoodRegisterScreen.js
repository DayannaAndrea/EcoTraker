import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";
import Brand from "../components/Brand";
import SectionLabel from "../components/SectionLabel";
import ProfessionalChart from "../components/ProfessionalChart";
import { colors } from "../theme/colors";
import { clearWebFocus } from "../utils/webFocus";

const foodTypes = [
  { name: "Carne de res", factor: 6.0, code: "RES" },
  { name: "Pollo", factor: 1.5, code: "POL" },
  { name: "Pescado", factor: 1.2, code: "PES" },
  { name: "Vegetariana", factor: 0.7, code: "VEG" },
  { name: "Vegana", factor: 0.4, code: "VGN" }
];

const chartSets = {
  Hoy: [
    { label: "08", value: 2.2 },
    { label: "10", value: 1.4 },
    { label: "12", value: 2.8 },
    { label: "14", value: 1.8 },
    { label: "16", value: 3.4 },
    { label: "18", value: 2.5 },
    { label: "20", value: 3.8 }
  ],
  Semana: [
    { label: "L", value: 6.8 },
    { label: "M", value: 8.1 },
    { label: "M", value: 5.6 },
    { label: "J", value: 9.4 },
    { label: "V", value: 7.2 },
    { label: "S", value: 4.7 },
    { label: "D", value: 6.3 }
  ],
  Mes: [
    { label: "01", value: 7.1 },
    { label: "05", value: 6.3 },
    { label: "10", value: 8.2 },
    { label: "15", value: 5.5 },
    { label: "20", value: 7.8 },
    { label: "25", value: 4.9 },
    { label: "30", value: 6.6 }
  ]
};

export default function FoodRegisterScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 980;
  const [food, setFood] = useState("Vegetariana");
  const [quantity, setQuantity] = useState("1");
  const [period, setPeriod] = useState("Semana");
  const [records, setRecords] = useState([]);

  const selected = foodTypes.find(item => item.name === food);
  const preview = (selected?.factor || 0) * (Number(quantity) || 0);
  const total = useMemo(
    () => records.reduce((sum, item) => sum + item.co2, 0),
    [records]
  );
  const chart = chartSets[period];
  const average = chart.reduce((sum, point) => sum + point.value, 0) / chart.length;
  const peak = chart.reduce((best, point) => point.value > best.value ? point : best, chart[0]);

  const addRecord = () => {
    const portions = Math.max(1, Math.min(20, Number(quantity) || 1));

    setRecords(current => [
      {
        id: `${Date.now()}`,
        food,
        portions,
        co2: (selected?.factor || 0) * portions
      },
      ...current
    ]);

    setQuantity("1");
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={[styles.shell, desktop && styles.shellDesktop]}>
            <View style={styles.header}>
              <Brand compact />
              <View style={styles.headerRight}>
                <View style={styles.activePill}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>SEGUIMIENTO ACTIVO</Text>
                </View>
                <TouchableOpacity
                  style={styles.avatar}
                  onPress={() => { clearWebFocus(); navigation.navigate("Login"); }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require("../../assets/images/user-avatar.png")}
                    style={styles.avatarImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pageTitleRow}>
              <View>
                <SectionLabel>DASHBOARD PERSONAL</SectionLabel>
                <Text style={styles.pageTitle}>Registro de comidas</Text>
              </View>
              <Text style={styles.pageSubtitle}>Impacto estimado</Text>
            </View>

            <View style={[styles.analytics, desktop && styles.analyticsDesktop]}>
              <View style={[styles.metricPanel, desktop && styles.metricPanelDesktop]}>
                <Text style={styles.metricKicker}>IMPACTO ACUMULADO</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricValue}>{total.toFixed(1)}</Text>
                  <View style={styles.metricUnitBox}>
                    <Text style={styles.metricUnit}>KG CO₂</Text>
                    <Text style={styles.metricUnitSub}>período actual</Text>
                  </View>
                </View>

                <View style={styles.smallStats}>
                  <View>
                    <Text style={styles.smallValue}>{average.toFixed(1)}</Text>
                    <Text style={styles.smallLabel}>PROMEDIO</Text>
                  </View>
                  <View style={styles.smallDivider} />
                  <View>
                    <Text style={styles.smallValue}>{peak.value.toFixed(1)}</Text>
                    <Text style={styles.smallLabel}>PICO</Text>
                  </View>
                  <View style={styles.smallDivider} />
                  <View>
                    <Text style={styles.smallValue}>{records.length}</Text>
                    <Text style={styles.smallLabel}>REGISTROS</Text>
                  </View>
                </View>
              </View>

              <View style={styles.chartPanel}>
                <View style={styles.chartHeader}>
                  <View>
                    <Text style={styles.chartTitle}>Evolución del impacto</Text>
                    <Text style={styles.chartSubtitle}>Comportamiento estimado del período</Text>
                  </View>
                  <View style={styles.chartLegend}>
                    <View style={styles.legendDot} />
                    <Text style={styles.legendText}>KG CO₂</Text>
                  </View>
                </View>

                <ProfessionalChart data={chart} />
              </View>
            </View>

            <View style={styles.periods}>
              {["Hoy", "Semana", "Mes"].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setPeriod(item)}
                  activeOpacity={0.82}
                  style={[styles.period, period === item && styles.periodActive]}
                >
                  <Text style={[styles.periodText, period === item && styles.periodTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.columns, desktop && styles.columnsDesktop]}>
              <View style={styles.column}>
                <View style={styles.sectionHead}>
                  <View>
                    <SectionLabel>NUEVO REGISTRO</SectionLabel>
                    <Text style={styles.sectionTitle}>Añadir comida</Text>
                  </View>
                  <View style={styles.preview}>
                    <Text style={styles.previewValue}>{preview.toFixed(1)}</Text>
                    <Text style={styles.previewUnit}>KG CO₂</Text>
                  </View>
                </View>

                <View style={styles.card}>
                  <Text style={styles.formLabel}>CATEGORÍA</Text>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.foodList}
                  >
                    {foodTypes.map(item => (
                      <TouchableOpacity
                        key={item.name}
                        onPress={() => setFood(item.name)}
                        activeOpacity={0.82}
                        style={[styles.foodCard, food === item.name && styles.foodActive]}
                      >
                        <View style={[styles.code, food === item.name && styles.codeActive]}>
                          <Text style={[styles.codeText, food === item.name && styles.codeTextActive]}>
                            {item.code}
                          </Text>
                        </View>
                        <Text style={[styles.foodName, food === item.name && styles.foodNameActive]}>
                          {item.name}
                        </Text>
                        <Text style={styles.factorText}>{item.factor.toFixed(1)} kg / porción</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.quantityHeader}>
                    <Text style={styles.formLabel}>PORCIONES</Text>
                    <Text style={styles.factor}>Factor base {selected?.factor.toFixed(1)} kg</Text>
                  </View>

                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => setQuantity(String(Math.max(1, Number(quantity || 1) - 1)))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.qtyText}>−</Text>
                    </TouchableOpacity>

                    <View style={styles.quantityBox}>
                      <TextInput
                        value={quantity}
                        onChangeText={value => setQuantity(value.replace(/[^0-9]/g, ""))}
                        keyboardType="number-pad"
                        style={styles.quantityInput}
                        maxLength={2}
                      />
                      <Text style={styles.portions}>PORCIONES</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => setQuantity(String(Math.min(20, Number(quantity || 0) + 1)))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.save}
                    onPress={addRecord}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.saveText}>Guardar registro</Text>
                    <View style={styles.saveArrow}>
                      <Text style={styles.saveArrowText}>→</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.hint}>
                    <View style={styles.hintMark}><Text style={styles.hintMarkText}>i</Text></View>
                    <Text style={styles.hintText}>
                      Vista de demostración. El cálculo y la persistencia serán conectados por el backend.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.column}>
                <View style={styles.sectionHead}>
                  <View>
                    <SectionLabel>ACTIVIDAD</SectionLabel>
                    <Text style={styles.sectionTitle}>Historial reciente</Text>
                  </View>
                  <Text style={styles.count}>{records.length} registros</Text>
                </View>

                <View style={styles.history}>
                  {records.length === 0 ? (
                    <View style={styles.empty}>
                      <View style={styles.emptyMark}>
                        <View style={styles.emptyInner} />
                      </View>
                      <Text style={styles.emptyTitle}>Tu historial está preparado</Text>
                      <Text style={styles.emptyText}>
                        Los registros aparecerán aquí cuando agregues tus comidas.
                      </Text>
                    </View>
                  ) : (
                    records.map(item => (
                      <View style={styles.record} key={item.id}>
                        <View style={styles.recordCode}>
                          <Text style={styles.recordCodeText}>{item.food.slice(0, 3).toUpperCase()}</Text>
                        </View>
                        <View style={styles.recordInfo}>
                          <Text style={styles.recordName}>{item.food}</Text>
                          <Text style={styles.recordMeta}>
                            {item.portions} {item.portions === 1 ? "porción" : "porciones"}
                          </Text>
                        </View>
                        <View style={styles.recordImpact}>
                          <Text style={styles.recordNumber}>{item.co2.toFixed(1)}</Text>
                          <Text style={styles.recordUnit}>KG CO₂</Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => { clearWebFocus(); navigation.navigate("Login"); }} activeOpacity={0.7}>
                <Text style={styles.logout}>CERRAR SESIÓN</Text>
              </TouchableOpacity>
              <View style={styles.footerLine} />
              <Text style={styles.footerVersion}>03 / COMIDAS</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 17,
    paddingVertical: 18,
    paddingBottom: 34
  },
  shell: { width: "100%", maxWidth: 760, alignSelf: "center" },
  shellDesktop: { maxWidth: 1260 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  activePill: {
    height: 29,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: "rgba(9,29,23,0.72)",
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.mint },
  activeText: { color: "#82A795", fontSize: 6.4, fontWeight: "900", letterSpacing: .7 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#17382E",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 13
  },
  pageTitleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 17
  },
  pageTitle: { color: colors.text, fontSize: 25, fontWeight: "900", marginTop: 4 },
  pageSubtitle: { color: "#71877D", fontSize: 8.5, fontWeight: "800" },
  analytics: {
    borderRadius: 27,
    backgroundColor: "#0E2B22",
    borderWidth: 1,
    borderColor: "rgba(145,220,187,0.12)",
    overflow: "hidden"
  },
  analyticsDesktop: {
    flexDirection: "row",
    padding: 1
  },
  metricPanel: {
    minHeight: 136,
    padding: 19,
    justifyContent: "flex-start"
  },
  metricPanelDesktop: {
    flex: 0.78,
    minWidth: 210,
    minHeight: 0
  },
  chartPanel: {
    minHeight: 218,
    padding: 14,
    marginTop: 1
  },

  heroKicker: {},
  metricKicker: {
    color: "#86AC9B",
    fontSize: 7.4,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 7,
    marginTop: 4
  },
  metricValue: {
    color: "#F5FBF8",
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: -1.3
  },
  metricUnitBox: { marginBottom: 4 },
  metricUnit: { color: "#B8D8C9", fontSize: 9, fontWeight: "900" },
  metricUnitSub: { color: "#719486", fontSize: 6.5, marginTop: 1 },
  smallStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  smallValue: { color: "#D5EADF", fontSize: 16, fontWeight: "900" },
  smallLabel: { color: "#77998A", fontSize: 6.1, fontWeight: "900", letterSpacing: .6, marginTop: 2 },
  smallDivider: { width: 1, height: 25, backgroundColor: "rgba(255,255,255,0.12)" },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  chartTitle: { color: "#EAF3EE", fontSize: 12, fontWeight: "900" },
  chartSubtitle: { color: "#7E9F90", fontSize: 8, marginTop: 2 },
  chartLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    height: 21,
    borderRadius: 8,
    backgroundColor: "rgba(131,230,177,0.07)"
  },
  legendDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.mint },
  legendText: { color: "#8CC3A7", fontSize: 6.3, fontWeight: "900" },
  periods: {
    marginTop: 14,
    padding: 4,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    gap: 4
  },
  period: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  periodActive: {
    backgroundColor: "#173D31"
  },
  periodText: { color: "#758A81", fontSize: 9.5, fontWeight: "800" },
  periodTextActive: { color: "#BCECD0" },
  columns: { marginTop: 24, gap: 22 },
  columnsDesktop: { flexDirection: "row", alignItems: "flex-start" },
  column: { flex: 1 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: "900", marginTop: 4 },
  preview: { alignItems: "flex-end" },
  previewValue: { color: colors.mint, fontSize: 18, fontWeight: "900" },
  previewUnit: { color: "#7C9188", fontSize: 6.3, fontWeight: "900", letterSpacing: .8 },
  card: {
    marginTop: 13,
    backgroundColor: "rgba(10,27,22,0.91)",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20
  },
  formLabel: {
    color: "#70837A",
    fontSize: 7.5,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 10
  },
  foodList: { gap: 8, paddingBottom: 4 },
  foodCard: {
    width: 119,
    height: 82,
    padding: 9,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: "rgba(167,215,195,0.1)"
  },
  foodActive: {
    backgroundColor: "rgba(92,193,141,0.1)",
    borderColor: "rgba(131,230,177,0.29)"
  },
  code: {
    width: 29,
    height: 21,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center"
  },
  codeActive: { backgroundColor: "rgba(131,230,177,0.16)" },
  codeText: { color: "#85988F", fontSize: 6.3, fontWeight: "900" },
  codeTextActive: { color: colors.mint },
  foodName: { color: "#71847B", fontSize: 9.4, fontWeight: "900", marginTop: 9 },
  foodNameActive: { color: "#D7F3E3" },
  factorText: { color: "#64776E", fontSize: 6.9, marginTop: 3 },
  quantityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 17
  },
  factor: { color: "#73877D", fontSize: 7.8, marginBottom: 10 },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyButton: {
    width: 45,
    height: 46,
    borderRadius: 13,
    backgroundColor: "rgba(131,230,177,0.08)",
    borderWidth: 1,
    borderColor: "rgba(131,230,177,0.1)",
    alignItems: "center",
    justifyContent: "center"
  },
  qtyText: { color: colors.mint, fontSize: 20 },
  quantityBox: {
    flex: 1,
    height: 46,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: "rgba(167,215,195,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  quantityInput: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    minWidth: 25
  },
  portions: { color: "#71847B", fontSize: 6.4, fontWeight: "900", marginLeft: 4 },
  save: {
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.mint,
    marginTop: 17,
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  saveText: { color: "#072218", fontSize: 12.5, fontWeight: "900" },
  saveArrow: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "rgba(6,47,31,0.15)",
    justifyContent: "center",
    alignItems: "center"
  },
  saveArrowText: { color: "#072218", fontSize: 19, fontWeight: "900" },
  hint: { marginTop: 13, flexDirection: "row", gap: 7, alignItems: "flex-start" },
  hintMark: {
    width: 15,
    height: 15,
    borderRadius: 5,
    backgroundColor: "rgba(131,230,177,0.1)",
    justifyContent: "center",
    alignItems: "center"
  },
  hintMarkText: { color: "#76AD92", fontSize: 8, fontWeight: "900" },
  hintText: { flex: 1, color: "#667970", fontSize: 8.1, lineHeight: 13 },
  count: { color: "#768980", fontSize: 8.2, fontWeight: "800" },
  history: {
    minHeight: 232,
    marginTop: 13,
    borderRadius: 22,
    backgroundColor: "rgba(10,27,22,0.91)",
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden"
  },
  empty: {
    minHeight: 232,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28
  },
  emptyMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(131,230,177,0.08)",
    justifyContent: "center",
    alignItems: "center"
  },
  emptyInner: {
    width: 20,
    height: 20,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#6BB18D"
  },
  emptyTitle: { color: "#DCEDE5", fontSize: 13, fontWeight: "900", marginTop: 12 },
  emptyText: {
    color: "#72867D",
    fontSize: 9.5,
    lineHeight: 15,
    textAlign: "center",
    maxWidth: 245,
    marginTop: 5
  },
  record: {
    minHeight: 73,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(190,220,208,0.07)"
  },
  recordCode: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "rgba(131,230,177,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11
  },
  recordCodeText: { color: "#81BA9D", fontSize: 6.7, fontWeight: "900" },
  recordInfo: { flex: 1 },
  recordName: { color: "#DDEDE6", fontSize: 11.5, fontWeight: "900" },
  recordMeta: { color: "#71847B", fontSize: 8.7, marginTop: 3 },
  recordImpact: { alignItems: "flex-end" },
  recordNumber: { color: colors.mint, fontSize: 14, fontWeight: "900" },
  recordUnit: { color: "#75887F", fontSize: 6.3, fontWeight: "900", letterSpacing: .7 },
  footer: {
    marginTop: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 9
  },
  logout: { color: "#73A088", fontSize: 7.6, fontWeight: "900", letterSpacing: .7 },
  footerLine: { flex: 1, height: 1, backgroundColor: "rgba(129,166,149,0.15)" },
  footerVersion: { color: "#6B8077", fontSize: 6.8, fontWeight: "800", letterSpacing: .7 }
});
