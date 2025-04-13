export async function generarFichaDesdePlantilla(formData) {
  const PDF_TEMPLATE_URL = "/ficha_inscripcion.pdf"; // desde carpeta public
  const FOLDER_ID = "10E9AijSEz2JoC0rPjkizG1zdiQRhn0wx"; // carpeta en Drive

  try {
    // 1. Descargar el PDF de la carpeta public
    const response = await fetch(PDF_TEMPLATE_URL);
    const pdfBlob = await response.blob();

    if (!pdfBlob || pdfBlob.type !== "application/pdf") {
      throw new Error("❌ No se pudo obtener el PDF base");
    }

    // 2. Leer y rellenar el PDF (requiere PDF-LIB)
    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
    const form = pdfDoc.getForm();

    // 🎯 Asociación entre campos del formulario y campos PDF
    const mapeoTexto = {
      text_2afuq: formData.nombre_alumno,
      text_3jrhy: formData.edad,
      text_4rkrt: formData.contacto,
      text_5phrt: formData.domicilio,
      text_6vtfk: formData.genero,
      textarea_8zzra: formData.institucion,
      textarea_9ekre: formData.informacion_relevante,
      text_10tjbl: formData.nombre_apellido_apoderado,
      text_11lvps: formData.telefono_apoderado,
      text_12xvuk: formData.correo_apoderado,
      text_13atlg: formData.nombre_contacto_adicional,
      text_14ldca: formData.telefono_contacto_adicional,
      text_15yayv: formData.correo_contacto_adicional,
      text_16by: formData.taller,
    };

    for (const [campo, valor] of Object.entries(mapeoTexto)) {
      try {
        form.getTextField(campo).setText(valor || "");
      } catch {
        console.warn(`⚠️ Campo de texto '${campo}' no encontrado.`);
      }
    }

    // ✅ Asociación de checkboxes
    const mapeoCheckbox = {
      checkbox_17qnfm: formData.documento1,
      checkbox_1vm9s: formData.documento2,
      checkbox_14gtu1: formData.documento3,
    };

    for (const [campo, estado] of Object.entries(mapeoCheckbox)) {
      try {
        const checkbox = form.getCheckBox(campo);
        if (estado) {
          checkbox.check();
        } else {
          checkbox.uncheck(); // opcional, por si hay algún caso que venga preseleccionado
        }
      } catch {
        console.warn(`⚠️ Checkbox '${campo}' no encontrado.`);
      }
    }


    form.flatten(); // Opcional: convierte campos en texto plano

    // 3. Generar nuevo PDF como blob
    const pdfBytes = await pdfDoc.save();
    const finalBlob = new Blob([pdfBytes], { type: "application/pdf" });

    // 4. Subir el nuevo PDF a Google Drive
    const metadata = {
      name: `Ficha - ${formData.nombre_alumno}.pdf`,
      mimeType: "application/pdf",
      parents: [FOLDER_ID],
    };

    const formDataDrive = new FormData();
    formDataDrive.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    formDataDrive.append("file", finalBlob);

    const uploadResponse = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${gapi.auth.getToken().access_token}`,
        }),
        body: formDataDrive,
      }
    );

    const result = await uploadResponse.json();
    console.log("✅ Documento subido a Drive:", result);

    return `https://drive.google.com/file/d/${result.id}/view`;

  } catch (error) {
    console.error("❌ Error generando ficha desde PDF:", error);
    throw error;
  }
}
