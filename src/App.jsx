// App.jsx
import { useEffect, useState } from "react";
import AuthButtons from "./AuthButtons";
import Formulario from "./Formulario";
import fondo_sf from './assets/logos/FOTO_PANORAMICA_SF_1.jpg';
import { initializeGapi } from "./googleAuth";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = import.meta.env.VITE_SCOPES;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [loginError, setLoginError] = useState(false);
initializeGapi()
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", async () => {
        try {
          await window.gapi.client.init({
            clientId: CLIENT_ID,
            scope: SCOPES,
          });

          await window.gapi.client.load("drive", "v3");
          await window.gapi.client.load("docs", "v1");

          const authInstance = window.gapi.auth2.getAuthInstance();
          setIsAuthenticated(authInstance.isSignedIn.get());

          authInstance.isSignedIn.listen((isSignedInNow) => {
            setIsAuthenticated(isSignedInNow);

            if (isSignedInNow) {
              window.location.reload();
            }
          });

          setGapiLoaded(true);
        } catch (error) {
          console.error("Error cargando GAPI:", error);
          setLoginError(true);
          setGapiLoaded(true); // Para no quedarse cargando eternamente
        }
      });
    };
    document.body.appendChild(script);
  }, []);

  if (!gapiLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
        <svg
          className="animate-spin h-12 w-12 text-blue-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <p className="text-lg text-gray-700 font-semibold">Cargando la aplicación...</p>
      </div>
    );
  }

  const showLoginCard = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();

    const intentarLogin = async () => {
      try {
        await authInstance.signIn({ prompt: 'select_account' });
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        setLoginError(true);
      }
    };

    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${fondo_sf})` }}
      >
        <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-xl p-8 w-full max-w-md text-center space-y-6">
          {loginError ? (
            <>
              <h1 className="text-2xl font-semibold text-white drop-shadow">Acceso Denegado</h1>
              <p className="text-gray-100">Esta cuenta no está autorizada. Por favor selecciona otra cuenta institucional.</p>
              <button
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                onClick={intentarLogin}
              >
                Cambiar de cuenta
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-white drop-shadow">Acceso a la plataforma</h1>
              <p className="text-gray-100">Inicia sesión con tu cuenta institucional @munisanfernando.com</p>
              <button
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                onClick={intentarLogin}
              >
                Iniciar sesión con Google
              </button>
            </>
          )}
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
