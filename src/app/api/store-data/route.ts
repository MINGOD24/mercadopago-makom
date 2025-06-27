import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  // Obtiene las columnas existentes
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

  // Calcula total pagado
  const totalPagado =
    (body.general * 36000) +
    (body.ninos * 18000) +
    (body.donacion * 36000);

  // Prepara los datos para el Excel
  const values = [
    [`Correo: ${body.email}`],
    [`Teléfono: ${body.contacto}`],
    [`RUT: ${body.rut}`],
    [`Cantidad de donaciones: ${body.donacion}`],
    [`Total pagado: $${totalPagado.toLocaleString()} CLP`],
    ...body.nombres.map((n: any) => [
      `Nombre: ${n.nombre} | Apellido: ${n.apellido} | Género: ${n.genero} | Tipo: ${n.tipoEntrada}`,
    ]),
  ];

  // Escribe los datos en la columna vacía
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${colLetter}1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });

  return NextResponse.json({ status: 'ok' });
}
