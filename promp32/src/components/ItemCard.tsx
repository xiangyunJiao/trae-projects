import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, Pause, Heart, MessageCircle } from 'lucide-react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const images = item.images ? item.images.split(',') : [];
  const coverImage = images[item.cover_index] || images[0] || 'https://placehold.co/300x300/FFB6C1/FFFFFF?text=🎁';

  const toggleAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current || !item.audio) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <Link
      to={`/detail/${item.id}`}
      className="card-cute group hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      {item.audio && (
        <audio ref={audioRef} src={`${item.audio}`} onEnded={() => setIsPlaying(false)} />
      )}
      
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-pink-light">
        <img
          src={coverImage.startsWith('http') ? coverImage : `${coverImage}`}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {item.audio && (
          <button
            onClick={toggleAudio}
            className={`audio-btn ${isPlaying ? 'bg-pink-cute text-white' : ''}`}
          >
            {isPlaying ? <Pause size={20} /> : <Volume2 size={20} />}
          </button>
        )}
        
        <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-pink-dark">
          👤 {item.nickname || '匿名'}
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
        {item.title}
      </h3>
      
      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
        {item.content}
      </p>

      <div className="flex items-center justify-between pt-3 border-t-2 border-pink-light">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-pink-dark">
            <Heart size={18} fill="currentColor" />
            <span className="text-sm font-medium">{item.like_count || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-dark">
            <MessageCircle size={18} />
            <span className="text-sm font-medium">{item.comment_count || 0}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
