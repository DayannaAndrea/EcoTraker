import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";
import Brand from "../components/Brand";
import SectionLabel from "../components/SectionLabel";
import { colors } from "../theme/colors";
import { clearWebFocus } from "../utils/webFocus";

export default function RegisterScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 920;
  const [secure, setSecure] = useState(true);
  const [focused, setFocused] = useState("");

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.shell, desktop && styles.shellDesktop]}>
              <View style={styles.topBar}>
                <TouchableOpacity onPress={() => { clearWebFocus(); navigation.goBack(); }} style={styles.back}>
                  <Text style={styles.backArrow}>←</Text>
                  <Text style={styles.backText}>Volver al acceso</Text>
                </TouchableOpacity>
                <Brand compact />
              </View>

              <View style={[styles.layout, desktop && styles.layoutDesktop]}>
                <View style={[styles.intro, desktop && styles.introDesktop]}>
                  <SectionLabel>CREACIÓN DE CUENTA</SectionLabel>
                  <Text style={[styles.title, desktop && styles.titleDesktop]}>
                    Empieza tu{"\n"}
                    <Text style={styles.accent}>seguimiento.</Text>
                  </Text>
                  <Text style={styles.description}>
                    Configura tu espacio personal y luego podrás comenzar a registrar tus comidas.
                  </Text>

                  <View style={styles.steps}>
                    <View style={[styles.step, styles.stepActive]}>
                      <Text style={styles.stepNumberActive}>01</Text>
                      <Text style={styles.stepLabelActive}>CUENTA</Text>
                    </View>
                    <View style={styles.stepLine} />
                    <View style={styles.step}>
                      <Text style={styles.stepNumber}>02</Text>
                      <Text style={styles.stepLabel}>PERFIL</Text>
                    </View>
                    <View style={styles.stepLine} />
                    <View style={styles.step}>
                      <Text style={styles.stepNumber}>03</Text>
                      <Text style={styles.stepLabel}>COMIDAS</Text>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.infoKicker}>EXPERIENCIA ECOTRACKER</Text>
                    <Text style={styles.infoText}>
                      Las tres pantallas comparten la misma identidad visual y están preparadas para la integración del backend.
                    </Text>
                  </View>
                </View>

                <View style={[styles.card, desktop && styles.cardDesktop]}>
                  <SectionLabel>PASO 01 / 03</SectionLabel>
                  <Text style={styles.cardTitle}>Crear cuenta</Text>
                  <Text style={styles.cardSubtitle}>Completa tu información básica.</Text>

                  <Text style={styles.label}>NOMBRE COMPLETO</Text>
                  <View style={[styles.inputBox, focused === "name" && styles.focused]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre y apellido"
                      placeholderTextColor={colors.textMuted}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused("")}
                    />
                  </View>

                  <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                  <View style={[styles.inputBox, focused === "email" && styles.focused]}>
                    <TextInput
                      style={styles.input}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                    />
                  </View>

                  <Text style={styles.label}>CONTRASEÑA</Text>
                  <View style={[styles.inputBox, focused === "password" && styles.focused]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={secure}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused("")}
                    />
                    <TouchableOpacity onPress={() => setSecure(value => !value)} style={styles.show}>
                      <Text style={styles.showText}>{secure ? "VER" : "OCULTAR"}</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
                  <View style={[styles.inputBox, focused === "confirm" && styles.focused]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Repite tu contraseña"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry
                      onFocus={() => setFocused("confirm")}
                      onBlur={() => setFocused("")}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.primary}
                    activeOpacity={0.88}
                    onPress={() => { clearWebFocus(); navigation.navigate("Home"); }}
                  >
                    <Text style={styles.primaryText}>Continuar</Text>
                    <Text style={styles.arrow}>→</Text>
                  </TouchableOpacity>

                  <Text style={styles.note}>
                    La validación y creación real del usuario se conectará después con el servicio del equipo.
                  </Text>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>ECOTRACKER</Text>
                <View style={styles.footerLine} />
                <Text style={styles.footerText}>02 / REGISTRO</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 19,
    paddingVertical: 20,
    justifyContent: "center"
  },
  shell: {
    backgroundColor: "transparent", width: "100%", maxWidth: 690, alignSelf: "center" },
  shellDesktop: { maxWidth: 1210 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  back: { flexDirection: "row", alignItems: "center", gap: 7 },
  backArrow: { color: colors.textSoft, fontSize: 19 },
  backText: { color: colors.textMuted, fontSize: 10, fontWeight: "800" },
  layout: { marginTop: 44, gap: 24 },
  layoutDesktop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 72,
    marginTop: 67
  },
  intro: {},
  introDesktop: { flex: 1 },
  title: {
    color: colors.cream,
    fontSize: 40,
    lineHeight: 45,
    fontWeight: "900",
    letterSpacing: -1.6,
    marginTop: 11
  },
  titleDesktop: { fontSize: 57, lineHeight: 62, color: colors.cocoa },
  accent: { color: colors.accent },
  description: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 15,
    maxWidth: 470
  },
  steps: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 455,
    marginTop: 28
  },
  step: {
    width: 51,
    height: 51,
    borderRadius: 15,
    backgroundColor: colors.white10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center"
  },
  stepActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepNumber: { color: colors.textMuted, fontSize: 8.5, fontWeight: "900" },
  stepNumberActive: { color: colors.cream, fontSize: 8.5, fontWeight: "900" },
  stepLabel: { color: colors.textMuted, fontSize: 6.2, fontWeight: "900", letterSpacing: .7 },
  stepLabelActive: { color: colors.gold, fontSize: 6.2, fontWeight: "900", letterSpacing: .7 },
  stepLine: { flex: 1, height: 1, backgroundColor: colors.border },
  infoCard: {
    maxWidth: 465,
    marginTop: 25,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.white10,
    borderWidth: 1,
    borderColor: colors.border
  },
  infoKicker: { color: colors.gold, fontSize: 7, fontWeight: "900", letterSpacing: 1.1 },
  infoText: { color: colors.textSoft, fontSize: 9.5, lineHeight: 15, marginTop: 6 },
  card: {
    width: "100%",
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardDesktop: { width: 465, padding: 31 },
  cardTitle: { color: colors.text, fontSize: 27, fontWeight: "900", marginTop: 7 },
  cardSubtitle: { color: colors.textMuted, fontSize: 10.5, marginTop: 4, marginBottom: 11 },
  label: { color: colors.textMuted, fontSize: 7.7, fontWeight: "900", letterSpacing: 1.05, marginTop: 12, marginBottom: 8 },
  inputBox: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white10,
    flexDirection: "row",
    alignItems: "center"
  },
  focused: { borderColor: colors.primary, backgroundColor: colors.white15 },
  input: { flex: 1, color: colors.text, fontSize: 12.8, paddingHorizontal: 14 },
  show: { paddingHorizontal: 12 },
  showText: { color: colors.accent, fontSize: 7, fontWeight: "900" },
  primary: {
    height: 55,
    borderRadius: 16,
    marginTop: 22,
    paddingHorizontal: 17,
    backgroundColor: colors.mintStrong,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  primaryText: { color: colors.cocoa, fontSize: 13, fontWeight: "900" },
  arrow: { color: colors.cocoa, fontSize: 21, fontWeight: "800" },
  note: { color: colors.textMuted, fontSize: 8.2, lineHeight: 13, textAlign: "center", marginTop: 13 },
  footer: { marginTop: 25, flexDirection: "row", alignItems: "center", gap: 9 },
  footerText: { color: colors.textMuted, fontSize: 6.6, fontWeight: "900", letterSpacing: 1 },
  footerLine: { flex: 1, height: 1, backgroundColor: "rgba(247,244,228,0.14)" }
});
