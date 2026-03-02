import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

async function loadFont(
  font: string,
  weights: string
): Promise<{ 400: ArrayBuffer; 600: ArrayBuffer }> {
  const familyParam = font.replace(/ /g, '+');
  const url = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weights}&display=swap`;
  const css = await (await fetch(url)).text();
  const fontFaces = css.split('@font-face');
  const result: { 400?: ArrayBuffer; 600?: ArrayBuffer } = {};
  for (const face of fontFaces) {
    const weightMatch = face.match(/font-weight:\s*(\d+)/);
    const hasLatin = face.includes('U+0000-00FF') || face.includes('U+0131');
    if (!weightMatch || !hasLatin) continue;
    const weight = parseInt(weightMatch[1], 10);
    const urlMatch = face.match(/url\((https:\/\/[^)]+)\)/);
    if (!urlMatch) continue;
    const fontRes = await fetch(urlMatch[1]);
    if (!fontRes.ok) continue;
    result[weight as 400 | 600] = await fontRes.arrayBuffer();
  }
  if (!result[400] || !result[600]) {
    throw new Error(`Failed to load fonts for ${font}`);
  }
  return { 400: result[400]!, 600: result[600]! };
}

export default async function handler() {
  try {
    const { 400: cormorant400, 600: cormorant600 } = await loadFont(
      'Cormorant Garamond',
      '400;600'
    );

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 50%, #fafaf9 100%)',
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='24' height='24' fill='none'%3E%3Ccircle fill='%23d4d4d4' opacity='0.4' cx='16' cy='16' r='2'%3E%3C/circle%3E%3C/svg%3E")`,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: 80,
            }}
          >
            <div
              style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 48,
                fontWeight: 400,
                color: '#78716c',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              With Joy, We Invite You
            </div>
            <div
              style={{
                width: 120,
                height: 2,
                background: 'linear-gradient(90deg, transparent, #d97706, transparent)',
                margin: '8px 0',
              }}
            />
            <div
              style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 72,
                fontWeight: 600,
                color: '#1c1917',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              Sai Nagendra & Sushma
            </div>
            <div
              style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 32,
                fontWeight: 400,
                color: '#78716c',
                marginTop: 8,
              }}
            >
              March 7th, 2026 · 02:25 AM (Early hours of March 8th)
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Cormorant Garamond',
            data: cormorant400,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Cormorant Garamond',
            data: cormorant600,
            style: 'normal',
            weight: 600,
          },
        ],
      }
    );
  } catch (e) {
    console.error('OG image error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
