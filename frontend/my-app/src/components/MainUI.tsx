'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import StaticModelViewer from './StaticModelViewer'

export default function MainUI() {
  const [isLoading, setIsLoading] = useState(false)
  const [modelPath, setModelPath] = useState('/models/Waving.glb')
  const titleRef = useRef<HTMLDivElement>(null)
  const anyoneRef = useRef<HTMLSpanElement>(null)
  const asYouRef = useRef<HTMLSpanElement>(null)
  const wantRef = useRef<HTMLSpanElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('파일 선택됨:', file.name)
      
      // 07번 CMU 애니메이션이 적용된 GLB 파일로 변경
      const cmuModelPath = '/models/07_02_stageii_animated.glb'
      console.log('07번 CMU 애니메이션 모델 적용:', cmuModelPath)
      
      // 모델 경로를 동적으로 변경하기 위해 상태 추가
      setModelPath(cmuModelPath)
      
      // 파일 선택 후 애니메이션 시작
      pushAnimation()
    }
  }

  const pushAnimation = () => {
    const uploadBox = document.getElementById('uploadBox')
    const modelViewer = document.getElementById('modelViewer')
    const processingText = document.getElementById('processingText')
    
    if (uploadBox && modelViewer && processingText) {
      // PROCESSING 텍스트 애니메이션 시작
      const processingChars = processingText.querySelectorAll('span')
      
      // PROCESSING 텍스트 나타나기
      gsap.set(processingChars, { 
        opacity: 0, 
        y: -50,
        scale: 0.5,
        rotation: -20
      })
      
      gsap.to(processingText, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
      
      gsap.to(processingChars, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'bounce.out'
      })
      
      // 로딩 동그라미 회전 애니메이션 - 즉시 시작
      const loadingCircle = document.getElementById('loadingCircle')
      if (loadingCircle) {
        gsap.to(loadingCircle, {
          rotation: 360,
          duration: 1,
          repeat: -1,
          ease: 'none'
        })
      }
      
      // PROCESSING 텍스트 반복 애니메이션 (점들 포함)
      gsap.delayedCall(1, () => {
        const processingTl = gsap.timeline({ repeat: -1 })
        processingChars.forEach((char, index) => {
          processingTl.to(char, {
            y: -10,
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
          }, index * 0.1)
          .to(char, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          }, index * 0.1 + 0.15)
        })
      })
      // 3D 캐릭터는 즉시 움직이기
      gsap.to(modelViewer, {
        x: '-200%',
        duration: 12,
        ease: 'none',
        onComplete: () => {
          // 3D 캐릭터가 사라진 후 다시 돌아오기
          setTimeout(() => {
            gsap.to(modelViewer, {
              x: '0%',
              duration: 10,
              ease: 'power2.out'
            })
          }, 3000) // 3초 후 돌아오기
        }
      })
      
      // Upload 상자는 1초 뒤에 움직이기
      gsap.to(uploadBox, {
        x: '-170%',
        duration: 10,
        ease: 'none',
        delay: 3,
        onComplete: () => {
          // 상자가 완전히 사라진 후 다른 화면으로 전환
          setTimeout(() => {
            console.log('상자가 완전히 사라짐 - 다른 화면으로 전환')
            // 예: window.location.href = '/processing' 또는 상태 변경
          }, 500)
        }
      })
    }
  }

  useEffect(() => {
    if (titleRef.current && anyoneRef.current && asYouRef.current && wantRef.current) {
      // Anyone 글자별 애니메이션 - 실제 점프 효과
      const anyoneChars = anyoneRef.current.querySelectorAll('span')
      
      // 초기 상태 설정 - 더 극적인 효과
      gsap.set(anyoneChars, { 
        y: -150, 
        opacity: 0,
        scale: 0.3,
        rotation: -20,
        transformOrigin: "center bottom"
      })
      
      // 점프하면서 나타나는 애니메이션
      gsap.to(anyoneChars, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "bounce.out"
      })

      // As You 글자별 애니메이션 - 사선에서 일어나는 효과
      const asYouChars = asYouRef.current.querySelectorAll('span')
      
      gsap.set(asYouChars, { 
        rotationX: 90, 
        scale: 0.6,
        transformOrigin: "center bottom"
      })
      
      gsap.to(asYouChars, {
        rotationX: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.1,
        delay: 2,
        ease: "power2.out"
      })

      // Want 애니메이션 - 기존 효과 유지
      gsap.set(wantRef.current, { 
        rotationX: 90, 
        opacity: 0,
        y: 150,
        scale: 0.2,
        transformOrigin: "center center"
      })
      
      gsap.to(wantRef.current, {
        rotationX: 0,
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.7,
        delay: 3.2,
        ease: "elastic.out(1, 0.5)"
      })

      // 파도타기 색깔 애니메이션 - 모든 글자 수집
      const wantChars = wantRef.current.querySelectorAll('span')
      const allChars = [...anyoneChars, ...asYouChars, ...wantChars]
      
      // 초기 애니메이션 완료 후 파도타기 시작
      gsap.delayedCall(5, () => {
        const waveTl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
        
        // 파도타기 효과 - 색상 변화와 점프 효과 동시 적용
        allChars.forEach((char, index) => {
          // 각 글자별로 색상 변화와 점프 효과
          waveTl.to(char, {
            color: "#00CC66", // 어두운 초록색
            y: -10, // 점프 효과
            scale: 1.1, // 살짝 확대
            duration: 0.5,
            ease: "power2.out"
          }, index * 0.1)
          .to(char, {
            color: "#000000", // 원래 검은색으로 복귀
            y: 0, // 원래 위치로
            scale: 1, // 원래 크기로
            duration: 0.5,
            ease: "power2.out"
          }, index * 0.1 + 0.25)
        })
      })
    }
  }, [])

  return (
    <div className="h-full flex flex-col p-8 bg-amber-200/50">
      {/* 제목 애니메이션 - 왼쪽에 크게 배치 */}
      <div className="relative">
        <div ref={titleRef} className="text-left" style={{ perspective: '800px' }}>
          <h1 className="text-[110px] font-bold text-black leading-tight">
                        <span ref={anyoneRef} className="inline-block">
                <span className="inline-block text-black">A</span>
                <span className="inline-block text-black">n</span>
                <span className="inline-block text-black">y</span>
                <span className="inline-block text-black">o</span>
                <span className="inline-block text-black">n</span>
                <span className="inline-block text-black">e</span>
                <span className="inline-block text-black">,</span>
              </span>
            <br />
            <span className="text-black inline-block" style={{ transformStyle: 'preserve-3d' }}>
              <span ref={asYouRef} className="inline-block" style={{ transformStyle: 'preserve-3d' }}>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>A</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>s</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>&nbsp;</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>Y</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>o</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>u</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>&nbsp;</span>
              </span>
              <span ref={wantRef} className="inline-block" style={{ transformStyle: 'preserve-3d' }}>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>W</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>a</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>n</span>
                <span className="inline-block text-black" style={{ transformStyle: 'preserve-3d' }}>t</span>
              </span>
            </span>
          </h1>
        </div>
        
        {/* PROCESSING 텍스트 - 오른쪽 위에 배치 */}
        <div className="absolute top-0 right-0 flex items-center gap-4 opacity-0" id="processingText">
          {/* 로딩 동그라미 */}
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full" id="loadingCircle"></div>
          
          {/* PROCESSING 텍스트 */}
          <div className="text-4xl font-bold text-amber-600">
            <span className="inline-block">P</span>
            <span className="inline-block">R</span>
            <span className="inline-block">O</span>
            <span className="inline-block">C</span>
            <span className="inline-block">E</span>
            <span className="inline-block">S</span>
            <span className="inline-block">S</span>
            <span className="inline-block">I</span>
            <span className="inline-block">N</span>
            <span className="inline-block">G</span>
            <span className="inline-block">.</span>
            <span className="inline-block">.</span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex items-center justify-center gap-12 max-w-6xl w-full mx-auto">
        {/* 사진 업로드 영역 */}
        <div className="flex-1 max-w-md">
          <div className="bg-transparent h-72 backdrop-blur-sm rounded-3xl p-8 border-3 border-black shadow-2xl hover:shadow-amber-200/30 hover:scale-105 transform translate-x-0" id="uploadBox">
            <div className="text-center h-full flex flex-col justify-center items-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Upload Hater</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">you can do control your hater in this website</p>
              <input 
                type="file" 
                id="fileInput" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => handleFileUpload(e)}
              />
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" onClick={() => document.getElementById('fileInput')?.click()}>
                Try it!
              </button>
            </div>
          </div>
        </div>

        {/* 3D 캐릭터 영역 */}
        <div className="flex-1 max-w-md">
          <div className="bg-transparent p-8 h-96 flex items-center justify-center transform translate-x-0" id="modelViewer">
            <div className="w-full h-full">
              <StaticModelViewer 
                modelPath={modelPath}
                width="100%"
                height="100%"
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 