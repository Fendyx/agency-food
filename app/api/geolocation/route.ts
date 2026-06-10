import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Получаем реальный IP клиента (заголовок от прокси/хостинга)
    const forwardedFor = request.headers.get('x-forwarded-for');
    let ip = forwardedFor ? forwardedFor.split(',')[0] : '';

    // Для локальной разработки – возвращаем заглушку (можно задать город по умолчанию)
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
      // Заглушка – выбери свой город или убери, если не нужна
      return NextResponse.json({ city: 'Warsaw', lat: 52.2297, lon: 21.0122 });
    }

    // Используем бесплатный сервис ip-api.com
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,lat,lon`, {
      signal: AbortSignal.timeout(3000), // таймаут 3 сек
    });
    const data = await res.json();

    if (data.status === 'success') {
      return NextResponse.json({ city: data.city, lat: data.lat, lon: data.lon });
    } else {
      return NextResponse.json({ city: null });
    }
  } catch (err) {
    // В случае ошибки просто возвращаем null
    return NextResponse.json({ city: null });
  }
}