import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import Hero from "../componets/sections/Hero";
import Features from "../componets/sections/Features";
import Practice from "../componets/sections/Practice";
import Testimonials from "../componets/sections/Testimonials";
import CTABanner from "../componets/sections/CTABanner";
import Navbar from "../componets/layout/Navbar";
import useReveal from "../componets/hooks/useReveal";
import useCountUp from "../componets/hooks/useCountUp";

import Toast from "../componets/ui/Toast.jsx";
import { launchConfetti } from "../componets/ui/Confetti";

import { HowItWorks, Stats } from "../componets/sections/HowItWorks";
import Footer from "../componets/layout/Footer.jsx";

import { useNavigate } from "react-router-dom";

// ─── ROOT HOMEPAGE ────────────────────────────────────────────────────────────
export default function Homepage() {
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimer = useRef(null);
  const navigate = useNavigate();

  useReveal();

  function showToast(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message: msg });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3200);
  }

  const handleCTA = (msg, actionType) => {
    showToast(msg);
    setTimeout(() => {
      if (actionType === "practice") {
        navigate("/problems");
      } else {
        navigate("/dashboard");
      }
    }, 600);
  };

  return (
    <>
      {toast.visible && <Toast message={toast.message} visible={toast.visible} />}

      <Navbar onSignup={showToast} />
      <Hero onCTA={handleCTA} />
      <Features />
      <HowItWorks />
      <Stats />
      <Practice onCTA={handleCTA} />
      <Testimonials />
      <CTABanner onCTA={handleCTA} />
      <Footer />
    </>
  );
}