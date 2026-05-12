import { type ReactNode } from "react";
import LeftButton from "@shared/assets/PageNationMobileLeftButton.png";
import RightButton from "@shared/assets/PageNationMobileRightButton.png";

interface PageNationMobileFrameProps {
  children: ReactNode;
}

export const PageNationMobileFrame = ({
  children,
}: PageNationMobileFrameProps) => {
  return (
    <div className="flex max-w-87.5 flex-wrap items-center justify-between md:max-w-187.5">
      {children}
    </div>
  );
};

interface PageNationMobileItemProps {
  children: ReactNode;
}

export const PageNationMobileItem = ({
  children,
}: PageNationMobileItemProps) => {
  return (
    <div className="bg-ec-box rounded-ec-10 my-1.25 h-20.75 w-87.5">
      {children}
    </div>
  );
};

export const PageNationMobileButton = () => {
  return (
    <div className="flex w-87.5 items-center justify-between pt-2.5 md:w-full">
      <div className="bg-ec-box flex h-6 w-6 cursor-pointer items-center justify-center rounded-full">
        <img src={LeftButton} alt="LeftButton" className="h-2.25 w-1.25" />
      </div>
      <div className="text-ec-sub justify-center text-center text-xs font-medium">
        24페이지 중 1페이지
      </div>
      <div className="bg-ec-box flex h-6 w-6 cursor-pointer items-center justify-center rounded-full">
        <img src={RightButton} alt="LeftButton" className="h-2.25 w-1.25" />
      </div>
    </div>
  );
};
