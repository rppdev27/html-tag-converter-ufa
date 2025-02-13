export const generateSpanReducerHTML = (content: string): string => {
  if (!content) return '';

  // Extract text content from multiple spans and combine them
  const spanRegex = /<span[^>]*font-arabic[^>]*>([^<]+)<\/span>/g;
  const arabicTexts: string[] = [];
  let match;

  while ((match = spanRegex.exec(content)) !== null) {
    arabicTexts.push(match[1]);
  }

  if (arabicTexts.length === 0) return content;

  // Combine all Arabic texts with a space between them
  const combinedText = arabicTexts.join(' ');
  
  // Return the combined text in a single span
  return `<span class="text-2xl font-arabic" dir="rtl" lang="ar">${combinedText}</span>`;
};