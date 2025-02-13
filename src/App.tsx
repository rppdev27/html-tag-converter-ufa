import React, { useState } from 'react';
import { Download, XCircle, Copy, Check } from 'lucide-react';
import { DoaFormData, FatwaFormData, ActiveTab } from './types';
import { generateDoaHTML } from './generators/doa-generator';
import { generateFatwaHTML } from './generators/fatwa-generator';
import { generateAdditionalHTML } from './generators/additional-generator';
import { processArabicMultiLines } from './generators/arabic-multiline-generator';
import { generateSpanReducerHTML } from './generators/span-reducer';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('span-reducer');
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
  const [additionalInput, setAdditionalInput] = useState('');
  const [arabicMultiLinesInput, setArabicMultiLinesInput] = useState('');
  const [spanReducerInput, setSpanReducerInput] = useState('');

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

  const getContent = () => {
    switch (activeTab) {
      case 'doa':
        return generateDoaHTML(doaFormData);
      case 'fatwa':
        return generateFatwaHTML(fatwaFormData);
      case 'additional':
        return generateAdditionalHTML(additionalInput);
      case 'arabic-multi-lines':
        return processArabicMultiLines(arabicMultiLinesInput);
      case 'span-reducer':
        return generateSpanReducerHTML(spanReducerInput);
      default:
        return '';
    }
  };

  const downloadContent = () => {
    const content = getContent();
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
    try {
      await navigator.clipboard.writeText(getContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">HTML Content Creator</h1>
        
        <div className="border-b border-gray-200 mb-8">
          <div className="inline-block">
            {[
              { id: 'span-reducer', label: 'Span Reducer' },
              { id: 'doa', label: 'Doa' },
              { id: 'fatwa', label: 'Fatwa' },
              { id: 'additional', label: 'Additional' },
              { id: 'arabic-multi-lines', label: 'Arabic Multi Lines' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <div className="float-right">
                <button
                  onClick={activeTab === 'doa' ? clearDoaForm : clearFatwaForm}
                  className="inline-block text-gray-600 hover:text-red-600 transition-colors"
                  title="Clear form"
                >
                  <span className="inline-block align-middle mr-1"><XCircle className="w-5 h-5" /></span>
                  <span className="inline-block align-middle text-sm">Clear</span>
                </button>
              </div>
              <h2 className="text-xl font-semibold">Input Form</h2>
            </div>
            
            <div className="space-y-4">
              {activeTab === 'doa' && (
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
              )}
              
              {activeTab === 'fatwa' && (
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
              
              {activeTab === 'additional' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Input HTML
                  </label>
                  <textarea
                    value={additionalInput}
                    onChange={(e) => setAdditionalInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
                  />
                </div>
              )}
              
              {activeTab === 'arabic-multi-lines' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arabic Text (One line per reference)
                  </label>
                  <textarea
                    value={arabicMultiLinesInput}
                    onChange={(e) => setArabicMultiLinesInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
                    dir="rtl"
                  />
                </div>
              )}

              {activeTab === 'span-reducer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Input HTML with Multiple Spans
                  </label>
                  <textarea
                    value={spanReducerInput}
                    onChange={(e) => setSpanReducerInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
                    placeholder="Paste HTML with multiple Arabic spans here..."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <div className="float-right">
                  <button
                    onClick={copyContent}
                    className="inline-block text-gray-600 hover:text-blue-600 transition-colors"
                    title="Copy HTML"
                  >
                    {copied ? (
                      <>
                        <span className="inline-block align-middle mr-1"><Check className="w-5 h-5" /></span>
                        <span className="inline-block align-middle text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-block align-middle mr-1"><Copy className="w-5 h-5" /></span>
                        <span className="inline-block align-middle text-sm">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <h2 className="text-xl font-semibold">HTML Preview</h2>
              </div>
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border font-mono text-sm overflow-x-auto">
                {getContent()}
              </pre>
            </div>

            <button
              onClick={downloadContent}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              <span className="inline-block align-middle mr-2"><Download className="w-5 h-5" /></span>
              <span className="inline-block align-middle">Download HTML</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;