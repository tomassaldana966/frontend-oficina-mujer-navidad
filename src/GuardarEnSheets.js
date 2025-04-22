const GuardarEnSheets = async (datosFormulario) => {
  const url = import.meta.env.VITE_APPSCRIPT // Reemplaza con tu URL del script de Google Apps
console.log(JSON.stringify(datosFormulario))
  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors", // Google Apps Script no necesita CORS
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosFormulario),
    });
console.log(response)
    console.log("Datos enviados a Google Sheets");
  } catch (error) {
    console.error("Error al enviar los datos:", error);
  }
};

export default GuardarEnSheets;