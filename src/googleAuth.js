import { gapi } from "gapi-script";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID



export function initializeGapi() {
  function start() {
    gapi.client
      .init({
        clientId: CLIENT_ID,
      })
      .then(() => {
        // 👇 Carga explícitamente la API de Drive
        return gapi.client.load("drive", "v3");
      })
      .then(() => {
        console.log("✅ GAPI inicializado correctamente con Drive");
      })
      .catch((error) => {
        console.error("❌ Error al inicializar GAPI:", error);
      });
  }

  gapi.load("client:auth2", start);
}
