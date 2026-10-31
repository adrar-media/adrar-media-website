import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import ts from "typescript";

// Charge les vrais modules métier TS avec les seuls transports externes simulés.
// Pas de requête Resend, pas de clé réelle, pas d'envoi de message.
function loadLead(env = {}, response = { data: { id: "test-message" }, error: null }) {
  const cache = new Map();
  const messages = [];
  const crmCalls = [];
  function load(path) {
    if (cache.has(path)) return cache.get(path).exports;
    const unit = { exports: {} };
    cache.set(path, unit);
    const code = ts.transpileModule(readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const localRequire = (name) => {
      if (name === "server-only") return {};
      if (name === "resend") return { Resend: class {
        emails = { send: async (message) => {
          messages.push(message);
          if (response instanceof Error) throw response;
          return response;
        } };
      } };
      if (name.startsWith("@/")) return load(resolve(name.slice(2) + ".ts"));
      throw new Error(`Import inattendu : ${name}`);
    };
    vm.runInNewContext(code, {
      module: unit, exports: unit.exports, require: localRequire,
      process: { env }, console: { error() {} }, AbortSignal,
      fetch: async (...args) => { crmCalls.push(args); throw new Error("CRM indisponible"); },
    }, { filename: path });
    return unit.exports;
  }
  return { ...load(resolve("lib/leads/submit-quote.ts")), messages, crmCalls };
}

const input = {
  name: "Test recette", email: "test@example.com", message: "Demande de test sans envoi réel.",
  consent: true, locale: "fr", source: "quote",
};
const configured = { EMAIL_API_KEY: "test-only", QUOTE_NOTIFICATION_FROM: "test@adrar.media" };

test("sans transport, aucun faux succès ni appel externe", async () => {
  const lead = loadLead();
  assert.equal((await lead.submitQuote(input, "test")).status, "unconfigured");
  assert.equal(lead.messages.length, 0);
});
test("une réponse fournisseur sans identifiant, un refus ou une panne sont des erreurs", async () => {
  for (const response of [{ data: null, error: null }, { data: null, error: { name: "rejected" } }, new Error("offline")]) {
    const lead = loadLead(configured, response);
    assert.equal((await lead.submitQuote(input, "test")).status, "error");
  }
});
test("les deux formulaires transmettent à la boîte commerciale et une panne CRM ne perd pas le succès", async () => {
  const lead = loadLead({ ...configured, ADRAR_OS_API_URL: "https://crm.example.com/leads" });
  for (const source of ["quote", "contact"]) {
    assert.equal((await lead.submitQuote({ ...input, source }, source)).status, "sent");
  }
  assert.equal(lead.messages.length, 2);
  for (const message of lead.messages) {
    assert.equal(message.to[0], "contact@adrar.media");
    assert.equal(message.replyTo, "test@example.com");
  }
  assert.notEqual(lead.messages[0].subject, lead.messages[1].subject);
  assert.equal(lead.crmCalls.length, 2);
  assert.equal(JSON.parse(lead.crmCalls[0][1].body).source, "site-web");
});
test("la validation et la limite de débit évitent les envois invalides ou répétés", async () => {
  const lead = loadLead(configured);
  assert.equal((await lead.submitQuote({ ...input, consent: false }, "test")).status, "invalid");
  for (let attempt = 0; attempt < 5; attempt++) assert.equal((await lead.submitQuote(input, "test")).status, "sent");
  assert.equal((await lead.submitQuote(input, "test")).status, "rate-limited");
  assert.equal(lead.messages.length, 5);
});
