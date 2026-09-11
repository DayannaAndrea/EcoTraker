import React, { useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";
import Brand from "../components/Brand";
import SectionLabel from "../components/SectionLabel";
import { colors } from "../theme/colors";
import { clearWebFocus } from "../utils/webFocus";
import { useImpact } from "../context/ImpactContext";

const transportOptions = [
  { id:"car", value:"Carro", label:"Automóvil", factor:0.22 },
  { id:"bus", value:"Bus", label:"Bus", factor:0.79 },
  { id:"bike", value:"Bici", label:"Bicicleta", factor:0 },
  { id:"walk", value:"A pie", label:"A pie", factor:0 }
];

export default function TravelRegisterScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 980;
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;
  const [origin,setOrigin]=useState("");
  const [destination,setDestination]=useState("");
  const [distance,setDistance]=useState("");
  const [transport,setTransport]=useState("car");
  const [error,setError]=useState("");
  const [saving,setSaving]=useState(false);
  const { travelRecords, addTravelRecord, removeTravelRecord } = useImpact();

  useEffect(()=>{
    Animated.parallel([
      Animated.timing(fade,{toValue:1,duration:550,useNativeDriver:false}),
      Animated.timing(rise,{toValue:0,duration:550,useNativeDriver:false})
    ]).start();
  },[fade,rise]);

  const selected=transportOptions.find(x=>x.id===transport)||transportOptions[0];
  const km=Number(distance)||0;
  const impact=km*selected.factor;
  const saveDemo = async () => {
    const roundedKm = Number.isFinite(km) ? km : 0;
    if (!origin.trim() || !destination.trim() || roundedKm <= 0) {
      setError("Completa origen, destino y una distancia válida.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await addTravelRecord({
        origin: origin.trim(),
        destination: destination.trim(),
        transport: selected.value,
        distance: roundedKm,
        date: new Date().toISOString().slice(0, 10)
      });
      setOrigin("");
      setDestination("");
      setDistance("");
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "No se pudo guardar el viaje.");
    } finally {
      setSaving(false);
    }
  };

  return <AnimatedBackground>
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS==="ios"?"padding":undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.shell,desktop&&styles.shellDesktop,{opacity:fade,transform:[{translateY:rise}]}]}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.back} activeOpacity={.8} onPress={()=>{clearWebFocus();navigation.navigate("Home");}}>
                <Text style={styles.backArrow}>←</Text><Text style={styles.backText}>Inicio</Text>
              </TouchableOpacity>
              <Brand compact/>
            </View>

            <View style={styles.titleRow}>
              <View style={{flex:1}}>
                <SectionLabel>ECOTRACKER / MOVILIDAD</SectionLabel>
                <Text style={styles.title}>Registrar viaje</Text>
                <Text style={styles.subtitle}>Registra un desplazamiento y guarda su impacto estimado en EcoTracker.</Text>
              </View>
              <View style={styles.counter}><Text style={styles.counterNumber}>#11</Text><Text style={styles.counterLabel}>VIAJE</Text></View>
            </View>

            <View style={[styles.layout,desktop&&styles.layoutDesktop]}>
              <View style={[styles.formCard,desktop&&styles.formDesktop]}>
                <View style={styles.cardHeader}>
                  <View><SectionLabel>DETALLES DEL VIAJE</SectionLabel><Text style={styles.cardTitle}>Nueva ruta</Text></View>
                  <View style={styles.status}><View style={styles.statusDot}/><Text style={styles.statusText}>BORRADOR</Text></View>
                </View>

                <View style={styles.routeLine}>
                  <View style={styles.routeRail}><View style={styles.routeDotStart}/><View style={styles.routeDash}/><View style={styles.routeDotEnd}/></View>
                  <View style={styles.routeInputs}>
                    <Text style={styles.label}>ORIGEN</Text>
                    <TextInput value={origin} onChangeText={setOrigin} placeholder="¿Desde dónde sales?" placeholderTextColor={colors.textMuted} style={styles.input}/>
                    <View style={styles.routeDivider}/>
                    <Text style={styles.label}>DESTINO</Text>
                    <TextInput value={destination} onChangeText={setDestination} placeholder="¿A dónde vas?" placeholderTextColor={colors.textMuted} style={styles.input}/>
                  </View>
                </View>

                <Text style={[styles.label,{marginTop:22}]}>MEDIO DE TRANSPORTE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.transportRow}>
                  {transportOptions.map((item,index)=><TouchableOpacity key={item.id} activeOpacity={.82} onPress={()=>setTransport(item.id)} style={[styles.transport,transport===item.id&&styles.transportActive]}>
                    <Text style={[styles.transportIndex,transport===item.id&&styles.transportIndexActive]}>0{index+1}</Text>
                    <Text style={[styles.transportLabel,transport===item.id&&styles.transportLabelActive]}>{item.label}</Text>
                  </TouchableOpacity>)}
                </ScrollView>

                <Text style={[styles.label,{marginTop:22}]}>DISTANCIA</Text>
                <View style={styles.distanceRow}>
                  <View style={styles.distanceInput}>
                    <TextInput value={distance} onChangeText={v=>setDistance(v.replace(/[^0-9.]/g,""))} keyboardType="decimal-pad" placeholder="0.0" placeholderTextColor={colors.textMuted} style={styles.distanceText}/>
                    <Text style={styles.km}>KM</Text>
                  </View>
                  <View style={styles.estimateMini}><Text style={styles.estimateMiniLabel}>FACTOR</Text><Text style={styles.estimateMiniValue}>{selected.factor.toFixed(2)} kg/km</Text></View>
                </View>

                <Pressable style={({pressed})=>[styles.saveButton,pressed&&styles.pressed]} onPress={saveDemo} disabled={saving}>
                  <View><Text style={styles.saveEyebrow}>REGISTRO</Text><Text style={styles.saveText}>{saving ? "Guardando..." : "Guardar viaje"}</Text></View>
                  <View style={styles.buttonIcon}><Text style={styles.buttonIconText}>→</Text></View>
                </Pressable>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
              <View style={styles.sideColumn}>
                <View style={styles.impactCard}>
                  <View style={styles.impactHeader}>
                    <View>
                      <SectionLabel>IMPACTO ESTIMADO</SectionLabel>
                      <Text style={styles.impactTitle}>Huella del viaje</Text>
                    </View>
                    <View style={styles.impactTag}>
                      <Text style={styles.impactTagText}>KG CO₂</Text>
                    </View>
                  </View>
                  <View style={styles.impactValueRow}>
                    <Text style={styles.impactValue}>{impact.toFixed(2)}</Text>
                    <View>
                      <Text style={styles.impactUnit}>KG CO₂</Text>
                      <Text style={styles.impactSub}>estimación actual</Text>
                    </View>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill,{width:`${Math.min(100,Math.max(5,impact*12))}%`}]}/>
                  </View>
                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryValue}>{km.toFixed(1)}</Text>
                      <Text style={styles.summaryLabel}>KILÓMETROS</Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryValue}>{selected.label}</Text>
                      <Text style={styles.summaryLabel}>TRANSPORTE</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View>
                      <SectionLabel>ACTIVIDAD</SectionLabel>
                      <Text style={styles.historyTitle}>Historial de viajes</Text>
                    </View>
                    <Text style={styles.historyCount}>{travelRecords.length} viajes</Text>
                  </View>

                  <View style={styles.travelHistory}>
                    {travelRecords.length === 0 ? (
                      <View style={styles.travelEmpty}>
                        <View style={styles.emptyRoute}>
                          <View style={styles.emptyRouteDot} />
                          <View style={styles.emptyRouteLine} />
                          <View style={styles.emptyRouteDotEnd} />
                        </View>
                        <Text style={styles.travelEmptyTitle}>Todavía no hay viajes</Text>
                        <Text style={styles.travelEmptyText}>Los trayectos que guardes aparecerán aquí.</Text>
                      </View>
                    ) : (
                      travelRecords.map(item => (
                        <View style={styles.travelRecord} key={item.id}>
                          <View style={styles.travelRecordRoute}>
                            <View style={styles.travelDot} />
                            <View style={styles.travelRouteLine} />
                            <View style={styles.travelDotEnd} />
                          </View>
                          <View style={styles.travelRecordInfo}>
                            <Text style={styles.travelRouteText}>{item.origin || "Origen"} → {item.destination || "Destino"}</Text>
                            <Text style={styles.travelMeta}>{item.transport} · {Number(item.distance).toFixed(1)} km</Text>
                          </View>
                          <View style={styles.travelImpact}>
                            <Text style={styles.travelImpactValue}>{Number(item.co2).toFixed(2)}</Text>
                            <Text style={styles.travelImpactUnit}>KG CO₂</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            activeOpacity={0.78}
                            onPress={() => removeTravelRecord(item.id)}
                          >
                            <Text style={styles.deleteText}>Eliminar</Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.footer}><Text style={styles.footerText}>ECOTRACKER</Text><View style={styles.footerLine}/><Text style={styles.footerText}>04 / VIAJES</Text></View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </AnimatedBackground>;
}

const styles=StyleSheet.create({
  flex:{flex:1},safe:{flex:1},scroll:{flexGrow:1,paddingHorizontal:18,paddingVertical:20,paddingBottom:34},
  shell:{width:"100%",maxWidth:760,alignSelf:"center"},shellDesktop:{maxWidth:1220},
  header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:34},
  back:{flexDirection:"row",alignItems:"center",gap:8},backArrow:{color:colors.olive,fontSize:20,fontWeight:"800"},backText:{color:colors.textSoft,fontSize:10,fontWeight:"800"},
  titleRow:{flexDirection:"row",alignItems:"flex-end",marginBottom:22,gap:16},title:{color:colors.cream,fontSize:34,lineHeight:38,fontWeight:"900",letterSpacing:-1,marginTop:7},
  subtitle:{color:colors.textMuted,fontSize:11.5,lineHeight:18,maxWidth:640,marginTop:7},counter:{width:62,height:62,borderRadius:18,backgroundColor:colors.primary10,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},
  counterNumber:{color:colors.gold,fontSize:17,fontWeight:"900"},counterLabel:{color:colors.textMuted,fontSize:6.5,fontWeight:"900",letterSpacing:1,marginTop:2},
  error:{color:colors.danger,fontSize:9,lineHeight:14,marginBottom:2},
  layout:{gap:18},layoutDesktop:{flexDirection:"row",alignItems:"flex-start",gap:20},formCard:{backgroundColor:colors.panel,borderRadius:25,borderWidth:1,borderColor:colors.border,padding:20},formDesktop:{flex:1,padding:28},
  cardHeader:{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24},cardTitle:{color:colors.cream,fontSize:23,fontWeight:"900",marginTop:5},
  status:{flexDirection:"row",alignItems:"center",gap:6,paddingHorizontal:9,height:27,borderRadius:9,backgroundColor:colors.white10},statusDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.olive},statusText:{color:colors.textMuted,fontSize:6.5,fontWeight:"900",letterSpacing:.8},
  routeLine:{flexDirection:"row"},routeRail:{width:25,alignItems:"center",paddingTop:4},routeDotStart:{width:10,height:10,borderRadius:5,borderWidth:2,borderColor:colors.olive},routeDotEnd:{width:10,height:10,borderRadius:5,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.cocoa},routeDash:{flex:1,width:1,borderLeftWidth:1,borderStyle:"dashed",borderColor:colors.textMuted,marginVertical:5},routeInputs:{flex:1},
  label:{color:colors.textMuted,fontSize:7.2,fontWeight:"900",letterSpacing:1,marginBottom:7},input:{height:49,borderRadius:13,borderWidth:1,borderColor:colors.border,backgroundColor:colors.white10,color:colors.cream,paddingHorizontal:14,fontSize:12.5,marginBottom:15},routeDivider:{height:1,backgroundColor:colors.white10,marginBottom:15},
  transportRow:{gap:8,paddingBottom:3},transport:{width:112,height:72,borderRadius:15,borderWidth:1,borderColor:colors.border,backgroundColor:colors.white10,padding:10,justifyContent:"space-between"},transportActive:{backgroundColor:colors.primary18,borderColor:"rgba(168,193,72,.55)"},transportIndex:{color:colors.textMuted,fontSize:7,fontWeight:"900"},transportIndexActive:{color:colors.olive},transportLabel:{color:colors.textSoft,fontSize:10,fontWeight:"800"},transportLabelActive:{color:colors.cream},
  distanceRow:{flexDirection:"row",gap:9,alignItems:"center"},distanceInput:{height:52,flex:1,borderRadius:14,borderWidth:1,borderColor:colors.border,backgroundColor:colors.white10,flexDirection:"row",alignItems:"center",paddingHorizontal:14},distanceText:{flex:1,color:colors.cream,fontSize:18,fontWeight:"900"},km:{color:colors.textMuted,fontSize:8,fontWeight:"900",letterSpacing:1},estimateMini:{height:52,minWidth:112,paddingHorizontal:12,borderRadius:14,justifyContent:"center",backgroundColor:colors.gold12},estimateMiniLabel:{color:colors.textMuted,fontSize:6.5,fontWeight:"900",letterSpacing:.8},estimateMiniValue:{color:colors.gold,fontSize:9,fontWeight:"900",marginTop:3},
  saveButton:{height:60,borderRadius:16,marginTop:22,paddingLeft:17,paddingRight:8,backgroundColor:colors.olive,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},pressed:{opacity:.86},saveEyebrow:{color:colors.cocoa,fontSize:6.5,fontWeight:"900",letterSpacing:1},saveText:{color:colors.cocoa,fontSize:13,fontWeight:"900",marginTop:2},buttonIcon:{width:43,height:43,borderRadius:13,backgroundColor:"rgba(59,45,42,.16)",alignItems:"center",justifyContent:"center"},buttonIconText:{color:colors.cocoa,fontSize:19,fontWeight:"900"},
  sideColumn:{flex:1,gap:18},impactCard:{backgroundColor:colors.panel,borderRadius:25,borderWidth:1,borderColor:colors.border,padding:21},impactHeader:{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start"},impactTitle:{color:colors.cream,fontSize:18,fontWeight:"900",marginTop:4},impactTag:{paddingHorizontal:8,height:23,borderRadius:8,backgroundColor:colors.primary10,justifyContent:"center"},impactTagText:{color:colors.olive,fontSize:6.5,fontWeight:"900",letterSpacing:.7},
  impactValueRow:{flexDirection:"row",alignItems:"baseline",gap:8,marginTop:22},impactValue:{color:colors.cream,fontSize:45,fontWeight:"900",letterSpacing:-1},impactUnit:{color:colors.gold,fontSize:9,fontWeight:"900"},impactSub:{color:colors.textMuted,fontSize:6.5,marginTop:2},progressTrack:{height:8,borderRadius:4,backgroundColor:colors.white10,overflow:"hidden",marginTop:22},progressFill:{height:"100%",borderRadius:4,backgroundColor:colors.olive},
  summaryGrid:{flexDirection:"row",gap:1,marginTop:20},summaryItem:{flex:1,paddingTop:13,borderTopWidth:1,borderTopColor:colors.white10},summaryValue:{color:colors.textSoft,fontSize:13,fontWeight:"900"},summaryLabel:{color:colors.textMuted,fontSize:6.2,fontWeight:"900",letterSpacing:.7,marginTop:3},

  historyCard:{backgroundColor:colors.cocoa,borderRadius:25,borderWidth:1,borderColor:colors.border,padding:21},
  historyHeader:{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end",marginBottom:13},
  historyTitle:{color:colors.cream,fontSize:18,fontWeight:"900",marginTop:4},
  historyCount:{color:colors.textMuted,fontSize:7.5,fontWeight:"800"},
  travelHistory:{borderRadius:17,backgroundColor:colors.white10,borderWidth:1,borderColor:colors.border,overflow:"hidden"},
  travelEmpty:{minHeight:165,alignItems:"center",justifyContent:"center",padding:22},
  emptyRoute:{height:35,alignItems:"center",justifyContent:"center"},
  emptyRouteDot:{width:9,height:9,borderRadius:5,borderWidth:2,borderColor:colors.olive},
  emptyRouteLine:{height:12,width:1,borderLeftWidth:1,borderStyle:"dashed",borderColor:colors.textMuted,marginVertical:2},
  emptyRouteDotEnd:{width:9,height:9,borderRadius:5,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.cocoa},
  travelEmptyTitle:{color:colors.cream,fontSize:12,fontWeight:"900",marginTop:10},
  travelEmptyText:{color:colors.textMuted,fontSize:8.8,lineHeight:14,textAlign:"center",marginTop:4},
  travelRecord:{minHeight:74,paddingHorizontal:12,flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:colors.white10},
  travelRecordRoute:{width:22,alignItems:"center",justifyContent:"center",marginRight:8},
  travelDot:{width:7,height:7,borderRadius:4,borderWidth:2,borderColor:colors.olive},
  travelRouteLine:{height:18,width:1,borderLeftWidth:1,borderStyle:"dashed",borderColor:colors.textMuted,marginVertical:2},
  travelDotEnd:{width:7,height:7,borderRadius:4,backgroundColor:colors.gold,borderWidth:1,borderColor:colors.cocoa},
  travelRecordInfo:{flex:1},
  travelRouteText:{color:colors.cream,fontSize:10.2,fontWeight:"900"},
  travelMeta:{color:colors.textMuted,fontSize:7.9,marginTop:3},
  travelImpact:{alignItems:"flex-end"},
  deleteButton:{minWidth:67,height:31,borderRadius:10,borderWidth:1,borderColor:colors.gold12,backgroundColor:colors.white10,alignItems:"center",justifyContent:"center",marginLeft:10,paddingHorizontal:8},
  deleteText:{color:colors.gold,fontSize:7.2,fontWeight:"900",letterSpacing:.4},
  travelImpactValue:{color:colors.gold,fontSize:13,fontWeight:"900"},
  travelImpactUnit:{color:colors.textMuted,fontSize:6.1,fontWeight:"900",letterSpacing:.6},
  footer:{marginTop:25,flexDirection:"row",alignItems:"center",gap:9},footerText:{color:colors.textMuted,fontSize:6.6,fontWeight:"900",letterSpacing:1},footerLine:{flex:1,height:1,backgroundColor:colors.white10}
});
