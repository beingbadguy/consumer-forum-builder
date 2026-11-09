import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ result: '' });
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).join('');
        if (translated) {
          return NextResponse.json({ result: translated });
        }
      }
    }
  } catch (err) {
    console.warn('Translation proxy error:', err);
  }

  return NextResponse.json({ result: '' });
}

