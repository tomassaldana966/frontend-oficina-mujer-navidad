// App.jsx
import { useEffect, useState } from "react";
import AuthButtons from "./AuthButtons";
import Formulario from "./Formulario";

const CLIENT_ID = "719483889158-ld3q8vsru8vhmvpko6j595686t0fs2b5.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents";










function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", async () => {
        await window.gapi.client.init({
          clientId: CLIENT_ID,
          scope: SCOPES,
        });
  
        // ✅ Cargar explícitamente Drive y Docs
        await window.gapi.client.load("drive", "v3");
        await window.gapi.client.load("docs", "v1");
  
        const authInstance = window.gapi.auth2.getAuthInstance();
        setIsAuthenticated(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsAuthenticated);
        setGapiLoaded(true);
      });
    };
    document.body.appendChild(script);
  }, []);
  

  if (!gapiLoaded) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <>
      <AuthButtons />
      {isAuthenticated ? <Formulario /> : <p className="text-center mt-10">Por favor inicia sesión para continuar.</p>}
    </>
  );
}

export default App;
