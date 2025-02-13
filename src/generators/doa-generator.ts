import { DoaFormData } from '../types';
import { processText, escapeHtml } from '../utils/text-processing';

export const generateDoaHTML = (doaFormData: DoaFormData): string => {
  const html: string[] = [];
  
  html.push('<div class="content">');
  
  if (doaFormData.title) {
    html.push(`  <h1 id="title" class="text-xl font-bold text-center">${processText(doaFormData.title)}</h1>`);
  }
  
  if (doaFormData.subtitle) {
    html.push(`  <h2 id="repeat-instruction" class="text-xs text-center">${processText(doaFormData.subtitle)}</h2>`);
  }
  
  if (doaFormData.arabicDoa) {
    html.push(`  <p id="arabic-text" class="text-4xl font-arabic mt-3 text-right" dir="rtl" lang="ar">${escapeHtml(doaFormData.arabicDoa)}</p>`);
  }
  
  if (doaFormData.latin) {
    html.push(`  <p id="latin-text" class="italic mt-2 text-sm tracking-normal"><i>${processText(doaFormData.latin)}</i></p>`);
  }
  
  if (doaFormData.meaning) {
    html.push(`  <p id="translation" class="mt-2 text-sm tracking-normal">${processText(doaFormData.meaning)}</p>`);
  }

  if (doaFormData.kandungan || doaFormData.benefit) {
    html.push('  <div id="explanation-section" class="mt-4">');
    html.push('    <h2 class="text-md font-bold mb-2 border-b border-slate-400 pb-2">Penjelasan</h2>');
    
    if (doaFormData.kandungan) {
      html.push('    <div id="explanation" class="mt-2 text-sm tracking-normal">');
      html.push('      <h3 class="text-md font-semibold mb-2">Kandungan</h3>');
      const paragraphs = doaFormData.kandungan.split('\n').filter(p => p.trim());
      paragraphs.forEach(paragraph => {
        html.push(`      <p class="mt-0">${processText(paragraph)}</p>`);
      });
      html.push('    </div>');
    }

    if (doaFormData.benefit) {
      html.push('    <div id="benefit" class="mt-4 text-sm tracking-normal">');
      html.push('      <h3 class="text-md font-semibold mb-2">Keutamaan</h3>');
      const paragraphs = doaFormData.benefit.split('\n').filter(p => p.trim());
      paragraphs.forEach(paragraph => {
        html.push(`      <p class="mt-0">${processText(paragraph)}</p>`);
      });
      html.push('    </div>');
    }
    html.push('  </div>');
  }
  
  if (doaFormData.footnote) {
    html.push('  <div id="hadith-reference" class="mt-4 text-sm tracking-normal">');
    html.push('    <h3 class="text-md font-semibold mb-2">Referensi</h3>');
    const lines = doaFormData.footnote.split('\n').filter(line => line.trim());
    lines.forEach(line => {
      html.push(`    <p class="mt-0">${processText(line)}</p>`);
    });
    html.push('  </div>');
  }
  
  html.push('</div>');
  return html.join('\n');
};