'use client';
import { useEffect } from 'react';

export default function Success() {
  useEffect(() => {
    const sendData = async () => {
      if (sessionStorage.getItem('alreadySent') === 'true') return;

      const ticketInfo = sessionStorage.getItem('ticketInfo');
      if (!ticketInfo) return;

      await fetch('/api/store-data', {
        method: 'POST',
        body: ticketInfo,
      });

      sessionStorage.removeItem('ticketInfo');
      sessionStorage.setItem('alreadySent', 'true');
    };

    sendData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-blue-100 to-indigo-100">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl max-w-lg w-full text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
            ¡Gracias por tu reserva! 🎉
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            Hemos recibido tu información. Te contactaremos pronto con los detalles.
          </p>
          <a
            href="/"
            className="inline-block bg-[#1f3b82] hover:bg-[#3355aa] text-white font-semibold px-4 py-2 rounded transition"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
