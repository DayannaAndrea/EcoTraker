import React, { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";
import Brand from "../components/Brand";
import SectionLabel from "../components/SectionLabel";
import ProfessionalChart from "../components/ProfessionalChart";
import { colors } from "../theme/colors";
import { clearWebFocus } from "../utils/webFocus";
import { useImpact } from "../context/ImpactContext";
import { buildImpactChart } from "../utils/dashboardData";

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 980;
  const [period, setPeriod] = useState("Semana");
  const { foodRecords, travelRecords, allRecords, foodTotal, travelTotal, totalImpact } = useImpact();

  const chart = useMemo(() => buildImpactChart(allRecords, period), [allRecords, period]);
  const peak = chart.reduce((best, point) => point.value > best.value ? point : best, { label: "--", value: 0 });

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={[styles.shell, desktop && styles.shellDesktop]}>
            <View style={styles.header}>
              <Brand compact />
              <View style={styles.headerRight}>
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>PANEL ACTIVO</Text>
                </View>
                <TouchableOpacity style={styles.avatar} activeOpacity={0.8} onPress={() => { clearWebFocus(); navigation.navigate("Login"); }}>
                  <Image source={require("../../assets/images/user-avatar.png")} style={styles.avatarImage} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.hero}>
              <View style={{ flex: 1 }}>
                <SectionLabel>CENTRO DE CONTROL</SectionLabel>
                <Text style={styles.title}>Tu impacto, en un solo lugar.</Text>
                <Text style={styles.subtitle}>Consulta comidas, movilidad y la huella total registrada en EcoTracker.</Text>
              </View>
              <View style={styles.dateBadge}>
                <Text style={styles.dateValue}>{allRecords.length}</Text>
                <Text style={styles.dateLabel}>REGISTROS</Text>
              </View>
            </View>

            <View style={styles.kpiGrid}>
              <View style={[styles.kpiCard, styles.kpiMain]}>
                <Text style={styles.kpiLabel}>CO₂ TOTALIZADO</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={styles.kpiValue}>{totalImpact.toFixed(1)}</Text>
                  <Text style={styles.kpiUnit}>KG CO₂</Text>
                </View>
                <Text style={styles.kpiHint}>Comidas + viajes</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>COMIDAS</Text>
                <Text style={styles.secondaryValue}>{foodTotal.toFixed(1)}</Text>
                <Text style={styles.kpiHint}>{foodRecords.length} registros</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>VIAJES</Text>
                <Text style={styles.secondaryValue}>{travelTotal.toFixed(1)}</Text>
                <Text style={styles.kpiHint}>{travelRecords.length} registros</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>PICO</Text>
                <Text style={styles.secondaryValue}>{peak.value.toFixed(1)}</Text>
                <Text style={styles.kpiHint}>Máximo del período</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartTop}>
                <View>
                  <SectionLabel>EVOLUCIÓN</SectionLabel>
                  <Text style={styles.chartTitle}>Impacto total</Text>
                  <Text style={styles.chartSubtitle}>Cada punto combina comidas y viajes registrados.</Text>
                </View>
                <View style={styles.chartBadge}>
                  <View style={styles.chartDot} />
                  <Text style={styles.chartBadgeText}>KG CO₂</Text>
                </View>
              </View>
              <ProfessionalChart data={chart} />
            </View>

            <View style={styles.periods}>
              {["Hoy", "Semana", "Mes"].map(item => (
                <TouchableOpacity key={item} activeOpacity={0.82} onPress={() => setPeriod(item)} style={[styles.period, period === item && styles.periodActive]}>
                  <Text style={[styles.periodText, period === item && styles.periodTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.actionGrid, desktop && styles.actionGridDesktop]}>
              <TouchableOpacity activeOpacity={0.86} style={styles.actionCard} onPress={() => { clearWebFocus(); navigation.navigate("FoodRegister"); }}>
                <View style={styles.actionTop}><Text style={styles.actionNumber}>01</Text><Text style={styles.actionArrow}>→</Text></View>
                <Text style={styles.actionTitle}>Registrar comida</Text>
                <Text style={styles.actionText}>Añade una comida y actualiza tu impacto alimentario.</Text>
                <View style={styles.actionAccent} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.86} style={[styles.actionCard, styles.actionTravel]} onPress={() => { clearWebFocus(); navigation.navigate("TravelRegister"); }}>
                <View style={styles.actionTop}><Text style={styles.actionNumber}>02</Text><Text style={styles.actionArrow}>→</Text></View>
                <Text style={styles.actionTitle}>Registrar viaje</Text>
                <Text style={styles.actionText}>Registra movilidad y consulta el CO₂ estimado.</Text>
                <View style={[styles.actionAccent, styles.actionAccentGold]} />
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => { clearWebFocus(); navigation.navigate("Login"); }}>
                <Text style={styles.footerLink}>CERRAR SESIÓN</Text>
              </TouchableOpacity>
              <View style={styles.footerLine} />
              <Text style={styles.footerText}>01 / INICIO</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1}, scroll:{flexGrow:1,paddingHorizontal:18,paddingVertical:20,paddingBottom:34},
  shell:{width:"100%",maxWidth:760,alignSelf:"center"}, shellDesktop:{maxWidth:1260},
  header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:28},
  headerRight:{flexDirection:"row",alignItems:"center",gap:8},
  statusPill:{height:29,paddingHorizontal:9,borderRadius:10,backgroundColor:colors.white10,borderWidth:1,borderColor:colors.border,flexDirection:"row",alignItems:"center",gap:6},
  statusDot:{width:5,height:5,borderRadius:2.5,backgroundColor:colors.olive},
  statusText:{color:colors.textMuted,fontSize:6.4,fontWeight:"900",letterSpacing:.8},
  avatar:{width:40,height:40,borderRadius:13,backgroundColor:colors.cocoa}, avatarImage:{width:40,height:40,borderRadius:13},
  hero:{flexDirection:"row",alignItems:"flex-end",justifyContent:"space-between",gap:16,marginBottom:20},
  title:{color:colors.cream,fontSize:31,lineHeight:36,fontWeight:"900",letterSpacing:-.8,marginTop:6},
  subtitle:{color:colors.textMuted,fontSize:10.5,lineHeight:16,maxWidth:590,marginTop:7},
  dateBadge:{width:67,height:67,borderRadius:19,backgroundColor:colors.primary10,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},
  dateValue:{color:colors.gold,fontSize:20,fontWeight:"900"}, dateLabel:{color:colors.textMuted,fontSize:6,fontWeight:"900",letterSpacing:.8,marginTop:1},
  kpiGrid:{flexDirection:"row",flexWrap:"wrap",gap:10,marginBottom:16},
  kpiCard:{flex:1,minWidth:150,minHeight:105,padding:15,borderRadius:20,backgroundColor:colors.cocoa,borderWidth:1,borderColor:colors.border},
  kpiMain:{minWidth:210,flex:1.45,backgroundColor:colors.panel},
  kpiLabel:{color:colors.textMuted,fontSize:6.9,fontWeight:"900",letterSpacing:1},
  kpiValueRow:{flexDirection:"row",alignItems:"baseline",gap:7,marginTop:7}, kpiValue:{color:colors.cream,fontSize:35,fontWeight:"900",letterSpacing:-1}, kpiUnit:{color:colors.gold,fontSize:8,fontWeight:"900"},
  secondaryValue:{color:colors.gold,fontSize:25,fontWeight:"900",marginTop:9}, kpiHint:{color:colors.textMuted,fontSize:7.6,marginTop:3},
  chartCard:{borderRadius:24,backgroundColor:colors.cocoa,borderWidth:1,borderColor:colors.border,padding:15},
  chartTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start"}, chartTitle:{color:colors.cream,fontSize:16,fontWeight:"900",marginTop:3}, chartSubtitle:{color:colors.textMuted,fontSize:8.2,marginTop:3},
  chartBadge:{height:24,paddingHorizontal:8,borderRadius:8,backgroundColor:colors.primary10,flexDirection:"row",alignItems:"center",gap:5}, chartDot:{width:5,height:5,borderRadius:2.5,backgroundColor:colors.olive}, chartBadgeText:{color:colors.gold,fontSize:6.3,fontWeight:"900"},
  periods:{marginTop:12,padding:4,borderRadius:13,backgroundColor:colors.white10,borderWidth:1,borderColor:colors.border,flexDirection:"row",gap:4},
  period:{flex:1,height:36,borderRadius:10,alignItems:"center",justifyContent:"center"}, periodActive:{backgroundColor:colors.panelSoft}, periodText:{color:colors.textMuted,fontSize:9.5,fontWeight:"800"}, periodTextActive:{color:colors.cream},
  actionGrid:{gap:12,marginTop:20}, actionGridDesktop:{flexDirection:"row"}, actionCard:{flex:1,minHeight:152,padding:18,borderRadius:22,backgroundColor:colors.cocoa,borderWidth:1,borderColor:colors.border},actionTravel:{backgroundColor:colors.panel},
  actionTop:{flexDirection:"row",justifyContent:"space-between"},actionNumber:{color:colors.olive,fontSize:7,fontWeight:"900",letterSpacing:1},actionArrow:{color:colors.gold,fontSize:17,fontWeight:"900"},
  actionTitle:{color:colors.cream,fontSize:16,fontWeight:"900",marginTop:27},actionText:{color:colors.textMuted,fontSize:8.5,lineHeight:14,maxWidth:360,marginTop:5},actionAccent:{height:3,width:34,borderRadius:3,backgroundColor:colors.olive,marginTop:16},actionAccentGold:{backgroundColor:colors.gold},
  footer:{marginTop:25,flexDirection:"row",alignItems:"center",gap:9},footerLink:{color:colors.olive,fontSize:7.3,fontWeight:"900",letterSpacing:.7},footerLine:{flex:1,height:1,backgroundColor:colors.white10},footerText:{color:colors.textMuted,fontSize:6.7,fontWeight:"900",letterSpacing:.8}
});
