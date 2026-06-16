export const smoothEase = [0.22, 1, 0.36, 1];
export const quickEase = [0.4, 0, 1, 1];

export const viewportOnce = { once: true, amount: 0.32 };

export const sectionContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export const sectionItem = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.58, ease: smoothEase },
  },
};

export const cardItem = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

export const screenVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: smoothEase, staggerChildren: 0.035 },
  },
  exit: { opacity: 0, y: 0, transition: { duration: 0.16, ease: quickEase } },
};

export const itemVariants = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: smoothEase } },
};
