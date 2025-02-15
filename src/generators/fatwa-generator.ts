import { FatwaFormData } from '../types';
import { processText } from '../utils/text-processing';

export const generateFatwaHTML = (fatwaFormData: FatwaFormData): string => {
  const html: string[] = [];
  
  html.push('<div>');
  
  if (fatwaFormData.question) {
    html.push('  <div id="question" class="mb-4">');
    const questionLines = fatwaFormData.question.split('\n').filter(line => line.trim());
    questionLines.forEach(line => {
      html.push(`    <p class="mt-0 text-right"><span class="text-2xl font-arabic" dir="rtl" lang="ar">${line}</span></p>`);
    });
    html.push('  </div>');
  }
  
  if (fatwaFormData.answer) {
    html.push('  <div id="answer" class="mb-4">');
    const answerLines = fatwaFormData.answer.split('\n').filter(line => line.trim());
    answerLines.forEach(line => {
      html.push(`    <p class="mt-0 text-right"><span class="text-2xl font-arabic" dir="rtl" lang="ar">${line}</span></p>`);
    });
    html.push('  </div>');
  }
  
  if (fatwaFormData.reference) {
    html.push('  <div id="reference" class="mt-4">');
    const referenceLines = fatwaFormData.reference.split('\n').filter(line => line.trim());
    referenceLines.forEach(line => {
      html.push(`    <p class="mt-0 text-right"><span class="text-2xl font-arabic" dir="rtl" lang="ar">${line}</span></p>`);
    });
    html.push('  </div>');
  }
  
  html.push('</div>');
  return html.join('\n');
};