'use client';

import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Failure() {
  return (
    <div className="w-full py-8 sm:py-12">
      <section className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[#d9c59f] bg-[#fffaf2] shadow-[0_24px_70px_rgba(47,34,20,0.14)]">
        <div className="border-b border-[#eadfce] bg-gradient-to-r from-[#fffaf2] via-[#f8eddb] to-[#fffaf2] px-6 py-7 text-center sm:px-10">
          <div className="mx-auto grid size-14 place-items-center rounded-full border border-[#f0b4a9] bg-[#fff1ee] text-[#9a2f22]">
            <AlertTriangle className="size-7" aria-hidden="true" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6f23]">
            Pago no completado
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#24385f] sm:text-3xl">
            No pudimos confirmar tu reserva
          </h1>
        </div>

        <div className="px-6 py-7 text-center sm:px-10">
          <p className="text-base leading-relaxed text-[#5f5348] sm:text-lg">
            El pago no se completó y la reserva no quedó confirmada. Podés
            volver a intentarlo o contactarnos si el problema persiste.
          </p>
          <a
            href="/"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6b2737] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#571d2b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver a tickets
          </a>
        </div>
      </section>
    </div>
  );
}
