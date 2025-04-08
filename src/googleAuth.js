import { gapi } from "gapi-script";

const CLIENT_ID = "719483889158-ld3q8vsru8vhmvpko6j595686t0fs2b5.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents";



export function initializeGapi() {
  function start() {
    gapi.client
      .init({
        clientId: CLIENT_ID,
        scope: SCOPES,
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
