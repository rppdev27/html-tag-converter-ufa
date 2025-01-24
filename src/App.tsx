import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface FormData {
  title: string;
  subtitle: string;
  arabicDoa: string;
  latin: string;
  meaning: string;
  kandungan: string;
  footnote: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    arabicDoa: '',
    latin: '',
    meaning: '',
    kandungan: '',
    footnote: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const downloadContent = () => {
    const blob = new Blob([generateHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doa-content.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHTML = () => {
    const html: string[] = [];
    html.push('<div class="content">');
    
    if (formData.title) {
      html.push(`  <h1 id="title" class="text-xl font-bold">${escapeHtml(formData.title)}</h1>`);
    }
    
    if (formData.subtitle) {
      html.push(`  <h2 id="repeat-instruction" class="text-lg">${escapeHtml(formData.subtitle)}</h2>`);
    }
    
    if (formData.arabicDoa) {
      html.push(`  <p id="arabic-text" class="text-4xl font-arabic" dir="rtl" lang="ar">\n    ${escapeHtml(formData.arabicDoa)}\n  </p>`);
    }
    
    if (formData.latin) {
      html.push(`  <p id="latin-text" class="italic"><i>${escapeHtml(formData.latin)}</i></p>`);
    }
    
    if (formData.meaning) {
      html.push(`  <p id="translation">${escapeHtml(formData.meaning)}</p>`);
    }
    
    if (formData.kandungan) {
      html.push('  <div id="explanation" class="mt-4">');
      const paragraphs = formData.kandungan.split('\n').filter(p => p.trim());
      paragraphs.forEach(paragraph => {
        html.push(`    <p class="mb-2">${escapeHtml(paragraph.trim())}</p>`);
      });
      html.push('  </div>');
    }
    
    if (formData.footnote) {
      html.push('  <div id="hadith-reference" class="text-sm text-gray-600">');
      const footnoteParagraphs = formData.footnote.split('\n').filter(p => p.trim());
      footnoteParagraphs.forEach(paragraph => {
        html.push(`    <p class="mb-2">${escapeHtml(paragraph.trim())}</p>`);
      });
      html.push('  </div>');
    }
    
    html.push('</div>');
    return html.join('\n');
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Input Form</h2>
            <div className="space-y-4">
              {[
                { name: 'title', label: 'Title' },
                { name: 'subtitle', label: 'Subtitle' },
                { name: 'arabicDoa', label: 'Arabic Doa' },
                { name: 'latin', label: 'Latin' },
                { name: 'meaning', label: 'Meaning' },
                { name: 'kandungan', label: 'Kandungan' },
                { name: 'footnote', label: 'Footnote' }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <textarea
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">HTML Preview</h2>
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border font-mono text-sm overflow-x-auto">
                {generateHTML()}
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