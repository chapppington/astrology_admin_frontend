import { Metadata } from "next";
import { SettingsPageClient } from "./SettingsPageClient";

export const metadata: Metadata = {
  title: "Настройки | Navika Partners",
};
export default function SettingsPage() {
  return <SettingsPageClient />;
}
