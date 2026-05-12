import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLoginButton } from "@auth/components";
import { buildLoginErrorPath, normalizeAuthError, readAuthErrorFromSearchParams } from "@auth/utils";
import { googleOAuth as GoogleLogin } from "@/auth/api";
import NavLogo from "@shared/assets/NavLogo.png";
import { LegalFooter, PageBackground } from "@shared/components";

const desktopSectionClassName =
  "relative hidden w-full flex-col lg:flex lg:min-h-screen lg:px-[clamp(2.5rem,3.8vw,3.5rem)] lg:pt-[clamp(3rem,4.5vw,3.75rem)] lg:pb-[clamp(2.5rem,4vw,3.125rem)]";

function LoginErrorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const authError = readAuthErrorFromSearchParams(searchParams);

  const handleGoogleLogin = () => {
    setIsRedirecting(true);

    try {
      GoogleLogin();
    } catch (error) {
      setIsRedirecting(false);
      navigate(buildLoginErrorPath(normalizeAuthError(error)), {
        replace: true,
      });
    }
  };

  return (
    <PageBackground variant="auth">
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
        <div className="mt-10">
          <div
            role="alert"
            className="border-ec-red text-ec-red tracking-ec-normal flex h-12 w-full items-center rounded-xl border px-3.5 text-[14px]/[20px] font-medium"
          >
            {authError.message}
          </div>

          <h1 className="text-ec-black font-pretendard tracking-ec-normal mt-5 text-[24px]/[1.35] font-semibold">
            다시 돌아온 걸 환영해요!
          </h1>
          <p className="text-ec-sub font-pretendard tracking-ec-normal mt-5 text-[14px]/[1.57] font-medium">
            멋쟁이사자처럼 강남대학교에 소속된 사용자만 이용할 수 있어요
          </p>

          <GoogleLoginButton
            onClick={handleGoogleLogin}
            disabled={isRedirecting}
            className="text-ec-blue border-ec-blue bg-ec-white font-pretendard hover:bg-ec-blue hover:text-ec-white focus-visible:outline-ec-blue tracking-ec-normal mt-10 inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border text-[14px]/[20px] font-medium transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
          />
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
          <span className="text-ec-black tracking-ec-tight text-3xl leading-none font-semibold sm:text-[44px] lg:text-[clamp(2rem,3vw,2.75rem)]">
            LIKELION KNU
          </span>
        </div>

        <div className="mt-[clamp(3.5rem,6vw,4.25rem)]">
          <div
            role="alert"
            className="border-ec-red text-ec-red rounded-ec-10 flex h-12 w-full max-w-96 items-center border px-4.5 text-sm leading-6 font-medium"
          >
            {authError.message}
          </div>

          <h1 className="typo-title text-ec-black mt-4.75">
            다시 돌아온 걸 환영해요!
          </h1>
          <p className="typo-body-1 text-ec-sub mt-5">
            멋쟁이사자처럼 강남대학교에 소속된 사용자만 이용할 수 있어요
          </p>

          <GoogleLoginButton
            onClick={handleGoogleLogin}
            disabled={isRedirecting}
            className="text-ec-blue rounded-ec-10 border-ec-blue bg-ec-white hover:bg-ec-blue hover:text-ec-white focus-visible:outline-ec-blue mt-10 inline-flex h-14 w-full max-w-96 cursor-pointer items-center justify-center gap-2.5 border transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            labelClassName="typo-body-1"
          />
        </div>
        <LegalFooter />
      </section>
    </PageBackground>
  );
}

export default LoginErrorPage;
