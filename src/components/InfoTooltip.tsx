'use client';
import { useId, useState } from 'react';
import { Info } from 'lucide-react';

export function InfoTooltip({ info }: { info: string }) {
  const [show, setShow] = useState(false);
  const tooltipId = useId();

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label="Más información"
        aria-describedby={tooltipId}
        aria-expanded={show}
        onClick={() => setShow((current) => !current)}
        onBlur={() => setShow(false)}
        className="grid size-6 place-items-center rounded-full text-[#8a641d] transition hover:bg-[#f3e5c6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a35]"
      >
        <Info className="h-4 w-4" />
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={`absolute bottom-full left-1/2 z-20 mb-2 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-[#24385f] px-3 py-2 text-left text-xs font-medium leading-relaxed text-white shadow-lg ${
          show ? 'block' : 'hidden group-hover:block group-focus-within:block'
        }`}
      >
        {info}
      </span>
    </span>
  );
}
