import './globals.css';

export const metadata = {
  title: 'Makom Tickets 2025',
  description: 'Compra de entradas para los Yamim Noraim',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <header className="w-full bg-[#fffaf2] shadow-[0_1px_18px_rgba(47,34,20,0.12)]">
          <img
            src="https://ecopass-static-temporal.s3.amazonaws.com/6fa2dcb8-ca3e-48e3-9ac1-c547bd32c2f4"
            alt="Makom Yamim Noraim 2025"
            className="block w-full h-auto object-cover"
          />
        </header>
        <main className="flex-1 flex items-center justify-center bg-[radial-gradient(circle_at_top,#fff7e6_0%,#f6ead7_38%,#e9eef5_100%)] p-3 sm:p-6">
          <div className="w-full max-w-5xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
