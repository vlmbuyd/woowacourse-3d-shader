import { useRef } from 'react';
import * as THREE from 'three';
import { useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { items } from '../assets/imgUrl';

export default function Items({ totalItems }: { totalItems: number }) {
  const textures = useTexture(items.map((item) => item.url));

  return (
    <>
      {textures.map((texture, idx) => (
        <Item key={idx} index={idx} texture={texture} totalItems={totalItems} />
      ))}
    </>
  );
}

type ItemProps = {
  index: number;
  texture: THREE.Texture;
  totalItems: number;
};

export function Item({ index, texture, totalItems }: ItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const { height: viewportHeight } = useThree((state) => state.viewport);
  const data = useScroll();

  const halfItems = totalItems / 2;

  let initialDistance = index - 0;

  if (initialDistance > halfItems)
    initialDistance = initialDistance - totalItems;
  else if (initialDistance < -halfItems)
    initialDistance = initialDistance + totalItems;

  const initialY = -initialDistance * viewportHeight; // 첫 렌더링 시 위치 (튕김 현상 방지)

  useFrame((_, delta) => {
    if (!groupRef.current || !materialRef.current) return;

    // 초기 스크롤 위치를 1px만큼 내려서 offset가 0에서 아주 살짝 벗어나도록 만듦 (e.g. offset: 0.000...1)
    // 첫 이미지에서 이전 페이지(마지막 이미지)로 스크롤 가능
    if (data.el.scrollTop === 0) {
      data.el.scrollTop = 1;
    }

    // 현재 스크롤 진행률
    const currentScroll = data.offset * totalItems;
    const scrollProgress = currentScroll % totalItems;

    // distance: '나'의 인덱스와 '현재 스크롤 페이지'의 차이
    // 0: 내가 중앙에 있음
    // 양수: 나는 다음 페이지
    // 음수: 나는 이전 페이지
    let distance = index - scrollProgress;

    if (distance > halfItems) {
      distance = distance - totalItems;
    } else if (distance < -halfItems) {
      distance = distance + totalItems;
    }

    // 'damp'로 계산해준 '다음 프레임의 새 위치'로 나의 현재 위치 덮어쓰기 (이동하기)
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y, // 현재 위치를 바탕으로
      -distance * viewportHeight, // 목표 위치를 계산하고
      6, // 속도
      delta // 이동 시간
    );

    // distance에 비례하여 z축 회전
    const targetRotationZ = -distance * THREE.MathUtils.degToRad(30);
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotationZ,
      4,
      delta
    );

    const absDistance = Math.abs(distance);
    groupRef.current.visible = absDistance < 1.2;
  });

  return (
    <group ref={groupRef} position={[0, initialY, 0]}>
      <mesh scale={[520, 520, 1]}>
        <planeGeometry />
        <meshBasicMaterial ref={materialRef} map={texture} transparent />
      </mesh>
    </group>
  );
}
