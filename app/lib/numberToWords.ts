export function convertNumberToIndianWords(numStr: string | number): string {
  if (!numStr) return '';
  const clean = String(numStr).replace(/,/g, '').trim();
  const num = parseInt(clean, 10);
  if (isNaN(num) || num <= 0) return '';

  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  function twoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 20) return a[n];
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return `${b[tens]} ${a[ones]}`.trim();
  }

  function threeDigits(n: number): string {
    if (n === 0) return '';
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundreds > 0) {
      res += `${a[hundreds]} Hundred `;
    }
    if (rest > 0) {
      res += twoDigits(rest);
    }
    return res.trim();
  }

  const crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  const thousand = Math.floor(remainder / 1000);
  const hundredPart = remainder % 1000;

  const parts: string[] = [];
  if (crore > 0) {
    parts.push(`${twoDigits(crore)} Crore`);
  }
  if (lakh > 0) {
    parts.push(`${twoDigits(lakh)} Lakh`);
  }
  if (thousand > 0) {
    parts.push(`${twoDigits(thousand)} Thousand`);
  }
  if (hundredPart > 0) {
    parts.push(threeDigits(hundredPart));
  }

  return parts.join(' ').trim();
}
