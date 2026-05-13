import { useLocation, useNavigate } from "react-router-dom";
import { useAuthSessionStore } from "@auth/stores";
import NavLogo from "@shared/assets/NavLogo.png";
import NavSession from "@shared/assets/NavSession.svg";
import NavGroup from "@shared/assets/NavGroup.svg";
import NavAlart from "@shared/assets/NavAlart.svg";
import NavQuestion from "@shared/assets/NavQuestion.svg";
import NavAdmin from "@shared/assets/NavAdmin.svg";
import UserProfileImg from "@shared/assets/UserProfileImg.png";
import Button from "../Button";

interface NavItemsProps {
  iconSrc: string;
  iconAlt: string;
  label: string;
  onClick?: () => void;
  selected?: boolean;
}

const NavItems = ({
  iconSrc,
  iconAlt,
  label,
  onClick,
  selected,
}: NavItemsProps) => {
  return (
    <div
      className="group bg-ec-black dark:bg-ec-white flex h-17 w-17 cursor-pointer items-center justify-center rounded-2xl duration-700 hover:bg-[#2D4F99]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex h-5 w-5 items-center justify-center">
          <img
            src={iconSrc}
            alt={iconAlt}
            className={`max-h-full max-w-full object-contain transition-all duration-0 ${
              selected
                ? "brightness-0 invert filter"
                : "group-hover:brightness-0 group-hover:invert group-hover:filter"
            }`}
          />
        </div>
        <div
          className={`justify-start text-center text-sm font-medium transition-colors duration-0 ${
            selected
              ? "text-ec-gnb-white"
              : "text-ec-gnb-unselected group-hover:text-ec-gnb-white"
          }`}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

const NavBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const userName = useAuthSessionStore((state) => state.session?.name);
  const profileUrl = useAuthSessionStore((state) => state.session?.profileUrl);
  const clearSession = useAuthSessionStore((state) => state.clearSession);
  const pathSegments = pathname.split("/").filter(Boolean);

  const isSessionSelected = pathname.startsWith("/user/sessions");
  const isGroupSelected = pathname.startsWith("/user/list");
  const isNotificationSelected = pathname.startsWith("/user/notification");
  const isQuestionSelected = pathname.startsWith("/user/questions");
  const isAdminSelected = pathSegments[0] === "admin";

  const handleLogout = () => {
    clearSession();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="bg-ec-black dark:bg-ec-white sticky top-0 flex h-screen min-h-screen w-21.5">
      <div className="flex h-full w-full flex-col items-center justify-between px-2.25 pt-9.25 pb-10.75">
        <div className="flex h-105.5 w-full flex-col items-center gap-10">
          <img
            src={NavLogo}
            alt="NavLogo"
            className="h-9 w-8 cursor-pointer"
            onClick={() => {
              navigate("/user/dashboard");
            }}
          />
          <div className="flex flex-col items-center gap-6.25">
            <NavItems
              iconSrc={NavSession}
              iconAlt="NavSession"
              label="세션"
              selected={isSessionSelected}
              onClick={() => navigate("/user/sessions")}
            />
            <NavItems
              iconSrc={NavGroup}
              iconAlt="NavGroup"
              label="그룹"
              selected={isGroupSelected}
              onClick={() => navigate("/user/list")}
            />
            <NavItems
              iconSrc={NavAlart}
              iconAlt="NavAlart"
              label="알림"
              selected={isNotificationSelected}
              onClick={() => navigate("/user/notification")}
            />
            <NavItems
              iconSrc={NavQuestion}
              iconAlt="NavQuestion"
              label="질문"
              selected={isQuestionSelected}
              onClick={() => navigate("/user/questions")}
            />

            <NavItems
              iconSrc={NavAdmin}
              iconAlt="NavAdmin"
              label="관리자"
              selected={isAdminSelected}
              onClick={() => navigate("/admin")}
            />
          </div>
        </div>
        <div className="group relative flex w-17 flex-col items-center">
          <div
            className="flex h-17 w-17 cursor-pointer flex-col items-center gap-1.25"
            onClick={() => {
              navigate("/user/dashboard");
            }}
          >
            <img
              className="border-ec-outline h-7 w-7 rounded-full border"
              alt="NavUserProfileImg"
              src={profileUrl || UserProfileImg}
            />
            <div className="text-ec-gnb-white cursor-alias justify-start text-center text-xs font-medium">
              {userName}
            </div>
          </div>
          <div className="invisible absolute bottom-full left-1/2 z-20 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
            <Button size="modal" variant="danger" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
