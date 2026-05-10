import { notFound } from "next/navigation";
import { initialChallenges } from "@/lib/challenges";
import LabEnvironment from "@/components/LabEnvironment";

import DefaultCredentialsLab from "../_components/DefaultCredentialsLab";
import DirectoryListingLab from "../_components/DirectoryListingLab";
import VerboseErrorLab from "../_components/VerboseErrorLab";
import PriceManipulationLab from "../_components/PriceManipulationLab";
import PrivilegeEscalationLab from "../_components/PrivilegeEscalationLab";
import MFABypassLab from "../_components/MFABypassLab";
import PasswordRecoveryLab from "../_components/PasswordRecoveryLab";
import RaceConditionLab from "../_components/RaceConditionLab";
import CouponStackingLab from "../_components/CouponStackingLab";
import AdvancedPriceManipulationLab from "../_components/AdvancedPriceManipulationLab";
import SparkFinancialHub from "../_components/SparkFinancialHub";

export default async function LabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = initialChallenges.find((c) => c.id === id);

  if (!challenge) {
    notFound();
  }

  const getTargetUrl = (cid: string) => {
    const urls: Record<string, string> = {
      "a02-1": "https://monitor.grafana-board.local/login",
      "a02-2": "https://static.cdn-assets.local/",
      "a02-3": "https://api.internal-search.local/v1/query",
      "a06-1": "https://auth.secure-portal.local/recovery",
      "a06-2": "https://shop.gadget-store.local/checkout",
      "a06-3": "https://rewards.loyalty-program.local/redeem",
      "a06-4": "https://crm.business-tools.local/dashboard",
      "a06-5": "https://portal.registration-system.local/verify",
      "a06-6": "https://checkout.marketplace-pro.local/order",
      "a06-7": "https://finance.spark-hub.local/account",
      "a06-8": "https://bank.spark-financial.local/transfer",
    };
    return urls[cid] || `https://${cid}.simulation.local`;
  };

  const renderLab = () => {
    if (id === "a02-1") return <DefaultCredentialsLab />;
    if (id === "a02-2") return <DirectoryListingLab />;
    if (id === "a02-3") return <VerboseErrorLab />;
    if (id === "a06-1") return <PasswordRecoveryLab />;
    if (id === "a06-2") return <PriceManipulationLab />;
    if (id === "a06-3") return <RaceConditionLab />;
    if (id === "a06-4") return <PrivilegeEscalationLab />;
    if (id === "a06-5") return <MFABypassLab />;
    if (id === "a06-6") return <CouponStackingLab />;
    if (id === "a06-7") return <AdvancedPriceManipulationLab />;
    if (id === "a06-8") return <SparkFinancialHub />;
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Under Construction</h1>
        <p className="text-gray-600">This lab is currently being provisioned.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {renderLab()}
    </div>
  );
}

