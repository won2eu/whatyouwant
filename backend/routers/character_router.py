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
        
        # 특정 GLB 파일 출력 (임의로 설정)
        if os.path.exists(OUTPUT_PATH):
            # 원하는 파일명을 여기서 설정
            target_file = "junghyun2.glb"  # 여기서 원하는 파일명으로 변경
            
            output_file = os.path.join(OUTPUT_PATH, target_file)
            if os.path.exists(output_file):
                print(f"출력할 GLB 파일: {target_file}")
            else:
                print(f"파일이 없습니다: {target_file}")
                raise HTTPException(status_code=404, detail=f"파일을 찾을 수 없습니다: {target_file}")
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