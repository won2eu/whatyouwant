#!/bin/bash

# 특정 파일만 처리하는 run.sh
# 사용법: bash run_target.sh <filename>

if [ $# -eq 0 ]; then
    echo "사용법: bash run_target.sh <filename>"
    echo "예시: bash run_target.sh user_image.png"
    exit 1
fi

TARGET_FILE=$1
echo "처리할 파일: $TARGET_FILE"

# Prepare your RGBA images in data/examples/rgba
# Step 0: Convert RGBA image to square images and estimate 2D keypoints
# python tools/centralize_rgba.py
# ./build/examples/openpose/openpose.bin ......

# Step 1: Fit SMPL-X to the input image, the result will be saved in data/examples/smplx
echo "Step 1: SMPL-X 피팅 시작..."
python fit.py --opt_orient --opt_betas --opt_pose

# Step 2: Hallucinated back-view images, the result will be saved in data/examples/back_images
# Note that the hallucination process is stochastic, therefore you may choose the best one manually.
echo "Step 2: 뒷면 이미지 생성 시작..."
python hallucinate.py --num_validation_images 1 --num_inference_steps 20

# Step 3: Reconstruct textured 3D meshes, the result will be saved in data/examples/meshes
echo "Step 3: 3D 메시 재구성 시작..."
python reconstruct.py --test_folder data/examples --config recon/config.yaml --resume checkpoints/recon_model.pth --grid_size 300 --save_uv

echo "모든 단계 완료!" 