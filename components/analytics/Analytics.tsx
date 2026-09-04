"use client";

import Script from "next/script";
import { useEffect } from "react";
import { analyticsIds } from "@/lib/analytics/config";
import { trackEvent } from "@/lib/analytics/events";

/**
 * SCRIPTS DE MESURE
 *
 * Montés uniquement après un accord explicite : ce composant n'est rendu que
 * lorsque le consentement vaut « granted ». Rien n'est chargé « en attendant »,
 * pas même en mode dégradé — un script de suivi présent dans la page dépose
 * ses cookies, quelle que soit la configuration qu'on lui applique ensuite.
 *
 * `afterInteractive` : la mesure d'audience n'a aucune raison de disputer la
 * bande passante au contenu. Elle démarre une fois la page utilisable.
 *
 * Chaque outil ne s'active que si son identifiant est renseigné.
 */
export function Analytics() {
  const { ga4, metaPixel, tiktokPixel } = analyticsIds;

  useEffect(() => {
    const onEmailClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = (link.getAttribute("href") ?? "").trim().toLowerCase();
      if (href.startsWith("mailto:")) {
        trackEvent("email_click", { page_path: window.location.pathname });
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      const page_path = window.location.pathname;
      if (href.startsWith("https://wa.me/")) {
        trackEvent("whatsapp_click", { page_path });
      } else if (href.startsWith("tel:")) {
        trackEvent("phone_click", { page_path });
      } else if (href.includes("/demander-un-devis") || href.includes("/request-a-quote")) {
        trackEvent("quote_cta_click", { page_path });
      }
    };

    document.addEventListener("click", onEmailClick, true);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onEmailClick, true);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      {ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}

      {tiktokPixel && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(e,n){e[n]=function(){e.push([n].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(e){for(var n=ttq._i[e]||[],i=0;i<ttq.methods.length;i++)ttq.setAndDefer(n,ttq.methods[i]);return n};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${tiktokPixel}');ttq.page()}(window,document,'ttq');`}
        </Script>
      )}
    </>
  );
}
