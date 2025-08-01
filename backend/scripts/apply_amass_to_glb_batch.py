import bpy
import numpy as np
import os
import mathutils
import math
import glob

# ==== [1] 사용자 입력 경로 ====
CHARACTER_PATH = "data/examples/output/jk1.glb"
MOTION_FOLDER = "data/cmu/CMU/07"  # 07번 폴더만 테스트
OUTPUT_FOLDER = "data/examples/output/cmu"
SMPLX_MODEL_PATH = "data/body_models/smplx/SMPLX_NEUTRAL.npz"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ==== [2] SMPL-X 본 이름 자동 로드 ====
def load_smplx_bone_names(model_path):
    data = np.load(model_path, allow_pickle=True)
    # joint_names가 있을 경우
    if 'joint_names' in data:
        bones = [str(name) for name in data['joint_names']]
    else:
        # joint_names가 없으면 기본 순서 생성
        print("⚠ joint_names 없음, 기본 21본 사용")
        bones = [
            'pelvis','left_hip','right_hip','spine1','left_knee','right_knee','spine2',
            'left_ankle','right_ankle','spine3','left_foot','right_foot','neck',
            'left_collar','right_collar','head','left_shoulder','right_shoulder',
            'left_elbow','right_elbow','left_wrist','right_wrist'
        ]
    print(f"✅ SMPL-X 본 구조 로드 완료: {len(bones)}개 본")
    return bones

smplx_bones = load_smplx_bone_names(SMPLX_MODEL_PATH)

# ==== [3] 모션 파일 반복 ====
npz_files = glob.glob(os.path.join(MOTION_FOLDER, "*.npz"))
print(f"총 {len(npz_files)} 개의 모션 파일을 처리합니다...")

for motion_file in npz_files:
    # Blender 초기화
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # 캐릭터 로드
    bpy.ops.import_scene.gltf(filepath=CHARACTER_PATH)
    armature = None
    for obj in bpy.data.objects:
        if obj.type == 'ARMATURE':
            armature = obj
            break
    if armature is None:
        raise RuntimeError("❌ Armature(본)가 없는 GLB입니다.")

    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='POSE')

    # 모션 로드
    data = np.load(motion_file)
    T = data['body_pose'].shape[0]
    global_orient = data['global_orient']
    body_pose = data['body_pose']
    trans = data['trans']

    print(f"▶ {os.path.basename(motion_file)}: {T}프레임 처리 중...")

    # 프레임별 키프레임 적용
    for frame in range(T):
        bpy.context.scene.frame_set(frame)
        # Root 이동
        if "pelvis" in armature.pose.bones:
            armature.pose.bones["pelvis"].location = trans[frame]
            armature.pose.bones["pelvis"].keyframe_insert("location")

        # Root 회전
        root_rot = mathutils.Euler(global_orient[frame], 'XYZ').to_quaternion()
        armature.pose.bones["pelvis"].rotation_quaternion = root_rot
        armature.pose.bones["pelvis"].keyframe_insert("rotation_quaternion")

        # Body joint 회전
        for i, bone_name in enumerate(smplx_bones[1:], start=0):
            if bone_name not in armature.pose.bones:
                continue
            angles = body_pose[frame, i*3:(i+1)*3]
            quat = mathutils.Euler(angles, 'XYZ').to_quaternion()
            armature.pose.bones[bone_name].rotation_quaternion = quat
            armature.pose.bones[bone_name].keyframe_insert("rotation_quaternion")

    # GLB 내보내기
    output_file = os.path.join(
        OUTPUT_FOLDER,
        os.path.splitext(os.path.basename(motion_file))[0] + "_animated.glb"
    )
    bpy.ops.export_scene.gltf(filepath=output_file, export_format='GLB')
    print(f"✅ 내보내기 완료: {output_file}")

print("🎉 모든 모션을 GLB 애니메이션으로 변환 완료!")
