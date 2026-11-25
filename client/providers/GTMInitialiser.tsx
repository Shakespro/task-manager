"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import TagManager from "react-gtm-module";

let initialized = false;

export default function GTMInitialiser() {
  useEffect(() => {
    const initialize = () => {
      if (!initialized && Cookies.get("userConsent") === "true") {
        TagManager.initialize({ gtmId: "GTM-5DNQDMJ4" });
        initialized = true;
      }
    };
    initialize();
    window.addEventListener("analytics-consent", initialize);
    return () => window.removeEventListener("analytics-consent", initialize);
  }, []);
  return null;
}
