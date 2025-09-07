// src/Formulario.jsx
import React, { useState } from 'react';
import GuardarEnSheets from './GuardarEnSheets';

const BENEFICIARIO_VACIO = {
  nombreFuncionario: '',
  apellidoFuncionario: '',
  apellido2Funcionario: '',
  nombreHijo: '',
  sexo: '',
  edad: '',
};

export default function Formulario() {
  // A) Datos generales
  const [general, setGeneral] = useState({ direccion: '' });

  // B) Beneficiarios (lista dinámica)
  const [beneficiarios, setBeneficiarios] = useState([{ ...BENEFICIARIO_VACIO }]);

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
    setBeneficiarios((prev) => [...prev, { ...BENEFICIARIO_VACIO }]);
  };

  // Eliminar seguro: si hay 1 solo, limpia; si hay >1, elimina
  const eliminarBeneficiario = (idx) => {
    if (!confirm('¿Eliminar este beneficiario?')) return;

    setBeneficiarios((prev) => {
      if (prev.length === 1) {
        const nuevo = [...prev];
        nuevo[0] = { ...BENEFICIARIO_VACIO };
        return nuevo;
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const validar = () => {
    if (!general.direccion.trim()) return 'La dirección es obligatoria.';
    if (beneficiarios.length === 0) return 'Agrega al menos un beneficiario.';

    for (let i = 0; i < beneficiarios.length; i++) {
      const b = beneficiarios[i];
      if (!b.nombreFuncionario.trim())
        return `Beneficiario #${i + 1}: falta el nombre del funcionario.`;
      if (!b.apellidoFuncionario.trim())
        return `Beneficiario #${i + 1}: falta el primer apellido del funcionario.`;
      if (!b.apellido2Funcionario.trim())
        return `Beneficiario #${i + 1}: falta el segundo apellido del funcionario.`;
      if (!b.nombreHijo.trim())
        return `Beneficiario #${i + 1}: falta el nombre del hijo/a.`;
      if (!String(b.sexo).trim())
        return `Beneficiario #${i + 1}: falta el sexo del hijo/a.`;

      const edadNum = Number(b.edad);
      if (!String(b.edad).trim())
        return `Beneficiario #${i + 1}: falta la edad.`;
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
      general: { direccion: general.direccion },
      beneficiarios: beneficiarios.map((b) => ({
        nombreFuncionario: b.nombreFuncionario,
        apellidoFuncionario: b.apellidoFuncionario,
        apellido2Funcionario: b.apellido2Funcionario,
        nombreHijo: b.nombreHijo,
        sexo: b.sexo,
        edad: Number(b.edad),
      })),
    };

    try {
      setEnviando(true);
      const res = await GuardarEnSheets(payload);
      setMensaje(`¡Enviado! (${res.message || 'Guardado con éxito'})`);
    } catch (e2) {
      console.error(e2);
      setError(e2.message || 'Ocurrió un error al enviar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Formulario Navidad — Funcionarios
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
        <fieldset
          style={{
            border: '1px solid #ddd',
            padding: 16,
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <legend style={{ padding: '0 8px' }}>Beneficiarios</legend>

          {beneficiarios.map((b, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #eee',
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 140px 160px',
                  gap: 12,
                  alignItems: 'end',
                }}
              >
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                    Nombre funcionario
                  </label>
                  <input
                    type="text"
                    name="nombreFuncionario"
                    value={b.nombreFuncionario}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Juan"
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                    Primer apellido
                  </label>
                  <input
                    type="text"
                    name="apellidoFuncionario"
                    value={b.apellidoFuncionario}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Pérez"
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                    Segundo apellido
                  </label>
                  <input
                    type="text"
                    name="apellido2Funcionario"
                    value={b.apellido2Funcionario}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Cortés"
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
                    placeholder="Ej: Ana"
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

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                    Sexo del hijo/a
                  </label>
                  <select
                    name="sexo"
                    value={b.sexo}
                    onChange={(e) => onChangeBenef(idx, e)}
                    style={{ width: '100%', padding: 8 }}
                  >
                    <option value="">Selecciona…</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => eliminarBeneficiario(idx)}
                  style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    padding: '6px 10px',
                    borderRadius: 6,
                  }}
                >
                  Eliminar
                </button>
              </div>
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
        {error && <div style={{ color: '#b00020', marginTop: 12 }}>{error}</div>}
        {mensaje && <div style={{ color: '#0a7b33', marginTop: 12 }}>{mensaje}</div>}

        <button
          type="submit"
          disabled={enviando}
          style={{
            marginTop: 16,
            background: enviando ? '#aaa' : '#7c3aed',
            color: 'white',
            padding: '10px 16px',
            borderRadius: 8,
          }}
        >
          {enviando ? 'Enviando…' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
