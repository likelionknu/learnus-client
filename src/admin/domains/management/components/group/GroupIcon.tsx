import MemoIcon from "../../assets/memo.svg?react";
import ChangeIcon from "../../assets/change.svg?react";
import DemeritIcon from "../../assets/demerit.svg?react";
import StopIcon from "../../assets/stop.svg?react";
import RestoreIcon from "../../assets/restore.svg?react";
import type { ComponentType, SVGProps } from "react";
import type { GroupIconType } from "../../types";

interface GroupIconProps {
  label: string;
  type: GroupIconType;
  onClick?: () => void;
}

function GroupIcon({ label, type, onClick }: GroupIconProps) {
  const iconMap: Record<
    GroupIconProps["type"],
    ComponentType<SVGProps<SVGSVGElement>>
  > = {
    memo: MemoIcon,
    change: ChangeIcon,
    demerit: DemeritIcon,
    stop: StopIcon,
    restore: RestoreIcon,
  };

  const textColorClass =
    type === "demerit" || type === "stop" ? "text-ec-red" : "text-ec-blue";
  const Icon = iconMap[type];

  return (
    <span
      className={`${textColorClass} inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap`}
      onClick={onClick}
    >
      <Icon className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default GroupIcon;
