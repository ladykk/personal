import { Metadata } from "next";
import favicon from "public/favicons/site.png";

export const metadata: Metadata = {
  title:
    "ladyk.dev | A monorepos project to prove the concept of reusability, scalability, and development experience.",
  description:
    "A monorepos project to prove the concept of reusability, scalability, and development experience.",
  icons: {
    icon: favicon.src,
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
