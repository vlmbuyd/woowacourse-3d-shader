import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeElement() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  //   const meshCopyRef1 = useRef<THREE.Mesh>(null);
  //   const meshCopyRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {});

  useEffect(() => {
    for (let i = 0; i < groupRef.current?.children.length; i++) {
      const mesh = groupRef.current!.children[i] as THREE.Mesh;
      mesh.geometry = meshRef.current!.geometry;
      mesh.position.x = i * 2 - 10;
    }

    // meshCopyRef1.current!.geometry = meshRef.current!.geometry;
    // meshCopyRef2.current!.geometry = meshRef.current!.geometry;
  }, []);

  return (
    <>
      <directionalLight position={[5, 5, 5]} />

      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusKnotGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial visible={false} color="green" />
      </mesh>

      <group ref={groupRef}>
        <mesh>
          <meshBasicMaterial wireframe color="green" />
        </mesh>

        <mesh>
          <meshBasicMaterial
            color="red"
            visible={true}
            transparent={true}
            opacity={1}
            side={THREE.FrontSide}
            alphaTest={1}
            depthTest={true}
            depthWrite={true}
            fog={true}
          />
        </mesh>

        <mesh>
          <meshLambertMaterial
            color="red"
            visible={true}
            transparent={true}
            opacity={1}
            side={THREE.FrontSide}
            alphaTest={1}
            depthTest={true}
            depthWrite={true}
            fog={true}
            emissive={'black'}
          />
        </mesh>

        <mesh>
          <meshPhongMaterial
            color="red"
            visible={true}
            transparent={true}
            opacity={1}
            side={THREE.FrontSide}
            alphaTest={1}
            depthTest={true}
            depthWrite={true}
            fog={true}
            emissive={'black'}
            specular={'#fff'}
            shininess={40}
            flatShading={true}
          />
        </mesh>

        <mesh>
          <meshNormalMaterial />
        </mesh>

        <mesh>
          <meshStandardMaterial
            color="red"
            visible={true}
            transparent={true}
            opacity={1}
            side={THREE.FrontSide}
            alphaTest={1}
            depthTest={true}
            depthWrite={true}
            fog={true}
            emissive={'black'}
            roughness={0.6}
            metalness={0.5}
            // flatShading={true}
          />
        </mesh>

        <mesh>
          <meshPhysicalMaterial
            color="#fff"
            visible={true}
            transparent={true}
            opacity={1}
            side={THREE.FrontSide}
            alphaTest={1}
            depthTest={true}
            depthWrite={true}
            fog={true}
            emissive={'black'}
            roughness={1}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            transmission={1}
            thickness={1}
            ior={2}
            // flatShading={true}
          />
        </mesh>
      </group>
    </>
  );
}
