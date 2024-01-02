"use client";
import { useEffect } from "react";
import { Bottombar, ScreenContainer, Topbar } from "./_components";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { GitBranch } from "lucide-react";
import { TechStack } from "@/static/tech-stack";
import Image from "next/image";
import { scrollSpy } from "react-scroll";

type Props = {
  ROOT_DOMAIN: string;
};
export default function SiteClient(props: Props) {
  // Update scrollspy on mount
  useEffect(() => {
    scrollSpy.update();
  }, []);

  return (
    <div className="min-h-svh">
      <Topbar
        navs={[
          {
            label: "Overview",
            name: "overview",
          },
          {
            label: "Tech Stack",
            name: "tech-stack",
          },
        ]}
        ROOT_DOMAIN={props.ROOT_DOMAIN}
      />
      <Bottombar />
      <ScreenContainer
        name="overview"
        className="flex flex-col items-center justify-center"
      >
        <p className="font-bold text-7xl mb-5">ladyk.dev</p>
        <p className="text-center text-lg mb-5 px-3 max-w-[500px]">
          A monorepos project to prove the concept of reusability, scalability,
          and development experience.
        </p>
        <Link
          href="https://github.com/ladykk/personal"
          target="_blank"
          className={buttonVariants()}
        >
          <GitBranch className="p-0.5 mr-2" />
          Git Repository
        </Link>
      </ScreenContainer>
      <ScreenContainer name="tech-stack" className="bg-background relative">
        <div className="max-w-7xl mx-auto sm:py-10 p-5">
          <p className="text-4xl font-bold mb-10">Tech Stack</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {TechStack.map((techstack) => (
              <Link
                key={techstack.name}
                href={techstack.link}
                className="h-64 rounded-md shadow grid grid-rows-[1fr_80px] border hover:bg-primary/10 hover:border-primary/20 transition-all duration-100"
              >
                <div className="relative bg-muted dark:bg-white/30 rounded-t">
                  <Image
                    src={techstack.logo}
                    alt={techstack.name}
                    sizes="100vh"
                    fill
                    style={{
                      objectFit: "contain",
                      padding: "2.5rem",
                    }}
                  />
                </div>
                <div className="flex justify-center items-center flex-col">
                  <p className="font-bold text-center">{techstack.name}</p>
                  <p className="text-center text-muted-foreground text-sm">
                    {techstack.usage}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
}
