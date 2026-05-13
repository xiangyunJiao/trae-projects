import { useState, useRef, useCallback } from 'react';
import { Editor } from './components/Editor';
import { exportToDocx } from './utils/exportWord';
import { importFromDocx } from './utils/importWord';
import { exportToPdf } from './utils/exportPdf';
import { pdfToHtml } from './utils/pdfToWord';

function App() {
  const [content, setContent] = useState<string>(`
    <h1 style="text-align: center;">欢迎使用 Word 文档编辑器</h1>
    <p style="text-align: center; color: #666; font-size: 14px;">功能完善的在线文档处理工具</p>
    <p></p>
    <h2>主要功能</h2>
    <ul>
      <li><strong>新建文档</strong>：从零开始创建新文档</li>
      <li><strong>内容编辑</strong>：支持富文本编辑，包含各种格式</li>
      <li><strong>字体设置</strong>：支持多种字体、大小、颜色</li>
      <li><strong>排版功能</strong>：对齐方式、行高、缩进等</li>
      <li><strong>导出 Word</strong>：导出为 .docx 格式</li>
      <li><strong>导入 Word</strong>：导入并编辑现有 .docx 文件</li>
      <li><strong>导出 PDF</strong>：将文档转换为 PDF 格式</li>
      <li><strong>PDF 转 Word</strong>：将 PDF 转换为可编辑的文档</li>
    </ul>
    <p></p>
    <h2>使用说明</h2>
    <p>1. 使用顶部工具栏进行文本格式设置</p>
    <p>2. 点击右侧操作按钮进行文件导入导出</p>
    <p>3. 所有操作在本地浏览器中完成，数据安全</p>
    <p style="text-align: center; color: #888; line-height: 2; margin-top: 40px;">开始编辑您的文档吧！</p>
  `);
  const [fileName, setFileName] = useState<string>('未命名文档');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const editorRef = useRef<any>(null);
  const wordFileInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const handleNewDocument = () => {
    if (confirm('确定要新建文档吗？当前未保存的内容将丢失。')) {
      setContent('');
      setFileName('未命名文档');
      showMessage('success', '新建文档成功');
    }
  };

  const handleExportWord = async () => {
    try {
      setIsProcessing(true);
      await exportToDocx(content, fileName || 'document');
      showMessage('success', 'Word 文档导出成功！');
    } catch (error) {
      console.error('Export word error:', error);
      showMessage('error', '导出 Word 文档失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsProcessing(true);
      await exportToPdf('editor-content-container', fileName || 'document');
      showMessage('success', 'PDF 文档导出成功！');
    } catch (error) {
      console.error('Export pdf error:', error);
      showMessage('error', '导出 PDF 文档失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportWord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const html = await importFromDocx(file);
      setContent(html);
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      showMessage('success', 'Word 文档导入成功！');
    } catch (error) {
      console.error('Import word error:', error);
      showMessage('error', '导入 Word 文档失败，请确保文件格式正确');
    } finally {
      setIsProcessing(false);
      if (wordFileInputRef.current) {
        wordFileInputRef.current.value = '';
      }
    }
  };

  const handlePdfToWord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const html = await pdfToHtml(file);
      setContent(html);
      setFileName(file.name.replace(/\.[^/.]+$/, '_converted'));
      showMessage('success', 'PDF 转换成功！您现在可以编辑内容了');
    } catch (error) {
      console.error('PDF to word error:', error);
      showMessage('error', '转换 PDF 失败，请确保文件格式正确');
    } finally {
      setIsProcessing(false);
      if (pdfFileInputRef.current) {
        pdfFileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse ${
          message.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {message.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700">处理中，请稍候...</p>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Word 文档编辑器</h1>
            </div>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm w-48"
              placeholder="文档名称"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewDocument}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新建
            </button>

            <input
              ref={wordFileInputRef}
              type="file"
              accept=".docx,.doc"
              onChange={handleImportWord}
              className="hidden"
            />
            <button
              onClick={() => wordFileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              导入 Word
            </button>

            <input
              ref={pdfFileInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePdfToWord}
              className="hidden"
            />
            <button
              onClick={() => pdfFileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-300 rounded hover:bg-purple-100 transition-colors text-sm font-medium text-purple-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF 转 Word
            </button>

            <div className="w-px h-8 bg-gray-300 mx-2"></div>

            <button
              onClick={handleExportWord}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出 Word
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出 PDF
            </button>
          </div>
        </div>
      </header>

      <main className="p-4" style={{ height: 'calc(100vh - 72px)' }}>
        <div id="editor-content-container" className="h-full">
          <Editor content={content} onChange={setContent} editorRef={editorRef} />
        </div>
      </main>
    </div>
  );
}

export default App;
