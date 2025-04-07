import { useEffect, useState } from "react";

const CLIENT_ID = "296332455762-948fh8pk35dv3cckqgp23gahsevlfe0d.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents";

function AuthButtons() {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Cargar script de gapi
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", async () => {
        await window.gapi.client.init({
          clientId: CLIENT_ID,
          scope: SCOPES,
        });
        const authInstance = window.gapi.auth2.getAuthInstance();
        setIsAuthenticated(authInstance.isSignedIn.get());
        setGapiLoaded(true);
        authInstance.isSignedIn.listen(setIsAuthenticated);
        console.log("✅ GAPI inicializado");
      });
    };
    document.body.appendChild(script);
  }, []);

  // ✅ Acciones
  const signIn = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signIn();
  };

  const signOut = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signOut();
  };

  // ✅ DEBUG: siempre mostrar estado
  console.log("¿Está autenticado?", isAuthenticated);

  return (
    <div className="w-full flex justify-end p-4 relative z-50">
      {!isAuthenticated ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={signIn}
        >
          Iniciar sesión con Google
        </button>
      ) : (
        <div className="relative">
          <button
            className="bg-blue-300 p-3 rounded-full hover:bg-blue-400 transition flex items-center justify-center"
            onClick={() => setShowPopup(!showPopup)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>

          {showPopup && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-36 transition-all duration-300 transform">
              <button
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={signOut}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AuthButtons;
