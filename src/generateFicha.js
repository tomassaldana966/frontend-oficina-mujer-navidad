import { subirPDFaDrive } from './googleSubida.js';

export async function generarFichaDesdePlantilla(formData) {
  const PDF_TEMPLATE_URL = "/ficha_inscripcion.pdf"; // desde carpeta public

  try {
    // 1. Descargar el PDF desde la carpeta public
    const response = await fetch(PDF_TEMPLATE_URL);
    const pdfBlob = await response.blob();

    if (!pdfBlob || pdfBlob.type !== "application/pdf") {
      throw new Error("❌ No se pudo obtener el PDF base");
    }

    // 2. Cargar el PDF y preparar el formulario
    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
    const form = pdfDoc.getForm();

    // 🎯 Asociación entre campos de texto del formulario y campos PDF
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
      checkbox_17cerm: formData.documento1,
      checkbox_18ztvs: formData.documento2,
      checkbox_19txlh: formData.documento3,
    };
    
    for (const [campo, estado] of Object.entries(mapeoCheckbox)) {
      try {
        const field = form.getField(campo); // Usamos getField en vez de getCheckBox
    
        console.log(`🧪 Campo '${campo}' tipo: ${field.constructor.name}`);
    
        if (field.constructor.name === "PDFCheckBox") {
          if (estado) {
            field.check();
          } else {
            field.uncheck();
          }
        } else {
          console.warn(`⚠️ '${campo}' no es un campo tipo checkbox`);
        }
      } catch (e) {
        console.warn(`❌ Campo '${campo}' no encontrado.`, e);
      }
    }

    console.log("📦 Campos PDF disponibles:", form.getFields().map(f => f.getName()));

    // ✅ Flatten solo una vez al final
    form.flatten();

    // 3. Generar el PDF final como Blob
    const pdfBytes = await pdfDoc.save();
    const finalBlob = new Blob([pdfBytes], { type: "application/pdf" });

    const nombre_alumno = `Ficha - ${formData.nombre_alumno}`;
    const result = await subirPDFaDrive(finalBlob, nombre_alumno, import.meta.env.VITE_FOLDER_ID);

    console.log("✅ Documento subido a Drive:", result);

    return `https://drive.google.com/file/d/${result.id}/view`;

  } catch (error) {
    console.error("❌ Error generando ficha desde PDF:", error);
    throw error;
  }
}
