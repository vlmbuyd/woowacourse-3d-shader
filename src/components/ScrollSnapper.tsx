import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { useRef } from 'react';

export default function ScrollSnapper({
  totalItems,
  isInfinite,
}: {
  totalItems: number;
  isInfinite: boolean;
}) {
  const data = useScroll();

  // 스냅이 1회 실행되었는지 체크
  const snapExecuted = useRef<boolean>(false);

  useFrame(() => {
    if (!isInfinite) return;

    const scrollVelocity = data.delta; // 현재 스크롤 속도
    const velocityThreshold = 0.0001; // "거의 멈췄음"을 판단하는 기준

    // 스크롤 중
    if (Math.abs(scrollVelocity) > velocityThreshold) {
      snapExecuted.current = false;
      return;
    }

    // 스크롤 멈췄을 때
    if (
      Math.abs(scrollVelocity) <= velocityThreshold &&
      !snapExecuted.current
    ) {
      snapExecuted.current = true;

      // 목표 지점 계산
      const currentScroll = data.offset * totalItems;
      const targetScroll = Math.round(currentScroll);

      const maxScrollTop = data.el.scrollHeight - data.el.clientHeight; // 실제 스크롤 할 수 있는 픽셀 총 범위
      const targetOffset = targetScroll / totalItems; // 목표 지점이 몇 %에 위치하는지 계산
      const targetScrollTop = maxScrollTop * targetOffset;

      // 스크롤 스냅 (1px 이상 차이날 때만 적용)
      if (Math.abs(data.el.scrollTop - targetScrollTop) >= 1) {
        data.el.scrollTop = targetScrollTop;
      }
    }
  });

  return null;
}
