import { formatDaysAgo } from "@/shared/utils";
import { MobileItem } from "@/user/shared/components";
import type { NotificationRow } from "../types";

interface MobileNotifitcationTableRowsProps {
  notifications: NotificationRow[];
}

function MobileNotifitcationTableRows({
  notifications,
}: MobileNotifitcationTableRowsProps) {
  return (
    <div className="flex flex-col gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-ec-box rounded-ec-10 px-5 py-6"
        >
          <div className="text-body-2 text-ec-black border-ec-outline-dark max-w-77.5 overflow-hidden border-b pb-3 text-ellipsis whitespace-nowrap">
            {notification.content}
          </div>

          <div className="mt-2 flex gap-4">
            <MobileItem
              label="상태"
              value={notification.read ? "읽음" : "안 읽음"}
              valueClassName={
                notification.read ? "text-ec-red" : "text-ec-blue"
              }
            />
            <MobileItem label="수신일" value={formatDaysAgo(notification.createdAt)} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MobileNotifitcationTableRows;