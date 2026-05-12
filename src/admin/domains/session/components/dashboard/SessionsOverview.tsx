import { TextBox } from "@/shared/components";

interface SessionOverviewItem {
  label: string;
  value: number;
}

interface SessionOverviewProps {
  items: SessionOverviewItem[];
}

const OverviewStatCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-10">
      {children}
    </div>
  );
};

const StatValue = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-ec-black font-pretendard tracking-ec-normal text-[32px] leading-120 font-medium">
      {children}
    </div>
  );
};

const StatLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="text-caption text-ec-sub w-18 text-center">
      {children}
    </span>
  );
};

function SessionOverview({ items }: SessionOverviewProps) {
  return (
    <>
      {items.map((item) => (
        <TextBox key={item.label}>
          <OverviewStatCard>
            <StatValue>{item.value}</StatValue>
            <StatLabel>{item.label}</StatLabel>
          </OverviewStatCard>
        </TextBox>
      ))}
    </>
  );
}

export default SessionOverview;
