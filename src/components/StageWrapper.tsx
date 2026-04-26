'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StageWrapperProps {
  stageKey: string;
  children: React.ReactNode;
}

const StageWrapper: React.FC<StageWrapperProps> = ({ stageKey, children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stageKey}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default StageWrapper;