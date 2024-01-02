"use client";
import { Hydrate, type dehydrate } from "@tanstack/react-query";

type HydrationBoundaryProps = {
  state: ReturnType<typeof dehydrate>;
  children: React.ReactNode;
};

export function HydrationBoundary(props: HydrationBoundaryProps) {
  return <Hydrate state={props.state}>{props.children}</Hydrate>;
}
