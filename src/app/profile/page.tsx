import { Metadata } from "next";
import { ProfilePageClient } from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "Главная | Navika Partners",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
