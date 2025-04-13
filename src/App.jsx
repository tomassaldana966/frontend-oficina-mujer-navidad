// App.jsx
import { useEffect, useState } from "react";
import AuthButtons from "./AuthButtons";
import Formulario from "./Formulario";
import fondo_sf from './assets/logos/FOTO_PANORAMICA_SF_1.jpg'
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

  const showLoginCard = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${fondo_sf})` }}
      >
        <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-xl p-8 w-full max-w-md text-center space-y-6">
          <h1 className="text-2xl font-semibold text-white drop-shadow">Acceso a la plataforma</h1>
          <p className="text-gray-100">Inicia sesión con tu cuenta institucional
            @munisanfernando.com
          </p>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            onClick={() => authInstance.signIn()}
          >
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    );
  };
  

  return (
    <>
      <AuthButtons />
      {isAuthenticated ? <Formulario /> : showLoginCard()}
    </>
  );
}

export default App;
