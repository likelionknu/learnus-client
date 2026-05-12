import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import NavLogo from "@shared/assets/NavLogo.png";
import { PageBackground, LegalFooter } from "@shared/components";

const desktopSectionClassName =
  "relative flex w-full flex-col px-8 py-10 sm:px-14 lg:min-h-screen lg:px-[clamp(2.5rem,3.8vw,3.5rem)] lg:pt-[clamp(3rem,4.5vw,3.75rem)] lg:pb-[clamp(2.5rem,4vw,3.125rem)]";

function MaintenanceIllustration() {
  return (
    <DotLottieReact
      src="https://lottie.host/4ea59aff-3eb3-4b0d-8ae9-bc1874ee6153/9v9r0ir6mJ.lottie"
      loop
      autoplay
      className="h-[9.4375rem] w-[9.4375rem] sm:h-44 sm:w-44 lg:h-[clamp(9.5rem,12vw,12rem)] lg:w-[clamp(9.5rem,12vw,12rem)]"
    />
  );
}

function MaintenancePage() {
  return (
    <PageBackground>
      <section className={desktopSectionClassName}>
        <div className="flex items-center gap-4">
          <img
            src={NavLogo}
            alt="LIKELION KNU 로고"
            className="h-9 w-6 shrink-0 brightness-0"
          />
          <span className="text-ec-black tracking-ec-tight text-3xl leading-none font-semibold sm:text-[44px] lg:text-[clamp(2rem,3vw,2.75rem)]">
            LIKELION KNU
          </span>
        </div>

        <div className="mt-14 lg:mt-[clamp(4rem,7vw,4.25rem)]">
          <MaintenanceIllustration />
          <h1 className="typo-title text-ec-black mt-7.5">
            잠시 서비스가 중단됐어요
          </h1>
          <p className="typo-body-1 text-ec-sub mt-4 leading-6">
            더 나은 이캠퍼스 환경을 위해 멋쟁이사자처럼 강남대학교 팀은
            <br />
            서비스를 점검하고 있어요
          </p>
        </div>
        <LegalFooter />
      </section>
    </PageBackground>
  );
}

export default MaintenancePage;
