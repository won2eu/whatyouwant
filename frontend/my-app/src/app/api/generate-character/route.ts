import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Next.js API 타임아웃 설정 (60분)
export const maxDuration = 3600

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json(
        { detail: '이미지 파일이 필요합니다.' },
        { status: 400 }
      )
    }
    
    // 백엔드 API URL (실제 서버 주소로 변경 필요)
    const backendUrl = 'http://localhost:8000/generate-character'
    console.log('백엔드 호출 시작:', backendUrl)
    
    // 백엔드로 요청 전송
    const backendFormData = new FormData()
    backendFormData.append('image', image)
    console.log('이미지 파일 크기:', image.size)
    
    try {
      console.log('백엔드 fetch 시작...')
      
      // axios를 사용하여 더 긴 타임아웃 설정
      const response = await axios.post(backendUrl, backendFormData, {
        timeout: 60 * 60 * 1000, // 60분
        responseType: 'arraybuffer', // GLB 파일을 받기 위해
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      console.log('백엔드 응답 받음')
      console.log('백엔드 응답 상태:', response.status)
      console.log('백엔드 응답 헤더:', response.headers)
      
      if (response.status === 200) {
        // GLB 파일을 그대로 전달
        const glbBuffer = Buffer.from(response.data)
        console.log('GLB 파일 크기:', glbBuffer.length)
        return new NextResponse(glbBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${image.name.replace('.png', '.glb')}"`,
          },
        })
      } else {
        console.log('백엔드 에러 응답 상태:', response.status)
        return NextResponse.json(
          { detail: '백엔드 처리 중 오류가 발생했습니다.' },
          { status: response.status }
        )
      }
    } catch (axiosError) {
      console.error('백엔드 axios 오류:', axiosError)
      console.error('axios 오류 타입:', typeof axiosError)
      console.error('axios 오류 메시지:', axiosError instanceof Error ? axiosError.message : 'Unknown error')
      throw axiosError
    }
  } catch (error) {
    console.error('API 오류:', error)
    console.error('에러 타입:', typeof error)
    console.error('에러 메시지:', error instanceof Error ? error.message : 'Unknown error')
    console.error('에러 스택:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { detail: `서버 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 