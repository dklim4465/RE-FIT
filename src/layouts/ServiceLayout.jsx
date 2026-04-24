import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ServiceHeader from "../components/common/ServiceHeader";
import ServiceMenu from "../components/common/ServiceMenu";
import MockAdBanner from "../components/main/MockAdBanner";
import { getRandomMockAd } from "../ads.data/mockAds";

export default function ServiceLayout() {
  const location = useLocation();
  const [activeAd, setActiveAd] = useState(() => getRandomMockAd());

  useEffect(() => {
    setActiveAd((currentAd) => getRandomMockAd(currentAd?.id ?? null));
  }, [location.pathname]);

  return (
    <div className="service-layout">
      <ServiceHeader />

      <section className="service-main-box">
        <ServiceMenu />

        <main className="service-content-box">
          <Outlet />
        </main>
      </section>

      <MockAdBanner ad={activeAd} className="service-ad-box" />
    </div>
  );
}
