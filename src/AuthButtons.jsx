import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

function AuthButtons() {
  const { logout, isAuthenticated, loginWithRedirect } = useAuth0();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="w-full flex justify-end p-4 relative">
      {!isAuthenticated ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() =>
            loginWithRedirect({
              prompt: "login",
              connection: "google-oauth2",
              screen_hint: "login"
            })
          }
        >
          Iniciar Sesión con Google
        </button>
      ) : (
        <div className="relative">
          {/* Botón con icono alineado a la derecha con fondo circular blue-300 */}
          <button
            className="bg-blue-300 p-3 rounded-full hover:bg-blue-400 transition flex items-center justify-center"
            onClick={() => setShowPopup(!showPopup)} // Toggle del popup
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

          {/* Popup flotante al hacer clic */}
            {showPopup && (
              <div className={`absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-36 
                  transition-all duration-300 transform ${showPopup ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              >
                <button
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => logout({ returnTo: window.location.origin })}
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
