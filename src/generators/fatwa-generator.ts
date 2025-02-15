import { FatwaFormData } from '../types';
import { processText, isArabicText } from '../utils/text-processing';

export const generateFatwaHTML = (fatwaFormData: FatwaFormData): string => {
  const html: string[] = [];
  
  html.push('<div>');
  
  if (fatwaFormData.question) {
    const questionLines = fatwaFormData.question.split('\n').filter(line => line.trim());
    questionLines.forEach(line => {
      if (isArabicText(line)) {
        html.push(`  <p class="mt-0 text-right"><span class="text-2xl font-arabic" dir="rtl" lang="ar">${line}</span></p>`);
      } else {
        html.push(`  <p class="mt-0">${line}</p>`);
      }
    });
  }
  
  if (fatwaFormData.answer) {
    const answerLines = fatwaFormData.answer.split('\n').filter(line => line.trim());
    answerLines.forEach(line => {
      if (isArabicText(line)) {
        html.push(`  <p class="mt-0 text-right"><span class="text-2xl font-arabic" dir="rtl" lang="ar">${line}</span></p>`);
      } else {
        html.push(`  <p class="mt-0">${line}</p>`);
      }
    });
  }
  
  if (fatwaFormData.reference) {
    const referenceLines = fatwaFormData.reference.split('\n').filter(line => line.trim());
    referenceLines.forEach(line => {
      if (isArabicText(line)) {
        html.push(`  <p class="mt-0 text-right"><span class="text-2xl font-arabic" dir="rtl" lang="ar">${line}</span></p>`);
      } else {
        html.push(`  <p class="mt-0">${line}</p>`);
      }
    });
  }
  
  html.push('</div>');
  return html.join('\n');
};