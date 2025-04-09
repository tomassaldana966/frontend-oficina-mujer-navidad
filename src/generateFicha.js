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

    // 🎯 Asociación manual entre campos PDF y datos
    const mapeo = {
      text_1moeg: formData.nombre_alumno,
      text_tgkbv: formData.edad,
      text_qxvls: formData.domicilio,
      text_tcvjd: formData.genero,
      text_o8ogj: formData.institucion,
      text_ih9zx: formData.contacto,
      text_1aq7p: formData.taller,
      text_gnfdm: formData.informacion_relevante,
      text_bhztd: formData.nombre_apellido_apoderado,
      text_p8qdy: formData.telefono_apoderado,
      text_7q29e: formData.correo_apoderado,
      text_xrqu9: formData.nombre_contacto_adicional,
      text_jrrfn: formData.telefono_contacto_adicional,
      text_ufvty: formData.correo_contacto_adicional,
    };

    for (const [campo, valor] of Object.entries(mapeo)) {
      try {
        form.getTextField(campo).setText(valor || "");
      } catch (e) {
        console.warn(`⚠️ Campo PDF '${campo}' no encontrado.`);
      }
    }

    form.flatten(); // Opcional: convertir campos en texto plano

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
