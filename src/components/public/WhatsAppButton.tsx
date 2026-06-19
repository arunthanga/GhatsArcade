import { buildWhatsAppLink } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  phone: string;
  message?: string;
  label?: string;
  className?: string;
};

// Click-to-chat button (prj.md Section 3). Link construction lives in src/lib/whatsapp.ts
// so it is unit-tested independently of this component.
export function WhatsAppButton({
  phone,
  message,
  label = "Chat on WhatsApp",
  className,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(phone, message);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-button"
      className={className}
    >
      {label}
    </a>
  );
}
