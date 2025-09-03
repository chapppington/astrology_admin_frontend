import { Metadata } from "next";
import { StoriesPageClient } from "./StoriesPageClient";

export const metadata: Metadata = {
  title: "Истории | Navika Admin",
};

export default function StoriesPage() {
  return <StoriesPageClient />;
}
