'use client';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Plus, Minus } from 'lucide-react';
import { PRECIOS } from '@/lib/tickets';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

const formatPrice = (value: number) => `$${value.toLocaleString('es-CL')} CLP`;

const cleanRut = (value: string) =>
  value
    .replace(/[^0-9kK]/g, '')
    .toUpperCase()
    .replace(/K(?!$)/g, '')
    .slice(0, 9);

const formatRut = (value: string) => {
  const cleaned = cleanRut(value);
  if (cleaned.length <= 1) return cleaned;

  const body = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formattedBody}-${verifier}`;
};

const fieldClass =
  'w-full rounded-lg border border-[#d8c9b4] bg-white px-3 py-2.5 text-[#27211b] shadow-sm transition placeholder:text-[#9b8f80] focus:border-[#b98a35] focus:outline-none focus:ring-2 focus:ring-[#ead2a0] focus-within:border-[#b98a35] focus-within:ring-2 focus-within:ring-[#ead2a0]';

const labelClass = 'mb-1.5 block text-sm font-semibold text-[#4b3d31]';

const childProgramDetail = (
  <>
    <strong>SIN ASIENTO.</strong> Programa infantil con actividades, juegos y
    colación.
  </>
);

type TicketSelectorProps = {
  label: string;
  detail?: ReactNode;
  price: string;
  value: number;
  onChange: (val: number) => void;
};

function TicketSelector({
  label,
  detail,
  price,
  value,
  onChange,
}: TicketSelectorProps) {
  return (
    <article
      className={`grid gap-4 rounded-xl border px-4 py-4 transition sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${
        value > 0
          ? 'border-[#d5ad57] bg-[#fff8ea] shadow-sm'
          : 'border-[#eadfce] bg-white/90'
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#24385f]">{label}</h3>
        </div>
        {detail && <p className="mt-1 text-sm text-[#6f6255]">{detail}</p>}
        <p className="mt-2 text-sm font-semibold text-[#8a641d]">{price}</p>
      </div>
      <div className="flex h-11 items-center justify-between gap-2 rounded-full border border-[#e1d3bd] bg-[#fbf6ed] p-1 sm:justify-end">
        <button
          type="button"
          onClick={(event) => {
            onChange(Math.max(0, value - 1));
            if (event.detail > 0) event.currentTarget.blur();
          }}
          disabled={value === 0}
          aria-label={`Restar ${label}`}
          className={`grid size-9 place-items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a35] ${
            value === 0
              ? 'cursor-not-allowed text-[#b8aa99]'
              : 'bg-white text-[#24385f] shadow-sm hover:bg-[#f0e4d1]'
          }`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span
          className="min-w-9 text-center text-base font-semibold tabular-nums text-[#24385f]"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={(event) => {
            onChange(value + 1);
            if (event.detail > 0) event.currentTarget.blur();
          }}
          aria-label={`Sumar ${label}`}
          className="grid size-9 place-items-center rounded-full bg-[#24385f] text-white shadow-sm transition hover:bg-[#182948] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a35]"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}

type AmountTicketRowProps = {
  label: string;
  detail?: ReactNode;
  value: number;
  onChange: (val: number) => void;
};

function AmountTicketRow({
  label,
  detail,
  value,
  onChange,
}: AmountTicketRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#eadfce] py-3 first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[#24385f]">{label}</h3>
        {detail && <p className="mt-0.5 text-xs text-[#6f6255]">{detail}</p>}
      </div>
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 rounded-full border border-[#e1d3bd] bg-[#fbf6ed] p-1">
        <button
          type="button"
          onClick={(event) => {
            onChange(Math.max(0, value - 1));
            if (event.detail > 0) event.currentTarget.blur();
          }}
          disabled={value === 0}
          aria-label={`Restar ${label}`}
          className={`grid size-8 place-items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a35] ${
            value === 0
              ? 'cursor-not-allowed text-[#b8aa99]'
              : 'bg-white text-[#24385f] shadow-sm hover:bg-[#f0e4d1]'
          }`}
        >
          <Minus className="size-4" />
        </button>
        <span
          className="min-w-8 text-center text-sm font-semibold tabular-nums text-[#24385f]"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={(event) => {
            onChange(value + 1);
            if (event.detail > 0) event.currentTarget.blur();
          }}
          aria-label={`Sumar ${label}`}
          className="grid size-8 place-items-center rounded-full bg-[#24385f] text-white shadow-sm transition hover:bg-[#182948] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a35]"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState({
    general: 0,
    ninos: 0,
    donacion: 0,
    bebes: 0,
    montoGeneral: 0,
    montoNinos: 0,
    montoBebes: 0,
    aporteGratuito: 0,
    contacto: '',
    email: '',
    rut: '',
    nombres: [] as {
      nombre: string;
      apellido: string;
      genero: string;
      tipoEntrada: string;
    }[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aporteGratuitoInput, setAporteGratuitoInput] = useState('0');
  const errorRef = useRef<HTMLDivElement>(null);

  const totalMontoEntradas =
    form.montoGeneral + form.montoNinos + form.montoBebes;

  const totalPago =
    PRECIOS.general * form.general +
    PRECIOS.ninos * form.ninos +
    PRECIOS.donacion * form.donacion +
    (totalMontoEntradas > 0 ? form.aporteGratuito : 0);

  const totalEntradas =
    form.general +
    form.ninos +
    form.bebes +
    totalMontoEntradas;

  useEffect(() => {
    const tipos = [
      ...Array(form.general).fill('General'),
      ...Array(form.ninos).fill('Niños'),
      ...Array(form.bebes).fill('Bebé'),
      ...Array(form.montoGeneral).fill('General - monto seleccionado'),
      ...Array(form.montoNinos).fill('Niños - monto seleccionado'),
      ...Array(form.montoBebes).fill('Bebé - monto seleccionado'),
    ];

    setForm((prev) => ({
      ...prev,
      nombres: tipos.map((tipo, i) => ({
        nombre: prev.nombres[i]?.nombre || '',
        apellido: prev.nombres[i]?.apellido || '',
        genero: prev.nombres[i]?.genero || '',
        tipoEntrada: tipo,
      })),
    }));
  }, [
    form.general,
    form.ninos,
    form.bebes,
    form.montoGeneral,
    form.montoNinos,
    form.montoBebes,
  ]);

  useEffect(() => {
    if (!error) return;

    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorRef.current?.focus({ preventScroll: true });
    });
  }, [error]);

  const handleSubmit = async () => {
    setError('');

    if (totalEntradas === 0 && form.donacion === 0) {
      setError('Debes seleccionar al menos una entrada o una donación.');
      return;
    }

    const camposContactoFaltantes = [
      !form.contacto ? 'teléfono' : '',
      !form.email.trim() ? 'correo' : '',
      !form.rut.trim() ? 'RUT' : '',
    ].filter(Boolean);

    if (camposContactoFaltantes.length > 0) {
      setError(
        `Completá ${camposContactoFaltantes.join(', ')} para continuar.`
      );
      return;
    }

    const tipos = [
      ...Array(form.general).fill('General'),
      ...Array(form.ninos).fill('Niños'),
      ...Array(form.bebes).fill('Bebé'),
      ...Array(form.montoGeneral).fill('General - monto seleccionado'),
      ...Array(form.montoNinos).fill('Niños - monto seleccionado'),
      ...Array(form.montoBebes).fill('Bebé - monto seleccionado'),
    ];

    const nombresFinal = tipos.map((tipo, i) => ({
      nombre: form.nombres[i]?.nombre || '',
      apellido: form.nombres[i]?.apellido || '',
      genero: form.nombres[i]?.genero || '',
      tipoEntrada: tipo,
    }));

    if (
      nombresFinal.some(
        (n) => !n.nombre.trim() || !n.apellido.trim() || !n.genero.trim()
      )
    ) {
      setError(
        'Revisá los datos de asistentes: faltan nombre, apellido o género.'
      );
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      aporteGratuito: totalMontoEntradas > 0 ? form.aporteGratuito : 0,
      nombres: nombresFinal,
    };

    sessionStorage.setItem('ticketInfo', JSON.stringify(payload));

    try {
      if (totalPago === 0) {
        const res = await fetch('/api/mp-webhook', {
          method: 'POST',
          body: JSON.stringify({
            type: 'manual_free',
            metadata: payload,
          }),
        });

        if (!res.ok) {
          throw new Error('No pudimos confirmar la reserva gratuita.');
        }

        window.location.href = '/success';
      } else {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok || !data.init_point) {
          throw new Error(
            data.message || 'No pudimos iniciar el pago. Intentá nuevamente.'
          );
        }

        window.location.href = data.init_point;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado. Intentá nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTicketQuantity = (
    key:
      | 'general'
      | 'ninos'
      | 'donacion'
      | 'bebes'
      | 'montoGeneral'
      | 'montoNinos'
      | 'montoBebes',
    value: number
  ) => {
    const scrollPosition =
      typeof window === 'undefined'
        ? null
        : { left: window.scrollX, top: window.scrollY };

    setForm((current) => ({ ...current, [key]: value }));

    if (scrollPosition) {
      requestAnimationFrame(() => {
        window.scrollTo(scrollPosition.left, scrollPosition.top);
        requestAnimationFrame(() => {
          window.scrollTo(scrollPosition.left, scrollPosition.top);
        });
      });
    }
  };

  const updateAporteGratuito = (value: string) => {
    const normalized = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');

    setAporteGratuitoInput(normalized);
    setForm((current) => ({
      ...current,
      aporteGratuito: Math.floor(Number(normalized) || 0),
    }));
  };

  return (
    <div className="w-full py-6 sm:py-10">
      <section className="mx-auto w-full max-w-2xl min-w-[280px] overflow-hidden rounded-2xl border border-[#e7d9c5] bg-[#fffaf2] shadow-[0_24px_70px_rgba(47,34,20,0.14)]">
        <div className="border-b border-[#eadfce] bg-gradient-to-r from-[#fffaf2] via-[#f8eddb] to-[#fffaf2] px-5 py-6 text-center sm:px-8">
          <h1 className="mt-2 text-2xl font-semibold text-[#24385f] sm:text-3xl">
            Entradas Yamim Noraim
          </h1>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6f23]">
            Rosh Hashana: en Makom
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6f23]">
            Yom Kipur: en Hotel Sheraton
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <div
            className="grid gap-3 text-sm"
            aria-label="Seleccioná la cantidad de tickets"
          >
            <TicketSelector
              label="Entrada general"
              price={formatPrice(PRECIOS.general)}
              value={form.general}
              onChange={(v) => updateTicketQuantity('general', v)}
            />
            <TicketSelector
              label="Entrada Niños (4 a 11 años)"
              detail={childProgramDetail}
              price={formatPrice(PRECIOS.ninos)}
              value={form.ninos}
              onChange={(v) => updateTicketQuantity('ninos', v)}
            />
            {/* <TicketSelector
              label="Donación Entrada General"
              detail="Donación Entrada General"
              price={formatPrice(PRECIOS.donacion)}
              value={form.donacion}
              onChange={(v) => updateTicketQuantity('donacion', v)}
            /> */}
            <TicketSelector
              label="Entrada Bebés (0 a 3 años)"
              detail={childProgramDetail}
              price={formatPrice(0)}
              value={form.bebes}
              onChange={(v) => updateTicketQuantity('bebes', v)}
            />

            <section
              className="rounded-xl border border-[#ead8b2] bg-[#fff7e8] px-4 py-4 shadow-sm"
              aria-labelledby="seleccionar-monto"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id="seleccionar-monto"
                    className="text-base font-semibold text-[#6b2737]"
                  >
                    ¿Necesitas ayuda con el valor de tus entradas?
                  </h2>
                  <p className="mt-1 text-sm text-[#5c4b3b]">
                    Selecciona la cantidad de entradas y el monto que puedes pagar.
                  </p>
                </div>
                <strong className="text-lg font-semibold tabular-nums text-[#6b2737]">
                  {formatPrice(
                    totalMontoEntradas > 0 ? form.aporteGratuito : 0
                  )}
                </strong>
              </div>

              <div className="mt-4 rounded-lg border border-[#eadfce] bg-white/80 px-3 py-3">
                <AmountTicketRow
                  label="Entrada General"
                  value={form.montoGeneral}
                  onChange={(v) => updateTicketQuantity('montoGeneral', v)}
                />
                <AmountTicketRow
                  label="Entrada Niños (4 a 11 años)"
                  detail={childProgramDetail}
                  value={form.montoNinos}
                  onChange={(v) => updateTicketQuantity('montoNinos', v)}
                />
                <AmountTicketRow
                  label="Entrada Bebés (0 a 3 años)"
                  detail={childProgramDetail}
                  value={form.montoBebes}
                  onChange={(v) => updateTicketQuantity('montoBebes', v)}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="aporteGratuito" className={labelClass}>
                  Monto total a pagar
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7a6c5c]">
                    $
                  </span>
                  <input
                    id="aporteGratuito"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={aporteGratuitoInput}
                    disabled={totalMontoEntradas === 0}
                    onFocus={(event) => {
                      if (aporteGratuitoInput === '0') {
                        event.currentTarget.select();
                      }
                    }}
                    onChange={(event) =>
                      updateAporteGratuito(event.target.value)
                    }
                    onBlur={() => {
                      if (aporteGratuitoInput === '') {
                        setAporteGratuitoInput('0');
                      }
                    }}
                    className={`${fieldClass} pl-7 disabled:cursor-not-allowed disabled:bg-[#eee5d8] disabled:text-[#8f8272]`}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-7 grid gap-4 border-t border-[#eadfce] pt-6">
            <div>
              <label htmlFor="contacto" className={labelClass}>
                Teléfono
              </label>
              <PhoneInput
                id="contacto"
                international
                defaultCountry="CL"
                value={form.contacto}
                onChange={(val) => setForm({ ...form, contacto: val || '' })}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Correo
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="rut" className={labelClass}>
                RUT
              </label>
              <input
                id="rut"
                type="text"
                autoComplete="off"
                inputMode="text"
                placeholder="12.345.678-9"
                value={form.rut}
                onChange={(e) =>
                  setForm({ ...form, rut: formatRut(e.target.value) })
                }
                className={fieldClass}
              />
            </div>
          </div>

          {form.nombres.length > 0 && (
            <div className="mt-7 border-t border-[#eadfce] pt-6">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-lg font-semibold text-[#24385f]">
                  Datos de asistentes
                </h2>
                <span className="text-sm font-medium text-[#7a6c5c]">
                  {form.nombres.length}{' '}
                  {form.nombres.length === 1 ? 'entrada' : 'entradas'}
                </span>
              </div>
              <div className="grid gap-4">
                {form.nombres.map((n, i) => (
                  <fieldset
                    key={i}
                    className="rounded-xl border border-[#eadfce] bg-white/90 px-4 pb-4 pt-3 shadow-sm"
                  >
                    <legend className="px-2 text-sm font-semibold text-[#6b2737]">
                      Asistente {i + 1}
                    </legend>
                    <p className="mb-3 text-sm font-medium text-[#7a6c5c]">
                      Tipo de entrada: {n.tipoEntrada}
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label htmlFor={`nombre-${i}`} className={labelClass}>
                          Nombre
                        </label>
                        <input
                          id={`nombre-${i}`}
                          className={fieldClass}
                          value={n.nombre}
                          onChange={(e) =>
                            setForm((p) => {
                              const upd = [...p.nombres];
                              upd[i].nombre = e.target.value;
                              return { ...p, nombres: upd };
                            })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor={`apellido-${i}`} className={labelClass}>
                          Apellido
                        </label>
                        <input
                          id={`apellido-${i}`}
                          className={fieldClass}
                          value={n.apellido}
                          onChange={(e) =>
                            setForm((p) => {
                              const upd = [...p.nombres];
                              upd[i].apellido = e.target.value;
                              return { ...p, nombres: upd };
                            })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor={`genero-${i}`} className={labelClass}>
                          Género
                        </label>
                        <select
                          id={`genero-${i}`}
                          className={fieldClass}
                          value={n.genero}
                          onChange={(e) =>
                            setForm((p) => {
                              const upd = [...p.nombres];
                              upd[i].genero = e.target.value;
                              return { ...p, nombres: upd };
                            })
                          }
                        >
                          <option value="">Seleccionar</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Femenino">Femenino</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 rounded-xl border border-[#24385f] bg-[#24385f] p-4 text-white shadow-[0_12px_30px_rgba(36,56,95,0.18)]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <span className="text-sm font-semibold text-[#f2d99f]">
                Total a pagar
              </span>
              <strong className="text-2xl font-semibold tabular-nums">
                {formatPrice(totalPago)}
              </strong>
            </div>
            <p className="mt-2 text-sm text-[#f6ead4]">
              {totalPago > 0
                ? 'Tu reserva será confirmada después del pago.'
                : 'Tu reserva será confirmada al finalizar.'}
            </p>
          </div>

          {error && (
            <div
              id="form-error"
              ref={errorRef}
              role="alert"
              tabIndex={-1}
              className="mt-5 rounded-lg border border-[#f0b4a9] bg-[#fff1ee] px-4 py-3 text-sm font-medium text-[#9a2f22] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d46b58]"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            aria-describedby={error ? 'form-error' : undefined}
            className={`mt-5 w-full rounded-xl px-5 py-3.5 text-base font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] ${
              loading
                ? 'cursor-not-allowed bg-[#b9ad9d] text-white'
                : 'bg-[#6b2737] text-white hover:bg-[#571d2b]'
            }`}
          >
            {loading
              ? 'Procesando...'
              : totalPago > 0
              ? 'Continuar al pago'
              : 'Reservar tickets'}
          </button>
        </div>
      </section>
    </div>
  );
}
