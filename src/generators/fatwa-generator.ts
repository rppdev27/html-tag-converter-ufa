import { FatwaFormData } from '../types';
import { processText } from '../utils/text-processing';

export const generateFatwaHTML = (fatwaFormData: FatwaFormData): string => {
  const html: string[] = [];
  
  html.push('<div class="content">');
  
  if (fatwaFormData.question) {
    html.push('  <div id="question" class="mb-4">');
    html.push(`    <h2 class="text-md font-bold mb-2">Pertanyaan:</h2>`);
    html.push(`    ${processText(fatwaFormData.question)}`);
    html.push('  </div>');
  }
  
  if (fatwaFormData.answer) {
    html.push('  <div id="answer" class="mb-4">');
    html.push(`    <h2 class="text-md font-bold mb-2">Jawaban:</h2>`);
    const paragraphs = fatwaFormData.answer.split('\n').filter(p => p.trim());
    paragraphs.forEach(paragraph => {
      html.push(`    ${processText(paragraph.trim())}`);
    });
    html.push('  </div>');
  }
  
  if (fatwaFormData.reference) {
    html.push('  <div id="reference" class="mt-4 text-sm text-gray-600">');
    html.push('    <h3 class="text-md font-semibold mb-2">Referensi</h3>');
    const referenceParagraphs = fatwaFormData.reference.split('\n').filter(p => p.trim());
    referenceParagraphs.forEach(paragraph => {
      html.push(`    ${processText(paragraph.trim())}`);
    });
    html.push('  </div>');
  }
  
  html.push('</div>');
  return html.join('\n');
};