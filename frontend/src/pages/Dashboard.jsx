import { useRef, useState } from "react";

import DashboardHeader from "../componets/dashboard/DashboardHeader.jsx";
import DashboardSections from "../componets/dashboard/DashboardSections.jsx";
import useReveal from "../componets/hooks/useReveal.js";
import Footer from "../componets/layout/Footer.jsx";
import Toast from "../componets/ui/Toast.jsx";

export default function Dashboard() {
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimer = useRef(null);

  useReveal();

  function showToast(message) {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setToast({ visible: true, message });

    toastTimer.current = setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3200);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {toast.visible && <Toast message={toast.message} visible={toast.visible} />}

      <DashboardHeader onCreateSession={showToast} />
      <DashboardSections onToast={showToast} />
      <Footer />
    </div>
  );
}
