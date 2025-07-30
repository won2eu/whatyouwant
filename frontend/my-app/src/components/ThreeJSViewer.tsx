'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useState, useRef } from 'react'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  
  // 모델을 적당한 크기로 스케일 조정
  scene.scale.set(1, 1, 1)
  
  return <primitive object={scene} />
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

interface ThreeJSViewerProps {
  width?: string
  height?: string
}

export default function ThreeJSViewer({ width = '100%', height = '300px' }: ThreeJSViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("파일 업로드 이벤트 발생")
    const file = event.target.files?.[0]
    console.log("선택된 파일:", file)
    if (file) {
      console.log("파일 확장자:", file.name.split('.').pop())
      if (file.name.endsWith('.glb')) {
        const url = URL.createObjectURL(file)
        setModelUrl(url)
        console.log("GLB 파일 업로드 성공:", file.name)
      } else {
        console.log("GLB 파일이 아닙니다:", file.name)
      }
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    console.log("파일 드롭 이벤트 발생")
    const file = event.dataTransfer.files?.[0]
    console.log("드롭된 파일:", file)
    if (file && file.name.endsWith('.glb')) {
      const url = URL.createObjectURL(file)
      setModelUrl(url)
      console.log("GLB 파일 드롭 성공:", file.name)
    } else {
      console.log("GLB 파일이 아닙니다:", file?.name)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  return (
    <div style={{ width, height }} className="flex items-center justify-center bg-gray-50">
      {!modelUrl ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <button
            onClick={() => {
              console.log("업로드 버튼 클릭됨")
              fileInputRef.current?.click()
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-8 rounded-lg transition-colors shadow-lg text-lg"
            style={{ zIndex: 1000 }}
          >
            GLB 파일 업로드
          </button>
          <p className="text-sm text-gray-500 mt-4">또는 파일을 여기에 드래그하세요</p>
          
          {/* 드래그 영역 */}
          <div
            className={`mt-4 border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm">GLB 파일을 드래그하여 업로드</p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative w-full h-full">
          <div style={{ width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <Canvas
              camera={{ position: [0, 2, 5], fov: 60 }}
              style={{ background: 'white' }}
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
          
          {/* 컨트롤 버튼들 */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setModelUrl(null)}
              className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-black/80 transition-colors"
            >
              새로고침
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-black/80 transition-colors"
            >
              다른 파일
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 