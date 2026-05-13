import * as mammoth from 'mammoth';

export async function importFromDocx(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        let html = result.value;
        
        html = html.replace(/<h1([^>]*)>/gi, '<h1$1>');
        html = html.replace(/<h2([^>]*)>/gi, '<h2$1>');
        html = html.replace(/<h3([^>]*)>/gi, '<h3$1>');
        
        resolve(html);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
