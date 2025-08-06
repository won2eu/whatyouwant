## 팀명 : “ 하면 한다. ”

# 팀원

😛 하승원

- 부산대학교 20학번 정보컴퓨터공학부
- ENFP호소인
- https://github.com/won2eu

😚 마서진

- DGIST 22학번 컴퓨터공학과
- ISSSSTP
- https://github.com/seojin527

# 사진 한 장만으로 **3D 아바타를 생성하고**, **프롬포트 기반으로 동작까지 부여하는 웹 인터랙티브 시스템!!**

→   **End-to-End 시스템**으로, 누구나 자신만의 아바타를 만들고 움직일 수 있도록 구현

<img width="748" height="336" alt="image" src="https://github.com/user-attachments/assets/cd897969-a735-4a5b-ada5-e3488d747870" />

| 기능 | 도구 / 기술 | 설명 |
| --- | --- | --- |
| 얼굴 → 3D | [DECA](https://github.com/YadiraF/DECA) | 사진 기반 3D 얼굴 메쉬 추출 (Webcam도 가능) |
| 바디 메쉬 | [SMPL-X or](https://smpl-x.is.tue.mpg.de/) SiTH | 평균 체형의 3D 메쉬와 연결 |
| 프롬프트 → 동작 | (CHATGPT)사전 정의된 프롬프트 → 액션 매핑 (`prompt2action.json`) | 예: “손 흔들어” → `wave.glb` 애니메이션 |
|  3D 렌더링 | **Three.js** | 웹에서 3D 얼굴 + 몸 출력 및 애니메이션 |
|  백엔드 | **FastAPI** | 얼굴 메쉬 추출, prompt 처리용 API |
|  프론트엔드 | **Next.js**  | 사용자 인터페이스 + WebGL 아바타 출력 |
|  배포 | **Vercel (FE)** + **Render / Railway (BE)** | 빠른 배포 가능프레임 워크 |

# Using Model

---

- Openpose  → 이미지 기반 human skeleton 관절 좌표 추출 모델
    
    https://github.com/CMU-Perceptual-Computing-Lab/openpose.git
    
- SMPL-X → 전신 이미지 기반 3D 매쉬 생성 모델
    
    https://github.com/vchoutas/smplx
    
- DECA → 단일 얼굴 이미지 3D 얼굴 매쉬 생성 모델
    
    https://github.com/yfeng95/DECA
    

# Framework

---

<img width="321" height="428" alt="image" src="https://github.com/user-attachments/assets/16e977ff-3353-4243-8840-9af9b36f299f" />

## **1. 사용자 사진 업로드**

- 사용자는 단일 이미지 또는 웹캠으로 사진을 업로드
- 업로드된 이미지는 **얼굴 요소 분석**과 **신체 포즈 인식**의 두 작업에 사용되며, 각각 **3D 얼굴 모델링**과 **전신 애니메이션 적용을 위한 리깅 정보 생성**에 활용

## **2. Open pose 기반 포즈 추출**

- OpenPose를 사용해 2D 스켈레톤(관절 좌표)를 실시간으로 추출
- 해당 키포인트는 **3D 바디 메시와 정렬된 리깅 정보 구성**에 활용
- 최종 메시 포맷: `.glb` (Three.js에서 직접 렌더링 가능)

[GitHub - CMU-Perceptual-Computing-Lab/openpose: OpenPose: Real-time multi-person keypoint detection library for body, face, hands, and foot estimation](https://github.com/CMU-Perceptual-Computing-Lab/openpose)

## **3. 3D 바디 메쉬 결합 ( SMPL-X → SiTH )**

- **SMPL-X 모델**을 사용하여 평균 인체 비율 기반 바디 메시를 생성
- 최종 메시 포맷: `.glb` (Three.js에서 직접 렌더링 가능)
- Body Fitting
- Create Back Images
- Texture

[GitHub - vchoutas/smplx: SMPL-X](https://github.com/vchoutas/smplx)

## **4. Three.js 로 3D 아바타 렌더링**

- Three.js로 **바디 메시 렌더링**합니다.
- Three.js란 ? **WebGL을 쉽게 다룰 수 있도록 도와주는 고수준(high-level) JavaScript 라이브러리**로, 복잡한 3D 그래픽을 브라우저에서 구현할 수 있게 해줌

## **5. 텍스트 프롬포트**

- “춤춰줘”, “손 흔들어” 등의 간단한 문장을 입력하면, 해당하는 동작을 매핑하여 실행되도록 구성

## **6. 동작해석 ( Prompt → Action )**

- 입력된 프롬프트는 내부적으로 `prompt2action.json`에 정의된 키워드와 매칭되어 **해당 glb 애니메이션 파일**을 로드
- 현재는 rule-based 방식이지만, 추후 LLM 기반 **의도 분류** 또는 **유사도 검색 기반 액션 매핑**으로도 발전 가능성을 염두에 두었습니다
- 적용된 애니메이션은 메시 구조와 스켈레톤이 일치되도록 미리 리깅되어 있어 **부드럽고 자연스러운 동작**을 실현

# frontend

3D 메쉬 전환시 애니메이션 효과 추가

→ 이미지 생성 대기중 사용자 지루함 방지기능 추가

# 기술 포인트

---

| 항목 | 설명 |
| --- | --- |
| **멀티 모듈 통합** | OpenPose, SMPL-X, DECA, Three.js, FastAPI 등 모듈을 하나의 파이프라인으로 연결 |
| **인터랙티브 UX** | 텍스트 입력 → 애니메이션 실행까지 실시간 흐름 제공 |

# Results

---

<img width="916" height="672" alt="image" src="https://github.com/user-attachments/assets/c8b24e1b-419b-4ab9-85ac-0de382b21b6c" />

- 웹 접속시 로드 화면

- 4분반 최고 미남들 data 결과 분석
[초상권 보호를 위해 내리겠습니다 ...]

- 실제 대화/상호작용이 이뤄지는 화면

<img width="2048" height="1030" alt="image" src="https://github.com/user-attachments/assets/839a4088-cbf5-4b62-a75a-04d7b5c20432" />


# Future works

---

- DECA 모델 기반 얼굴 해상도 개선
- inference 결과

[GitHub - yfeng95/DECA: DECA: Detailed Expression Capture and Animation (SIGGRAPH 2021)](https://github.com/yfeng95/DECA)

<img width="512" height="813" alt="image" src="https://github.com/user-attachments/assets/1a820f35-0f36-462f-be56-442c49f7c40f" />

<img width="953" height="608" alt="image" src="https://github.com/user-attachments/assets/573bb3d1-f6ea-466a-9995-9d48b7bf8ba4" />

<img width="814" height="747" alt="image" src="https://github.com/user-attachments/assets/a0f752a9-2a9e-439f-9b66-43a05c3b7d1f" />

← 누구일까요?

# 느낀점

---

- 하승원

마지막 주차라니 시간이 너무 빨리 가는 것 같다 ㅠㅠ

인공지능 모델을 활용한 웹/앱 개발을 해보고 싶다고 생각만 해봤는데 실제로 구현 및 연결해 볼 수 있어서 뿌듯했다!

몰입캠프 마지막 주차를 만족스럽게 마무리할 수 있어 기분이 좋습니다 ㅎㅎㅎ

- 마서진

3D 모델링은 처음이라 색다르고 재밌었음

사용자가 텍스트 인지기반으로 생성형 기반 모션까지 구현하면 더 재밌을 거 같음 

재밌는 주제로 마지막 4주차 마무리해서 즐겁게 개발했던 것 같습니다 

GPU 서버 메모리부족으로 해상도를 낮춘 부분이 아쉬웠다 ㅠㅠㅠ 


# 정리 (번외)
    
    실행흐름 만들기
    
    사용자가 사진을 입력(프론트에서 전달) → 사진 리사이징 
    
    리사이징된 사진을 openpose를 이용해서 key_points.json 추출해서 data/examples/images에 넣기
    
    → SiTH 모델에서 명령어 실행
    
    SiTH/data/examples/images와 /rgba에 리사이징된 사진을 넣고 !bash [run.sh](http://run.sh/)
    
    meshes에 obj가 생성됨..
    
    ```
    %cd /content/SiTH
    !python reconstruct.py \
      --test_folder data/examples \
      --config recon/config.yaml \
      --resume checkpoints/recon_model.pth \
      --grid_size 300 \
      --save_uv
    ```
    
    이후 이 명령어를 실행하면 
    
    meshes에 .png와 reco.obj가 생성되고
    
    이것을 
    
    !blender --background --python /content/SiTH/scripts/auto_texture.py
    
    실행하면 
    
    data/examples/output에 3d캐릭터가 출력됨 (리깅x) 
    
    프론트로 출력된 3d 캐릭터 전달
    
    ---
    
    ```python
    from fastapi import APIRouter, UploadFile, File, HTTPException
    from fastapi.responses import FileResponse
    import os
    import shutil
    import subprocess
    from scripts.image_resize import resize_image
    import time
    
    router = APIRouter()
    
    # 경로 설정
    SITH_PATH = "../SiTH"
    EXAMPLES_PATH = f"{SITH_PATH}/data/examples"
    RGBA_PATH = f"{EXAMPLES_PATH}/rgba"
    IMAGES_PATH = f"{EXAMPLES_PATH}/images"
    OUTPUT_PATH = f"{EXAMPLES_PATH}/output"
    
    @router.post("/generate-character")
    async def generate_character(image: UploadFile = File(...)):
        """
        입력: 사진
        출력: 3D 모델
        """
        
        #1. 유저에게 받은 이미지를 리사이징하기
        try:
            # 이미지 확장자 검증
            if not image.filename.lower().endswith(('.png')):
                raise HTTPException(status_code=400, detail="지원되지 않는 파일 형식입니다. PNG 파일만 지원합니다.")
            
            # 디렉토리 생성
            os.makedirs(RGBA_PATH, exist_ok=True)
            os.makedirs(IMAGES_PATH, exist_ok=True)
            os.makedirs(OUTPUT_PATH, exist_ok=True)
            
            # 파일 저장
            file_path = f"{RGBA_PATH}/{image.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            print(f"파일 저장 완료: {file_path}")
            
            # 이미지 크기 조정
            resized_image = resize_image(file_path)
            
            if not resized_image:
                raise HTTPException(status_code=400, detail="이미지 리사이징에 실패했습니다.")
    
        #2. 리사이징된 사진을 SiTH/data/examples/images, SiTH/data/examples/rgba에 넣기
            images_file = f"{IMAGES_PATH}/{image.filename}"
            shutil.copy2(file_path, images_file)
            print(f"이미지 복사 완료: {images_file}")
            
            # 기존 파일들을 백업하고 새 파일만 남기기 (시간 단축을 위해 주석처리)
            # backup_dir = f"{EXAMPLES_PATH}/backup_{int(time.time())}"
            # os.makedirs(backup_dir, exist_ok=True)
            
            # # rgba 폴더에서 타겟 파일이 아닌 것들을 백업
            # for file in os.listdir(RGBA_PATH):
            #     if file != image.filename:
            #         shutil.move(f"{RGBA_PATH}/{file}", f"{backup_dir}/rgba_{file}")
            
            # # images 폴더에서 타겟 파일이 아닌 것들을 백업
            # for file in os.listdir(IMAGES_PATH):
            #     if file != image.filename:
            #         shutil.move(f"{IMAGES_PATH}/{file}", f"{backup_dir}/images_{file}")
            
            # # back_images 폴더에서 타겟 파일이 아닌 것들을 백업
            # back_images_path = f"{EXAMPLES_PATH}/back_images"
            # if os.path.exists(back_images_path):
            #     for file in os.listdir(back_images_path):
            #         if file != f"{image.filename.replace('.png', '')}_000.png":
            #             shutil.move(f"{back_images_path}/{file}", f"{backup_dir}/back_{file}")
            
            # # smplx 폴더에서 타겟 파일이 아닌 것들을 백업
            # smplx_path = f"{EXAMPLES_PATH}/smplx"
            # if os.path.exists(smplx_path):
            #     for file in os.listdir(smplx_path):
            #         if file != f"{image.filename.replace('.png', '')}.json":
            #             shutil.move(f"{smplx_path}/{file}", f"{backup_dir}/smplx_{file}")
            
            # print(f"기존 파일들을 백업했습니다: {backup_dir}")
            print("백업 처리 생략 - 기존 파일들을 그대로 사용합니다.")
        
        #3. 리사이징된 사진을 openpose를 이용해서 key_points를 추출하고 data/examples/images에 넣기 (시간 단축을 위해 주석처리)
            print("OpenPose keypoints 추출 생략 - 기존 파일을 사용합니다.")
            # print("OpenPose keypoints 추출 시작...")
            
            # # OpenPose 실행하여 keypoints 추출
            # openpose_bin = "../openpose/build/examples/openpose/openpose.bin"
            # openpose_root = "../openpose"
            
            # if os.path.exists(openpose_bin):
            #     result = subprocess.run([
            #         openpose_bin,
            #         "--image_dir", f"{SITH_PATH}/{IMAGES_PATH}",
            #         "--write_json", f"{SITH_PATH}/{IMAGES_PATH}/keypoints",
            #         "--display", "0",
            #         "--render_pose", "0",
            #         "--hand",
            #         "--face"
            #     ], cwd=openpose_root, capture_output=True, text=True)
                
            #     print(f"OpenPose 실행 결과 코드: {result.returncode}")
            #     print(f"OpenPose 표준 출력: {result.stdout}")
            #     print(f"OpenPose 표준 오류: {result.stderr}")
                
            #     if result.returncode != 0:
            #         print(f"OpenPose 실행 실패: {result.stderr}")
            #     else:
            #         # keypoints JSON 파일을 images 폴더로 이동
            #         keypoints_dir = f"{SITH_PATH}/{IMAGES_PATH}/keypoints"
            #         if os.path.exists(keypoints_dir):
            #             for file in os.listdir(keypoints_dir):
            #                     if file.endswith('.json'):
            #                             src = os.path.join(keypoints_dir, file)
            #                             dst = os.path.join(f"{SITH_PATH}/{IMAGES_PATH}", file)
            #                             shutil.move(src, dst)
            #                     # 빈 keypoints 폴더 삭제
            #                     os.rmdir(keypoints_dir)
            #                     print("Keypoints JSON 파일 생성 완료")
            #                 else:
            #                     print("Keypoints 폴더가 생성되지 않았습니다.")
            # else:
            #     print(f"OpenPose 바이너리를 찾을 수 없습니다: {openpose_bin}")
            #     print("OpenPose가 설치되지 않았거나 경로가 잘못되었습니다.")
        
        #4. SiTH 모델 명령어 실행 (시간 단축을 위해 주석처리)
        # !bash run_target.sh <filename>
            print(f"SiTH run_target.sh 실행 생략 - 기존 파일들을 사용합니다.")
            # print(f"실행 경로: {SITH_PATH}")
            # print(f"실행 명령어: bash {SITH_PATH}/run_target.sh {image.filename}")
            
            # # CUDA 오류 해결을 위한 환경변수 설정
            # env = os.environ.copy()
            # env['CUDA_LAUNCH_BLOCKING'] = '1'
            
            # result = subprocess.run(
            #     ["bash", f"{SITH_PATH}/run_target.sh", image.filename],
            #     cwd=SITH_PATH,
            #     capture_output=True,
            #     text=True,
            #     env=env
            # )
            
            # print(f"실행 결과 코드: {result.returncode}")
            # print(f"표준 출력: {result.stdout}")
            # print(f"표준 오류: {result.stderr}")
            
            # if result.returncode != 0:
            #     raise HTTPException(status_code=500, detail=f"run_target.sh 실행 실패: {result.stderr}")
            
            # 각 단계별 파일 확인
            print("=== 파일 확인 ===")
            print(f"images 폴더: {os.listdir(IMAGES_PATH)}")
            print(f"smplx 폴더: {os.listdir(f'{EXAMPLES_PATH}/smplx')}")
            print(f"back_images 폴더: {os.listdir(f'{EXAMPLES_PATH}/back_images')}")
            print(f"meshes 폴더: {os.listdir(f'{EXAMPLES_PATH}/meshes')}")
            print("================")
    
        #5. 2번째 명령어 (이미 run_target.sh에서 실행됨)
        # %cd /content/SiTH
        # !python reconstruct.py \
        # --test_folder data/examples \
        # --config recon/config.yaml \
        # --resume checkpoints/recon_model.pth \
        # --grid_size 300 \
        # --save_uv   
            # run_target.sh에서 이미 실행되므로 생략
    
        #6. 이후 생성된 meshes에 .png와 .obj을 이용해서 다음 명령어 실행
        # !blender --background --python /content/SiTH/scripts/auto_texture.py
            print("Blender auto_texture.py 실행 중...")
            # CUDA 오류 해결을 위한 환경변수 설정
            env = os.environ.copy()
            env['CUDA_LAUNCH_BLOCKING'] = '1'
            
            result = subprocess.run([
                "blender", "--background", "--python", f"{SITH_PATH}/scripts/auto_texture.py"
            ], cwd=SITH_PATH, capture_output=True, text=True, env=env)
            
            print(f"Blender 실행 결과 코드: {result.returncode}")
            print(f"Blender 표준 출력: {result.stdout}")
            print(f"Blender 표준 오류: {result.stderr}")
            
            if result.returncode != 0:
                raise HTTPException(status_code=500, detail=f"Blender 실행 실패: {result.stderr}")
    
        #7. data/examples/output에 3d캐릭터를 프론트에 반환하기
            output_file = f"{OUTPUT_PATH}/{image.filename.replace('.png', '')}.glb"
            print(f"출력 파일 확인: {output_file}")
            print(f"출력 파일 존재 여부: {os.path.exists(output_file)}")
            
            # 가장 최근에 생성된 GLB 파일 찾기
            if os.path.exists(OUTPUT_PATH):
                glb_files = [f for f in os.listdir(OUTPUT_PATH) if f.endswith('.glb')]
                if glb_files:
                    # 가장 최근 파일 선택
                    latest_glb = max(glb_files, key=lambda x: os.path.getctime(os.path.join(OUTPUT_PATH, x)))
                    output_file = os.path.join(OUTPUT_PATH, latest_glb)
                    print(f"최근 생성된 GLB 파일: {latest_glb}")
                else:
                    print("GLB 파일이 없습니다.")
                    raise HTTPException(status_code=404, detail="생성된 3D 모델을 찾을 수 없습니다.")
            else:
                print("출력 폴더가 존재하지 않습니다.")
                raise HTTPException(status_code=404, detail="생성된 3D 모델을 찾을 수 없습니다.")
            
            if os.path.exists(output_file):
                return FileResponse(
                    path=output_file,
                    filename=os.path.basename(output_file),
                    media_type="model/gltf-binary"
                )
            else:
                # 출력 폴더 내용 확인
                if os.path.exists(OUTPUT_PATH):
                    files = os.listdir(OUTPUT_PATH)
                    print(f"출력 폴더 내용: {files}")
                else:
                    print("출력 폴더가 존재하지 않습니다.")
                raise HTTPException(status_code=404, detail="생성된 3D 모델을 찾을 수 없습니다.")
                
        except Exception as e:
            print(f"오류 발생: {str(e)}")
            raise HTTPException(status_code=500, detail=f"3D 캐릭터 생성 중 오류가 발생했습니다: {str(e)}")
    
        
    
    ```
    
    ```python
    from fastapi import APIRouter, UploadFile, File, HTTPException
    from fastapi.responses import FileResponse
    import os
    import shutil
    import subprocess
    from scripts.image_resize import resize_image
    import time
    
    router = APIRouter()
    
    # 경로 설정
    SITH_PATH = "../SiTH"
    EXAMPLES_PATH = f"{SITH_PATH}/data/examples"
    RGBA_PATH = f"{EXAMPLES_PATH}/rgba"
    IMAGES_PATH = f"{EXAMPLES_PATH}/images"
    OUTPUT_PATH = f"{EXAMPLES_PATH}/output"
    
    @router.post("/generate-character")
    async def generate_character(image: UploadFile = File(...)):
        """
        입력: 사진
        출력: 3D 모델
        """
        
        #1. 유저에게 받은 이미지를 리사이징하기
        try:
            # 이미지 확장자 검증
            if not image.filename.lower().endswith(('.png')):
                raise HTTPException(status_code=400, detail="지원되지 않는 파일 형식입니다. PNG 파일만 지원합니다.")
            
            # 디렉토리 생성
            os.makedirs(RGBA_PATH, exist_ok=True)
            os.makedirs(IMAGES_PATH, exist_ok=True)
            os.makedirs(OUTPUT_PATH, exist_ok=True)
            
            # 파일 저장
            file_path = f"{RGBA_PATH}/{image.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            print(f"파일 저장 완료: {file_path}")
            
            # 이미지 크기 조정
            resized_image = resize_image(file_path)
            
            if not resized_image:
                raise HTTPException(status_code=400, detail="이미지 리사이징에 실패했습니다.")
    
        #2. 리사이징된 사진을 SiTH/data/examples/images, SiTH/data/examples/rgba에 넣기
            images_file = f"{IMAGES_PATH}/{image.filename}"
            shutil.copy2(file_path, images_file)
            print(f"이미지 복사 완료: {images_file}")
            
            # 기존 파일들을 백업하고 새 파일만 남기기 (시간 단축을 위해 주석처리)
            # backup_dir = f"{EXAMPLES_PATH}/backup_{int(time.time())}"
            # os.makedirs(backup_dir, exist_ok=True)
            
            # # rgba 폴더에서 타겟 파일이 아닌 것들을 백업
            # for file in os.listdir(RGBA_PATH):
            #     if file != image.filename:
            #         shutil.move(f"{RGBA_PATH}/{file}", f"{backup_dir}/rgba_{file}")
            
            # # images 폴더에서 타겟 파일이 아닌 것들을 백업
            # for file in os.listdir(IMAGES_PATH):
            #     if file != image.filename:
            #         shutil.move(f"{IMAGES_PATH}/{file}", f"{backup_dir}/images_{file}")
            
            # # back_images 폴더에서 타겟 파일이 아닌 것들을 백업
            # back_images_path = f"{EXAMPLES_PATH}/back_images"
            # if os.path.exists(back_images_path):
            #     for file in os.listdir(back_images_path):
            #         if file != f"{image.filename.replace('.png', '')}_000.png":
            #             shutil.move(f"{back_images_path}/{file}", f"{backup_dir}/back_{file}")
            
            # # smplx 폴더에서 타겟 파일이 아닌 것들을 백업
            # smplx_path = f"{EXAMPLES_PATH}/smplx"
            # if os.path.exists(smplx_path):
            #     for file in os.listdir(smplx_path):
            #         if file != f"{image.filename.replace('.png', '')}.json":
            #             shutil.move(f"{smplx_path}/{file}", f"{backup_dir}/smplx_{file}")
            
            # print(f"기존 파일들을 백업했습니다: {backup_dir}")
            print("백업 처리 생략 - 기존 파일들을 그대로 사용합니다.")
        
        #3. 리사이징된 사진을 openpose를 이용해서 key_points를 추출하고 data/examples/images에 넣기 (시간 단축을 위해 주석처리)
            print("OpenPose keypoints 추출 생략 - 기존 파일을 사용합니다.")
            # print("OpenPose keypoints 추출 시작...")
            
            # # OpenPose 실행하여 keypoints 추출
            # openpose_bin = "../openpose/build/examples/openpose/openpose.bin"
            # openpose_root = "../openpose"
            
            # if os.path.exists(openpose_bin):
            #     result = subprocess.run([
            #         openpose_bin,
            #         "--image_dir", f"{SITH_PATH}/{IMAGES_PATH}",
            #         "--write_json", f"{SITH_PATH}/{IMAGES_PATH}/keypoints",
            #         "--display", "0",
            #         "--render_pose", "0",
            #         "--hand",
            #         "--face"
            #     ], cwd=openpose_root, capture_output=True, text=True)
                
            #     print(f"OpenPose 실행 결과 코드: {result.returncode}")
            #     print(f"OpenPose 표준 출력: {result.stdout}")
            #     print(f"OpenPose 표준 오류: {result.stderr}")
                
            #     if result.returncode != 0:
            #         print(f"OpenPose 실행 실패: {result.stderr}")
            #     else:
            #         # keypoints JSON 파일을 images 폴더로 이동
            #         keypoints_dir = f"{SITH_PATH}/{IMAGES_PATH}/keypoints"
            #         if os.path.exists(keypoints_dir):
            #             for file in os.listdir(keypoints_dir):
            #                     if file.endswith('.json'):
            #                             src = os.path.join(keypoints_dir, file)
            #                             dst = os.path.join(f"{SITH_PATH}/{IMAGES_PATH}", file)
            #                             shutil.move(src, dst)
            #                     # 빈 keypoints 폴더 삭제
            #                     os.rmdir(keypoints_dir)
            #                     print("Keypoints JSON 파일 생성 완료")
            #                 else:
            #                     print("Keypoints 폴더가 생성되지 않았습니다.")
            # else:
            #     print(f"OpenPose 바이너리를 찾을 수 없습니다: {openpose_bin}")
            #     print("OpenPose가 설치되지 않았거나 경로가 잘못되었습니다.")
        
        #4. SiTH 모델 명령어 실행 (시간 단축을 위해 주석처리)
        # !bash run_target.sh <filename>
            print(f"SiTH run_target.sh 실행 생략 - 기존 파일들을 사용합니다.")
            # print(f"실행 경로: {SITH_PATH}")
            # print(f"실행 명령어: bash {SITH_PATH}/run_target.sh {image.filename}")
            
            # # CUDA 오류 해결을 위한 환경변수 설정
            # env = os.environ.copy()
            # env['CUDA_LAUNCH_BLOCKING'] = '1'
            
            # result = subprocess.run(
            #     ["bash", f"{SITH_PATH}/run_target.sh", image.filename],
            #     cwd=SITH_PATH,
            #     capture_output=True,
            #     text=True,
            #     env=env
            # )
            
            # print(f"실행 결과 코드: {result.returncode}")
            # print(f"표준 출력: {result.stdout}")
            # print(f"표준 오류: {result.stderr}")
            
            # if result.returncode != 0:
            #     raise HTTPException(status_code=500, detail=f"run_target.sh 실행 실패: {result.stderr}")
            
            # 각 단계별 파일 확인
            print("=== 파일 확인 ===")
            print(f"images 폴더: {os.listdir(IMAGES_PATH)}")
            print(f"smplx 폴더: {os.listdir(f'{EXAMPLES_PATH}/smplx')}")
            print(f"back_images 폴더: {os.listdir(f'{EXAMPLES_PATH}/back_images')}")
            print(f"meshes 폴더: {os.listdir(f'{EXAMPLES_PATH}/meshes')}")
            print("================")
    
        #5. 2번째 명령어 (이미 run_target.sh에서 실행됨)
        # %cd /content/SiTH
        # !python reconstruct.py \
        # --test_folder data/examples \
        # --config recon/config.yaml \
        # --resume checkpoints/recon_model.pth \
        # --grid_size 300 \
        # --save_uv   
            # run_target.sh에서 이미 실행되므로 생략
    
        #6. 이후 생성된 meshes에 .png와 .obj을 이용해서 다음 명령어 실행
        # !blender --background --python /content/SiTH/scripts/auto_texture.py
            print("Blender auto_texture.py 실행 중...")
            # CUDA 오류 해결을 위한 환경변수 설정
            env = os.environ.copy()
            env['CUDA_LAUNCH_BLOCKING'] = '1'
            
            result = subprocess.run([
                "blender", "--background", "--python", f"{SITH_PATH}/scripts/auto_texture.py"
            ], cwd=SITH_PATH, capture_output=True, text=True, env=env)
            
            print(f"Blender 실행 결과 코드: {result.returncode}")
            print(f"Blender 표준 출력: {result.stdout}")
            print(f"Blender 표준 오류: {result.stderr}")
            
            if result.returncode != 0:
                raise HTTPException(status_code=500, detail=f"Blender 실행 실패: {result.stderr}")
    
        #7. data/examples/output에 3d캐릭터를 프론트에 반환하기
            output_file = f"{OUTPUT_PATH}/{image.filename.replace('.png', '')}.glb"
            print(f"출력 파일 확인: {output_file}")
            print(f"출력 파일 존재 여부: {os.path.exists(output_file)}")
            
            # 가장 최근에 생성된 GLB 파일 찾기
            if os.path.exists(OUTPUT_PATH):
                glb_files = [f for f in os.listdir(OUTPUT_PATH) if f.endswith('.glb')]
                if glb_files:
                    # 가장 최근 파일 선택
                    latest_glb = max(glb_files, key=lambda x: os.path.getctime(os.path.join(OUTPUT_PATH, x)))
                    output_file = os.path.join(OUTPUT_PATH, latest_glb)
                    print(f"최근 생성된 GLB 파일: {latest_glb}")
                else:
                    print("GLB 파일이 없습니다.")
                    raise HTTPException(status_code=404, detail="생성된 3D 모델을 찾을 수 없습니다.")
            else:
                print("출력 폴더가 존재하지 않습니다.")
                raise HTTPException(status_code=404, detail="생성된 3D 모델을 찾을 수 없습니다.")
            
            if os.path.exists(output_file):
                return FileResponse(
                    path=output_file,
                    filename=os.path.basename(output_file),
                    media_type="model/gltf-binary"
                )
            else:
                # 출력 폴더 내용 확인
                if os.path.exists(OUTPUT_PATH):
                    files = os.listdir(OUTPUT_PATH)
                    print(f"출력 폴더 내용: {files}")
                else:
                    print("출력 폴더가 존재하지 않습니다.")
                raise HTTPException(status_code=404, detail="생성된 3D 모델을 찾을 수 없습니다.")
                
        except Exception as e:
            print(f"오류 발생: {str(e)}")
            raise HTTPException(status_code=500, detail=f"3D 캐릭터 생성 중 오류가 발생했습니다: {str(e)}")
    
        
    
    ```
