// Text processing utilities
export const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const isArabicText = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

export const processText = (text: string): string => {
  const segments = text.split(/(\[lang="ar"\][\s\S]*?\[\/lang="ar"\])/g);
  
  return segments.map(segment => {
    if (segment.startsWith('[lang="ar"]')) {
      const content = segment.replace(/^\[lang="ar"\]|\[\/lang="ar"\]$/g, '');
      return `<span class="text-2xl font-arabic" dir="rtl" lang="ar">${escapeHtml(content)}</span>`;
    }
    
    let result = '';
    let arabicText = '';
    let normalText = '';
    
    for (let i = 0; i < segment.length; i++) {
      const char = segment[i];
      if (isArabicText(char) || (char === '(' && i + 1 < segment.length && isArabicText(segment[i + 1])) || 
          (char === ')' && i > 0 && isArabicText(segment[i - 1]))) {
        if (normalText) {
          result += escapeHtml(normalText);
          normalText = '';
        }
        arabicText += char;
      } else {
        if (arabicText) {
          result += `<span class="text-2xl font-arabic" dir="rtl" lang="ar">${escapeHtml(arabicText)}</span>`;
          arabicText = '';
        }
        normalText += char;
      }
    }
    
    if (arabicText) {
      result += `<span class="text-2xl font-arabic" dir="rtl" lang="ar">${escapeHtml(arabicText)}</span>`;
    }
    if (normalText) {
      result += escapeHtml(normalText);
    }
    
    return result;
  }).join('');
};