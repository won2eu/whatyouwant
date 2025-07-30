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
      
      // 애니메이션 재생
      action.play()
      
      console.log('Animation loop set to:', action.loop)
    } else if (animations.length > 0) {
      // 첫 번째 애니메이션 재생
      const firstAction = Object.values(actions)[0] as THREE.AnimationAction
      if (firstAction) {
        console.log('Playing first available animation')
        firstAction.reset()
        firstAction.setLoop(THREE.LoopRepeat, Infinity)
        firstAction.setEffectiveTimeScale(1)
        firstAction.setEffectiveWeight(1)
        firstAction.clampWhenFinished = false
        firstAction.play()
      }
    } else {
      console.log('No animations found')
    }
  }, [actions, animationName, loop, animations])

  // 모델을 적당한 크기로 스케일 조정
  scene.scale.set(1, 1, 1)
  
  // 모델을 고정 위치에 배치 (Y축을 아래로)
  scene.position.set(0, -0.8, 0)

  return <primitive ref={group} object={scene} />
} 