export async function generarFichaDesdePlantilla(formData) {
  const TEMPLATE_ID = "1ZSZ1DOV-McQz4Uaa81IK5eUcOd8Vdbifl96FxeJ6hgE";

  try {
    const gapiClient = window.gapi.client;

    // 🧠 Verifica y muestra cuál cuenta está autenticada
    const email = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getBasicProfile()
      .getEmail();

    console.log("✅ Usuario autenticado:", email); // DEBE ser serviciodedatos@munisanfernando.com

    // 🧩 Copiar el documento
    const copyResponse = await gapiClient.drive.files.copy({
      fileId: TEMPLATE_ID,
      supportsAllDrives: true, // ✅ correcto
      resource: {
        name: `Ficha - ${formData.nombre_alumno} ${formData.apellidos_alumno}`,
      },
    });
    

    const newDocId = copyResponse.result.id;

    // 🛠 Reemplazo de campos
    const requests = Object.entries(formData).map(([clave, valor]) => ({
      replaceAllText: {
        containsText: {
          text: `{{${clave}}}`,
          matchCase: true,
        },
        replaceText: valor,
      },
    }));

    await gapiClient.docs.documents.batchUpdate({
      documentId: newDocId,
      resource: { requests },
    });

    return `https://docs.google.com/document/d/${newDocId}/edit`;
  } catch (error) {
    console.error("❌ Error generando la ficha:", error);
    throw error;
  }
}
