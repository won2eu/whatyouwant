'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import AnimatedModel from './AnimatedModel'

interface StaticModelViewerProps {
  modelPath: string
  width?: string
  height?: string
  animationName?: string
}

export default function StaticModelViewer({ 
  modelPath, 
  width = '100%', 
  height = '100%',
  animationName = "Armature|mixamo.com|Layer0"
}: StaticModelViewerProps) {
  // Waving.glb일 때 다른 카메라 설정 사용
  const isWaving = modelPath.includes('Waving.glb')
  const cameraConfig = isWaving 
    ? { position: [0, 2, 8] as [number, number, number], fov: 18 } // Waving용 카메라 설정 - 더 가깝고 높은 위치
    : { position: [9, -0.5, 3] as [number, number, number], fov: 20 } // 기본 카메라 설정
  
  console.log('Model path:', modelPath, 'Is waving:', isWaving, 'Camera config:', cameraConfig)

  return (
    <div style={{ width, height }} className="bg-transparent rounded-lg overflow-hidden">
      <Canvas
        style={{ background: 'transparent' }}
        shadows
        gl={{ antialias: true }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={cameraConfig.position} 
          fov={cameraConfig.fov} 
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        
        <Suspense fallback={null}>
          <AnimatedModel 
            modelPath={modelPath}
            animationName={animationName}
            loop={true}
          />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={false}
          minDistance={2}
          maxDistance={6}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
} 