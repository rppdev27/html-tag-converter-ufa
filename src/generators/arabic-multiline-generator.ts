import { processText } from '../utils/text-processing';

export const processArabicMultiLines = (content: string): string => {
  if (!content) return '';

  const lines = content.split('\n').filter(line => line.trim());
  const html: string[] = [];

  html.push('<div class="content">');
  html.push('  <div id="hadith-reference" class="mt-4 text-sm tracking-normal">');
  html.push('    <h3 class="text-md font-semibold mb-2">Referensi</h3>');
  
  lines.forEach(line => {
    // For Arabic text, wrap the entire line in a single span
    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(line)) {
      html.push(`    <p class="mt-0 text-right"><span class="text-2xl font-arabic" dir="rtl" lang="ar">${line}</span></p>`);
    } else {
      // For non-Arabic text, use the regular text processing
      html.push(`    <p class="mt-0">${processText(line)}</p>`);
    }
  });

  html.push('  </div>');
  html.push('</div>');
  return html.join('\n');
};