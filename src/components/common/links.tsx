"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();

  return (
    <Button variant="link" className="p-0" onClick={() => router.back()}>
      <ChevronLeft className="p-0.5 mr-1" />
      Back
    </Button>
  );
}

export function HomePageLink() {
  return (
    <Link href={window.location.origin} className={buttonVariants()}>
      Go to homepage
    </Link>
  );
}
