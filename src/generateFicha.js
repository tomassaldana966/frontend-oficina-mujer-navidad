export async function generarFichaDesdePlantilla(formData) {
  const TEMPLATE_ID = "1SlUiID-3jJRNFu78QtzfNmgJrzobuRo52HuBXRX6JK4";

  try {
    const gapiClient = window.gapi.client;

    if (!gapiClient?.drive || !gapiClient?.docs) {
      console.error("❌ GAPI no está completamente cargado.");
      throw new Error("GAPI no cargado");
    }

    if (!formData || typeof formData !== "object") {
      console.error("❌ formData inválido o no proporcionado:", formData);
      throw new Error("formData inválido");
    }

    const nombreAlumno = formData?.nombre_alumno || "SIN_NOMBRE";
    const apellidosAlumno = formData?.apellidos_alumno || "";

    console.log("📂 Iniciando copia de plantilla...");

    const copyResponse = await gapiClient.drive.files.copy({
      fileId: TEMPLATE_ID,
      supportsAllDrives: true,
      resource: {
        name: `Ficha - ${nombreAlumno} ${apellidosAlumno}`,
      },
    });

    const newDocId = copyResponse.result.id;
    console.log("✅ Documento copiado:", newDocId);

    // Obtener el documento para extraer los marcadores
    const docResponse = await gapiClient.docs.documents.get({
      documentId: newDocId,
      supportsAllDrives: true,
    });

    const doc = docResponse.result;
    const bookmarks = doc.bookmarks || {};

    console.log("📌 Marcadores encontrados:", bookmarks);

    const requests = [];

    // TEST: Usamos el primer marcador encontrado (solo para testear)
    const marcadorIds = Object.keys(bookmarks);
    if (marcadorIds.length === 0) {
      console.warn("⚠️ No se encontraron marcadores en el documento.");
    } else {
      const primerMarcadorId = marcadorIds[0];
      const index = bookmarks[primerMarcadorId].position.index;

      console.log(`🧷 Usando marcador con ID: '${primerMarcadorId}' en el índice ${index}`);

      requests.push({
        insertText: {
          location: { index },
          text: formData.nombre_alumno || "NOMBRE_NO_ENCONTRADO",
        },
      });
    }

    console.log("🛠️ Enviando reemplazo por marcador:", JSON.stringify(requests, null, 2));

    if (requests.length > 0) {
      await gapiClient.docs.documents.batchUpdate({
        documentId: newDocId,
        supportsAllDrives: true,
        resource: { requests },
      });

      console.log("✅ Documento actualizado correctamente");
    } else {
      console.warn("⚠️ No se enviaron reemplazos porque no se encontraron marcadores.");
    }

    return `https://docs.google.com/document/d/${newDocId}/edit`;

  } catch (error) {
    console.error("❌ Error generando la ficha:", error.result?.error || error);
    throw error;
  }
}
