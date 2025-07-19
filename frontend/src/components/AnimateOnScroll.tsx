// src/components/AnimateOnScroll.tsx
import React, { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Đăng ký plugin ScrollTrigger một lần khi ứng dụng khởi chạy.
// Đây là best practice để tránh đăng ký nhiều lần.
// Bạn có thể đặt dòng này ở file index.tsx hoặc App.tsx để nó chỉ chạy 1 lần duy nhất.
// Nếu bạn chưa làm vậy, việc đặt nó ở đây vẫn sẽ hoạt động, nhưng sẽ có cảnh báo trong console.
if (typeof window !== 'undefined') { // Kiểm tra để đảm bảo chạy ở môi trường trình duyệt
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimateOnScrollProps {
  children: ReactNode;
  /**
   * Defines the starting properties for the animation (GSAP 'from' state).
   * Default: { opacity: 0, y: 50, scale: 0.95 }
   */
  from?: gsap.TweenVars;
  /**
   * Defines the ending properties for the animation (GSAP 'to' state).
   * Default: { opacity: 1, y: 0, scale: 1 }
   */
  to?: gsap.TweenVars;
  /**
   * Delay in milliseconds before the animation starts after entering viewport.
   * Default: 0
   */
  delay?: number;
  /**
   * Duration of the animation in seconds.
   * Default: 0.8
   */
  duration?: number;
  /**
   * Easing function for the animation.
   * Default: 'power3.out'
   */
  ease?: string;
  /**
   * If true, the animation will only run once when the element enters the viewport.
   * If false, it will animate on enter and reverse on leave back.
   * Default: true
   */
  triggerOnce?: boolean;
  /**
   * Advanced ScrollTrigger 'start' property.
   * Default: 'top 85%' (when the top of the element hits 85% from viewport top)
   * Examples: "top center", "top bottom", "center center"
   */
  start?: string;
  /**
   * Advanced ScrollTrigger 'end' property.
   * Default: 'bottom top'
   * Examples: "bottom top", "+=300" (300px past trigger end)
   */
  end?: string;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  from = { opacity: 0, y: 50, scale: 0.95 },
  to = { opacity: 1, y: 0, scale: 1 },
  delay = 0,
  duration = 0.8,
  ease = 'power3.out',
  triggerOnce = true,
  start = 'top 85%', // Kích hoạt khi đỉnh phần tử chạm 85% chiều cao viewport từ trên xuống
  end = 'bottom top', // Kết thúc khi đáy phần tử rời khỏi đỉnh viewport
}) => {
  const el = useRef<HTMLDivElement>(null); // Ref để tham chiếu đến phần tử DOM

  useEffect(() => {
    // Đảm bảo phần tử DOM đã được render
    if (!el.current) return;

    // Đặt trạng thái ban đầu cho phần tử trước khi animation bắt đầu
    gsap.set(el.current, from);

    // Tạo một GSAP Timeline để kiểm soát tốt hơn các animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el.current,      // Phần tử sẽ kích hoạt ScrollTrigger
        start: start,             // Khi nào animation bắt đầu
        end: end,                 // Khi nào animation kết thúc
        once: triggerOnce,        // Animation chạy 1 lần hay nhiều lần
        toggleActions: triggerOnce ? 'play none none none' : 'play none none reverse',
        // 'play': Khi vào viewport, chạy animation
        // 'none': Khi rời viewport (cuộn xuống), không làm gì
        // 'none': Khi vào lại viewport (cuộn lên), không làm gì
        // 'reverse': Khi rời viewport (cuộn lên), đảo ngược animation
        // markers: true, // Chỉ sử dụng cho mục đích debug, hiển thị các marker của ScrollTrigger
      },
    });

    // Thêm animation 'to' vào timeline
    tl.to(el.current, {
      ...to, // Các thuộc tính kết thúc animation
      delay: delay / 1000, // Chuyển đổi mili giây sang giây cho GSAP
      duration: duration,
      ease: ease,
    });

    // Cleanup function để loại bỏ ScrollTrigger instance khi component unmount
    return () => {
      if (tl.scrollTrigger) { // Kiểm tra xem ScrollTrigger có tồn tại không
        tl.scrollTrigger.kill(); // Hủy bỏ ScrollTrigger để tránh rò rỉ bộ nhớ
      }
    };
  }, [from, to, delay, duration, ease, triggerOnce, start, end]); // Dependencies của useEffect

  // Render children trong một div được gán ref
  return <div ref={el}>{children}</div>;
};

export default AnimateOnScroll;