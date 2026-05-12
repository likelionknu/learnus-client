import type { MemberState } from "../../types";

interface SelectedUserProps {
  item: MemberState;
  onRemove: (userId: number) => void;
}

function SelectedUser({ item, onRemove }: SelectedUserProps) {
  return (
    <button
      className="bg-ec-table-header flex cursor-pointer items-center gap-1 rounded-[100px] px-2 py-1"
      type="button"
      onClick={() => onRemove(item.userId)}
    >
      {item.profileUrl ? (
        <img src={item.profileUrl} className="h-5 w-5 rounded-[50%]" />
      ) : (
        <div className="bg-ec-white flex h-5 w-5 items-center justify-center rounded-[50%]">
          <div className="bg-ec-sub h-2.5 w-2.5 rounded-full" />
        </div>
      )}
      <span className="text-caption text-ec-sub">{item.name}</span>
    </button>
  );
}

export default SelectedUser;
