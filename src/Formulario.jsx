import { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Checkbox, Button, ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import "dayjs/locale/es";

import logo from "./assets/logos/sflogosvg.png";
import logo4 from "./assets/logos/SF3.jpg";
import DtoMujer from "./assets/logos/DtoMujer.svg";
import infLOGO from "./assets/logos/informatica.svg";
import panoramica2 from "./assets/logos/mujerTaller3.webp";

import Swal from "sweetalert2";
import selects from "./optionsSelect.json";
import { initializeGapi } from "./googleAuth";
import GuardarEnSheets from "./GuardarEnSheets";
import { generarFichaDesdePlantilla } from "./generateFicha";
//force deploy vercel
const Formulario = () => {
    initializeGapi();

    const [formData, setFormData] = useState({});
    const [talleresHoja, setTalleres] = useState([]);
    const [loading, setLoading] = useState(false); // <-- nuevo estado

    // Cargar talleres desde Google Sheets
    useEffect(() => {
        const url =
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgRoSlDAGk_575DYTlpnTfuc5OvFI0FDIKuc5Rnda0z6SGDE7sewf_VUUZnmJc9QsDhLUe6LSSkB9V/pub?gid=0&single=true&output=csv";

        fetch(url)
            .then((res) => res.text())
            .then((csvText) => {
                const rows = csvText.split("\n").map((row) => row.trim()).filter(Boolean);
                const formatted = rows.map((row) => {
                    const valor = row.split(",")[0].trim();
                    return { value: valor, label: valor };
                });
                setTalleres(formatted);
            })
            .catch(console.error);
    }, []);

    // Validador de RUT (chileno)
    const validarRUT = (_, value) => {
        if (!value) return Promise.reject("El RUT es obligatorio");
        const clean = value.replace(/[.]/g, "").toUpperCase();
        if (!/^\d{7,8}-[0-9K]$/.test(clean)) return Promise.reject("RUT inválido");

        const [cuerpo, dv] = clean.split("-");

        let suma = 0, mult = 2;

        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo.charAt(i)) * mult;
            mult = mult < 7 ? mult + 1 : 2;
        }

        const dvEsperado = 11 - (suma % 11);
        const dvCalc = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

        return dv === dvCalc ? Promise.resolve() : Promise.reject("RUT inválido");
    };
    const currentYear = new Date().getFullYear();

    // Enviar formulario
    const handleFinish = async (values) => {
        setLoading(true); // activar loading
        try {
            const data = {
                ...values,
                text_nombre_completo: `${values.text_nombres} ${values.text_apellidos}`,
                // Formateos:
                text_fecha_nacimiento: values.text_fecha_nacimiento
                    ? values.text_fecha_nacimiento.format("YYYY-MM-DD")
                    : "",
                text_20sknx: values.text_20sknx
                    ? values.text_20sknx.format("YYYY") // <-- solo aAÑO
                    : currentYear,
            };

            setFormData(data);
            await GuardarEnSheets(data);
            await generarFichaDesdePlantilla(data);
            Swal.fire({
                icon: "success",
                title: "¡Enviado!",
                text: "Los datos se guardaron y el documento fue generado con éxito.",
            });
        } catch (err) {
            console.error("❌ Error al enviar:", err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrió un error al enviar los datos o generar el documento.",
            });
        } finally {
            setLoading(false); // desactivar loading siempre
        }
    };
        // Opciones para select de años 2020-2030
        const anios = Array.from({ length: 11 }, (_, i) => {
            const year = 2020 + i;
            return { value: year.toString(), label: year.toString() };
        });
    return (
        <ConfigProvider locale={esES}>
            <div
                className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
                style={{
                    backgroundImage: `url(${panoramica2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "bottom",
                }}
            >
                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md relative z-10 h-[90vh] overflow-y-auto">
                    {/* Banner superior */}
                    <div className="bg-electricViolet-300 text-electricViolet-950 text-center py-2 rounded-md shadow-md mb-4">
                        <span className="text-lg font-bold uppercase tracking-wide">
                          Oficina de la Mujer
                        </span>
                    </div>

                    {/* Logos */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-200 p-4 mb-6 rounded relative overflow-hidden">
                        <div className="absolute inset-0">
                            <img src={logo4} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
                        </div>
                        <img
                            src={infLOGO}
                            className="p-5 absolute right-4 top-1/2 transform -translate-y-1/2 w-40 h-auto object-contain z-10"
                        />
                        <img
                            src={DtoMujer}
                            className="p-5 absolute right-4 top-1/2 transform -translate-x-24 -translate-y-1/2 w-40 h-auto object-contain z-10"
                        />
                        <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                            <img src={logo} className="w-full h-full object-contain" />
                        </div>
                    </div>

                    {/* Formulario */}
                    <Form layout="vertical" onFinish={handleFinish} initialValues={{ ...formData, anio: currentYear.toString() }}>
                        <div className="bg-electricViolet-300 text-electricViolet-950 text-center py-2 rounded-md shadow-md mb-4">
                          <span className="text-lg font-bold uppercase tracking-wide">
                            Información del Taller
                          </span>
                        </div>
                        <Form.Item
                            label="Taller"
                            name="text_nombre_taller"
                            rules={[{ required: true, message: "Campo obligatorio" }]}
                        >
                            <Select options={talleresHoja} placeholder="Selecciona taller" />
                        </Form.Item>
                        <Form.Item label="Monitor(a)" name="text_monitor" rules={[{ required: true }]}>
                            <Input placeholder="Christian Ramos" />
                        </Form.Item>
                        <Form.Item label="Día" name="text_dia" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Horario" name="text_horario" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Semestre" name="text_semestre" rules={[{ required: true }]}>
                            <Select options={selects.semestre} placeholder="Selecciona semestre" />
                        </Form.Item>
                        <Form.Item
                            label="Año del Taller"
                            name="anio"
                            rules={[{ required: true, message: "Debes seleccionar un año" }]}

                        >
                            <Select placeholder="Selecciona un año" options={anios} />
                        </Form.Item>
                        <div className="bg-electricViolet-300 text-electricViolet-950 text-center py-2 rounded-md shadow-md my-4">
                          <span className="text-lg font-bold uppercase tracking-wide">
                            Información de Alumna
                          </span>
                        </div>
                        <Form.Item label="Cédula de Identidad" name="text_cedula" rules={[{ validator: validarRUT,required: true }]}>
                            <Input placeholder="12345678-9" maxLength={10} />
                        </Form.Item>
                        <Form.Item label="Nombres" name="text_nombres" rules={[{ required: true }]}>
                            <Input placeholder="Tomás Felipe" />
                        </Form.Item>
                        <Form.Item label="Apellidos" name="text_apellidos" rules={[{ required: true }]}>
                            <Input placeholder="Saldaña Palominos" />
                        </Form.Item>
                        <Form.Item label="Nacionalidad" name="text_nacionalidad" rules={[{ required: true }]}>
                            <Select options={selects.nacionalidad} placeholder="Selecciona nacionalidad" />
                        </Form.Item>
                        <Form.Item label="Fecha de nacimiento" name="text_fecha_nacimiento" rules={[{ required: true }]}>
                            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="DD/MM/AAAA" />
                        </Form.Item>
                        <Form.Item label="Escolaridad" name="text_escolaridad" rules={[{ required: true }]}>
                            <Select options={selects.escolaridad} placeholder="Selecciona escolaridad" />
                        </Form.Item>
                        <Form.Item label="Estado Civil" name="text_estado_civil" rules={[{ required: true }]}>
                            <Select options={selects.estadoCivil} placeholder="Selecciona estado civil" />
                        </Form.Item>
                        <Form.Item label="Domicilio" name="text_domicilio" rules={[{ required: true }]}>
                            <Input placeholder="Argomedo, #123" />
                        </Form.Item>
                        <Form.Item label="Teléfono de contacto" name="text_telefono" rules={[{ required: true, message: "Campo obligatorio" }]}>
                            <Input placeholder="+569 12345678" />
                        </Form.Item>
                        <Form.Item label="¿Enfermedad preexistente?" name="text_enfermedades">
                            <Input />
                        </Form.Item>
                        <Form.Item label="¿Discapacidad?" name="text_discapacidad">
                            <Input />
                        </Form.Item>
                        <Form.Item label="¿Derivación?" name="text_derivacion">
                            <Input />
                        </Form.Item>
                        <Form.Item label="¿Otros talleres?" name="text_otros_talleres">
                            <Input placeholder="Customizar chaquetas" />
                        </Form.Item>
                        <div className="bg-electricViolet-300 text-electricViolet-950 text-center py-2 rounded-md shadow-md mt-6 mb-4">
                          <span className="text-lg font-bold uppercase tracking-wide">
                            Documentación
                          </span>
                        </div>
                        <Form.Item name="checkbox_19bqbu" valuePropName="checked">
                            <Checkbox>Fotocopia Cédula de Identidad</Checkbox>
                        </Form.Item>
                        <Form.Item name="checkbox_20ddbp" valuePropName="checked">
                            <Checkbox>Registro Social de Hogares</Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-electricViolet-500 w-full mt-4"
                                loading={loading}
                            >
                                Enviar
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Formulario;
