/** Validate configuration without printing values or secrets. */
export function validateDeployment(env) {
  const errors = [];
  const warnings = [];
  const value = (key) => env[key]?.trim() || "";
  const check = (key, pattern) => {
    if (value(key) && !pattern.test(value(key))) errors.push(`${key} : format invalide`);
  };
  const httpsUrl = (key, fallback = "", originOnly = false) => {
    const input = value(key) || fallback;
    if (!input) return;
    try {
      const url = new URL(input);
      if (url.protocol !== "https:" || url.username || url.password ||
          url.hostname === "localhost" || !url.hostname.includes(".") ||
          (originOnly && (url.pathname !== "/" || url.search || url.hash))) {
        throw new Error("invalid");
      }
    } catch {
      errors.push(`${key} : URL HTTPS publique${originOnly ? " sans chemin, requête ni fragment" : ""} requise`);
    }
  };

  httpsUrl("NEXT_PUBLIC_SITE_URL", "https://adrar.media", true);
  for (const channel of ["INSTAGRAM", "LINKEDIN", "FACEBOOK", "TIKTOK"]) {
    httpsUrl(`NEXT_PUBLIC_${channel}_URL`);
  }
  for (const key of ["CONTACT_EMAIL", "RECRUITMENT_EMAIL", "DATA_CONTACT_EMAIL"]) {
    check(`NEXT_PUBLIC_${key}`, /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/);
  }
  for (const key of ["PHONE_E164", "LANDLINE_E164"]) {
    check(`NEXT_PUBLIC_${key}`, /^\+[1-9]\d{7,14}$/);
  }
  check("NEXT_PUBLIC_WHATSAPP_NUMBER", /^[1-9]\d{7,14}$/);
  check("NEXT_PUBLIC_COUNTRY", /^[A-Z]{2}$/);
  check("NEXT_PUBLIC_GA4_MEASUREMENT_ID", /^G-[A-Z0-9]+$/);
  check("NEXT_PUBLIC_META_PIXEL_ID", /^\d+$/);
  check("NEXT_PUBLIC_TIKTOK_PIXEL_ID", /^[A-Za-z0-9]+$/);

  const coordinateKeys = ["NEXT_PUBLIC_LATITUDE", "NEXT_PUBLIC_LONGITUDE"];
  coordinateKeys.forEach((key, index) => {
    if (value(key) && (!Number.isFinite(Number(value(key))) ||
        Math.abs(Number(value(key))) > (index === 0 ? 90 : 180))) {
      errors.push(`${key} : coordonnée invalide`);
    }
  });
  if (coordinateKeys.some((key) => value(key)) && !coordinateKeys.every((key) => value(key))) {
    errors.push("NEXT_PUBLIC_LATITUDE et NEXT_PUBLIC_LONGITUDE doivent être renseignées ensemble");
  }
  for (const key of Object.keys(env)) {
    if (/^NEXT_PUBLIC_.*(?:SECRET|API_KEY|TOKEN|PASSWORD)/i.test(key) && value(key)) {
      errors.push(`${key} : secret interdit côté navigateur`);
    }
  }
  const apiKey = value("EMAIL_API_KEY");
  const sender = value("QUOTE_NOTIFICATION_FROM");
  if (Boolean(apiKey) !== Boolean(sender)) errors.push("EMAIL_API_KEY et QUOTE_NOTIFICATION_FROM doivent être renseignées ensemble");
  if (apiKey && /[\r\n]/.test(apiKey)) errors.push("EMAIL_API_KEY : format invalide");
  if (sender && (!/^(?:[^<>\r\n]+ <)?[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>?$/.test(sender) || /[\r\n]/.test(sender))) {
    errors.push("QUOTE_NOTIFICATION_FROM : expéditeur invalide");
  }
  if (!apiKey && !sender) warnings.push("Envoi automatique désactivé : repli email/WhatsApp à tester avant publication");
  httpsUrl("ADRAR_OS_API_URL");
  if (value("ADRAR_OS_API_KEY") && !value("ADRAR_OS_API_URL")) errors.push("ADRAR_OS_API_KEY sans ADRAR_OS_API_URL");
  if (value("NEXT_PUBLIC_STYLEGUIDE") === "1") errors.push("NEXT_PUBLIC_STYLEGUIDE doit rester fermé pour la publication");
  return { errors, warnings };
}
