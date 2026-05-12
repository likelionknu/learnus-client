import PhoneIcon from "@shared/assets/phone.svg";
import { Link } from "react-router-dom";

function ScreenSizeErrorPage() {
  return (
    <main className="bg-ec-white min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-96 flex-col px-6 pt-31 pb-8">
        <div className="flex flex-col items-center">
          <img
            src={PhoneIcon}
            alt=""
            aria-hidden="true"
            className="h-18.5 w-24"
          />

          <h1 className="text-ec-black font-pretendard mt-11 text-center text-[20px]/[1.35] font-semibold tracking-ec-normal">
            더 큰 화면에서 사용해주세요
          </h1>

          <p className="text-ec-sub font-pretendard mt-5 text-center text-[16px]/[24px] font-medium tracking-ec-normal">
            쾌적한 모바일 환경을 제공하기 위해
            <br />
            아직 준비하고 있어요
          </p>

          <Link
            to="/auth/login"
            className="bg-ec-blue text-ec-gnb-white rounded-ec-10 font-pretendard focus-visible:outline-ec-blue hover:bg-ec-blue-item mt-10 inline-flex h-10 items-center justify-center px-3.5 text-[14px]/[20px] font-medium tracking-ec-normal transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            메인 페이지로 돌아가기
          </Link>
        </div>

        <p className="typo-caption text-ec-sub mt-auto text-right">
          LIKELION KNU 2026. 모든 권리 보유.
        </p>
      </section>
    </main>
  );
}

export default ScreenSizeErrorPage;
