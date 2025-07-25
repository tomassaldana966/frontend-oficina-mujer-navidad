import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);

export const SelectorFechaNacimiento = ({ formData, handleChange, errors }) => {
  const id = "text_fecha_nacimiento";
  const label = "Fecha de nacimiento";

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleDateChange = (date) => {
    if (!date) {
      handleChange({ target: { name: id, value: "" } });
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`; // formato para backend
    handleChange({ target: { name: id, value: formatted } });
  };

  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <br />
      <DatePicker
        selected={formData[id] ? parseLocalDate(formData[id]) : null}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        locale="es"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        placeholderText="Selecciona la fecha"
        className={`appearance-none block w-full bg-electricViolet-100 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white ${
          errors[id] ? "border border-red-500" : ""
        }`}
        maxDate={new Date()}
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );
};
