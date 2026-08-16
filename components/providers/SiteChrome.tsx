"use client";

import SmoothScroll from "./SmoothScroll";
import PageTransition from "./PageTransition";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import Preloader from "@/components/ui/Preloader";
import GrainOverlay from "@/components/ui/GrainOverlay";

/** Bundles every site-wide premium-interaction piece behind one import in the (site) root layout. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgressBar />
      <GrainOverlay />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
