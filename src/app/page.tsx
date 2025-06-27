'use client';
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

const precios = {
  general: 36000,
  ninos: 18000,
  donacion: 36000,
};

export default function Home() {
  const [form, setForm] = useState({
    general: 0,
    ninos: 0,
    donacion: 0,
    bebes: 0,
    gratuito: 0,
    contacto: '',
    email: '',
    nombres: [] as { nombre: string; sexo: string }[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPago =
    precios.general * form.general +
    precios.ninos * form.ninos +
    precios.donacion * form.donacion;

  const totalPagados =
    form.general + form.ninos + form.donacion;
  const totalGratuitos = form.bebes + form.gratuito;
  const totalEntradas = totalPagados + totalGratuitos;

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      nombres: Array.from({ length: totalEntradas }, (_, i) => ({
        nombre: prev.nombres[i]?.nombre || '',
        sexo: prev.nombres[i]?.sexo || '',
      })),
    }));
  }, [form.general, form.ninos, form.donacion, form.bebes, form.gratuito]);

  const handleSubmit = async () => {
    setError('');

    if (totalEntradas === 0) {
      setError('Debes seleccionar al menos una entrada.');
      return;
    }

    if (!form.contacto || !form.email.trim()) {
      setError('El teléfono y el correo son obligatorios.');
      return;
    }

    if (form.nombres.some((n) => !n.nombre.trim() || !n.sexo.trim())) {
      setError('Todos los nombres y sexos son obligatorios.');
      return;
    }

    setLoading(true);

    const payload = { ...form };

    sessionStorage.setItem('ticketInfo', JSON.stringify(payload));

    if (totalPago === 0) {
      await fetch('/api/store-data', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      window.location.href = '/success';
    } else {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const { init_point } = await res.json();
      if (init_point) window.location.href = init_point;
    }

    setLoading(false);
  };

  const TicketSelector = ({ label, value, onChange }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }) => (
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="bg-gray-200 rounded-full p-1 hover:bg-gray-300"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="bg-gray-200 rounded-full p-1 hover:bg-gray-300"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-indigo-100 flex flex-col items-center">
      <section className="w-full max-w-xl min-w-[450px] bg-white p-8 mt-6 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-semibold text-[#1f3b82] mb-6 text-center">
          Reserva tus entradas
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-4 text-sm">
          <TicketSelector
            label={`Entrada General ($${precios.general.toLocaleString()})`}
            value={form.general}
            onChange={(v) => setForm({ ...form, general: v })}
          />
          <TicketSelector
            label={`Entrada Niños (4-11) ($${precios.ninos.toLocaleString()})`}
            value={form.ninos}
            onChange={(v) => setForm({ ...form, ninos: v })}
          />
          <TicketSelector
            label={`Donar entrada ($${precios.donacion.toLocaleString()})`}
            value={form.donacion}
            onChange={(v) => setForm({ ...form, donacion: v })}
          />
          <TicketSelector
            label="Entrada Bebés (0-3) gratis"
            value={form.bebes}
            onChange={(v) => setForm({ ...form, bebes: v })}
          />
          <TicketSelector
            label="No puedo pagar (gratis)"
            value={form.gratuito}
            onChange={(v) => setForm({ ...form, gratuito: v })}
          />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <PhoneInput
              international
              defaultCountry="CL"
              value={form.contacto}
              onChange={(val) => setForm({ ...form, contacto: val || '' })}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Correo
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {form.nombres.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-[#1f3b82] mb-2">
              Datos de asistentes
            </h3>
            <div className="flex flex-col gap-3">
              {form.nombres.map((n, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <input
                    className="p-2 border rounded"
                    placeholder={`Nombre ${i + 1}`}
                    value={n.nombre}
                    onChange={(e) =>
                      setForm((p) => {
                        const upd = [...p.nombres];
                        upd[i].nombre = e.target.value;
                        return { ...p, nombres: upd };
                      })
                    }
                  />
                  <select
                    className="p-2 border rounded"
                    value={n.sexo}
                    onChange={(e) =>
                      setForm((p) => {
                        const upd = [...p.nombres];
                        upd[i].sexo = e.target.value;
                        return { ...p, nombres: upd };
                      })
                    }
                  >
                    <option value="">Sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="inline-block bg-yellow-300 text-yellow-900 font-bold text-lg px-4 py-2 rounded shadow">
            Total a pagar: ${totalPago.toLocaleString()} CLP
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-8 w-full py-3 rounded-lg font-semibold transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#1f3b82] text-white hover:bg-[#3355aa]'
          }`}
        >
          {loading ? 'Procesando...' : 'Confirmar reserva'}
        </button>
      </section>
    </main>
  );
}
