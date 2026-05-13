import { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import { Toolbar } from './Toolbar';
import { FontFamily } from '../extensions/fontFamily';
import { FontSize } from '../extensions/fontSize';
import { LineHeight } from '../extensions/lineHeight';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  editorRef?: React.MutableRefObject<ReturnType<typeof useEditor> | null>;
}

export const Editor = ({ content, onChange, editorRef }: EditorProps) => {
  const isUpdatingRef = useRef(false);
  const lastContentRef = useRef(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: '开始输入你的文档内容...',
      }),
      LineHeight,
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      isUpdatingRef.current = true;
      lastContentRef.current = editor.getHTML();
      onChange(editor.getHTML());
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-full p-8',
      },
    },
  });

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor as any;
    }
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor && !isUpdatingRef.current && content !== lastContentRef.current) {
      lastContentRef.current = content;
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 min-h-[1000px]">
          <EditorContent editor={editor} className="min-h-full" />
        </div>
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex justify-between">
        <span>
          字数: {editor?.storage.characterCount.characters() || 0}
        </span>
        <span>
          词数: {editor?.storage.characterCount.words() || 0}
        </span>
      </div>
    </div>
  );
};
