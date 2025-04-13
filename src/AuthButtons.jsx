// AuthButtons.jsx
import { useState } from "react";

function AuthButtons() {
  const [showPopup, setShowPopup] = useState(false);
  const authInstance = window.gapi.auth2.getAuthInstance();
  const isAuthenticated = authInstance?.isSignedIn.get();

  const signIn = () => authInstance.signIn();

  const signOut = () => {
    authInstance.disconnect(); // Limpia completamente sesión + permisos
    authInstance.signOut();
  };

  if (!isAuthenticated) return null; // Si no está autenticado, no se muestra

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="relative">
        <button
          className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition flex items-center justify-center shadow-md"
          onClick={() => setShowPopup(!showPopup)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0 17.93 17.93 0 0 1-7.5 1.65c-2.7 0-5.2-.58-7.5-1.65Z"
            />
          </svg>
        </button>

        {showPopup && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-36 transition-all duration-200">
            <button
              className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={signOut}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthButtons;
