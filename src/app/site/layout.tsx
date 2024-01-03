import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "ladyk.dev | A monorepos project to prove the concept of reusability, scalability, and development experience.",
  description:
    "A monorepos project to prove the concept of reusability, scalability, and development experience.",
  icons: {
    icon: "/favicons/site.png",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
