import { useScroll, useTexture } from '@react-three/drei';
import { items } from '../assets/imgUrl';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function Items({ totalPages }: { totalPages: number }) {
  const textures = useTexture(items.map((item) => item.url));

  return (
    <>
      {textures.map((texture, idx) => (
        <Item
          key={idx}
          index={idx}
          texture={texture}
          itemData={items[idx]}
          totalPages={totalPages}
        />
      ))}
    </>
  );
}

type ItemData = {
  url: string;
  scale: [number, number];
  position: [number, number, number];
};

type ItemProps = {
  index: number;
  texture: THREE.Texture;
  itemData: ItemData;
  totalPages: number;
};

export function Item({ index, texture, itemData, totalPages }: ItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const data = useScroll();
  const { height: viewportHeight } = useThree((state) => state.viewport);

  const initialDistance = index - 0;
  const initialY = -initialDistance * viewportHeight; // 첫 렌더링 시 위치 (튕김 현상 방지)

  useFrame((_, delta) => {
    if (!groupRef.current || !materialRef.current) return;

    // 현재 스크롤 진행률
    // e.g. 총 3페이지 -> scrollProgress: 0 ~ 2
    const scrollProgress = data.offset * (totalPages - 1);

    // distance: '나'의 인덱스와 '현재 스크롤 페이지'의 차이
    // 0: 내가 중앙에 있음
    // 양수: 나는 다음 페이지
    // 음수: 나는 이전 페이지
    const distance = index - scrollProgress;

    if (index === 2) console.log(-distance * viewportHeight);

    // 'damp'로 계산해준 '다음 프레임의 새 위치'로 나의 현재 위치 덮어쓰기 (이동하기)
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y, // 현재 위치를 바탕으로
      -distance * viewportHeight, // 목표 위치를 계산하고
      6, // 속도
      delta // 이동 시간
    );

    // distance에 비례하여 z축 회전
    const targetRotationZ = -distance * THREE.MathUtils.degToRad(23);
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotationZ,
      4,
      delta
    );
  });

  const [imgWidth, imgHeight] = itemData.scale;

  return (
    <group ref={groupRef} position={[0, initialY, 0]}>
      <mesh scale={[imgWidth, imgHeight, 1]}>
        <planeGeometry />
        <meshBasicMaterial ref={materialRef} map={texture} transparent />
      </mesh>
    </group>
  );
}
