import bpy, os

def apply_texture_to_obj(obj_path, texture_path, export_path):
    # Blender 초기화 (기존 씬 제거)
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # OBJ 파일 가져오기
    bpy.ops.import_scene.obj(filepath=obj_path)
    obj = bpy.context.selected_objects[0]
    bpy.context.view_layer.objects.active = obj

    # UV가 없으면 자동 생성 (스마트 프로젝션)
    if not obj.data.uv_layers:
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.uv.smart_project(island_margin=0.003)
        bpy.ops.object.mode_set(mode='OBJECT')

    # 새로운 머티리얼 생성 및 노드 기반 구성
    mat = bpy.data.materials.new(name="TexMat")
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links

    # 불필요한 노드 제거 (Output만 남김)
    for n in list(nodes):
        if n.type != 'OUTPUT_MATERIAL':
            nodes.remove(n)

    # 기본 노드 구성: 텍스처 → BSDF → 머티리얼 출력
    out = nodes.get('Material Output')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    tex  = nodes.new('ShaderNodeTexImage')

    # 텍스처 이미지 로드 및 패킹
    img = bpy.data.images.load(texture_path)
    img.pack()
    tex.image = img

    # 노드 연결
    links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])

    # 오브젝트에 머티리얼 적용
    obj.data.materials.clear()
    obj.data.materials.append(mat)

    bpy.ops.export_scene.gltf(
        filepath=export_path,
        export_format='GLB',
        export_skins=True,          # 본 데이터 포함
        export_animations=True,     # 애니메이션이 있다면 포함
        export_texcoords=True,
        export_normals=True,
        export_materials='EXPORT',
        export_colors=True,
    )

    # ✅ FBX로 내보내기 (텍스처 포함, Mixamo 호환)
    # os.makedirs(os.path.dirname(export_path), exist_ok=True)
    # bpy.ops.export_scene.fbx(
    #     filepath=export_path,
    #     use_selection=False,  # 씬 전체 내보내기
    #     apply_unit_scale=True,
    #     apply_scale_options='FBX_SCALE_ALL',
    #     object_types={'MESH'},  # 메시만 추출
    #     path_mode='COPY',       # 텍스처 복사 경로 자동 처리
    #     embed_textures=True     # 텍스처 .fbx 내부에 포함
    # )

import sys
import glob

# meshes 폴더에서 가장 최근 생성된 파일 찾기
meshes_dir = "data/examples/meshes"
obj_files = glob.glob(f"{meshes_dir}/*_reco.obj")
png_files = glob.glob(f"{meshes_dir}/*.png")

if obj_files and png_files:
    # 가장 최근 파일 선택
    obj_file = max(obj_files, key=os.path.getctime)
    texture_file = max(png_files, key=os.path.getctime)
    
    # 파일명 추출 (확장자 제거)
    base_name = os.path.splitext(os.path.basename(obj_file))[0].replace('_reco', '')
    export_file = f"data/examples/output/{base_name}.glb"
    
    print(f"Processing: {obj_file} -> {export_file}")
    
    # 실행
    apply_texture_to_obj(obj_file, texture_file, export_file)
else:
    print("No obj or png files found in meshes directory")
