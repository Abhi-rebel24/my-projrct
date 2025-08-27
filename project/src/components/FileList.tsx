import React, { useState } from 'react';
import { Download, Eye, Image, File, Lock, FolderOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassmorphicCard from './GlassmorphicCard';
import { FileItem, FolderType } from '../types';

interface FileListProps {
  files: FileItem[];
  title: string;
  icon: React.ReactNode;
  onRefresh: () => void;
  isProtected?: boolean;
  onUnlock?: () => void;
}

const FileList: React.FC<FileListProps> = ({ 
  files, 
  title, 
  icon, 
  onRefresh,
  isProtected = false,
  onUnlock
}) => {
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDownload = (file: FileItem) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isProtected) {
    return (
      <GlassmorphicCard className="p-8 text-center" hover onClick={onUnlock}>
        <Lock className="w-16 h-16 text-white/70 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/60">Click to unlock with PIN</p>
      </GlassmorphicCard>
    );
  }

  return (
    <>
      <GlassmorphicCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          <span className="text-sm text-white/60">{files.length} files</span>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-8">
            <File className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassmorphicCard className="p-4 hover:bg-white/10 transition-all duration-300" hover>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {file.isImage ? (
                          <Image className="w-6 h-6 text-purple-300" />
                        ) : (
                          <File className="w-6 h-6 text-blue-300" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{file.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{formatDate(file.uploadedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.isImage && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-purple-400/20 text-purple-300 hover:bg-purple-400/30 transition-colors"
                            onClick={() => setPreviewFile(file)}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 transition-colors"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassmorphicCard>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassmorphicCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{previewFile.name}</h3>
                  <button
                    className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setPreviewFile(null)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </GlassmorphicCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FileList;