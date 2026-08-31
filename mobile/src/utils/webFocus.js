import { Platform } from "react-native";

export function clearWebFocus() {
  if (Platform.OS !== "web") {
    return;
  }

  const active = document.activeElement;

  if (active && typeof active.blur === "function") {
    active.blur();
  }
}
