import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDeployment } from "./deployment-config.mjs";

test("le lancement sans analytics ni CRM conserve le repli manuel", () => {
  const result = validateDeployment({});
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.length, 1);
});
test("refuse un domaine local, un chemin canonique et un lien social scriptable", () => {
  for (const url of ["http://localhost:3100", "https://adrar.media/fr", "https://adrar.media?x=1"]) {
    assert.equal(validateDeployment({ NEXT_PUBLIC_SITE_URL: url }).errors.length, 1);
  }
  assert.equal(validateDeployment({ NEXT_PUBLIC_FACEBOOK_URL: "javascript:alert(1)" }).errors.length, 1);
});
test("refuse les clés publiques et les identifiants analytics injectables", () => {
  const result = validateDeployment({ NEXT_PUBLIC_API_KEY: "private", NEXT_PUBLIC_META_PIXEL_ID: "123');alert(1)//" });
  assert.equal(result.errors.length, 2);
  assert.ok(result.errors.every((error) => !error.includes("private") && !error.includes("alert")));
});
test("refuse une configuration email partielle et un expéditeur injecté", () => {
  assert.equal(validateDeployment({ EMAIL_API_KEY: "secret" }).errors.length, 1);
  assert.ok(validateDeployment({ EMAIL_API_KEY: "secret", QUOTE_NOTIFICATION_FROM: "a@adrar.media\r\nBcc:x@y.ma" }).errors.length);
});
test("accepte un transport complet sans prétendre vérifier la délivrabilité", () => {
  assert.deepEqual(validateDeployment({ EMAIL_API_KEY: "secret", QUOTE_NOTIFICATION_FROM: "Site Adrar Media <no-reply@adrar.media>" }), { errors: [], warnings: [] });
});
test("refuse les formats téléphoniques, coordonnées et CRM incohérents", () => {
  assert.equal(validateDeployment({ NEXT_PUBLIC_WHATSAPP_NUMBER: "+212663070561", NEXT_PUBLIC_LATITUDE: "91", ADRAR_OS_API_KEY: "private" }).errors.length, 4);
});
