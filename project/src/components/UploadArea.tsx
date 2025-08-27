import React, { useState, useCallback } from 'react';
import { Upload, FolderOpen, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassmorphicCard from './GlassmorphicCard';
import { FolderType } from '../types';

interface UploadAreaProps {
  onFileUpload: (file: File, folder: FolderType) => Promise<void>;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
    setShowFolderSelect(true);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setShowFolderSelect(true);
    }
  };

  const handleUpload = async (folder: FolderType) => {
    for (const file of selectedFiles) {
      await onFileUpload(file, folder);
    }
    setSelectedFiles([]);
    setShowFolderSelect(false);
  };

  return (
    <>
      <GlassmorphicCard className="p-8 text-center cursor-pointer hover:bg-white/25 transition-all duration-300">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <motion.div
            animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragOver ? 'text-purple-300' : 'text-white/70'}`} />
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragOver ? 'Drop files here' : 'Upload Files'}
            </h3>
            <p className="text-white/60 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <div className="text-sm text-white/50">
              Supports all file types • Max size: 100MB per file
            </div>
          </motion.div>
          
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </GlassmorphicCard>

      <AnimatePresence>
        {showFolderSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowFolderSelect(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="backdrop-blur-lg bg-white/20 rounded-2xl p-8 border border-white/30 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Choose Upload Destination
              </h3>
              <p className="text-white/70 mb-6 text-center">
                Selected {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
              </p>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-400/30 to-blue-400/30 border border-white/20 text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3"
                  onClick={() => handleUpload('public')}
                >
                  <FolderOpen className="w-5 h-5" />
                  <span>Public Folder</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-400/30 to-pink-400/30 border border-white/20 text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3"
                  onClick={() => handleUpload('private')}
                >
                  <Lock className="w-5 h-5" />
                  <span>Protected Folder</span>
                </motion.button>
              </div>
              
              <button
                className="mt-4 w-full text-white/60 hover:text-white/80 transition-colors"
                onClick={() => setShowFolderSelect(false)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UploadArea;