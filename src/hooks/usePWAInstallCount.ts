import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePWAInstallCount() {
  const [installCount, setInstallCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("pwa_installations")
        .select("*", { count: "exact", head: true });
      
      if (!error && count !== null) {
        setInstallCount(count);
      }
    };

    fetchCount();
  }, []);

  const recordInstallation = async () => {
    // Generate a unique device ID if not exists
    let deviceId = localStorage.getItem("pwa_device_id");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("pwa_device_id", deviceId);
    }

    const { error } = await supabase
      .from("pwa_installations")
      .upsert(
        {
          device_id: deviceId,
          user_agent: navigator.userAgent,
        },
        { onConflict: "device_id" }
      );

    if (!error) {
      setInstallCount((prev) => prev + 1);
    }
  };

  return { installCount, recordInstallation };
}
