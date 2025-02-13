import { escapeHtml } from '../utils/text-processing';

export const generateAdditionalHTML = (additionalInput: string): string => {
  if (!additionalInput) return '';
  
  // Extract only Arabic text from the input
  const arabicTexts: string[] = [];
  const htmlContent = additionalInput.replace(/\s+/g, ' ').trim();
  
  // Match only Arabic characters and punctuation
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u060C\u061B\u061F\u066A-\u066C\u066D\u06D4]+/g;
  
  // First, extract Arabic text from spans
  const spanRegex = /<span[^>]*font-arabic[^>]*>([^<]+)<\/span>/g;
  let match;
  
  while ((match = spanRegex.exec(htmlContent)) !== null) {
    const spanContent = match[1];
    // Extract only Arabic characters from span content
    const arabicMatches = spanContent.match(arabicPattern);
    if (arabicMatches) {
      arabicTexts.push(...arabicMatches);
    }
  }
  
  // Then extract any standalone Arabic text
  const textWithoutSpans = htmlContent.replace(/<span[^>]*>.*?<\/span>/g, ' ');
  const standaloneArabic = textWithoutSpans.match(arabicPattern);
  if (standaloneArabic) {
    arabicTexts.push(...standaloneArabic);
  }

  // If we found any Arabic text, combine them
  if (arabicTexts.length > 0) {
    const combinedText = arabicTexts
      .filter(text => text.trim()) // Remove empty strings
      .join(' '); // Join with spaces
    
    return `<p class="mt-0"><span class="text-2xl font-arabic" dir="rtl" lang="ar">${escapeHtml(combinedText)}</span></p>`;
  }
  
  return '';
};