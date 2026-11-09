import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');

  if (!text) {
    return NextResponse.json({ result: '' });
  }

  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(
      text
    )}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`;

    const res = await fetch(url, { cache: 'force-cache' });
    if (res.ok) {
      const data = await res.json();
      if (
        Array.isArray(data) &&
        data[0] === 'SUCCESS' &&
        Array.isArray(data[1]) &&
        data[1][0] &&
        Array.isArray(data[1][0][1]) &&
        data[1][0][1][0]
      ) {
        return NextResponse.json({ result: data[1][0][1][0] });
      }
    }
  } catch (err) {
    console.warn('Transliteration proxy error:', err);
  }

  return NextResponse.json({ result: text });
}

