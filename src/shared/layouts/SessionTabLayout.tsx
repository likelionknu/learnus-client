import { TabBar } from "@/shared/components";
import { ADMIN_DASHBOARD_TAG_ITEMS, ADMIN_MANAGEMENT_TAG_ITEMS, USER_SESSION_TAG_ITEMS } from "@/shared/constants";
import type { ComponentProps } from "react";
import { Outlet, useParams } from "react-router-dom";

interface SessionTabLayoutProps {
  tabType: "userSession" | "adminManagement" | "adminDashboard";
}

const TAB_ITEMS_MAP = {
  userSession: USER_SESSION_TAG_ITEMS,
  adminManagement: ADMIN_MANAGEMENT_TAG_ITEMS,
  adminDashboard: ADMIN_DASHBOARD_TAG_ITEMS,
} as const;

function SessionTabLayout({ tabType }: SessionTabLayoutProps) {
  const { sid } = useParams();
  const baseItems = TAB_ITEMS_MAP[tabType];
  const items: ComponentProps<typeof TabBar>["items"] =
    tabType === "userSession" && sid
      ? baseItems.map((item) => ({
          ...item,
          path: `/user/sessions/${sid}/${item.path}`,
        }))
      : baseItems;

  return (
    <>
      <TabBar items={items} />
      <Outlet />
    </>
  );
}

export default SessionTabLayout;
