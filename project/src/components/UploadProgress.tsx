import React from 'react';
import { CheckCircle, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassmorphicCard from './GlassmorphicCard';
import { UploadProgress as UploadProgressType } from '../types';

interface UploadProgressProps {
  uploads: UploadProgressType[];
}

const UploadProgress: React.FC<UploadProgressProps> = ({ uploads }) => {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full">
      <AnimatePresence>
        {uploads.map((upload, index) => (
          <motion.div
            key={upload.fileName}
            initial={{ opacity: 0, x: 100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            className="mb-3"
          >
            <GlassmorphicCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {upload.isComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Upload className="w-5 h-5 text-blue-400 animate-pulse" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {upload.fileName}
                  </p>
                  <div className="mt-1">
                    <div className="bg-white/20 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full h-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${upload.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-white/70 font-mono">
                  {upload.progress}%
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UploadProgress;