import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "../components/AnimatedBackground";
import Brand from "../components/Brand";
import SectionLabel from "../components/SectionLabel";
import { colors } from "../theme/colors";
import { clearWebFocus } from "../utils/webFocus";

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 920;
  const [secure, setSecure] = useState(true);
  const [focused, setFocused] = useState("");
  return (
    <AnimatedBackground variant="login">
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.shell, desktop && styles.shellDesktop]}>
              <View style={styles.topBar}>
                <Brand />
                <View style={styles.topStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>ECOTRACKER ONLINE</Text>
                </View>
              </View>

              <View style={[styles.layout, desktop && styles.layoutDesktop]}>
                <View style={[styles.intro, desktop && styles.introDesktop]}>
                  <SectionLabel>PERSONAL IMPACT PLATFORM</SectionLabel>

                  <Text style={[styles.title, desktop && styles.titleDesktop]}>
                    Decisiones más{"\n"}
                    <Text style={styles.accent}>conscientes.</Text>
                  </Text>

                  <Text style={styles.description}>
                    Un espacio privado para registrar tus comidas, revisar tu impacto estimado y construir hábitos con información que puedas entender.
                  </Text>

                  <View style={styles.statement}>
                    <View style={styles.statementAccent} />
                    <View style={styles.statementContent}>
                      <Text style={styles.statementKicker}>TU ESPACIO</Text>
                      <Text style={styles.statementTitle}>Claro. Personal. Enfocado.</Text>
                      <Text style={styles.statementText}>
                        Menos ruido visual. Más información útil.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.lineDecor}>
                    <View style={styles.lineShort} />
                    <View style={styles.lineLong} />
                  </View>
                </View>

                <View style={[styles.card, desktop && styles.cardDesktop]}>
                  <View style={styles.cardHeader}>
                    <SectionLabel>ACCESO</SectionLabel>
                    <Text style={styles.cardTitle}>Bienvenido</Text>
                    <Text style={styles.cardSubtitle}>
                      Ingresa a tu cuenta para continuar.
                    </Text>
                  </View>

                  <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                  <View style={[styles.inputBox, focused === "email" && styles.inputFocused]}>
                    <TextInput
                      style={styles.input}
                      placeholder="nombre@correo.com"
                      placeholderTextColor="#6F8078"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                    />
                  </View>

                  <View style={styles.passwordHeader}>
                    <Text style={styles.label}>CONTRASEÑA</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.help}>Recuperar acceso</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.inputBox, focused === "password" && styles.inputFocused]}>
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#6F8078"
                      secureTextEntry={secure}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused("")}
                    />
                    <TouchableOpacity
                      style={styles.show}
                      activeOpacity={0.7}
                      onPress={() => setSecure(value => !value)}
                    >
                      <Text style={styles.showText}>
                        {secure ? "MOSTRAR" : "OCULTAR"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.primaryButtonPressed
                    ]}
                    onPress={() => { clearWebFocus(); navigation.navigate("FoodRegister"); }}
                  >
                    <View>
                      <Text style={styles.primaryEyebrow}>CONTINUAR</Text>
                      <Text style={styles.primaryText}>Entrar a EcoTracker</Text>
                    </View>
                    <View style={styles.arrowBubble}>
                      <Text style={styles.arrow}>→</Text>
                    </View>
                  </Pressable>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>NUEVO USUARIO</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    activeOpacity={0.82}
                    onPress={() => { clearWebFocus(); navigation.navigate("Register"); }}
                  >
                    <Text style={styles.secondaryText}>Crear una cuenta</Text>
                  </TouchableOpacity>

                  <View style={styles.secureRow}>
                    <View style={styles.secureIcon}>
                      <View style={styles.secureInner} />
                    </View>
                    <Text style={styles.secureText}>
                      Acceso preparado para la integración con el servicio del proyecto.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>ECOTRACKER</Text>
                <View style={styles.footerLine} />
                <Text style={styles.footerText}>01 / LOGIN</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 23,
    justifyContent: "center"
  },
  shell: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center"
  },
  shellDesktop: {
    maxWidth: 1200
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 42
  },
  topStatus: {
    height: 29,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(10,27,22,0.7)",
    borderWidth: 1,
    borderColor: colors.border
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint
  },
  statusText: {
    color: "#81A796",
    fontSize: 6.5,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  layout: {
    gap: 26
  },
  layoutDesktop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 82
  },
  intro: {},
  introDesktop: {
    flex: 1,
    paddingBottom: 4
  },
  title: {
    color: colors.text,
    fontSize: 43,
    lineHeight: 47,
    fontWeight: "900",
    letterSpacing: -1.9,
    marginTop: 12
  },
  titleDesktop: {
    fontSize: 62,
    lineHeight: 66
  },
  accent: {
    color: colors.mint
  },
  description: {
    color: "#AFC0B8",
    fontSize: 13.2,
    lineHeight: 21.5,
    maxWidth: 520,
    marginTop: 18
  },
  statement: {
    flexDirection: "row",
    maxWidth: 470,
    marginTop: 32,
    padding: 18,
    borderRadius: 19,
    backgroundColor: "rgba(10,29,23,0.62)",
    borderWidth: 1,
    borderColor: colors.border
  },
  statementAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.mintStrong
  },
  statementContent: {
    paddingLeft: 12
  },
  statementKicker: {
    color: "#70A68C",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.3
  },
  statementTitle: {
    color: "#E2EFE8",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 5
  },
  statementText: {
    color: "#7C9489",
    fontSize: 10,
    marginTop: 4
  },
  lineDecor: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  lineShort: {
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#68C896"
  },
  lineLong: {
    width: 80,
    height: 1,
    backgroundColor: "rgba(131,230,177,0.2)"
  },
  card: {
    width: "100%",
    padding: 25,
    borderRadius: 29,
    backgroundColor: "rgba(8,24,20,0.93)",
    borderWidth: 1,
    borderColor: "rgba(164,221,198,0.13)"
  },
  cardDesktop: {
    width: 470,
    padding: 32
  },
  cardHeader: {
    marginBottom: 23
  },
  cardTitle: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 7
  },
  cardSubtitle: {
    color: "#738980",
    fontSize: 10.5,
    marginTop: 4
  },
  label: {
    color: "#789087",
    fontSize: 7.7,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 8
  },
  passwordHeader: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  help: {
    color: colors.mint,
    fontSize: 7.5,
    fontWeight: "900"
  },
  inputBox: {
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(164,221,198,0.1)",
    backgroundColor: "rgba(255,255,255,0.035)",
    flexDirection: "row",
    alignItems: "center"
  },
  inputFocused: {
    borderColor: "rgba(131,230,177,0.55)",
    backgroundColor: "rgba(255,255,255,0.055)"
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    paddingHorizontal: 15
  },
  show: {
    paddingHorizontal: 12
  },
  showText: {
    color: "#7EA992",
    fontSize: 7,
    fontWeight: "900"
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 17,
    backgroundColor: colors.mint,
    marginTop: 23,
    paddingLeft: 18,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  primaryButtonPressed: { opacity: 0.9 },
  primaryEyebrow: {
    color: "#317456",
    fontSize: 6.8,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  primaryText: {
    color: "#062017",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2
  },
  arrowBubble: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: "rgba(2,43,28,0.16)",
    alignItems: "center",
    justifyContent: "center"
  },
  arrow: {
    color: "#062017",
    fontSize: 20,
    fontWeight: "900"
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginVertical: 21
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(190,222,209,0.1)"
  },
  dividerText: {
    color: "#6E837B",
    fontSize: 6.7,
    fontWeight: "900",
    letterSpacing: 1
  },
  secondaryButton: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(131,230,177,0.21)",
    backgroundColor: "rgba(131,230,177,0.035)",
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryText: {
    color: "#B1DBC4",
    fontSize: 11.5,
    fontWeight: "900"
  },
  secureRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  secureIcon: {
    width: 15,
    height: 15,
    borderRadius: 5,
    backgroundColor: "rgba(131,230,177,0.08)",
    alignItems: "center",
    justifyContent: "center"
  },
  secureInner: {
    width: 7,
    height: 7,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: "#6DA889"
  },
  secureText: {
    flex: 1,
    color: "#687A72",
    fontSize: 7.8,
    lineHeight: 12
  },
  footer: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 9
  },
  footerText: {
    color: "#6B8177",
    fontSize: 6.6,
    fontWeight: "900",
    letterSpacing: 1
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(133,170,152,0.13)"
  }
});
