import { setupServiceWorker } from "@builder.io/qwik-city/service-worker";

setupServiceWorker();

declare const self: ServiceWorkerGlobalScope;

addEventListener("install", () => self.skipWaiting());

addEventListener("activate", () => self.clients.claim());
