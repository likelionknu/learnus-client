import { useState } from "react";

interface SelectBoxProps {
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  defaultValue,
  value,
  onChange,
  className = "",
}) => {
  const [selected, setSelected] = useState<string>(defaultValue || options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const isControlled = value !== undefined;
  const fallbackSelected = defaultValue || options[0] || "";
  const uncontrolledSelected =
    selected && options.includes(selected) ? selected : fallbackSelected;
  const controlledSelected =
    value && options.includes(value) ? value : fallbackSelected;
  const resolvedSelected = isControlled
    ? controlledSelected
    : uncontrolledSelected;

  const handleSelect = (option: string) => {
    if (!isControlled) {
      setSelected(option);
    }
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-40 ${className}`}>
      {/* 선택된 값 */}
      <button
        type="button"
        className="bg-ec-box rounded-ec-10 flex h-11 w-full cursor-pointer items-center justify-between px-3.5"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          className={`text-sm font-medium ${
            resolvedSelected === defaultValue ? "text-ec-sub" : "text-ec-black"
          }`}
        >
          {resolvedSelected}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 옵션 리스트 */}
      {isOpen && (
        <ul className="bg-ec-box rounded-ec-10 absolute top-full left-0 z-10 mt-2 flex w-full flex-col gap-2.5 px-3.5 py-3.5 shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              className="text-ec-black cursor-pointer rounded px-2 py-1 text-sm font-medium"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectBox;
