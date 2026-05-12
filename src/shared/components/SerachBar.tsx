import SearchIcon from "../assets/serach.svg?react";
import Input from "./Input";

interface SerachBarProps {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SerachBar({ placeholder, value, onChange }: SerachBarProps) {
  const iconFillClass = value ? "fill-ec-black" : "fill-ec-sub";

  return (
    <div className="relative w-full">
      <Input value={value} placeholder={placeholder} onChange={onChange} />
      <SearchIcon
        className={`${iconFillClass} absolute top-1/2 right-7 w-3 -translate-y-1/2`}
        aria-hidden="true"
      />
    </div>
  );
}

export default SerachBar;
