export async function generarFichaDesdePlantilla(formData) {
    const TEMPLATE_ID = "1SlUiID-3jJRNFu78QtzfNmgJrzobuRo52HuBXRX6JK4";
  
    try {
      const gapiClient = window.gapi.client;
  
      const copyResponse = await gapiClient.drive.files.copy({
        fileId: TEMPLATE_ID,
        resource: {
          name: `Ficha - ${formData.nombre_alumno} ${formData.apellidos_alumno}`,
          // ❌ Puedes comentar esto si no estás usando carpeta destino
          // parents: ["ID_CARPETA"]
        },
      });
  
      const newDocId = copyResponse.result.id;
  
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
  