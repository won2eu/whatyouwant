from PIL import Image
import os

def resize_image(input_filename, target_size=1024):
    """
    이미지를 정사각형으로 리사이징하는 함수
    
    Args:
        input_filename (str): 입력 이미지 파일명
        target_size (int): 목표 크기 (기본값: 1024)
    
    Returns:
        str: 리사이징된 이미지 파일명 (실패시 None)
    """
    try:
        # 이미지 열기
        img = Image.open(input_filename).convert("RGBA")
        original_width, original_height = img.size
        
        # 비율 유지해서 리사이즈 (긴 쪽이 target_size가 되도록)
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
        padded_img.save(input_filename)
        print(f"✅ {input_filename}: {original_width}x{original_height} → 최종 {target_size}x{target_size} (비율 유지, 중앙 정렬)")
        
        return input_filename
        
    except Exception as e:
        print(f"❌ 이미지 리사이징 실패: {str(e)}")
        return None

# 사용 예시
if __name__ == "__main__":
    # 이미지 리사이징
    resized_filename = resize_image("jk1.png")
    if resized_filename:
        print(f"리사이징 완료: {resized_filename}")
    else:
        print("리사이징 실패")
