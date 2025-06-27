import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});
const preferenceClient = new Preference(mp);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    console.log('USANDO BASE_URL:', baseUrl);  // 👈 ADD THIS LINE

    if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_URL no está definido');

    const items = [];
    if (data.general > 0)
      items.push({ id: 'general', title: 'Entrada General', unit_price: 1000, quantity: +data.general, currency_id: 'CLP' });
    if (data.ninos > 0)
      items.push({ id: 'ninos', title: 'Entrada Niños (4-11)', unit_price: 18000, quantity: +data.ninos, currency_id: 'CLP' });
    if (data.donacion > 0)
      items.push({ id: 'donacion', title: 'Donación Entrada', unit_price: 1000, quantity: +data.donacion, currency_id: 'CLP' });

    const preferenceBody = {
      items,
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/failure`,
        pending: `${baseUrl}/pending`,
      },
      //uto_return: 'approved' as const,
      metadata: {
        contacto: data.contacto,
        email: data.email,
        nombres: data.nombres,
      },
      notification_url: `${baseUrl}/api/mp-webhook`,
      external_reference: data.email,
    };

    console.log('💡 Enviando preferencia a Mercado Pago:', JSON.stringify(preferenceBody, null, 2));


    const { sandbox_init_point, init_point } = await preferenceClient.create({ body: preferenceBody });

    return NextResponse.json({ init_point: sandbox_init_point ?? init_point });
  } catch (err: any) {
    console.error('Mercado Pago error:', err);
    return NextResponse.json(
      { message: err.message ?? 'Error inesperado' },
      { status: 500 },
    );
  }
}
