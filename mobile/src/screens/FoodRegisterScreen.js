import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";
import Brand from "../components/Brand";
import SectionLabel from "../components/SectionLabel";
import { colors } from "../theme/colors";
import { clearWebFocus } from "../utils/webFocus";
import { useImpact } from "../context/ImpactContext";

const foodTypes = [
  { name:"Carne de res", factor:6.0, code:"RES" },
  { name:"Pollo", factor:1.5, code:"POL" },
  { name:"Pescado", factor:1.2, code:"PES" },
  { name:"Vegetariana", factor:0.7, code:"VEG" },
  { name:"Vegana", factor:0.4, code:"VGN" }
];

export default function FoodRegisterScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const [food, setFood] = useState("Vegetariana");
  const [quantity, setQuantity] = useState("1");
  const { foodRecords, foodTotal, addFoodRecord, removeFoodRecord } = useImpact();
  const selected = foodTypes.find(item => item.name === food) || foodTypes[0];
  const preview = selected.factor * (Number(quantity) || 0);

  const addRecord = () => {
    const portions = Math.max(1, Math.min(20, Number(quantity) || 1));
    addFoodRecord({ food, portions, co2:selected.factor * portions });
    setQuantity("1");
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={[styles.shell, desktop && styles.shellDesktop]}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.back} activeOpacity={0.8} onPress={() => { clearWebFocus(); navigation.navigate("Home"); }}>
                <Text style={styles.backArrow}>←</Text><Text style={styles.backText}>Inicio</Text>
              </TouchableOpacity>
              <View style={styles.headerRight}><Brand compact /><TouchableOpacity style={styles.avatar}><Image source={require("../../assets/images/user-avatar.png")} style={styles.avatarImage}/></TouchableOpacity></View>
            </View>

            <View style={styles.hero}>
              <View style={{flex:1}}>
                <SectionLabel>ALIMENTACIÓN</SectionLabel>
                <Text style={styles.title}>Registrar comida</Text>
                <Text style={styles.subtitle}>Añade una comida, calcula su CO₂ estimado y gestiona tus registros.</Text>
              </View>
              <View style={styles.totalBox}><Text style={styles.totalValue}>{foodTotal.toFixed(1)}</Text><Text style={styles.totalLabel}>KG CO₂ COMIDAS</Text></View>
            </View>

            <View style={[styles.columns, desktop && styles.columnsDesktop]}>
              <View style={styles.formCard}>
                <View style={styles.cardHead}><View><SectionLabel>NUEVO REGISTRO</SectionLabel><Text style={styles.cardTitle}>Selecciona una categoría</Text></View><Text style={styles.preview}>{preview.toFixed(1)} KG</Text></View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foodList}>
                  {foodTypes.map(item => (
                    <TouchableOpacity key={item.name} activeOpacity={0.82} onPress={() => setFood(item.name)} style={[styles.foodCard, food === item.name && styles.foodActive]}>
                      <View style={[styles.code, food === item.name && styles.codeActive]}><Text style={[styles.codeText, food === item.name && styles.codeTextActive]}>{item.code}</Text></View>
                      <Text style={[styles.foodName, food === item.name && styles.foodNameActive]}>{item.name}</Text>
                      <Text style={styles.factor}>{item.factor.toFixed(1)} kg / porción</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.label}>PORCIONES</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity style={styles.qty} activeOpacity={0.8} onPress={() => setQuantity(String(Math.max(1, Number(quantity || 1) - 1)))}><Text style={styles.qtyText}>−</Text></TouchableOpacity>
                  <View style={styles.quantityBox}><TextInput value={quantity} onChangeText={value => setQuantity(value.replace(/[^0-9]/g,""))} keyboardType="number-pad" maxLength={2} style={styles.quantity}/><Text style={styles.portions}>PORCIONES</Text></View>
                  <TouchableOpacity style={styles.qty} activeOpacity={0.8} onPress={() => setQuantity(String(Math.min(20, Number(quantity || 0) + 1)))}><Text style={styles.qtyText}>+</Text></TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.save} activeOpacity={0.86} onPress={addRecord}><Text style={styles.saveText}>Guardar comida</Text><Text style={styles.saveArrow}>→</Text></TouchableOpacity>
              </View>

              <View style={styles.historyCard}>
                <View style={styles.cardHead}><View><SectionLabel>ACTIVIDAD</SectionLabel><Text style={styles.cardTitle}>Historial de comidas</Text></View><Text style={styles.count}>{foodRecords.length} registros</Text></View>
                <View style={styles.history}>
                  {foodRecords.length === 0 ? (
                    <View style={styles.empty}><Text style={styles.emptyTitle}>Aún no hay comidas</Text><Text style={styles.emptyText}>Los registros que guardes aparecerán aquí.</Text></View>
                  ) : (
                    foodRecords.map(item => (
                      <View style={styles.record} key={item.id}>
                        <View style={styles.recordCode}><Text style={styles.recordCodeText}>{item.food.slice(0,3).toUpperCase()}</Text></View>
                        <View style={styles.recordInfo}><Text style={styles.recordName}>{item.food}</Text><Text style={styles.recordMeta}>{item.portions} {item.portions === 1 ? "porción" : "porciones"}</Text></View>
                        <View style={styles.recordImpact}><Text style={styles.recordNumber}>{Number(item.co2).toFixed(1)}</Text><Text style={styles.recordUnit}>KG CO₂</Text></View>
                        <TouchableOpacity style={styles.deleteButton} activeOpacity={0.78} onPress={() => removeFoodRecord(item.id)}><Text style={styles.deleteText}>Eliminar</Text></TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </View>

            <View style={styles.footer}><Text style={styles.footerText}>02 / COMIDAS</Text><View style={styles.footerLine}/><TouchableOpacity onPress={() => navigation.navigate("Home")}><Text style={styles.footerLink}>VOLVER AL INICIO</Text></TouchableOpacity></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1},scroll:{flexGrow:1,paddingHorizontal:18,paddingVertical:20,paddingBottom:34},shell:{width:"100%",maxWidth:760,alignSelf:"center"},shellDesktop:{maxWidth:1260},
  header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:28},back:{flexDirection:"row",alignItems:"center",gap:8},backArrow:{color:colors.olive,fontSize:20,fontWeight:"800"},backText:{color:colors.textSoft,fontSize:10,fontWeight:"800"},
  headerRight:{flexDirection:"row",alignItems:"center",gap:10},avatar:{width:40,height:40,borderRadius:13,backgroundColor:colors.cocoa},avatarImage:{width:40,height:40,borderRadius:13},
  hero:{flexDirection:"row",alignItems:"flex-end",justifyContent:"space-between",gap:16,marginBottom:20},title:{color:colors.cream,fontSize:32,lineHeight:37,fontWeight:"900",letterSpacing:-.8},subtitle:{color:colors.textMuted,fontSize:10.5,lineHeight:16,maxWidth:600,marginTop:7},
  totalBox:{width:84,height:69,borderRadius:19,backgroundColor:colors.primary10,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},totalValue:{color:colors.gold,fontSize:19,fontWeight:"900"},totalLabel:{color:colors.textMuted,fontSize:5.8,fontWeight:"900",letterSpacing:.8,marginTop:2},
  columns:{gap:16},columnsDesktop:{flexDirection:"row",alignItems:"flex-start"},formCard:{flex:1,backgroundColor:colors.cocoa,borderRadius:24,borderWidth:1,borderColor:colors.border,padding:20},historyCard:{flex:1,backgroundColor:colors.cocoa,borderRadius:24,borderWidth:1,borderColor:colors.border,padding:20},
  cardHead:{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16},cardTitle:{color:colors.cream,fontSize:18,fontWeight:"900",marginTop:4},preview:{color:colors.olive,fontSize:15,fontWeight:"900"},
  foodList:{gap:8,paddingBottom:4},foodCard:{width:120,height:85,padding:9,borderRadius:15,backgroundColor:colors.white10,borderWidth:1,borderColor:colors.border},foodActive:{backgroundColor:colors.primary18,borderColor:"rgba(168,193,72,.55)"},
  code:{width:29,height:21,borderRadius:7,backgroundColor:colors.white15,alignItems:"center",justifyContent:"center"},codeActive:{backgroundColor:colors.primary18},codeText:{color:colors.textMuted,fontSize:6.3,fontWeight:"900"},codeTextActive:{color:colors.olive},
  foodName:{color:colors.textSoft,fontSize:9.4,fontWeight:"900",marginTop:9},foodNameActive:{color:colors.cream},factor:{color:colors.textMuted,fontSize:6.9,marginTop:3},
  label:{color:colors.textMuted,fontSize:7.5,fontWeight:"900",letterSpacing:1.1,marginTop:18,marginBottom:9},quantityRow:{flexDirection:"row",alignItems:"center",gap:8},qty:{width:45,height:46,borderRadius:13,backgroundColor:colors.primary10,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},qtyText:{color:colors.olive,fontSize:20},
  quantityBox:{flex:1,height:46,borderRadius:13,backgroundColor:colors.white10,borderWidth:1,borderColor:colors.border,flexDirection:"row",alignItems:"center",justifyContent:"center"},quantity:{color:colors.cream,fontSize:16,fontWeight:"900",textAlign:"center",minWidth:25},portions:{color:colors.textMuted,fontSize:6.4,fontWeight:"900",marginLeft:4},
  save:{height:54,borderRadius:15,backgroundColor:colors.olive,marginTop:17,paddingHorizontal:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},saveText:{color:colors.cocoa,fontSize:12.5,fontWeight:"900"},saveArrow:{color:colors.cocoa,fontSize:19,fontWeight:"900"},
  count:{color:colors.textMuted,fontSize:7.8,fontWeight:"800"},history:{borderRadius:17,backgroundColor:colors.white10,borderWidth:1,borderColor:colors.border,overflow:"hidden",minHeight:200},empty:{minHeight:200,alignItems:"center",justifyContent:"center",padding:24},
  emptyTitle:{color:colors.cream,fontSize:12.5,fontWeight:"900"},emptyText:{color:colors.textMuted,fontSize:8.8,lineHeight:14,textAlign:"center",marginTop:4},
  record:{minHeight:73,paddingHorizontal:12,flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:colors.white10},recordCode:{width:39,height:39,borderRadius:12,backgroundColor:colors.primary10,alignItems:"center",justifyContent:"center",marginRight:10},
  recordCodeText:{color:colors.olive,fontSize:6.7,fontWeight:"900"},recordInfo:{flex:1},recordName:{color:colors.cream,fontSize:10.8,fontWeight:"900"},recordMeta:{color:colors.textMuted,fontSize:8,marginTop:3},recordImpact:{alignItems:"flex-end"},recordNumber:{color:colors.gold,fontSize:13,fontWeight:"900"},recordUnit:{color:colors.textMuted,fontSize:6,fontWeight:"900",letterSpacing:.7},
  deleteButton:{minWidth:67,height:31,borderRadius:10,borderWidth:1,borderColor:colors.gold12,backgroundColor:colors.white10,alignItems:"center",justifyContent:"center",marginLeft:10,paddingHorizontal:8},deleteText:{color:colors.gold,fontSize:7,fontWeight:"900"},
  footer:{marginTop:25,flexDirection:"row",alignItems:"center",gap:9},footerText:{color:colors.textMuted,fontSize:6.7,fontWeight:"900",letterSpacing:.8},footerLink:{color:colors.olive,fontSize:6.7,fontWeight:"900",letterSpacing:.8},footerLine:{flex:1,height:1,backgroundColor:colors.white10}
});
