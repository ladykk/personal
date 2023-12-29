"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RedirectCountdownProps = {
  seconds: number;
  callbackUrl?: string;
};
export function RedirectCountdown(props: RedirectCountdownProps) {
  const router = useRouter();
  const [countDown, setCountDown] = useState(props.seconds);

  // Set timer to redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Redirect when count down is 0
  useEffect(() => {
    if (countDown === 0) router.push(props.callbackUrl ?? "/");
  }, [countDown]);

  return (
    <div className="text-center">
      <p className="text-sm">
        We're redirecting you to application in {countDown} seconds.
      </p>
      <p className="text-sm">
        If you're not redirected, please click{" "}
        <a href={props.callbackUrl} className="underline">
          here
        </a>
        .
      </p>
    </div>
  );
}
