import { motion } from 'framer-motion';

// Fade in animation container
export const FadeIn = ({ children, delay = 0, duration = 0.3, className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide up animation container
export const SlideUp = ({ children, delay = 0, duration = 0.4, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Scale in animation container
export const ScaleIn = ({ children, delay = 0, duration = 0.2, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide from right animation container
export const SlideRight = ({ children, delay = 0, duration = 0.3, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Staggered children animation container
export const StaggerContainer = ({ children, staggerDelay = 0.1, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Item for staggered animation
export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 15 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Hover scale animation wrapper
export const HoverScale = ({ children, scale = 1.02, className = '' }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.15, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Page transition wrapper
export const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default {
  FadeIn,
  SlideUp,
  ScaleIn,
  SlideRight,
  StaggerContainer,
  StaggerItem,
  HoverScale,
  PageTransition,
};
