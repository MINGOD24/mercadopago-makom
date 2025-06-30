import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔔 Webhook recibido:', JSON.stringify(body, null, 2));

    // Verifica que sea un evento de pago
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id;

      // Obtiene los detalles del pago desde Mercado Pago
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN!}`,
        },
      });

      if (!mpRes.ok) {
        console.error('Error consultando pago en Mercado Pago:', mpRes.statusText);
        return NextResponse.json({ error: 'Error consultando pago' }, { status: 500 });
      }

      const payment = await mpRes.json();
      console.log('💳 Detalle del pago:', JSON.stringify(payment, null, 2));

      if (payment.status === 'approved') {
        await guardarEnGoogleSheets(payment.metadata, payment.transaction_amount);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('❌ Error en el webhook:', err);
    return NextResponse.json({ error: 'Error procesando webhook' }, { status: 500 });
  }
}

async function guardarEnGoogleSheets(metadata: any, totalPagado: number) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  // Encuentra la primera columna vacía
  const getCols = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A:Z',
  });

  const cols = getCols.data.values || [];
  let colIndex = 0;
  while (colIndex < 26) {
    const col = cols.map(row => row[colIndex] || '');
    if (col.every(cell => cell === '')) break;
    colIndex++;
  }

  const colLetter = String.fromCharCode(65 + colIndex);

  const values = [
    [`Correo: ${metadata.email}`],
    [`Teléfono: ${metadata.contacto}`],
    [`RUT: ${metadata.rut || ''}`],
    [`Cantidad de donaciones: ${metadata.donacion || 0}`],
    [`Total pagado: $${totalPagado.toLocaleString()} CLP`],
    ...metadata.nombres.map((n: any) => [
      `Nombre: ${n.nombre} | Apellido: ${n.apellido} | Género: ${n.genero} | Tipo: ${n.tipoEntrada}`,
    ]),
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${colLetter}1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });

  console.log('✅ Datos guardados en Google Sheets');
}
