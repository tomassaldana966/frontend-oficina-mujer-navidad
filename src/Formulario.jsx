import { useState } from "react";
import logo from "./assets/logos/sflogosvg.png";
import logo4 from "./assets/logos/SF3.jpg";
import DtoMujer from "./assets/logos/DtoMujer.svg";
import MCCDLogo from "./assets/logos/MCCDLogo.svg";
import panoramica2 from "./assets/logos/mujerTaller3.webp";
import Swal from "sweetalert2";
import selects from "./optionsSelect.json"
import Select from "react-select";

const REQUIRED_FIELDS = [
  "text_nombre_taller",
  "text_monitor",
  "text_dia",
  "text_horario",
  //"text_nombre_completo",
  "text_cedula",
  "text_nacionalidad",
  "text_fecha_nacimiento",
  "text_escolaridad",
  "text_estado_civil",
  "text_domicilio",
  "text_telefono",
  "text_semestre",
  //no directos
  "text_nombres",
  "text_apellidos"
];

const Formulario = () => {
  const [formData, setFormData] = useState({
    text_nombre_taller: "",
    text_monitor: "",
    text_dia: "",
    text_horario: "",
    text_nombre_completo: "",
    text_nombres:"",
    text_apellidos:"",
    text_cedula: "",
    text_nacionalidad: "",
    text_fecha_nacimiento: "",
    text_escolaridad: "",
    text_estado_civil: "",
    text_domicilio: "",
    text_telefono: "",
    text_enfermedades: "",
    text_discapacidad: "",
    text_derivacion: "",
    text_otros_talleres: "",
    text_semestre: "",
    text_20sknx: "",
    checkbox_19bqbu: false,
    checkbox_20ddbp: false,
    checkbox_21ybso: false,
  });

  const [errors, setErrors] = useState({});

  function validarRUT(rutCompleto) {
    rutCompleto = rutCompleto.replace(/[.-]/g, "").toUpperCase();
  
    if (!/^\d{7,8}[0-9K]$/.test(rutCompleto)) return false;
  
    const cuerpo = rutCompleto.slice(0, -1);
    const dv = rutCompleto.slice(-1);
  
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplicador;
      multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }
  
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado =
      dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
  
    return dv === dvCalculado;
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpiar error al escribir
  };

const validate = () => {
  const newErrors = {};
  REQUIRED_FIELDS.forEach((field) => {
    const value = formData[field];
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      newErrors[field] = "Este campo es obligatorio";
    }
  });
  console.log(newErrors)
  return newErrors;
};


  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    let nombreCompleto = formData.text_nombres + " " + formData.text_apellidos
    setFormData((prev) => ({ ...prev, ["text_nombre_completo"]: nombreCompleto }));


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor, completa todos los campos requeridos.",
      });
      return;
    }
    if (!validarRUT(formData.text_cedula)) {
      newErrors["text_cedula"] = "El RUT ingresado no es válido.";
      setErrors(newErrors);
      Swal.fire({
        icon: "error",
        title: "RUT inválido",
        text: "El RUT ingresado no es válido. Por favor revísalo.",
        confirmButtonColor: "#f27474",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      setCamposInvalidos([]);
      setErrorVisible(false);
  
/*       GuardarEnSheets(formData);
      await generarFichaDesdePlantilla(formData); */
  
      setIsSubmitting(false);
  
      Swal.fire({
        icon: 'success',
        title: '¡Enviado!',
        text: 'Los datos se guardaron y el documento fue generado con éxito.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      resetearFormulario();

  
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

  const renderInput = (id, label, type = "text") => (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={formData[id]}
        onChange={handleChange}
        className={`appearance-none block w-full bg-electricViolet-100 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${errors[id] ? "border border-red-500" : ""}`}
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );


const renderSelect = (id, label, options = []) => (
  <div>
    <label htmlFor={id} className="font-medium">
      {label}
    </label>
    <Select
      inputId={id}
      name={id}
      options={options}
      value={options.find((opt) => opt.value === formData[id]) || null}
      onChange={(selectedOption) =>
        handleChange({
          target: {
            name: id,
            value: selectedOption ? selectedOption.value : "",
          },
        })
      }
      isClearable
      className="mb-1"
      classNamePrefix="react-select"
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: '#f8e3ff', // electricViolet-100
          color: '#374151', // text-gray-700
          borderColor: errors[id] ? '#ef4444' : '#d1d5db', // red-500 o gray-300
          borderRadius: '0.375rem', // rounded
          paddingTop: '0.5rem', // py-3
          paddingBottom: '0.5rem',
          paddingLeft: '1rem', // px-4
          paddingRight: '1rem',
          fontSize: '1rem',
          boxShadow: state.isFocused ? '0 0 0 2px #ce35ff' : base.boxShadow, // focus:outline con electricViolet-500
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? '#ce35ff' // electricViolet-500
            : state.isFocused
            ? '#e8a5ff' // electricViolet-300
            : 'white',
          color: '#111827', // text-gray-900
          cursor: 'pointer',
        }),
        menu: (base) => ({
          ...base,
          zIndex: 10,
        }),
        singleValue: (base) => ({
          ...base,
          color: '#111827', // text-gray-900
        }),
        placeholder: (base) => ({
          ...base,
          color: '#9ca3af', // text-gray-400
        }),
      }}
      placeholder="Selecciona una opción"
    />
    {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
  </div>
);


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${panoramica2})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md relative z-10 h-[90vh] overflow-y-auto">
        <div className="bg-electricViolet-300 text-electricViolet-950 text-center py-2 rounded-md shadow-md mb-4">
          <span className="text-lg font-bold uppercase tracking-wide">Oficina de la Mujer</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-200 p-4 mb-6 rounded relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={logo4} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
          </div>
          <img src={MCCDLogo} className="p-5 absolute right-4 top-1/2 transform -translate-y-1/2 w-40 max-w-[150px] h-auto object-contain z-10" />
          <img src={DtoMujer} className="p-5 absolute right-4 top-1/2 transform -translate-x-24 -translate-y-1/2 w-40 max-w-[150px] h-auto object-contain z-10 " />
          <div className="relative z-10 w-24 h-24 flex items-center justify-center">
            <img src={logo} className="w-full h-full object-contain z-20" alt="Logo principal" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-electricViolet-300 text-electricViolet-950 text-center py-2 rounded-md shadow-md mb-4">
            <span className="text-lg font-bold uppercase tracking-wide">Información del Taller</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {renderSelect("text_nombre_taller","Taller", selects.talleres)}
            {renderInput("text_monitor", "Monitor(a)")}
            {renderInput("text_dia", "Día")}
            {renderInput("text_horario", "Horario")}
            {renderSelect("text_semestre", "Semestre",selects.semestre)}
            </div>


        <div className="grid grid-cols-1 gap-4">
          <div className="bg-electricViolet-300 text-electricViolet-950 text-center py-2 rounded-md shadow-md my-4">
            <span className="text-lg font-bold uppercase tracking-wide">Información de alumna</span>
          </div>

            <div>
            <label htmlFor={"text_cedula"} className="font-medium">
            {"Cédula de Identidad"}
            </label>
            <input
            onChange={(e) => handleChange(e)}
            id={"text_cedula"}
            name={"text_cedula"}
            type={"text"}
            value={formData["text_cedula"]}
            maxLength={12}  
            className={`appearance-none block w-full bg-electricViolet-100 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${errors["text_cedula"] ? "border border-red-500" : ""}`}
            />
            {errors["text_cedula"] && <p className="text-red-500 text-sm">{errors["text_cedula"]}</p>}
            </div>


            {/* {renderInput("text_cedula", "Cédula de Identidad")} */}
            {renderInput("text_nombres", "Nombres")}
            {renderInput("text_apellidos", "Apellidos")}
            {/* {renderInput("text_nombre_completo", "Nombre completo")} */}
            {renderSelect("text_nacionalidad", "Nacionalidad",selects.nacionalidad)}
            {renderInput("text_fecha_nacimiento", "Fecha de nacimiento")}
            {renderSelect("text_escolaridad", "Escolaridad",selects.escolaridad)}
            {renderSelect("text_estado_civil", "Estado civil",selects.estadoCivil)}
            {renderInput("text_domicilio", "Domicilio")}
            {renderInput("text_telefono", "Teléfono de contacto")}
            {renderInput("text_enfermedades", "¿Enfermedad preexistente?")}
            {renderInput("text_discapacidad", "¿Discapacidad?")}
            {renderInput("text_derivacion", "¿Derivación?")}
            {renderInput("text_otros_talleres", "¿Ha recibido otro taller? ¿Cuál/es?")}
          </div>

          <div className="bg-electricViolet-300 text-electricViolet-950 text-center py-2 rounded-md shadow-md mt-6 mb-4">
            <span className="text-lg font-bold uppercase tracking-wide">Documentación</span>
          </div>

          <label htmlFor="text_20sknx" className="font-medium">Año</label>
          <input
            id="text_20sknx"
            name="text_20sknx"
            value={formData.text_20sknx}
            onChange={handleChange}
            className="input mb-4 ml-5"
            readOnly
          />

          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center">
              <input type="checkbox" name="checkbox_19bqbu" checked={formData.checkbox_19bqbu} onChange={handleChange} className="form-checkbox" />
              <span className="ml-2">Fotocopia Cédula de Identidad</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" name="checkbox_20ddbp" checked={formData.checkbox_20ddbp} onChange={handleChange} className="form-checkbox" />
              <span className="ml-2">Registro Social de Hogares</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" name="checkbox_21ybso" checked={formData.checkbox_21ybso} onChange={handleChange} className="form-checkbox" />
              <span className="ml-2">Otro documento</span>
            </label>
          </div>

          <div className="flex justify-center mt-6">
            <button type="submit" className="text-lg uppercase bg-electricViolet-300 text-electricViolet-950 px-6 py-2 rounded hover:bg-electricViolet-700 transition">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulario;
