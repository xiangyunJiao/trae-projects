import { Editor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';

interface ToolbarProps {
  editor: Editor | null;
}

const FONT_FAMILIES = [
  { label: '默认', value: 'inherit' },
  { label: '宋体', value: 'SimSun, serif' },
  { label: '黑体', value: 'SimHei, sans-serif' },
  { label: '微软雅黑', value: 'Microsoft YaHei, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
];

const FONT_SIZES = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '36px', value: '36px' },
  { label: '48px', value: '48px' },
];

const LINE_HEIGHTS = [
  { label: '1.0', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '1.75', value: '1.75' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3' },
];

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc',
  '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff',
  '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
];

const HIGHLIGHT_COLORS = [
  'transparent', '#ffff00', '#00ff00', '#00ffff', '#ff9900',
  '#ff00ff', '#9900ff', '#cccccc', '#999999',
];

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowTextColor(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(event.target as Node)) {
        setShowHighlight(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, isActive, disabled, children, title }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2 py-1.5 rounded hover:bg-gray-200 transition-colors text-xs ${
        isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-7 bg-gray-300 mx-1" />
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 bg-white border-b border-gray-200">
      <select
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'inherit') {
            editor.chain().focus().unsetFontFamily().run();
          } else {
            editor.chain().focus().setFontFamily(value).run();
          }
        }}
        className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white hover:border-blue-500 focus:outline-none focus:border-blue-500"
        defaultValue="inherit"
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.label}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            editor.chain().focus().setFontSize(value).run();
          }
        }}
        className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white hover:border-blue-500 focus:outline-none focus:border-blue-500"
        defaultValue="16px"
      >
        {FONT_SIZES.map((size) => (
          <option key={size.value} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="粗体 (Ctrl+B)"
      >
        <span className="font-bold">粗体</span>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="斜体 (Ctrl+I)"
      >
        <span className="italic">斜体</span>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="下划线 (Ctrl+U)"
      >
        <span className="underline">下划线</span>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="删除线"
      >
        <span className="line-through">删除线</span>
      </ToolbarButton>

      <ToolbarDivider />

      <div className="relative" ref={colorPickerRef}>
        <ToolbarButton
          onClick={() => setShowTextColor(!showTextColor)}
          title="文字颜色"
        >
          文字颜色
        </ToolbarButton>
        {showTextColor && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="text-xs text-gray-500 mb-1">选择颜色</div>
            <div className="grid grid-cols-5 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowTextColor(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setShowTextColor(false);
              }}
              className="w-full mt-2 text-xs text-gray-600 hover:text-gray-800 py-1 border border-gray-200 rounded hover:bg-gray-50"
            >
              清除颜色
            </button>
          </div>
        )}
      </div>

      <div className="relative" ref={highlightRef}>
        <ToolbarButton
          onClick={() => setShowHighlight(!showHighlight)}
          title="高亮颜色"
        >
          高亮
        </ToolbarButton>
        {showHighlight && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="text-xs text-gray-500 mb-1">高亮颜色</div>
            <div className="grid grid-cols-3 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    if (color === 'transparent') {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      editor.chain().focus().toggleHighlight({ color }).run();
                    }
                    setShowHighlight(false);
                  }}
                  className={`w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform ${
                    color === 'transparent' ? 'bg-white' : ''
                  }`}
                  style={{ backgroundColor: color === 'transparent' ? undefined : color }}
                  title={color === 'transparent' ? '无' : color}
                >
                  {color === 'transparent' && (
                    <span className="text-red-500 text-xs font-bold">×</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="标题1"
      >
        标题1
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="标题2"
      >
        标题2
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="标题3"
      >
        标题3
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive('paragraph')}
        title="正文"
      >
        正文
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="左对齐"
      >
        左对齐
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="居中对齐"
      >
        居中
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="右对齐"
      >
        右对齐
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        title="两端对齐"
      >
        两端对齐
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="无序列表"
      >
        ● 无序列表
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="有序列表"
      >
        1. 有序列表
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
        title="增加缩进"
      >
        缩进→
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
        title="减少缩进"
      >
        ←缩进
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="引用"
      >
        引用
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="代码块"
      >
        代码块
      </ToolbarButton>

      <ToolbarDivider />

      <select
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            editor.chain().focus().setLineHeight(value).run();
          }
        }}
        className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white hover:border-blue-500 focus:outline-none focus:border-blue-500"
        defaultValue="1.5"
      >
        {LINE_HEIGHTS.map((lh) => (
          <option key={lh.value} value={lh.value}>
            行高 {lh.label}
          </option>
        ))}
      </select>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="撤销 (Ctrl+Z)"
      >
        撤销
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="重做 (Ctrl+Y)"
      >
        重做
      </ToolbarButton>
    </div>
  );
};
