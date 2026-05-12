import { NavLink, useLocation } from "react-router-dom";
import ArrorwIcon from "../assets/arrow.svg?react";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

interface TabItem {
  label: string;
  path: string;
  end?: boolean;
}

function TabBar({ items }: { items: TabItem[] }) {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const [toggle, setToggle] = useState<boolean>(false);

  const activeItem =
    items.find((item) =>
      item.end ? pathname === item.path : pathname.startsWith(item.path),
    ) ?? items[0];

  const isTabListVisible = !isMobile || toggle;

  return (
    <nav className="bg-ec-white border-ec-outline absolute top-16.25 z-10 w-dvw overflow-hidden border-r md:relative md:top-0 md:w-50">
      {isMobile && (
        <div
          className="bg-ec-box flex items-center justify-between px-6 py-3"
          onClick={() => setToggle((prev) => !prev)}
        >
          <span className="text-caption text-ec-sub">{activeItem?.label}</span>
          <ArrorwIcon
            className={`file:bg-ec-sub w-2 transition-transform duration-200 ${
              toggle ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      )}

      {isTabListVisible && (
        <ul className="bg-ec-box md:bg-ec-white flex flex-col gap-2 px-6 py-2 md:gap-5 md:px-7 md:py-7">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                onClick={() => {
                  if (isMobile) setToggle(false);
                }}
                className={({ isActive }) =>
                  `font-pretendard tracking-ec-normal text-[12px] leading-120 font-medium transition-colors md:text-[18px] ${
                    isActive
                      ? "text-ec-black font-semibold dark:text-[#16302B]"
                      : "text-ec-black hover:text-ec-blue"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default TabBar;
