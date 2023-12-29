import { Mail, type LucideIcon, Phone, Github } from "lucide-react";

export const Contacts: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  {
    href: "mailto:krtp.apirat@gmail.com",
    label: "krtp.apirat@gmail.com",
    icon: Mail,
  },
  {
    href: "tel:+66623434114",
    label: "(+66)62-343-4114",
    icon: Phone,
  },
  {
    href: "https://github.com/ladykk",
    label: "@ladykk",
    icon: Github,
  },
];
