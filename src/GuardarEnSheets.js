const GuardarEnSheets = async (datosFormulario) => {
  const url = import.meta.env.VITE_BACKEND_APPSCRIPT;
  console.log("URL DE CALL:", url);
  console.log("Datos a enviar:", datosFormulario);
  console.log('API:', import.meta.env.VITE_BACKEND_APPSCRIPT);


  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}` // opcional, si quieres seguridad
      },
      body: JSON.stringify(datosFormulario),
    });

    if (!response.ok) {
      throw new Error(`❌ Error HTTP: ${response.status}`);
    }

    const result = await response.json(); // ← aquí recoges lo que devuelve doPost
      const sheetsResponse = JSON.parse(result.respuesta)
    if (sheetsResponse.status !== "success") {
      throw new Error(`❌ Error en Apps Script: ${result.message}`);
    }

    console.log("✅ Datos guardados correctamente en Google Sheets");
    return result;

  } catch (error) {
    console.error("❌ Error al enviar los datos:", error);
    throw error; // relanza si quieres manejarlo en otra parte
  }
};

export default GuardarEnSheets;
