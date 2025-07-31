'use client'

import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

interface AnimatedModelProps {
  modelPath: string
  animationName?: string
  loop?: boolean
}

export default function AnimatedModel({ 
  modelPath, 
  animationName = 'idle', 
  loop = true 
}: AnimatedModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    // 사용 가능한 애니메이션 목록 출력
    console.log('Available animations:', animations.map(anim => anim.name))
    console.log('Available actions:', Object.keys(actions))

    // 모든 애니메이션 정지
    Object.values(actions).forEach(action => {
      if (action) {
        action.stop()
        action.reset()
      }
    })

    // 기본 애니메이션 재생
    if (actions[animationName]) {
      const action = actions[animationName]
      console.log('Playing animation:', animationName)
      
      // 애니메이션 설정
      action.reset()
      action.setLoop(THREE.LoopRepeat, Infinity)
      action.setEffectiveTimeScale(1)
      action.setEffectiveWeight(1)
      action.clampWhenFinished = false
      action.time = 0
      
      // 애니메이션 재생
      action.play()
      
      console.log('Animation is playing:', action.isRunning())
    } else {
      console.log('Animation not found:', animationName)
    }
  }, [actions, animationName, loop, animations])

  // 모델을 적당한 크기로 스케일 조정
  scene.scale.set(1, 1, 1)
  
  // 모델을 고정 위치에 배치 (Y축을 아래로)
  scene.position.set(0, -0.8, 0)

  return <primitive ref={group} object={scene} />
} 