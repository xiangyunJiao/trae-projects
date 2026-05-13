import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
}

interface LineData {
  text: string;
  y: number;
  fontSize: number;
  x: number;
  isBold: boolean;
  pageWidth: number;
}

function detectBold(fontName: string): boolean {
  const lowerName = fontName.toLowerCase();
  return lowerName.includes('bold') || 
         lowerName.includes('heavy') || 
         lowerName.includes('black') ||
         lowerName.includes('semibold');
}

function isLikelyHeading(fontSize: number, maxFontSize: number): boolean {
  if (maxFontSize <= 12) return fontSize >= maxFontSize * 1.3;
  return fontSize >= maxFontSize * 1.2;
}

function getHeadingTag(fontSize: number, maxFontSize: number): string {
  if (fontSize >= maxFontSize * 1.5) return 'h1';
  if (fontSize >= maxFontSize * 1.3) return 'h2';
  if (fontSize >= maxFontSize * 1.15) return 'h3';
  return 'p';
}

function groupLinesToParagraphs(lines: LineData[]): string[] {
  if (lines.length === 0) return [];

  const paragraphs: string[] = [];
  let currentParagraph: LineData[] = [];
  
  const sortedLines = [...lines].sort((a, b) => b.y - a.y);

  for (let i = 0; i < sortedLines.length; i++) {
    const line = sortedLines[i];
    const prevLine = i > 0 ? sortedLines[i - 1] : null;

    if (prevLine && line.text.trim()) {
      const lineGap = prevLine.y - line.y;
      const avgLineHeight = (prevLine.fontSize + line.fontSize) / 2;

      if (lineGap > avgLineHeight * 2 || 
          isLikelyHeading(line.fontSize, Math.max(...lines.map(l => l.fontSize))) ||
          isLikelyHeading(prevLine.fontSize, Math.max(...lines.map(l => l.fontSize)))) {
        if (currentParagraph.length > 0) {
          paragraphs.push(renderParagraph(currentParagraph));
          currentParagraph = [];
        }
      }
    }

    if (line.text.trim()) {
      currentParagraph.push(line);
    }
  }

  if (currentParagraph.length > 0) {
    paragraphs.push(renderParagraph(currentParagraph));
  }

  return paragraphs;
}

function renderParagraph(lines: LineData[]): string {
  if (lines.length === 0) return '';

  const maxFontSize = Math.max(...lines.map(l => l.fontSize));
  const firstLine = lines[0];
  const headingTag = getHeadingTag(firstLine.fontSize, maxFontSize);
  
  let textContent = lines.map(line => line.text.trim()).join(' ').replace(/\s+/g, ' ').trim();
  
  if (!textContent) return '';

  const escapedText = escapeHtml(textContent);
  const fontSize = Math.round(firstLine.fontSize);
  
  if (headingTag !== 'p' && lines.length === 1) {
    return `<${headingTag} style="font-size: ${fontSize}px; ${firstLine.isBold ? 'font-weight: bold;' : ''}">${escapedText}</${headingTag}>`;
  }

  const styleParts: string[] = [];
  styleParts.push(`font-size: ${fontSize}px`);
  
  if (firstLine.isBold) {
    styleParts.push('font-weight: bold');
  }

  return `<p style="${styleParts.join('; ')}">${escapedText}</p>`;
}

export async function pdfToHtml(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullHtml = '';
        const allLines: LineData[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.0 });
          const textContent = await page.getTextContent();
          
          const items = textContent.items as TextItem[];
          const pageLines: LineData[] = [];
          let currentLine = '';
          let currentY = -1;
          let currentFontSize = 16;
          let currentX = 0;
          let currentIsBold = false;

          items.forEach((item) => {
            const fontSize = item.transform[3] || item.height || 16;
            const y = item.transform[5];
            const x = item.transform[4];
            const isBold = detectBold(item.fontName);
            
            if (currentY === -1 || Math.abs(y - currentY) > fontSize * 0.5) {
              if (currentLine.trim()) {
                pageLines.push({
                  text: currentLine.trim(),
                  y: currentY,
                  fontSize: currentFontSize,
                  x: currentX,
                  isBold: currentIsBold,
                  pageWidth: viewport.width,
                });
              }
              currentLine = item.str;
              currentY = y;
              currentFontSize = fontSize;
              currentX = x;
              currentIsBold = isBold;
            } else {
              const gap = x - (currentX + currentLine.length * fontSize * 0.5);
              if (gap > fontSize * 0.3) {
                currentLine += ' ';
              }
              currentLine += item.str;
              currentFontSize = Math.max(currentFontSize, fontSize);
              if (isBold) currentIsBold = true;
            }
            
            if (item.hasEOL) {
              if (currentLine.trim()) {
                pageLines.push({
                  text: currentLine.trim(),
                  y: currentY,
                  fontSize: currentFontSize,
                  x: currentX,
                  isBold: currentIsBold,
                  pageWidth: viewport.width,
                });
              }
              currentLine = '';
              currentY = -1;
              currentFontSize = 16;
              currentX = 0;
              currentIsBold = false;
            }
          });

          if (currentLine.trim()) {
            pageLines.push({
              text: currentLine.trim(),
              y: currentY,
              fontSize: currentFontSize,
              x: currentX,
              isBold: currentIsBold,
              pageWidth: viewport.width,
            });
          }

          allLines.push(...pageLines);
        }

        const paragraphs = groupLinesToParagraphs(allLines);

        if (paragraphs.length === 0) {
          fullHtml = '<p>无法从 PDF 中提取文本内容。可能的原因：</p><ul><li>PDF 是扫描件（图片格式）</li><li>PDF 被加密或受保护</li></ul>';
        } else {
          fullHtml = paragraphs.join('');
        }

        fullHtml = `
          <p style="color: #666; font-size: 14px; padding: 10px; background-color: #f9f9f9; border-radius: 4px; margin-bottom: 20px;">
            ⚠️ 提示：PDF 转 Word 功能仅能提取文本内容。复杂格式（如表格、图片、精确的排版布局）无法完全保留，请根据需要手动调整。
          </p>
          ${fullHtml}
        `;

        resolve(fullHtml);
      } catch (error) {
        console.error('PDF parsing error:', error);
        reject(new Error('解析 PDF 文件失败，请确保文件格式正确且未被加密'));
      }
    };
    
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsArrayBuffer(file);
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
