'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  
  // 모델을 적당한 크기로 스케일 조정
  scene.scale.set(1, 1, 1)
  
  // 모델의 바운딩 박스를 계산하여 중심점 찾기
  const box = new THREE.Box3().setFromObject(scene)
  const center = box.getCenter(new THREE.Vector3())
  
  // 모델을 중심점으로 이동
  scene.position.sub(center)
  
  // 캐릭터 좌표 정보 로그 출력
  console.log('=== 캐릭터 좌표 정보 ===')
  console.log('바운딩 박스 최소점:', box.min)
  console.log('바운딩 박스 최대점:', box.max)
  console.log('중심점:', center)
  console.log('모델 위치:', scene.position)
  console.log('모델 크기:', box.getSize(new THREE.Vector3()))
  console.log('========================')
  
  return <primitive object={scene} />
}

function Ground() {
  return (
    <mesh position={[0, -1, 0]} receiveShadow>
      <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
      <meshStandardMaterial color="#fef8e7" emissive="#fef8e7" emissiveIntensity={0.5} />
    </mesh>
  )
}

interface ThreeJSViewerProps {
  width?: string
  height?: string
  modelUrl?: string
}

export default function ThreeJSViewer({ 
  width = '100%', 
  height = '300px',
  modelUrl: initialModelUrl 
}: ThreeJSViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(initialModelUrl || null)

  // initialModelUrl이 변경되면 modelUrl 업데이트
  useEffect(() => {
    if (initialModelUrl) {
      setModelUrl(initialModelUrl)
    }
  }, [initialModelUrl])

  return (
    <div style={{ width, height }} className="flex items-center justify-center bg-gray-50">
      {modelUrl && (
        <div className="relative w-full h-full">
          <div style={{ width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <Canvas
              camera={{ position: [0, 1.5, 3], fov: 45 }}
              style={{ background: '#fef3c7' }}
              shadows
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
              <directionalLight position={[-5, -5, -5]} intensity={0.4} />
              
              {/* 바닥 평면 */}
              <Ground />
              
              <Suspense fallback={null}>
                <Model url={modelUrl} />
              </Suspense>
              <OrbitControls 
                enablePan={false} 
                enableZoom={false} 
                enableRotate={true}
                minDistance={3}
                maxDistance={8}
                autoRotate={false}
              />
            </Canvas>
          </div>
        </div>
      )}
    </div>
  )
} 