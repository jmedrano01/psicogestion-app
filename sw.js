/*
 * Service worker de PsicoGestión web (lo genera `npm run build:web`).
 *
 * - Guarda solo los archivos de la app (mismo origen) para abrir rápido y sin
 *   conexión la pantalla de entrada. Los datos clínicos viven en la nube y en
 *   memoria: nunca pasan por esta caché.
 * - Cada publicación trae un BUILD_ID nuevo: el navegador detecta el cambio,
 *   instala la versión nueva y la app avisa «Nueva versión lista».
 */
const BUILD_ID = '2.6.0-mvx4negf';
const CACHE = `psicogestion-${BUILD_ID}`;
const ASSETS = ["assets/index-CPWVv2pM.js","assets/ArchitectureAndDbView-CsljcEgJ.js","assets/ClinicalAssistantModule-C23W81ij.js","assets/DiagnosticsView-B7M0LGFI.js","assets/KnowledgeLibraryPanel-CcSObUnA.js","assets/PlanningModule-X1-S3Mus.js","assets/PsychometricsModule-Cyzt0Gtr.js","assets/SettingsModal-CTBaM5Wk.js","assets/ai-CNfBNT-O.js","assets/aiTasks-DFj2u44Z.js","assets/bot-CpuEfLK_.js","assets/catalog-B_FDrvwQ.js","assets/info-CPLtgK1U.js","assets/jsx-runtime-DphrNBlM.js","assets/knowledge-DfGm0Q-Z.js","assets/library-DXo8HpXK.js","assets/loader-circle-C06ttK5c.js","assets/notebook-pen-3Qrm_wGD.js","assets/platform-Ci8V49D_.js","assets/rotate-ccw-CmJLJl5B.js","assets/webState-YJmeLx0N.js","assets/wrench-Dm06QUka.js","assets/avatar_psychologist_1792852281458-CRsUcffM.webp","assets/index-kUFJIqoR.css","assets/jetbrains-mono-latin-400-normal-6-qcROiO.woff","assets/jetbrains-mono-latin-400-normal-V6pRDFza.woff2","assets/jetbrains-mono-latin-500-normal-BWZEU5yA.woff2","assets/jetbrains-mono-latin-500-normal-CJOVTJB7.woff","assets/outfit-latin-400-normal-BGsTXAXT.woff2","assets/outfit-latin-400-normal-DMwTpYkH.woff","assets/outfit-latin-500-normal-ClnHRwRh.woff","assets/outfit-latin-500-normal-DKnIMDSk.woff2","assets/outfit-latin-600-normal-B7SfZ07L.woff2","assets/outfit-latin-600-normal-BEfTtDA7.woff","assets/outfit-latin-700-normal-Cu9v6i1X.woff2","assets/outfit-latin-700-normal-D4itBLBr.woff","assets/plus-jakarta-sans-latin-400-italic-BVaBttQe.woff","assets/plus-jakarta-sans-latin-400-italic-D5MFNpT-.woff2","assets/plus-jakarta-sans-latin-400-normal-BDKaGhyp.woff","assets/plus-jakarta-sans-latin-400-normal-Dhut76fR.woff2","assets/plus-jakarta-sans-latin-500-normal-Bf-nb4oT.woff2","assets/plus-jakarta-sans-latin-500-normal-DYtqi0QS.woff","assets/plus-jakarta-sans-latin-600-normal-BR_Ojra4.woff","assets/plus-jakarta-sans-latin-600-normal-DLTa1BUW.woff2","assets/plus-jakarta-sans-latin-700-normal-CfpNZvy6.woff2","assets/plus-jakarta-sans-latin-700-normal-DqEcQeE5.woff","assets/student_avatar_mateo_1792852282340-BLK4wj_I.webp","assets/student_avatar_sofia_1792852281355-DhpaSRge.webp"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(['./', ...ASSETS.map((file) => `./${file}`)]))
      .catch(() => undefined)
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('psicogestion-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// La app pide activar la versión nueva cuando la persona acepta recargar.
self.addEventListener('message', (event) => {
  if (event.data === 'activar-version-nueva') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // nube, fuentes externas: directo a la red

  // La página: primero la red (para ver publicaciones nuevas), si no hay, la caché.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./').then((cached) => cached || Response.error()))
    );
    return;
  }
  // version.json siempre de la red.
  if (url.pathname.endsWith('/version.json')) return;

  // Archivos con huella (assets/…): primero la caché.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && url.pathname.includes('/assets/')) {
            const copy = response.clone();
            void caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
