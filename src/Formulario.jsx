import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Toaster, toast } from "react-hot-toast";
import AuthButtons from "./AuthButtons"; 
import logo from "./assets/logos/sflogosvg.png";
import logo4 from "./assets/logos/SF3.jpg";
import panoramica2 from "./assets/logos/FOTO_PANORAMICA_SF_2.jpg";

function Formulario() {
  // ✅ Hooks en el mismo orden SIEMPRE
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // ✅ Estado del formulario
  const [formData, setFormData] = useState({
    nombre_alumno: "",
    apellidos_alumno: "",
    edad: "",
    domicilio: "",
    institucion: "",
    contacto: "",
    taller: "",
    informacion_relevante: "",
    nombre_apellido_apoderado: "",
    telefono_apoderado: "",
    correo_apoderado: "",
    nombre_contacto_adicional: "",
    telefono_contacto_adicional: "",
    peticion: "",
    finalidad: "",
    informe: "",
    descripcionInforme: "",
    documento1: false,
    documento2: false,
    documento3: false,
  });

  // ✅ Redirigir solo si no está autenticado y no está cargando
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  // ✅ Mostrar "Cargando..." mientras espera autenticación
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando sesión...</div>;
  }

  // ✅ Evita que la pantalla quede en blanco
  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Redirigiendo...</div>;
  }

  // ✅ Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGeneratePDF = () => {
    toast.success("PDF generado exitosamente");
  };

  const isFormComplete = () => {
    const isComplete =
      formData.nombre_alumno &&
      formData.apellidos_alumno &&
      formData.edad &&
      formData.domicilio &&
      formData.institucion &&
      formData.contacto &&
      formData.taller &&
      formData.documento1 &&
      formData.documento3;
  
    console.log("Estado de los campos del formulario:", formData); // 🔍 Muestra el estado completo
    console.log("documento1:", formData.documento1, "| documento3:", formData.documento3); // 🔍 Verifica valores específicos
    console.log("¿Está el formulario completo?", isComplete); // 🔍 Verifica el resultado final
  
    return isComplete;
  };
  
  

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${panoramica2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔹 Botón de Logout en la parte superior */}
      <AuthButtons />

      <Toaster />

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-200 p-4 mb-6 rounded relative overflow-hidden">
          {/* Imagen de fondo con filtro azul */}
          <div className="absolute inset-0 transition-opacity duration-2000">
            <img src={logo4} className="w-full h-full object-cover" alt="Fondo" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
          </div>

          {/* Logo en primer plano */}
          <div className="relative z-10 w-32 h-32 flex items-center justify-center">
            <img src={logo} className="w-full h-full object-contain" alt="Logo" />
          </div>
        </div>

        <div className="w-full bg-blue-500 text-white text-center py-2 rounded-md shadow-md mb-2">
          <span className="text-lg font-bold uppercase tracking-wide">Datos del alumno</span>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Nombre del alumno
            </label>
            <input
              name="nombre_alumno"
              value={formData.nombre_alumno}
              onChange={handleChange}
              maxLength={20}  
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Ingrese el nombre del alumno"
              required
            />
          </div>

        
        <div className="w-full px-3 mb-2">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Apellidos del alumno 
          </label>
          <input
            name="apellidos_alumno"
            value={formData.apellidos_alumno}
            onChange={handleChange}
            maxLength={20}  
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            placeholder="Ingrese el nombre y apellido de la persona que este llenando el formulario"
            required
          />
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="number"
              min="0"
              step="1"
              placeholder="Ingrese edad"
              required
            />
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
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Ingrese contacto"
                required
              />
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
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Ingrese contacto"
                required
              />
            </div>
  
            <div className="w-full px-3 mb-2">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                contacto
              </label>
              <input
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                maxLength={20}  
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Ingrese contacto"
                required
              />
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
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" disabled hidden>Seleccione una taller</option>  {/* ✅ No aparece luego de seleccionar */}
                  <option value="Taller 1">Taller 1</option>
                  <option value="Taller 2">Taller 2</option>
                  <option value="Taller 3">Taller 3</option>
                  <option value="Taller 4">Taller 4</option>
                  <option value="Taller 5">Taller 5</option>
                  <option value="Taller 6">Taller 6</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
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
                placeholder="Ingresar información relevante adicional"
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
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                placeholder="Ingrese el nombre y apellido del apoderado"
              />
            </div>
            <div className="w-full px-3 mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Teléfono del apoderado
              </label>
              <input
                name="telefono_apoderado"
                value={formData.telefono_apoderado} 
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                placeholder="Ingrese el telefono del apoderado"
              />
            </div>
  
            <div className="w-full px-3 mb-2">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Correo del apoderado
              </label>
              <input
                name="correo_apoderado"
                value={formData.correo_apoderado}
                onChange={handleChange} 
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Ingrese correo del apoderado"
                required
              />
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
                placeholder="Ingrese el nombre del contacto adicional"
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
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                placeholder="Ingrese el telefono del contacto adicional"
              />
            </div>
  
            <div className="w-full px-3 mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Informe o Dato en Bruto
              </label>
              <div className="relative">
                <select
                  name="informe"
                  value={formData.informe}
                  onChange={handleChange}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" disabled hidden>Seleccione una opción</option>  {/* ✅ Ahora solo aparece al inicio */}
                  <option value="Informe">Informe</option>
                  <option value="Dato en Bruto">Dato en bruto</option>
                  <option value="Ambos">Ambos</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>
            </div>
  
            {["Informe", "Ambos"].includes(formData.informe) && (
              <div className="w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Descripción del Informe
                </label>
                <textarea
                  name="descripcionInforme"
                  value={formData.descripcionInforme}
                  onChange={handleChange}
                  maxLength={300}  
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Describa el informe requerido"
                />
              </div>
            )}
  
            <div className="w-full px-3 mb-6">
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
                  <span className="ml-2">Documento 1</span>
                </label>
  
                <label className="inline-flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="documento2"
                    className="form-checkbox"
                    checked={formData.documento2}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Documento 2</span>
                </label>
  
                <label className="inline-flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="documento3"
                    className="form-checkbox"
                    checked={formData.documento3}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Documento 3</span>
                </label>
              </div>
            </div>

        </div>     

        <button
          type="button"
          onClick={handleGeneratePDF}
          disabled={!isFormComplete()}
          className={`w-full p-3 rounded mt-4 ${
            isFormComplete() ? "bg-lime-600 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Visualizar PDF
        </button>
      </div>
    </div>
  );
}

export default Formulario;
