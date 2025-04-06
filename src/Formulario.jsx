import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { generarPDF } from "./generatePDF";
import logo from "./assets/logos/sflogosvg.png";
import logo4 from "./assets/logos/SF3.jpg";
import panoramica2 from "./assets/logos/FOTO_PANORAMICA_SF_2.jpg";
import GuardarEnSheets from "./GuardarEnSheets";

function Formulario() {
  const [formData, setFormData] = useState({
    nombre_alumno: "",
    apellidos_alumno: "",
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
    informacion_relevante: "",
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
    
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,  // 👈 Maneja checkboxes y inputs de texto
    }));
  };


  
  const handleGeneratePDF = () => {
    generarPDF(formData);
    toast.success("PDF generado exitosamente");
  };
  
  //Indica los campos que son obligatorios para obtener la visuualización del formulario. Además '&&' (es sintaxis) dice que se debe ingresar otro campo. Cuando ya no hay mas campos que agregar entonces no se coloca &&
  const isFormComplete = () => {
    return (
      formData.nombre_alumno &&
      formData.apellidos_alumno &&
      formData.edad &&
      formData.domicilio &&
      formData.institucion &&
      formData.contacto &&
      formData.taller &&
      formData.informacion_relevante &&
      formData.nombre_apellido_apoderado &&
      formData.telefono_apoderado &&
      formData.correo_apoderado
    );
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    GuardarEnSheets(formData);
    alert("Datos enviados correctamente");
  };

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
  

  return (
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

        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-200 p-4 mb-6 rounded relative overflow-hidden">
          <div
            className={`absolute inset-0 transition-opacity duration-2000`} // Ajustar duración para la transición de opacidad
          >
            <img src={logo4} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
          </div>

          <div className="relative z-10 w-32 h-32 flex items-center justify-center">
            <img src={logo} className="w-full h-full object-contain" />
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Ingresar nombres y apellidos del alumno"
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
              placeholder="Ingrese dirección de domicilio"
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
              placeholder="Ingrese institución educativa del alumno que figure para el presente año escolar"
              required
            />
          </div>

          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Contacto Telefonico
            </label>
            <input
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              maxLength={20}  
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Ingrese el telefono de contacto del alumno"
              required
            />
          </div>

          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Identidad de Género
            </label>
            <div className="relative">
              <select
                name="identidad"
                value={formData.identidad}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
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
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
              onChange={handleChange}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Ingrese el telefono del contacto adicional(opcional)"
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
                <span className="ml-2">Certificado</span>
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

        {/* Botón para enviar a Google Sheets */}
        <button 
          type="submit" 
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleSubmit}
        >
          Enviar
        </button>

      </div>
    </div>
  );

}
  

export default Formulario;