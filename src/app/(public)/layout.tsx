import { PublicWhatsAppFloat } from "@/components/public/PublicWhatsAppFloat";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { publicEnv } from "@/lib/env";

// Shared chrome for all public (marketing) pages. The admin area has its own layout,
// so the public header/footer (and the legal disclaimer) appear only here.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const whatsappNumber = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      {whatsappNumber ? <PublicWhatsAppFloat phone={whatsappNumber} /> : null}
    </div>
  );
}
