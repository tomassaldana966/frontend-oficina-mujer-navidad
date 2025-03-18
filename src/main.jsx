import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import Formulario from "./Formulario";
import "./index.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}  // 👈 Habilitar refresh tokens
      cacheLocation="localstorage"  // 👈 Almacenar sesión en localStorage
    >
      <BrowserRouter>
        <Formulario />
      </BrowserRouter>
    </Auth0Provider>

  </StrictMode>
);
