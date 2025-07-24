import Select from "react-select";
import comunasChile from "./comunasChile.json"; // archivo JSON con { label: "Santiago, Región Metropolitana", value: "Santiago" }

export const SelectorDomicilio = ({ formData, handleChange, errors }) => {
  const id = "text_domicilio";
  const label = "Comuna o domicilio";

  return (
    <div>
      <label htmlFor={id} className="font-medium">{label}</label>
      <Select
        inputId={id}
        name={id}
        options={comunasChile}
        value={comunasChile.find((opt) => opt.value === formData[id]) || null}
        onChange={(selected) =>
          handleChange({ target: { name: id, value: selected?.value || "" } })
        }
        isClearable
        placeholder="Selecciona una comuna o escribe..."
        className="mb-1"
        classNamePrefix="react-select"
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );
};
