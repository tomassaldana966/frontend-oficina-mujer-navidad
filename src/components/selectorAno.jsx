import Select from "react-select";

export const SelectorAno = ({ formData, handleChange, errors }) => {
  const id = "text_20sknx";
  const label = "Año del taller";

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear + 3 - 2024 + 1 },
    (_, i) => {
      const year = 2024 + i;
      return { value: year, label: year.toString() };
    }
  ).reverse(); // Años recientes arriba

  const selectedValue =
    yearOptions.find((opt) => opt.value === formData[id]) ||
    yearOptions.find((opt) => opt.value === currentYear);


  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <Select
        inputId={id}
        name={id}
        options={yearOptions}
        defaultValue={2025}
        value={selectedValue || null}
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
            backgroundColor: "#f8e3ff",
            color: "#374151",
            borderColor: errors[id] ? "#ef4444" : "#d1d5db",
            borderRadius: "0.375rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            fontSize: "1rem",
            boxShadow: state.isFocused ? "0 0 0 2px #ce35ff" : base.boxShadow,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#ce35ff"
              : state.isFocused
              ? "#e8a5ff"
              : "white",
            color: "#111827",
            cursor: "pointer",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 10,
          }),
          singleValue: (base) => ({
            ...base,
            color: "#111827",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
          }),
        }}
        placeholder="Selecciona un año"
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );
};
