import React from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const curlPlaneGLSL = `
  vec2 curlPlane(float x, float s, float r, float k, bool flip) {
    float v1 = flip ? s*k : s - s*k;
    float n1 = s > 0.0 ? 1.0 : -1.0;

    float t1 = 0.01;

    float e1 = flip ? n1*v1 : n1*x;
    float e2 = flip ? n1*x : n1*v1;

    if (r <= t1) {
      return vec2(x, 0.0);
    }

    if (e1 <= e2) {
      return vec2(x, 0.0);
    }

    float r2 = abs(s) / r;
    float hp = 1.5707963;

    return vec2(
      v1/r2 + cos(x/r2 - hp - v1/r2),
      -sin(x/r2 + hp - v1/r2) + 1.0
    ) * r2;
  }
`;

const vertexShader = `
  varying vec2 vUv;
  uniform float uDistance; // 스크롤 거리 (-1.0 ~ 1.0)
  uniform float uPlaneSize; // 이미지의 원래 크기 (정점 Y 좌표가 -0.5 ~ 0.5 이므로 1.0)

  ${curlPlaneGLSL}

  // 0.0 ~ 1.0 범위의 값을 부드럽게 변환하는 함수
  float easeOutCubic(float x) {
    return 1.0 - pow(1.0 - x, 3.0);
  }
  
  void main() {
    vUv = uv;
    vec3 pos = position; // 원본 정점 위치 (y: -0.5 ~ 0.5)
    float centerOffset = uPlaneSize * 0.5; // Y축의 중앙 오프셋 (0.5)

    float curlRadius = 1.4;  // 접히는 반경 (클수록 많이 접힘)

    // 스크롤 진행도에 따라 curl 파라미터 조절
    float curlAmount = abs(uDistance); // 0.0 ~ 1.0 (스크롤이 멀어질수록 커짐)
    float easedAmount = easeOutCubic(curlAmount); 
    float curlOffset = mix(0.0, 1.5, easedAmount);  // 접힘 시작점 (0.0=끝, 1.0=중앙)

    // 접히는 방향 (filp) 로직 반전
    // uDistance < 0 (위로 스크롤) => 아래쪽 접힘
    // uDistance > 0 (아래로 스크롤) => 위쪽 접힘
    bool flipCurl = uDistance < 0.0;

    // 정점 위치 변형
    vec2 curledPosition = curlPlane(
      centerOffset + pos.y,     // pos.y를 0.0 ~ 1.0 범위로 조정
      uPlaneSize,               // 접히는 전체 평면의 크기 (y축 기준, 1.0)
      curlRadius,               // 얼마나 둥글게 접힐지 반경 (r)
      curlOffset,               // 전체 길이 중 얼마나 접을 것인지 (k)
      flipCurl                  // 접히는 방향 (flip)
    );

    // 사다리꼴 효과: 원근법에 따라 접힌 부분이 더 넓어지도록
    float fanAmount = 0.3;  // 클수록 더 넓어짐
    pos.x *= (1.0 + curledPosition.y * fanAmount);
    
    // 변형된 Y, Z 좌표를 pos에 적용
    pos.y = curledPosition.x - centerOffset; // 새 Y 좌표 적용
    pos.z += curledPosition.y;               // 새 Z 좌표(깊이) 적용

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  
  void main() {
    gl_FragColor = texture2D(uTexture, vUv);
  }
`;
const FoldMaterial = shaderMaterial(
  {
    uDistance: 0.0,
    uTexture: new THREE.Texture(),
    uPlaneSize: 1.0,
  },
  vertexShader,
  fragmentShader
);

extend({ FoldMaterial });

export type FoldMaterialType = typeof FoldMaterial & {
  uDistance: number;
  uTexture: THREE.Texture;
  uPlaneSize: number;
} & THREE.ShaderMaterial;

declare module '@react-three/fiber' {
  interface ThreeElements {
    foldMaterial: React.JSX.IntrinsicElements['meshStandardMaterial'] & {
      uDistance?: number;
      uTexture?: THREE.Texture;
      uPlaneSize?: number;
      side?: THREE.Side;
      transparent?: boolean;
    };
  }
}

export default FoldMaterial;
