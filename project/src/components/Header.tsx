import React from 'react';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-400/30 to-pink-400/30 backdrop-blur-sm border border-white/20">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
              MyFileShare
            </h1>
          </motion.div>
          
          <div className="text-sm text-white/70 hidden sm:block">
            Secure • Fast • Beautiful
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;