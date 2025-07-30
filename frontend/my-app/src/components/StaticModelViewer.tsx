'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import AnimatedModel from './AnimatedModel'

interface StaticModelViewerProps {
  modelPath: string
  width?: string
  height?: string
}

export default function StaticModelViewer({ 
  modelPath, 
  width = '100%', 
  height = '100%' 
}: StaticModelViewerProps) {
  // 모델 경로에 따라 애니메이션 이름 결정
  const getAnimationName = (path: string) => {
    if (path.includes('07_02_stageii_animated')) {
      return 'SMPLX_ArmatureAction'
    }
    return 'Armature|mixamo.com|Layer0'
  }

  return (
    <div style={{ width, height }} className="bg-transparent rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.7, 3], fov: 32.5 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        
        <Suspense fallback={null}>
          <AnimatedModel 
            modelPath={modelPath}
            animationName={getAnimationName(modelPath)}
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