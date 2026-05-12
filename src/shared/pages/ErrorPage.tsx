import { LegalFooter, PageBackground } from "@shared/components";
import { Link } from "react-router-dom";
import NavLogo from "@shared/assets/NavLogo.png";

const desktopSectionClassName =
  "relative hidden w-full flex-col lg:flex lg:min-h-screen lg:px-[clamp(2.5rem,3.8vw,3.5rem)] lg:pt-[clamp(3rem,4.5vw,3.75rem)] lg:pb-[clamp(2.5rem,4vw,3.125rem)]";

// 공통 404(Not Found) 페이지입니다.
function ErrorPage() {
  return (
    <PageBackground>
      {/*모바일*/}
      <section className="relative flex min-h-screen w-full flex-col px-6 pt-14 pb-8 sm:px-14 sm:pt-16 lg:hidden">
        {/*모바일 로고*/}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <img
            src={NavLogo}
            alt="LIKELION KNU 로고"
            className="h-6 w-4 shrink-0 brightness-0 sm:h-9 sm:w-6"
          />
          <span className="text-ec-black tracking-ec-tight text-[19px] leading-none font-semibold sm:text-3xl">
            LIKELION KNU
          </span>
        </div>

        {/*모바일 내용*/}
        <div className="mt-14">
          <h1 className="text-ec-black font-pretendard tracking-ec-normal text-[24px]/[1.35] font-semibold">
            페이지를 찾을 수 없어요
          </h1>
          <p className="text-ec-sub font-pretendard tracking-ec-normal mt-4 text-[14px]/[1.57] font-medium">
            찾고 있는 페이지를 찾을 수 없거나, 일시적으로 사용할 수 없어요
          </p>

          <Link
            to="/user/dashboard"
            className="bg-ec-blue text-ec-gnb-white font-pretendard focus-visible:outline-ec-blue hover:bg-ec-blue-item tracking-ec-normal mt-10 inline-flex h-10 items-center justify-center rounded-xl px-6 text-[14px]/[20px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            대시보드로 돌아가기
          </Link>
        </div>

        {/*모바일 푸터*/}
        <div className="mt-auto flex justify-end pt-20">
          <p className="typo-caption text-ec-sub text-right">
            LIKELION KNU 2026. 모든 권리 보유.
          </p>
        </div>
      </section>

      {/*웹*/}
      <section className={desktopSectionClassName}>
        <div className="flex items-center gap-4">
          <img
            src={NavLogo}
            alt="LIKELION KNU 로고"
            className="h-9 w-6 shrink-0 brightness-0"
          />
          <span className="text-ec-black tracking-ec-tight text-[clamp(2rem,3vw,2.75rem)] leading-none font-semibold">
            LIKELION KNU
          </span>
        </div>

        <div className="mt-[clamp(4rem,8vw,5.375rem)]">
          <h1 className="typo-title text-ec-black">페이지를 찾을 수 없어요</h1>
          <p className="typo-body-1 text-ec-sub mt-4">
            찾고 있는 페이지를 찾을 수 없거나, 일시적으로 사용할 수 없어요
          </p>

          <Link
            to="/user/dashboard"
            className="bg-ec-blue text-ec-gnb-white typo-body-1 rounded-ec-10 focus-visible:outline-ec-blue hover:bg-ec-blue-item mt-11 inline-flex w-full max-w-72 items-center justify-center px-6 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            대시보드로 돌아가기
          </Link>
        </div>
        <LegalFooter />
      </section>
    </PageBackground>
  );
}

export default ErrorPage;
