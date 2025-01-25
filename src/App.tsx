import React, { useState } from 'react';
import { Download, XCircle, Copy, Check } from 'lucide-react';

interface DoaFormData {
  title: string;
  subtitle: string;
  arabicDoa: string;
  latin: string;
  meaning: string;
  kandungan: string;
  benefit: string;
  footnote: string;
}

interface FatwaFormData {
  question: string;
  answer: string;
  reference: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'doa' | 'fatwa'>('doa');
  const [copied, setCopied] = useState(false);
  const [doaFormData, setDoaFormData] = useState<DoaFormData>({
    title: '',
    subtitle: '',
    arabicDoa: '',
    latin: '',
    meaning: '',
    kandungan: '',
    benefit: '',
    footnote: ''
  });
  const [fatwaFormData, setFatwaFormData] = useState<FatwaFormData>({
    question: '',
    answer: '',
    reference: ''
  });

  const handleDoaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoaFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFatwaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFatwaFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearDoaForm = () => {
    setDoaFormData({
      title: '',
      subtitle: '',
      arabicDoa: '',
      latin: '',
      meaning: '',
      kandungan: '',
      benefit: '',
      footnote: ''
    });
  };

  const clearFatwaForm = () => {
    setFatwaFormData({
      question: '',
      answer: '',
      reference: ''
    });
  };

  const detectAndWrapArabicText = (text: string): string => {
    const sentences = text.split(/([.;؛])/);
    let result = '';

    sentences.forEach((sentence, index) => {
      if (sentence === '.' || sentence === ';' || sentence === '؛') {
        result += sentence;
        return;
      }

      if (/[\u0600-\u06FF]/.test(sentence)) {
        const colonParts = sentence.split(/(:\s*)/);
        let processedSentence = '';

        colonParts.forEach((part, partIndex) => {
          if (part.match(/:\s*/)) {
            processedSentence += part;
          } else if (/[\u0600-\u06FF]/.test(part)) {
            if (partIndex > 0 && !colonParts[partIndex - 1].match(/:\s*/)) {
              processedSentence += ' ';
            }
            processedSentence += part.trim();
          } else {
            processedSentence += part;
          }
        });

        if (processedSentence.trim()) {
          result += `<p class="mb-2 text-right"><span class="text-3xl font-arabic" dir="rtl" lang="ar">${processedSentence.trim()}</span></p>`;
        }
      } else {
        result += sentence;
      }
    });

    return result;
  };

  const generateDoaHTML = () => {
    const html: string[] = [];
    
    html.push('<div class="content">');
    
    if (doaFormData.title) {
      html.push(`  <h1 id="title" class="text-xl font-bold text-center">${escapeHtml(doaFormData.title)}</h1>`);
    }
    
    if (doaFormData.subtitle) {
      html.push(`  <h2 id="repeat-instruction" class="text-xs text-center">${escapeHtml(doaFormData.subtitle)}</h2>`);
    }
    
    if (doaFormData.arabicDoa) {
      html.push(`  <p id="arabic-text" class="text-4xl font-arabic mt-3 text-right" dir="rtl" lang="ar">${escapeHtml(doaFormData.arabicDoa)}</p>`);
    }
    
    if (doaFormData.latin) {
      html.push(`  <p id="latin-text" class="italic mt-2 text-sm tracking-normal"><i>${escapeHtml(doaFormData.latin)}</i></p>`);
    }
    
    if (doaFormData.meaning) {
      html.push(`  <p id="translation" class="mt-2 text-sm tracking-normal">${escapeHtml(doaFormData.meaning)}</p>`);
    }

    if (doaFormData.kandungan || doaFormData.benefit) {
      html.push('  <div id="explanation-section" class="mt-4">');
      html.push('    <h2 class="text-md font-bold mb-2 border-b border-slate-400 pb-2">Penjelasan</h2>');
      
      if (doaFormData.kandungan) {
        html.push('    <div id="explanation" class="mt-2 text-sm tracking-normal">');
        html.push('      <h3 class="text-md font-semibold mb-2">Kandungan</h3>');
        const paragraphs = doaFormData.kandungan.split('\n').filter(p => p.trim());
        paragraphs.forEach(paragraph => {
          html.push(`      ${detectAndWrapArabicText(escapeHtml(paragraph))}`);
        });
        html.push('    </div>');
      }

      if (doaFormData.benefit) {
        html.push('    <div id="benefit" class="mt-4 text-sm tracking-normal">');
        html.push('      <h3 class="text-md font-semibold mb-2">Keutamaan</h3>');
        const paragraphs = doaFormData.benefit.split('\n').filter(p => p.trim());
        paragraphs.forEach(paragraph => {
          html.push(`      ${detectAndWrapArabicText(escapeHtml(paragraph))}`);
        });
        html.push('    </div>');
      }
      html.push('  </div>');
    }
    
    if (doaFormData.footnote) {
      html.push('  <div id="hadith-reference" class="mt-4 text-sm tracking-normal">');
      html.push('    <h3 class="text-md font-semibold mb-2">Referensi</h3>');
      const footnoteParagraphs = doaFormData.footnote.split('\n').filter(p => p.trim());
      footnoteParagraphs.forEach(paragraph => {
        html.push(`    ${detectAndWrapArabicText(escapeHtml(paragraph))}`);
      });
      html.push('  </div>');
    }
    
    html.push('</div>');
    return html.join('\n');
  };

  const generateFatwaHTML = () => {
    const html: string[] = [];
    
    html.push('<div class="content">');
    
    if (fatwaFormData.question) {
      html.push('  <div id="question" class="mb-4">');
      html.push(`    <h2 class="text-md font-bold mb-2">Pertanyaan:</h2>`);
      html.push(`    ${detectAndWrapArabicText(escapeHtml(fatwaFormData.question))}`);
      html.push('  </div>');
    }
    
    if (fatwaFormData.answer) {
      html.push('  <div id="answer" class="mb-4">');
      html.push(`    <h2 class="text-md font-bold mb-2">Jawaban:</h2>`);
      const paragraphs = fatwaFormData.answer.split('\n').filter(p => p.trim());
      paragraphs.forEach(paragraph => {
        html.push(`    ${detectAndWrapArabicText(escapeHtml(paragraph.trim()))}`);
      });
      html.push('  </div>');
    }
    
    if (fatwaFormData.reference) {
      html.push('  <div id="reference" class="mt-4 text-sm text-gray-600">');
      html.push('    <h3 class="text-md font-semibold mb-2">Referensi</h3>');
      const referenceParagraphs = fatwaFormData.reference.split('\n').filter(p => p.trim());
      referenceParagraphs.forEach(paragraph => {
        html.push(`    ${detectAndWrapArabicText(escapeHtml(paragraph.trim()))}`);
      });
      html.push('  </div>');
    }
    
    html.push('</div>');
    return html.join('\n');
  };

  const downloadContent = () => {
    const content = activeTab === 'doa' ? generateDoaHTML() : generateFatwaHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-content.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyContent = async () => {
    const content = activeTab === 'doa' ? generateDoaHTML() : generateFatwaHTML();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">HTML Content Creator</h1>
        
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'doa'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('doa')}
          >
            Doa
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'fatwa'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('fatwa')}
          >
            Fatwa
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Input Form</h2>
              <button
                onClick={activeTab === 'doa' ? clearDoaForm : clearFatwaForm}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
                title="Clear form"
              >
                <XCircle className="w-5 h-5" />
                <span className="text-sm">Clear</span>
              </button>
            </div>
            <div className="space-y-4">
              {activeTab === 'doa' ? (
                <>
                  {[
                    { name: 'title', label: 'Title' },
                    { name: 'subtitle', label: 'Subtitle' },
                    { name: 'arabicDoa', label: 'Arabic Doa' },
                    { name: 'latin', label: 'Latin' },
                    { name: 'meaning', label: 'Meaning' },
                    { name: 'kandungan', label: 'Kandungan' },
                    { name: 'benefit', label: 'Keutamaan' },
                    { name: 'footnote', label: 'Footnote' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <textarea
                        name={field.name}
                        value={doaFormData[field.name as keyof DoaFormData]}
                        onChange={handleDoaChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { name: 'question', label: 'Question' },
                    { name: 'answer', label: 'Answer' },
                    { name: 'reference', label: 'Reference' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <textarea
                        name={field.name}
                        value={fatwaFormData[field.name as keyof FatwaFormData]}
                        onChange={handleFatwaChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">HTML Preview</h2>
                <button
                  onClick={copyContent}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                  title="Copy HTML"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border font-mono text-sm overflow-x-auto">
                {activeTab === 'doa' ? generateDoaHTML() : generateFatwaHTML()}
              </pre>
            </div>

            <button
              onClick={downloadContent}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;