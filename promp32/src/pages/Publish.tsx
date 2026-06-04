import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Check, Star } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';
import { useAppStore } from '../store';
import { Item } from '../types';

export default function Publish() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id) {
      fetchItem();
    }
  }, [id, user]);

  const [existingAudio, setExistingAudio] = useState<string | undefined>();

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      if (data.success) {
        const item: Item = data.item;
        setTitle(item.title);
        setContent(item.content);
        setCoverIndex(item.cover_index);
        setExistingAudio(item.audio);
        const imgs = item.images ? item.images.split(',') : [];
        setExistingImages(imgs);
        setImagePreviews(imgs.map(img => img.startsWith('http') ? img : `${img}`));
      }
    } catch (error) {
      console.error('获取作品失败:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const remainingSlots = 9 - images.length - existingImages.length;
    const newFiles = Array.from(files).slice(0, remainingSlots);
    
    if (newFiles.length === 0) return;

    setImages(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      if (coverIndex >= existingImages.length && coverIndex > 0) {
        setCoverIndex(coverIndex - 1);
      } else if (coverIndex === index) {
        setCoverIndex(0);
      }
    } else {
      const newIndex = index - existingImages.length;
      setImages(prev => prev.filter((_, i) => i !== newIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      if (coverIndex === index) {
        setCoverIndex(0);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }
    if (imagePreviews.length === 0) {
      alert('请至少上传一张图片');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('coverIndex', coverIndex.toString());
    formData.append('userId', user!.id);
    
    if (existingImages.length > 0) {
      formData.append('existingImages', existingImages.join(','));
    }
    
    images.forEach(img => {
      formData.append('images', img);
    });
    
    if (audioFile) {
      formData.append('audio', audioFile);
    }

    try {
      const url = id 
        ? `/api/items/${id}`
        : '/api/items';
      
      const res = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        navigate('/', { replace: true });
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen decoration-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card-cute">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3 animate-float">{id ? '✏️' : '🎁'}</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-dark to-blue-dark bg-clip-text text-transparent">
              {id ? '编辑宝贝' : '发布我的宝贝'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ 宝贝标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-cute"
                placeholder="给你的宝贝起个好听的名字吧~"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 宝贝介绍
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-cute min-h-32 resize-none"
                placeholder="详细介绍一下你的宝贝吧，比如它有什么特别的地方..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📸 上传图片 ({imagePreviews.length}/9)
                <span className="text-xs text-gray-400 ml-2">
                  点击星星选择封面图
                </span>
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img
                      src={preview}
                      alt={`预览${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverIndex(idx)}
                      className={`absolute bottom-1 left-1 p-1.5 rounded-full transition-all ${
                        idx === coverIndex
                          ? 'bg-yellow-cute text-yellow-700'
                          : 'bg-white/80 text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <Star size={16} fill={idx === coverIndex ? 'currentColor' : 'none'} />
                    </button>
                    {idx === coverIndex && (
                      <div className="absolute inset-0 border-4 border-yellow-cute rounded-xl pointer-events-none">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-cute text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                          封面
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {imagePreviews.length < 9 && (
                  <label className="aspect-square rounded-xl border-4 border-dashed border-pink-cute/50 flex flex-col items-center justify-center cursor-pointer hover:border-pink-cute hover:bg-pink-light/30 transition-all">
                    <Upload size={32} className="text-pink-cute mb-2" />
                    <span className="text-sm text-gray-500">添加图片</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎤 语音介绍 (可选)
              </label>
              <AudioRecorder 
                onAudioChange={setAudioFile} 
                initialAudioUrl={id && existingAudio ? `${existingAudio}` : undefined}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-cute btn-green flex items-center justify-center gap-2 text-lg"
              >
                <Check size={24} />
                {loading ? '发布中...' : (id ? '保存修改' : '立即发布')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
