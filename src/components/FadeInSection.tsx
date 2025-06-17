import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  disableOnMobile?: boolean;
}

export default function FadeInSection({ children, delay = 0, disableOnMobile = true }: Props) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  useEffect(() => {
    if (disableOnMobile && isMobile) return;

    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay },
      });
    }
  }, [inView, controls, delay, isMobile, disableOnMobile]);

  if (disableOnMobile && isMobile) {
    // ✅ 모바일일 경우 애니메이션 없이 렌더링
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
