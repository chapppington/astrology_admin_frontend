import { Metadata } from "next";
import { PartnerPaymentsClient } from "./PartnerPaymentsClient";

export const metadata: Metadata = {
  title: "Платежи | Navika Partners",
};

export default function PartnerPaymentsPage() {
  return <PartnerPaymentsClient />;
}
