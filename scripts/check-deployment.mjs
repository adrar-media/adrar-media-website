import nextEnv from "@next/env";
import { validateDeployment } from "./deployment-config.mjs";

nextEnv.loadEnvConfig(process.cwd(), false);
const { errors, warnings } = validateDeployment(process.env);
for (const warning of warnings) console.warn(`À vérifier : ${warning}`);
for (const error of errors) console.error(`Bloquant : ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("Configuration valide. Ce contrôle ne confirme ni les DNS, ni la réception email, ni les accords clients.");
