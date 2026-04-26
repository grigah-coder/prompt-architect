import { motion } from 'framer-motion';

const MeshBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <motion.div
        className="absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-30 bg-linear-to-br from-blue-500 to-purple-600"
        animate={{
          x: [0, 200, -100, 0],
          y: [0, -150, 200, 0],
          scale: [1, 1.3, 0.7, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute top-1/4 right-20 w-80 h-80 rounded-full blur-3xl opacity-30 bg-linear-to-br from-green-400 to-blue-500"
        animate={{
          x: [0, -150, 250, 0],
          y: [0, 200, -100, 0],
          scale: [1, 0.8, 1.4, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-30 bg-linear-to-br from-purple-500 to-pink-500"
        animate={{
          x: [0, 300, -200, 0],
          y: [0, -250, 150, 0],
          scale: [1, 1.2, 0.6, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 11,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-64 h-64 rounded-full blur-3xl opacity-30 bg-linear-to-br from-yellow-400 to-red-500"
        animate={{
          x: [0, -250, 100, 0],
          y: [0, 150, -200, 0],
          scale: [1, 0.9, 1.5, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default MeshBackground;