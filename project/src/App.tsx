import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Lock, X } from 'lucide-react';
import Header from './components/Header';
import GlassmorphicCard from './components/GlassmorphicCard';
import UploadArea from './components/UploadArea';
import UploadProgress from './components/UploadProgress';
import FileList from './components/FileList';
import { useFirebaseStorage } from './hooks/useFirebaseStorage';
import { FolderType } from './types';

const PROTECTED_PIN = '1234'; // In production, use proper authentication

function App() {
  const { files, uploadProgress, uploadFile, fetchFiles } = useFirebaseStorage();
  const [isProtectedUnlocked, setIsProtectedUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleFileUpload = async (file: File, folder: FolderType) => {
    try {
      await uploadFile(file, folder);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleProtectedAccess = () => {
    setShowPinModal(true);
    setPin('');
    setPinError('');
  };

  const handlePinSubmit = () => {
    if (pin === PROTECTED_PIN) {
      setIsProtectedUnlocked(true);
      setShowPinModal(false);
      fetchFiles('private');
    } else {
      setPinError('Invalid PIN. Try again.');
      setPin('');
    }
  };

  const handlePinKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePinSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-400/20 to-teal-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <Header />
      
      <main className="container mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <UploadArea onFileUpload={handleFileUpload} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FileList
              files={files.public}
              title="Public Files"
              icon={<FolderOpen className="w-6 h-6 text-green-400" />}
              onRefresh={() => fetchFiles('public')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FileList
              files={files.private}
              title="Protected Files"
              icon={<Lock className="w-6 h-6 text-purple-400" />}
              onRefresh={() => fetchFiles('private')}
              isProtected={!isProtectedUnlocked}
              onUnlock={handleProtectedAccess}
            />
          </motion.div>
        </div>
      </main>

      <UploadProgress uploads={uploadProgress} />

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="backdrop-blur-lg bg-white/20 rounded-2xl p-8 border border-white/30 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Enter PIN</h3>
                <button
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setShowPinModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyPress={handlePinKeyPress}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all"
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  autoFocus
                />
                {pinError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm mt-2"
                  >
                    {pinError}
                  </motion.p>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                onClick={handlePinSubmit}
              >
                Unlock Files
              </motion.button>
              
              <p className="text-white/50 text-xs text-center mt-4">
                Demo PIN: 1234
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;