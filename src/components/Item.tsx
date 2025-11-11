import { useRef } from 'react';
import * as THREE from 'three';
import { useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { items } from '../assets/imgUrl';
import { type FoldMaterialType } from './FoldMaterial';

export default function Items({
  totalItems,
  isInfinite,
}: {
  totalItems: number;
  isInfinite: boolean;
}) {
  const textures = useTexture(items.map((item) => item.url));
  return (
    <>
      {textures.map((texture, idx) => (
        <Item
          key={idx}
          index={idx}
          texture={texture}
          totalItems={totalItems}
          isInfinite={isInfinite}
        />
      ))}
    </>
  );
}

type ItemProps = {
  index: number;
  texture: THREE.Texture;
  totalItems: number;
  isInfinite: boolean;
};

export function Item({ index, texture, totalItems, isInfinite }: ItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<FoldMaterialType>(null);

  const { height: viewportHeight } = useThree((state) => state.viewport);
  const data = useScroll();

  const positionMultiplier = 0.6; // 아이템 간의 간격
  const halfItems = totalItems / 2;
  let initialDistance = index - 0; // index - scrollProgress(초기값 0)

  //   // 무한스크롤일 때, 초기 위치값을 첫 번째(0번)를 기준으로 최단 거리에 원형으로 배치
  if (isInfinite && initialDistance > halfItems) {
    initialDistance = initialDistance - totalItems;
  }
  const initialY = -initialDistance * viewportHeight * positionMultiplier; // 첫 렌더링 시 위치 (튕김 현상 방지)

  useFrame((_, delta) => {
    if (!groupRef.current || !materialRef.current) return;

    let distance;
    let scrollProgress;

    if (isInfinite) {
      // 현재 스크롤 진행률
      const currentScroll = data.offset * totalItems;
      scrollProgress = currentScroll % totalItems;

      // distance: '내 위치'와 '현재 스크롤 페이지'의 차이
      // 0: 내가 중앙에 있음
      // 양수: 나는 다음 페이지 이후에 존재
      // 음수: 나는 이전 페이지 이전에 존재
      distance = index - scrollProgress;

      // distance를 최단 거리로 보정
      if (distance > halfItems) distance = distance - totalItems;
      if (distance < -halfItems) distance = distance + totalItems;

      const absDistance = Math.abs(distance);
      groupRef.current.visible = absDistance < 1.5;
    } else {
      scrollProgress = data.offset * (totalItems - 1);
      distance = index - scrollProgress;
    }

    const positionDamp = 6; // Y축 이동 댐핑 강도
    const rotationDamp = 4; // Z축 회전 댐핑 강도

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      -distance * viewportHeight * positionMultiplier,
      positionDamp,
      delta
    );

    const targetRotationZ = -distance * THREE.MathUtils.degToRad(35);
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotationZ,
      rotationDamp,
      delta
    );

    materialRef.current.uDistance = distance;
  });

  return (
    <group ref={groupRef} position={[0, initialY, 0]}>
      <mesh scale={[520, 520, 1]}>
        <planeGeometry args={[1, 1, 64, 64]} />

        <foldMaterial
          ref={materialRef}
          uTexture={texture}
          side={THREE.FrontSide}
          transparent={false}
        />
      </mesh>
    </group>
  );
}
