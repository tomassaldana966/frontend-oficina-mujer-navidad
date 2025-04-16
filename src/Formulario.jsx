import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { generarPDF } from "./generatePDF";
import logo from "./assets/logos/sflogosvg.png";
import logo4 from "./assets/logos/SF3.jpg";
import cultura from "./assets/logos/cultura.png";
import panoramica2 from "./assets/logos/FOTO_PANORAMICA_SF_2.jpg";
import GuardarEnSheets from "./GuardarEnSheets";
import { initializeGapi } from "./googleAuth";
import AuthButtons from "./AuthButtons";
import { generarFichaDesdePlantilla } from "./generateFicha";
import Swal from 'sweetalert2';


function Formulario() {
  const [formData, setFormData] = useState({
    nombre_alumno: "",
/*     apellidos_alumno: "", */
    edad: "",
    domicilio: "",
    genero: "",
    institucion: "",
    contacto: "",
    taller: "",
    informacion_relevante: "",
    nombre_apellido_apoderado: "",
    telefono_apoderado: "",
    correo_apoderado: "",
    nombre_contacto_adicional: "",
    telefono_contacto_adicional: "",
    correo_contacto_adicional: "",
    documento1: false,  // 👈 Ahora es un booleano en vez de una cadena vacía
    documento2: false,  // 👈 Ahora es un booleano en vez de una cadena vacía
    documento3: false,  // 👈 Ahora es un booleano en vez de una cadena vacía
  });

  const [currentBackground, setCurrentBackground] = useState(panoramica2); // La imagen fija al inicio de la pagina, antes de la rotacion 
  //const logos = [panoramica2]; // estas son las imagenes que van a ir rotando 
  const [isFading, setIsFading] = useState(false);

// Este es el nuevo handleChange que permite marcar y desmarcar las casillas de los documentos a adjuntar
  
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    console.log(`🔍 Cambio detectado: ${name} = ${newValue}`);

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const esCorreoValido = (correo) => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [camposInvalidos, setCamposInvalidos] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  
  
  const handleGeneratePDF = () => {
    generarPDF(formData);
    toast.success("PDF generado exitosamente");
  };
  
  //Indica los campos que son obligatorios para obtener la visuualización del formulario. Además '&&' (es sintaxis) dice que se debe ingresar otro campo. Cuando ya no hay mas campos que agregar entonces no se coloca &&
  const isFormComplete = () => {
    return (
      formData.nombre_alumno &&
      formData.edad &&
      formData.domicilio &&
      formData.institucion &&
      formData.genero &&
      formData.contacto &&
      formData.taller &&
      formData.nombre_apellido_apoderado &&
      formData.telefono_apoderado &&
      formData.correo_apoderado
    );
  }; 
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Función para validar formato de correo electrónico
    const esCorreoValido = (correo) => {
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regexCorreo.test(correo);
    };

    // Verificar campos obligatorios
    if (!isFormComplete()) {
      const camposFaltantes = Object.entries(formData)
        .filter(([key, valor]) =>
          [
            "nombre_alumno",
            "edad",
            "domicilio",
            "genero",
            "institucion",
            "contacto",
            "taller",
            "nombre_apellido_apoderado",
            "telefono_apoderado",
            "correo_apoderado"
          ].includes(key) && !valor
        )
        .map(([key]) => key);

      setCamposInvalidos(camposFaltantes);
      setErrorVisible(true);

      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios incompletos',
        text: 'Por favor completa todos los campos requeridos antes de enviar.',
        confirmButtonColor: '#f27474',
      });

      return;
    }

    // Validar formato de correo
    if (!esCorreoValido(formData.correo_apoderado)) {
      setCamposInvalidos(["correo_apoderado"]);
      setErrorVisible(true);

      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'El correo del apoderado no tiene un formato válido.',
        confirmButtonColor: '#f27474',
      });

      return;
    }

    try {
      setIsSubmitting(true);
      setCamposInvalidos([]);
      setErrorVisible(false);

      GuardarEnSheets(formData);
      await generarFichaDesdePlantilla(formData);

      setIsSubmitting(false);

      Swal.fire({
        icon: 'success',
        title: '¡Enviado!',
        text: 'Los datos se guardaron y el documento fue generado con éxito.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });

    } catch (error) {
      setIsSubmitting(false);
      console.error("❌ Error al enviar:", error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al enviar los datos o generar el documento.',
      });
    }
  };

  
  
/*   useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", async () => {
        await window.gapi.client.init({
          clientId: "296332455762-948fh8pk35dv3cckqgp23gahsevlfe0d.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents",
        });
  
        const authInstance = window.gapi.auth2.getAuthInstance();
  
        // ✅ Mueve este log aquí
        console.log("Usuario autenticado:", authInstance.currentUser.get().getBasicProfile().getEmail());
  
        setIsAuthenticated(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsAuthenticated);
      });
    };
    document.body.appendChild(script);
  }, []); */
  
  
/* 
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthButtons />
      </div>
    );
  }
  
  console.log("Usuario autenticado, renderizando formulario");
 */

  /*
  const enviarDatos = async (formData) => {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyBHuoDkD_NxWNkHc7udUYGw6f3MfcZYqNxUo7n0BMJnMfl7kmb6Qs5vAHAR8P51EDYKQ/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const data = await response.json();
    console.log("Respuesta del servidor:", data);
  };*/
  
  console.log("RENDER!");
  return (
    <>    
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 2s cubic-bezier(0.77, 0, 0.175, 1)", // Ajustar la duración de la transición
      }}
    >
      <Toaster />

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md relative z-10 h-[90vh] overflow-y-auto">
      
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-200 p-4 mb-6 rounded relative overflow-hidden w-full max-w-[900px] mx-auto">
          {/* Fondo principal (logo4) */}
          <div className="absolute inset-0 transition-opacity duration-2000">
            <img src={logo4} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
          </div>

          {/* Imagen 'cultura' flotando a la derecha */}
          <img
            src={cultura}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-40 max-w-[150px] h-auto object-contain z-10"
            alt="Cultura"
          />


          {/* Logo frontal centrado */}
          <div className="relative z-10 w-24 h-24 flex items-center justify-center">
            <img src={logo} className="w-full h-full object-contain z-20" alt="Logo principal" />
          </div>
        </div>


        <div className="w-full justify-between bg-blue-500 text-white text-center py-2 rounded-md shadow-md mb-2">
                <span className="text-lg font-bold uppercase tracking-wide">Datos del alumno</span>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Campos del formulario */}
          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Nombre Completo del alumno 
            </label>
            <input
              name="nombre_alumno"
              value={formData.nombre_alumno}
              onChange={handleChange}
              maxLength={40}  
              type="text"
              placeholder="Ingresar nombres y apellidos del alumno"
              required
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                camposInvalidos.includes("nombre_alumno") ? "border-red-500" : "border-gray-200"
              }`}
            />
              {camposInvalidos.includes("nombre_alumno") && (
                <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
              )}
          </div>

          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Edad
            </label>
            <input
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              maxLength={20}  
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                camposInvalidos.includes("nombre_alumno") ? "border-red-500" : "border-gray-200"
              }`}
              type="number"
              min="0"
              step="1"
              placeholder="Ingrese edad"
              required
            />
              {camposInvalidos.includes("edad") && (
                <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
              )}
          </div>

          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Domicilio
            </label>
            <input
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              maxLength={20}  
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                camposInvalidos.includes("nombre_alumno") ? "border-red-500" : "border-gray-200"
              }`}              
              type="text"
              placeholder="Ingrese dirección de domicilio"
              required
            />
              {camposInvalidos.includes("domicilio") && (
                <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
              )}
          </div>

          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Institución educativa a la que pertenece
            </label>
            <input
              name="institucion"
              value={formData.institucion}
              onChange={handleChange}
              maxLength={20}  
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                camposInvalidos.includes("nombre_alumno") ? "border-red-500" : "border-gray-200"
              }`}                
              type="text"
              placeholder="Ingrese institución educativa del alumno que figure para el presente año escolar"
              required
            />
              {camposInvalidos.includes("institucion") && (
                <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
              )}
          </div>

          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Contacto Telefónico
            </label>
            <input
              name="contacto"
              value={formData.contacto}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, ""); // elimina todo lo que no sea número
                setFormData((prev) => ({
                  ...prev,
                  contacto: soloNumeros,
                }));
              }}
              maxLength={20}
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                camposInvalidos.includes("contacto") ? "border-red-500" : "border-gray-200"
              }`}
              type="tel"
              placeholder="Ingrese el teléfono de contacto del alumno"
              required
            />
            {camposInvalidos.includes("contacto") && (
              <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
            )}
          </div>

          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Identidad de Género
            </label>
            <div className="relative">
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                  camposInvalidos.includes("nombre_alumno") ? "border-red-500" : "border-gray-200"
                }`}                  
                required

              >
                <option value="" disabled hidden>Indique la identidad de genero del alumno(opcional)</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Intersexual">Intersexual</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </div>
              {camposInvalidos.includes("genero") && (
                <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
              )}
            </div>
          </div>

          <div className="w-full px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Taller al que se inscribe
            </label>
            <div className="relative">
              <select
                name="taller"
                value={formData.taller}
                onChange={handleChange}
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                  camposInvalidos.includes("nombre_alumno") ? "border-red-500" : "border-gray-200"
                }`}               
                >
                <option value="" disabled hidden>Seleccione un taller</option>
                <option value="Acuarela Adultos">Acuarela Adultos</option>
                <option value="Mosaico">Mosaico</option>
                <option value="Encuadernación">Encuadernación</option>
                <option value="Pintura al Óleo">Pintura al Óleo</option>
                <option value="Escuela de Circo">Escuela de Circo</option>
                <option value="Baile Entretenido">Baile Entretenido</option>
                <option value="Danza Árabe">Danza Árabe</option>
                <option value="Ballet Folclórico Municipal">Ballet Folclórico Municipal</option>
                <option value="Ballet">Ballet</option>
                <option value="Guitarra">Guitarra</option>
                <option value="Big Band">Big Band</option>
                <option value="Coro Polifónico">Coro Polifónico</option>
                <option value="Escuela de Talentos">Escuela de Talentos</option>
                <option value="Coro Adulto Mayor">Coro Adulto Mayor</option>
                <option value="Piano">Piano</option>
                <option value="Escuela de Rock">Escuela de Rock</option>
                <option value="Taller de Teatro">Taller de Teatro</option>
                <option value="Teatro Adulto Mayor">Teatro Adulto Mayor</option>
                <option value="Compañía de Teatro">Compañía de Teatro</option>
                <option value="Teatro Inclusivo">Teatro Inclusivo</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Violín">Violín</option>
                <option value="Violoncello">Violoncello</option>
                <option value="Contrabajo">Contrabajo</option>
                <option value="Flauta Traversa">Flauta Traversa</option>
                <option value="Clarinete">Clarinete</option>
                <option value="Bronces">Bronces</option>
                <option value="Percusión">Percusión</option>
                <option value="Plan Formativo Cine">Plan Formativo Cine</option>
                <option value="Plan Formativo Danza">Plan Formativo Danza</option>
                <option value="Plan Formativo Teatro">Plan Formativo Teatro</option>
                <option value="Plan Formativo Artes Visuales">Plan Formativo Artes Visuales</option>
                <option value="Plan Formativo Fotografía">Plan Formativo Fotografía</option>
                <option value="Plan Formativo Música">Plan Formativo Música</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </div>
              {camposInvalidos.includes("taller") && (
                <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
              )}
            </div>
          </div>


          <div className="w-full px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Información relevante (opcional) {/* Nuevo campo añadido aquí */}
            </label>
            <textarea
              name="informacion_relevante"
              value={formData.informacion_relevante}
              onChange={handleChange}
              maxLength={200}  
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="Ingresar información relevante adicional como por ejemplo, alguna enfermedad cronica, alergia, algun cuidado especial o similares"
            />
          </div>

          <div className="w-full px-3 mb-6">
          <div className="w-full justify-between bg-blue-500 text-white text-center py-2 rounded-md shadow-md mb-2">
                <span className="text-lg font-bold uppercase tracking-wide">Datos del apoderado</span>
          </div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Nombre y Apellido del apoderado
            </label>
            <input
              name="nombre_apellido_apoderado"
              value={formData.nombre_apellido_apoderado}
              onChange={handleChange}
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                camposInvalidos.includes("nombre_alumno") ? "border-red-500" : "border-gray-200"
              }`}               
              type="text"
              placeholder="Ingrese el nombre y apellido del apoderado"
            />
              {camposInvalidos.includes("nombre_apellido_apoderado") && (
                <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
              )}
          </div>
          <div className="w-full px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Teléfono del apoderado
            </label>
            <input
              name="telefono_apoderado"
              value={formData.telefono_apoderado}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({
                  ...prev,
                  telefono_apoderado: soloNumeros,
                }));
              }}
              type="tel"
              maxLength={20}
              placeholder="Ingrese el teléfono del apoderado"
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                camposInvalidos.includes("telefono_apoderado") ? "border-red-500" : "border-gray-200"
              }`}
            />
            {camposInvalidos.includes("telefono_apoderado") && (
              <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
            )}
          </div>


          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Correo del apoderado
            </label>
            <input
              name="correo_apoderado"
              value={formData.correo_apoderado}
              onChange={handleChange} 
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
                camposInvalidos.includes("nombre_alumno") ? "border-red-500" : "border-gray-200"
              }`}                
              type="text"
              placeholder="Ingrese correo del apoderado"
              required
            />
              {camposInvalidos.includes("correo_apoderado") && (
                <p className="text-red-500 text-xs italic mt-1">Este campo es obligatorio.</p>
              )}
          </div>

          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Nombre de un contacto adicional
            </label>
            <input
              name="nombre_contacto_adicional"
              value={formData.nombre_contacto_adicional}
              onChange={handleChange} 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Ingrese el nombre del contacto adicional(opcional)"
              required
            />
          </div>

          <div className="w-full px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Teléfono del contacto adicional
            </label>
            <input
              name="telefono_contacto_adicional"
              value={formData.telefono_contacto_adicional}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({
                  ...prev,
                  telefono_contacto_adicional: soloNumeros,
                }));
              }}
              type="tel"
              maxLength={20}
              placeholder="Ingrese el teléfono del contacto adicional (opcional)"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>


          <div className="w-full px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Correo del contacto adicional
            </label>
            <input
              name="correo_contacto_adicional"
              value={formData.correo_contacto_adicional} 
              onChange={handleChange}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Ingrese el telefono del contacto adicional(opcional)"
            />
          </div>

         { <div className="w-full px-3 mb-6">
            <div className="w-full justify-between bg-blue-500 text-white text-center py-2 rounded-md shadow-md mb-2">
                <span className="text-lg font-bold uppercase tracking-wide">Documentos adjuntos</span>
            </div> 
            <div className="flex flex-col"> 
              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  name="documento1"
                  className="form-checkbox"
                  checked={formData.documento1}
                  onChange={handleChange}
                />
                <span className="ml-2">CERTIFICADO RESIDENCIA</span>
              </label>

              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  name="documento2"
                  className="form-checkbox"
                  checked={formData.documento2}
                  onChange={handleChange}
                />
                <span className="ml-2">CERTIFICADO NACIMIENTO</span>
              </label>

              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  name="documento3"
                  className="form-checkbox"
                  checked={formData.documento3}
                  onChange={handleChange}
                />
                <span className="ml-2">DECLARACIÓN JURADA</span>
              </label>
            </div>
          </div>
}

        </div>

        {/*
        <button
          type="button" onClick={handleGeneratePDF}
          disabled={!isFormComplete()} // ✅ Se deshabilita si falta algún campo obligatorio
          className={`w-full p-3 rounded mt-4 ${
            isFormComplete() ? "bg-lime-600 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Visualizar PDF
        </button>
        */}
        {errorVisible && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
            Por favor completa todos los campos obligatorios antes de enviar.
          </div>
        )}
        {/* Botón para enviar a Google Sheets */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition duration-300 ease-in-out
              ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
              text-white flex items-center gap-2 shadow-md`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                Enviando...
              </>
            ) : (
              'Enviar'
            )}
          </button>
        </div>

      </div>
    </div>
    </>
  );

}
  

export default Formulario;