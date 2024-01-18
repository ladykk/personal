"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, Mail, Phone, Printer, Smartphone } from "lucide-react";
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

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="outline" size="icon" onClick={() => router.back()}>
      <ChevronLeft />
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

export function EmailLink(props: { email: string }) {
  return (
    <Link
      className={buttonVariants({
        variant: "link",
        size: "fit",
      })}
      href={`mailto:${props.email.trim()}`}
    >
      <Mail className="w-4 h-4 mr-2" />
      {props.email.trim()}
    </Link>
  );
}

export function PhoneLink(props: { phoneNo: string }) {
  const isMobile = props.phoneNo.length > 9;
  return (
    <Link
      key={props.phoneNo.trim()}
      className={buttonVariants({
        variant: "link",
        size: "fit",
      })}
      href={`tel:${props.phoneNo.trim()}`}
    >
      {isMobile ? (
        <Smartphone className="w-4 h-4 mr-2" />
      ) : (
        <Phone className="w-4 h-4 mr-2" />
      )}
      {props.phoneNo.trim()}
    </Link>
  );
}

export function FaxLink(props: { faxNo: string }) {
  return (
    <Link
      key={props.faxNo.trim()}
      className={buttonVariants({
        variant: "link",
        size: "fit",
      })}
      href={`tel:${props.faxNo.trim()}`}
    >
      <Printer className="w-4 h-4 mr-2" />
      {props.faxNo.trim()}
    </Link>
  );
}
