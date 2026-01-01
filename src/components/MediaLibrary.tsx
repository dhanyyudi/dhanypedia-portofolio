'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Video, Loader2, Check, AlertCircle } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
  type: 'image' | 'video';
}

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, type: 'image' | 'video') => void;
  filterType?: 'image' | 'video' | 'all';
}

export default function MediaLibrary({ isOpen, onClose, onSelect, filterType = 'all' }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/media');
      if (!response.ok) throw new Error('Failed to fetch media');
      const data = await response.json();
      setMedia(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedia = filterType === 'all' 
    ? media 
    : media.filter(m => m.type === filterType);

  const handleSelect = () => {
    const selected = media.find(m => m.id === selectedId);
    if (selected) {
      onSelect(selected.url, selected.type);
      onClose();
      setSelectedId(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--accent-primary)]/20 rounded-lg">
                <ImageIcon size={20} className="text-[var(--accent-primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Media Library</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Select from previously uploaded media
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-[var(--accent-primary)]" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle size={48} className="text-red-500 mb-3" />
                <p className="text-[var(--text-muted)]">{error}</p>
                <button
                  onClick={fetchMedia}
                  className="mt-4 btn-secondary py-2 px-4"
                >
                  Try Again
                </button>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon size={48} className="text-[var(--text-muted)] mb-3" />
                <p className="text-[var(--text-muted)]">No media files found</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Upload images in your projects to build your library
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredMedia.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedId(file.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                      selectedId === file.id
                        ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/30'
                        : 'border-transparent hover:border-[var(--border-color)]'
                    }`}
                  >
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--background-secondary)]">
                        <Video size={32} className="text-[var(--text-muted)]" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-black/50 transition-opacity ${
                      selectedId === file.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {selectedId === file.id && (
                        <div className="absolute top-2 right-2 p-1 bg-[var(--accent-primary)] rounded-full">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-xs truncate">
                        <p className="text-white truncate">{file.name}</p>
                        <p className="text-white/70">{formatSize(file.size)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-[var(--border-color)] bg-[var(--background-secondary)]">
            <p className="text-sm text-[var(--text-muted)]">
              {filteredMedia.length} file{filteredMedia.length !== 1 ? 's' : ''} available
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="btn-secondary py-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSelect}
                disabled={!selectedId}
                className="btn-glow py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} />
                Use Selected
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
