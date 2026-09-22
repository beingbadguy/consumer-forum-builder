declare global {
  interface Window {
    html2pdf?: any;
  }
}

export async function exportToPdf(elementId: string, filename = 'Consumer_Complaint.pdf') {
  if (typeof window === 'undefined') return;

  const element = document.getElementById(elementId);
  if (!element) {
    alert('Document element not found for PDF export.');
    return;
  }

  // Check if html2pdf is available on window
  if (window.html2pdf) {
    const opt = {
      margin: [0, 0, 0, 0],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    try {
      await window.html2pdf().set(opt).from(element).save();
      return;
    } catch (err) {
      console.error('html2pdf generation error, falling back to print:', err);
    }
  }

  // Fallback: window.print()
  window.print();
}

export function printDocument() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
