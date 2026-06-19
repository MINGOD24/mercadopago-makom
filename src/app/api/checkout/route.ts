import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

import { PRECIOS } from '@/lib/tickets';

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});
const preferenceClient = new Preference(mp);

function getBaseUrl(req: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  const rawUrl = configuredUrl || req.nextUrl.origin;
  const urlWithProtocol = /^https?:\/\//.test(rawUrl)
    ? rawUrl
    : rawUrl.includes('localhost') || rawUrl.startsWith('127.')
    ? `http://${rawUrl}`
    : `https://${rawUrl}`;

  return urlWithProtocol.replace(/\/$/, '');
}

function canAutoReturn(baseUrl: string) {
  return !/^http:\/\/(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(baseUrl);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const quantities = {
      general: Number(data.general) || 0,
      ninos: Number(data.ninos) || 0,
      donacion: Number(data.donacion) || 0,
    };

    const baseUrl = getBaseUrl(req);

    const items = [];
    if (quantities.general > 0) {
      items.push({
        id: 'general',
        title: 'Entrada General',
        unit_price: PRECIOS.general,
        quantity: quantities.general,
        currency_id: 'CLP',
      });
    }

    if (quantities.ninos > 0) {
      items.push({
        id: 'ninos',
        title: 'Entrada Niños (4-11)',
        unit_price: PRECIOS.ninos,
        quantity: quantities.ninos,
        currency_id: 'CLP',
      });
    }

    if (quantities.donacion > 0) {
      items.push({
        id: 'donacion',
        title: 'Donación Entrada',
        unit_price: PRECIOS.donacion,
        quantity: quantities.donacion,
        currency_id: 'CLP',
      });
    }

    if (items.length === 0) {
      return NextResponse.json({ message: 'No se enviaron items válidos.' }, { status: 400 });
    }

    const preferenceBody = {
      items,
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/failure`,
        pending: `${baseUrl}/pending`,
      },
      ...(canAutoReturn(baseUrl) ? { auto_return: 'approved' as const } : {}),
      metadata: {
        contacto: data.contacto,
        email: data.email,
        rut: data.rut,
        donacion: data.donacion,
        nombres: data.nombres,
      },
      notification_url: `${baseUrl}/api/mp-webhook`,
      external_reference: data.email,
    };

    const { init_point } = await preferenceClient.create({ body: preferenceBody });

    return NextResponse.json({ init_point });
  } catch (err: any) {
    console.error('Mercado Pago error:', err);
    return NextResponse.json(
      { message: err.message ?? 'Error inesperado' },
      { status: 500 }
    );
  }
}
