import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, LevelFormat } from 'docx';
import { saveAs } from 'file-saver';

interface HeadingStyle {
  level: typeof HeadingLevel[keyof typeof HeadingLevel];
  fontSize: number;
  bold: boolean;
}

const headingStyles: Record<string, HeadingStyle> = {
  'h1': { level: HeadingLevel.HEADING_1, fontSize: 32, bold: true },
  'h2': { level: HeadingLevel.HEADING_2, fontSize: 24, bold: true },
  'h3': { level: HeadingLevel.HEADING_3, fontSize: 20, bold: true },
};

function getAlignment(type: string): typeof AlignmentType[keyof typeof AlignmentType] {
  switch (type) {
    case 'left':
      return AlignmentType.LEFT;
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'justify':
      return AlignmentType.JUSTIFIED;
    default:
      return AlignmentType.LEFT;
  }
}

function parseStyle(style: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!style) return result;
  
  const declarations = style.split(';');
  declarations.forEach(decl => {
    const [property, value] = decl.split(':').map(s => s.trim());
    if (property && value) {
      result[property.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
    }
  });
  return result;
}

function parseFontSize(sizeStr: string): number {
  if (!sizeStr) return 24;
  const match = sizeStr.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const size = parseFloat(match[1]);
    if (sizeStr.includes('px')) {
      return size * 2;
    }
    if (sizeStr.includes('em')) {
      return size * 32;
    }
    if (sizeStr.includes('pt')) {
      return size * 2;
    }
    return size * 2;
  }
  return 24;
}

function extractAllText(element: HTMLElement | Text): TextRun[] {
  const runs: TextRun[] = [];
  
  if (element.nodeType === Node.TEXT_NODE) {
    const text = (element as Text).textContent;
    if (text) {
      runs.push(new TextRun({ text }));
    }
    return runs;
  }

  const el = element as HTMLElement;
  const style = parseStyle(el.getAttribute('style') || '');
  const tagName = el.tagName.toLowerCase();

  let bold = false;
  let italics = false;
  let underline = false;
  let color = '';
  let highlightColor = '';
  let fontSize = 0;
  let fontFamily = '';

  if (tagName === 'strong' || tagName === 'b' || style.fontWeight === 'bold' || (style.fontWeight && parseInt(style.fontWeight) >= 600)) {
    bold = true;
  }
  if (tagName === 'em' || tagName === 'i' || style.fontStyle === 'italic') {
    italics = true;
  }
  if (tagName === 'u' || (style.textDecoration && style.textDecoration.includes('underline'))) {
    underline = true;
  }
  if (style.color) {
    const colorMatch = style.color.match(/#([0-9a-fA-F]{3,6})/);
    if (colorMatch) {
      let hexColor = colorMatch[1];
      if (hexColor.length === 3) {
        hexColor = hexColor.split('').map(c => c + c).join('');
      }
      color = hexColor;
    }
  }
  if (style.backgroundColor || style.background) {
    const bg = style.backgroundColor || style.background;
    const colorMatch = bg.match(/#([0-9a-fA-F]{3,6})/);
    if (colorMatch) {
      let hexColor = colorMatch[1];
      if (hexColor.length === 3) {
        hexColor = hexColor.split('').map(c => c + c).join('');
      }
      highlightColor = hexColor;
    }
  }
  if (style.fontSize) {
    fontSize = parseFontSize(style.fontSize);
  }
  if (style.fontFamily) {
    fontFamily = style.fontFamily;
  }

  const processChildren = (parent: Node) => {
    parent.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node as Text).textContent;
        if (text) {
          const runOptions: any = {
            text,
            bold,
            italics,
            underline: underline ? {} : undefined,
            color: color || undefined,
            shading: highlightColor ? { type: 'clear', color: 'auto', fill: highlightColor } : undefined,
          };
          if (fontSize > 0) {
            runOptions.size = fontSize;
          }
          if (fontFamily) {
            runOptions.font = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
          }
          if (tagName === 'code') {
            runOptions.font = 'Consolas';
          }
          runs.push(new TextRun(runOptions));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const childEl = node as HTMLElement;
        const childTagName = childEl.tagName.toLowerCase();
        
        if (childTagName === 'br') {
          runs.push(new TextRun({ text: '' }));
        } else {
          const childRuns = extractAllText(childEl);
          childRuns.forEach(run => {
            const runJson = JSON.parse(JSON.stringify(run));
            if (bold && !runJson.bold) runJson.bold = true;
            if (italics && !runJson.italics) runJson.italics = true;
            if (underline && !runJson.underline) runJson.underline = {};
            if (color && !runJson.color) runJson.color = color;
            if (highlightColor && !runJson.shading) {
              runJson.shading = { type: 'clear', color: 'auto', fill: highlightColor };
            }
            if (fontSize > 0 && !runJson.size) runJson.size = fontSize;
            runs.push(new TextRun(runJson));
          });
        }
      }
    });
  };

  if (tagName === 'a') {
    processChildren(el);
  } else {
    processChildren(el);
  }

  return runs;
}

function createParagraph(element: HTMLElement): Paragraph {
  const style = parseStyle(element.getAttribute('style') || '');
  const tagName = element.tagName.toLowerCase();
  
  const children = extractAllText(element);
  const alignment = style.textAlign ? getAlignment(style.textAlign) : AlignmentType.LEFT;
  let lineHeight: number | undefined;
  
  if (style.lineHeight) {
    const match = style.lineHeight.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      lineHeight = parseFloat(match[1]) * 240;
    }
  }

  const paragraphOptions: any = {
    children: children.length > 0 ? children : [new TextRun({ text: '' })],
    alignment,
    spacing: lineHeight ? { line: lineHeight } : undefined,
  };

  if (headingStyles[tagName]) {
    paragraphOptions.heading = headingStyles[tagName].level;
  }

  if (tagName === 'blockquote') {
    paragraphOptions.indent = { left: convertInchesToTwip(0.5) };
  }

  return new Paragraph(paragraphOptions);
}

function createListParagraph(element: HTMLElement, listType: 'bullet' | 'numbered'): Paragraph {
  const style = parseStyle(element.getAttribute('style') || '');
  const children = extractAllText(element);
  const alignment = style.textAlign ? getAlignment(style.textAlign) : AlignmentType.LEFT;

  const paragraphOptions: any = {
    children: children.length > 0 ? children : [new TextRun({ text: '' })],
    alignment,
  };

  if (listType === 'bullet') {
    paragraphOptions.bullet = { level: 0 };
  } else {
    paragraphOptions.numbering = { reference: 'ordered-list', level: 0 };
  }

  return new Paragraph(paragraphOptions);
}

function processElement(element: HTMLElement, paragraphs: Paragraph[]) {
  const tagName = element.tagName.toLowerCase();

  if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'].includes(tagName)) {
    paragraphs.push(createParagraph(element));
  } else if (tagName === 'ul') {
    element.querySelectorAll(':scope > li').forEach((li) => {
      paragraphs.push(createListParagraph(li as HTMLElement, 'bullet'));
      const nestedUl = li.querySelector(':scope > ul');
      const nestedOl = li.querySelector(':scope > ol');
      if (nestedUl) {
        nestedUl.querySelectorAll(':scope > li').forEach((nestedLi) => {
          paragraphs.push(createListParagraph(nestedLi as HTMLElement, 'bullet'));
        });
      }
      if (nestedOl) {
        nestedOl.querySelectorAll(':scope > li').forEach((nestedLi) => {
          paragraphs.push(createListParagraph(nestedLi as HTMLElement, 'numbered'));
        });
      }
    });
  } else if (tagName === 'ol') {
    element.querySelectorAll(':scope > li').forEach((li) => {
      paragraphs.push(createListParagraph(li as HTMLElement, 'numbered'));
      const nestedUl = li.querySelector(':scope > ul');
      const nestedOl = li.querySelector(':scope > ol');
      if (nestedUl) {
        nestedUl.querySelectorAll(':scope > li').forEach((nestedLi) => {
          paragraphs.push(createListParagraph(nestedLi as HTMLElement, 'bullet'));
        });
      }
      if (nestedOl) {
        nestedOl.querySelectorAll(':scope > li').forEach((nestedLi) => {
          paragraphs.push(createListParagraph(nestedLi as HTMLElement, 'numbered'));
        });
      }
    });
  } else if (tagName === 'pre') {
    const code = element.textContent || '';
    code.split('\n').forEach(line => {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: line, font: 'Consolas' })],
      }));
    });
  } else if (tagName === 'div') {
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        processElement(node as HTMLElement, paragraphs);
      }
    });
  }
}

export async function exportToDocx(htmlContent: string, fileName: string = 'document') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const paragraphs: Paragraph[] = [];

  doc.body.childNodes.forEach(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    processElement(node as HTMLElement, paragraphs);
  });

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: '' })],
    }));
  }

  const docxDocument = new Document({
    numbering: {
      config: [
        {
          reference: 'ordered-list',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(docxDocument);
  saveAs(blob, `${fileName}.docx`);
}
