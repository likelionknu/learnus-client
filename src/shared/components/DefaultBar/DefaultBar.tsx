import type { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import Header from "./Header";
import NavBar from "./NavBar";

interface DefaultBarProps {
  children: ReactNode;
}

const DefaultBar = ({ children }: DefaultBarProps) => {
  const isTablet = useMediaQuery({ maxWidth: 1280 });
  return (
    <>
      {isTablet ? (
        <div className="flex min-h-screen">
          <Header />
          <div className="flex h-full w-full justify-start">{children}</div>
        </div>
      ) : (
        <div className="flex h-full min-h-screen">
          <NavBar />
          <main className="flex flex-1 flex-col">
            <Header />
            <div className="flex h-full w-full justify-start">{children}</div>
          </main>
        </div>
      )}
    </>
  );
};

export default DefaultBar;
