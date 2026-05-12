import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import NavLogo from "@shared/assets/NavLogo.png";
import { PageBackground, LegalFooter } from "@shared/components";

const desktopSectionClassName =
  "relative flex w-full flex-col px-8 py-10 sm:px-14 lg:min-h-screen lg:px-[clamp(2.5rem,3.8vw,3.5rem)] lg:pt-[clamp(3rem,4.5vw,3.75rem)] lg:pb-[clamp(2.5rem,4vw,3.125rem)]";

function PreparingIllustration() {
  return (
    <DotLottieReact
      src="https://lottie.host/9ae5b434-3698-40c2-9751-7d9c84f570b1/nY3kQWTdZE.lottie"
      loop
      autoplay
      className="h-[12.0625rem] w-[10.0625rem] sm:h-56 sm:w-48 lg:h-[clamp(12rem,16vw,14rem)] lg:w-[clamp(10rem,13vw,12rem)]"
    />
  );
}

function PreparingPage() {
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
          <PreparingIllustration />
          <h1 className="typo-title text-ec-black mt-5">
            서비스를 준비하고 있어요
          </h1>
          <p className="typo-body-1 text-ec-sub mt-4 leading-6">
            편리한 이캠퍼스 환경을 위해 지금은 준비하고 있어요
            <br />
            나중에 다시 방문해주세요!
          </p>
        </div>
        <LegalFooter />
      </section>
    </PageBackground>
  );
}

export default PreparingPage;
