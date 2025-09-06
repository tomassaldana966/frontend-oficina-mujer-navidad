// src/Formulario.jsx
import React, { useState } from 'react';
import GuardarEnSheets from './GuardarEnSheets';

export default function Formulario() {
  // A) Datos generales (solo Dirección en este mini test)
  const [general, setGeneral] = useState({
    direccion: '',
  });

  // B) Beneficiarios (lista dinámica)
  const [beneficiarios, setBeneficiarios] = useState([
    { nombreFuncionario: '', nombreHijo: '', edad: '' },
  ]);

  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Handlers generales
  const onChangeGeneral = (e) => {
    const { name, value } = e.target;
    setGeneral((g) => ({ ...g, [name]: value }));
  };

  const onChangeBenef = (idx, e) => {
    const { name, value } = e.target;
    setBeneficiarios((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, [name]: value } : b))
    );
  };

  const agregarBeneficiario = () => {
    setBeneficiarios((prev) => [
      ...prev,
      { nombreFuncionario: '', nombreHijo: '', edad: '' },
    ]);
  };

  const eliminarBeneficiario = (idx) => {
    setBeneficiarios((prev) => prev.filter((_, i) => i !== idx));
  };

  const validar = () => {
    if (!general.direccion.trim()) return 'La dirección es obligatoria.';
    if (beneficiarios.length === 0) return 'Agrega al menos un beneficiario.';
    for (let i = 0; i < beneficiarios.length; i++) {
      const b = beneficiarios[i];
      if (!b.nombreFuncionario.trim())
        return `Beneficiario #${i + 1}: falta el nombre del funcionario.`;
      if (!b.nombreHijo.trim())
        return `Beneficiario #${i + 1}: falta el nombre del hijo/a.`;
      if (!String(b.edad).trim())
        return `Beneficiario #${i + 1}: falta la edad.`;
      const edadNum = Number(b.edad);
      if (!Number.isFinite(edadNum) || edadNum < 0)
        return `Beneficiario #${i + 1}: la edad no es válida.`;
    }
    return null;
  };

  // Submit → SOLO Sheets (sin PDF/Drive)
  const onSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    const err = validar();
    if (err) {
      setError(err);
      return;
    }

    // Armamos el payload que recibirá Apps Script
    const payload = {
      general: {
        direccion: general.direccion,
      },
      beneficiarios: beneficiarios.map((b) => ({
        nombreFuncionario: b.nombreFuncionario,
        nombreHijo: b.nombreHijo,
        edad: Number(b.edad),
      })),
    };

    try {
      setEnviando(true);
      const res = await GuardarEnSheets(payload);
      setMensaje(`¡Enviado! (${res.message || 'Guardado con éxito'})`);
      // Si quieres limpiar el formulario tras enviar:
      // setGeneral({ direccion: '' });
      // setBeneficiarios([{ nombreFuncionario: '', nombreHijo: '', edad: '' }]);
    } catch (e2) {
      console.error(e2);
      setError(e2.message || 'Ocurrió un error al enviar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Formulario Navidad (mini test)
      </h1>

      <form onSubmit={onSubmit}>
        {/* A) Datos generales */}
        <fieldset style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
          <legend style={{ padding: '0 8px' }}>Datos generales</legend>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={general.direccion}
              onChange={onChangeGeneral}
              placeholder="Ej: SECPLAN"
              style={{ width: '100%', padding: 8 }}
            />
          </div>
        </fieldset>

        {/* B) Beneficiarios */}
        <fieldset style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginTop: 16 }}>
          <legend style={{ padding: '0 8px' }}>Beneficiarios</legend>

          {beneficiarios.map((b, idx) => (
            <div key={idx} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                    Nombre funcionario
                  </label>
                  <input
                    type="text"
                    name="nombreFuncionario"
                    value={b.nombreFuncionario}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Juan Pérez"
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                    Nombre hijo/a
                  </label>
                  <input
                    type="text"
                    name="nombreHijo"
                    value={b.nombreHijo}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Ana Pérez"
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                    Edad
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={b.edad}
                    onChange={(e) => onChangeBenef(idx, e)}
                    min="0"
                    placeholder="Ej: 7"
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>
              </div>

              {beneficiarios.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarBeneficiario(idx)}
                  style={{ marginTop: 8, background: '#eee', padding: '6px 10px', borderRadius: 6 }}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={agregarBeneficiario}
            style={{ background: '#f3f3ff', padding: '8px 12px', borderRadius: 6 }}
          >
            + Agregar beneficiario
          </button>
        </fieldset>

        {/* Mensajes */}
        {error && (
          <div style={{ color: '#b00020', marginTop: 12 }}>
            {error}
          </div>
        )}
        {mensaje && (
          <div style={{ color: '#0a7b33', marginTop: 12 }}>
            {mensaje}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          style={{
            marginTop: 16,
            background: enviando ? '#aaa' : '#7c3aed',
            color: 'white',
            padding: '10px 16px',
            borderRadius: 8
          }}
        >
          {enviando ? 'Enviando…' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
