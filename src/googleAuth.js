import { gapi } from "gapi-script";

const CLIENT_ID = "296332455762-948fh8pk35dv3ckqgp23gahsevlf0e0d.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents";

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
