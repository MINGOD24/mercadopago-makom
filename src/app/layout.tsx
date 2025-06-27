import './globals.css';

export const metadata = {
  title: 'Makom Tickets 2025',
  description: 'Compra de entradas para los Yamim Noraim',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
     <body className="min-h-screen flex flex-col">
  <header className="shadow bg-white">
    <img
      src="https://ecopass-static-temporal.s3.amazonaws.com/10269241-416c-476d-8648-bf827d0f4534"
      alt="Makom Yamim Noraim 2025"
      className="block w-screen h-auto"
    />
  </header>
  <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-indigo-100">
    {children}
  </main>
</body>

    </html>
  );
}
