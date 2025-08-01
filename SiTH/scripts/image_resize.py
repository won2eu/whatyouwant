from PIL import Image
import os

# 입력 이미지 설정
input_filename = "jk1.png"
base_dir = "data/examples/images"
input_path = os.path.join(base_dir, input_filename)
output_path = input_path  # 덮어쓰기

# 열기
img = Image.open(input_path).convert("RGBA")
original_width, original_height = img.size

# 목표 크기
target_size = 1024

# 비율 유지해서 리사이즈 (긴 쪽이 1024가 되도록)
scale = min(target_size / original_width, target_size / original_height)
new_width = int(original_width * scale)
new_height = int(original_height * scale)

# 리사이즈 (비율 유지)
resized_img = img.resize((new_width, new_height), Image.LANCZOS)

# 여백 채우기용 투명 배경 생성
padded_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
paste_x = (target_size - new_width) // 2
paste_y = (target_size - new_height) // 2
padded_img.paste(resized_img, (paste_x, paste_y))

# 저장
padded_img.save(output_path)
print(f"✅ {input_filename}: {original_width}x{original_height} → 최종 1024x1024 (비율 유지, 중앙 정렬)")
