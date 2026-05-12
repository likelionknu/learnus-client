import { useState } from "react";
import { useLocation, useMatches, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import DarkModeImg from "@shared/assets/DarkModeImg.png";
import LightModeImg from "@shared/assets/LightModeImg.png";
import MobileHeaderIcon from "@shared/assets/MobileHeaderIcon.png";
import MobileHeaderLogo from "@shared/assets/MobileHeaderLogo.png";
import UserProfileImg from "@shared/assets/UserProfileImg.png";
import xWhile from "@user/domains/dashboard/assets/xWhite.png";
import { useSessionStore } from "@/shared/stores/sessionStore";

type HeaderRouteHandle = {
  title?: string;
};

interface HeaderRouterButtonProps {
  label: string;
  to: string;
  onClick: (to: string) => void;
}

function HeaderRouterButton({ label, to, onClick }: HeaderRouterButtonProps) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center"
      onClick={() => onClick(to)}
    >
      <div className="text-ec-black full line-clamp-1 justify-start text-base font-medium">
        {label}
      </div>
    </button>
  );
}

function Header() {
  const isTablet = useMediaQuery({ maxWidth: 1280 });

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const matches = useMatches();
  const sessionName = useSessionStore((state) => state.sessionName);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const pageTitle =
    [...matches]
      .reverse()
      .map((match) => (match.handle as HeaderRouteHandle | undefined)?.title)
      .find((title) => typeof title === "string") ?? "eCampus";
  const pathSegments = pathname.split("/").filter(Boolean);
  const isSessionDetailPage =
    (pathSegments[0] === "user" || pathSegments[0] === "admin") &&
    pathSegments[1] === "sessions" &&
    /^\d+$/.test(pathSegments[2] ?? "");
  const headerTitle =
    isSessionDetailPage && sessionName ? sessionName : pageTitle;

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;

      document.documentElement.classList.toggle("dark", next);
      document.documentElement.style.colorScheme = next ? "dark" : "light";
      localStorage.setItem("theme", next ? "dark" : "light");

      return next;
    });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {isTablet ? (
        <div className="fixed top-0 left-0 z-60 h-16.25 w-full">
          <div
            className={`fixed inset-0 top-16.25 z-40 bg-black/20 backdrop-blur-[3px] transition-opacity duration-0 ${
              isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="bg-ec-blue fixed top-0 left-0 z-60 flex h-16.25 w-full items-center justify-center">
            <div className="flex w-full items-center justify-between px-10.5 py-4.75">
              <div className="flex items-center gap-2.5">
                <img
                  className="h-3.5 w-2.5"
                  alt="MobileHeaderLogo"
                  src={MobileHeaderLogo}
                />
                <div className="text-ec-gnb-white line-clamp-1 justify-start text-base font-medium">
                  {headerTitle}
                </div>
              </div>
              <img
                className="h-3 w-3 cursor-pointer"
                alt="MobileHeaderIcon"
                src={isMobileMenuOpen ? xWhile : MobileHeaderIcon}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              />
            </div>
          </div>
          <div
            className={`bg-ec-white border-ec-outline rounded-br-ec-10 rounded-bl-ec-10 relative top-16.25 z-50 w-full overflow-hidden border-r border-b border-l transition-all duration-500 ${
              isMobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-full opacity-0"
            }`}
          >
            <div className="flex flex-col gap-3.75 px-6 py-5.5">
              <HeaderRouterButton
                label="세션"
                to="/user/sessions"
                onClick={(to) => {
                  navigate(to);
                  setIsMobileMenuOpen(false);
                }}
              />
              <HeaderRouterButton
                label="그룹"
                to="/user/sessions/group"
                onClick={(to) => {
                  navigate(to);
                  setIsMobileMenuOpen(false);
                }}
              />
              <HeaderRouterButton
                label="알림"
                to="/user/notification"
                onClick={(to) => {
                  navigate(to);
                  setIsMobileMenuOpen(false);
                }}
              />
              <HeaderRouterButton
                label="질문"
                to="/user/questions"
                onClick={(to) => {
                  navigate(to);
                  setIsMobileMenuOpen(false);
                }}
              />
              <div className="flex items-center gap-2.5">
                <div className="h-4 w-4 rounded-full bg-zinc-300">
                  <img src={UserProfileImg} alt="" className="" />
                </div>
                <div className="text-ec-table-topic line-clamp-1 justify-start text-base font-medium">
                  황형진
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <header className="border-ec-outline sticky top-0 flex h-20 w-full items-center justify-between border-b-2 py-6.75 pr-29.25 pl-8 dark:border-[#323232]">
            <h1 className="typo-sub-title">{headerTitle}</h1>
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={handleToggleTheme}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggleTheme();
                }
              }}
              className="border-ec-outline bg-ec-white relative flex h-9.5 w-27.5 cursor-pointer items-center overflow-hidden rounded-xl border-2 dark:border-[#323232] dark:bg-[#131313]"
            >
              <span
                aria-hidden
                className="bg-ec-outline absolute inset-0 h-full w-1/2 cursor-pointer rounded-md transition-transform duration-500 dark:bg-[#323232]"
                style={{
                  transform: isDark ? "translateX(100.5%)" : "translateX(0%)",
                }}
              />
              <div className="border-ec-outline-dark relative flex w-1/2 items-center justify-center">
                <img
                  className="h-4.5 w-4.5"
                  alt="NavLightModeImg"
                  src={LightModeImg}
                />
              </div>
              <div className="border-ec-outline-dark relative flex w-1/2 items-center justify-center">
                <img
                  className="h-4.5 w-4"
                  alt="NavDarkModeImg"
                  src={DarkModeImg}
                />
              </div>
            </button>
          </header>
        </div>
      )}
    </>
  );
}

export default Header;
