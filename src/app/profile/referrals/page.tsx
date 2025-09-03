import { Metadata } from "next";
import { PartnerReferralsClient } from "./PartnerReferralsClient";

export const metadata: Metadata = {
  title: "Мои рефералы | Navika Partners",
};

export default function PartnerReferralsPage() {
  return <PartnerReferralsClient />;
}
