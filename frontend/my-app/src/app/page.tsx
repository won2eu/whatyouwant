import Component from "../components/prompt-input";
import ThreeJSViewer from "../components/ThreeJSViewer";
import MainUI from "../components/MainUI";

export default function Home() {
  return (
    <div className="h-screen relative bg-white">
      {/* 메인 UI - 제목, 사진 업로드, 3D 캐릭터 */}
      <div className="absolute inset-0 z-0">
        <MainUI />
      </div>
      
      {/* 프롬프트 입력 컴포넌트 - 숨김 상태 */}
      {/* <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
          <Component />
        </div>
      </div> */}
    </div>
  );
}
