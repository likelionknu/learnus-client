import EmptyImg from "../../assets/empty.png";

function TableEmptyState({ label }: { label: string }) {
  return (
    <div className="bg-ec-box flex w-full flex-col items-center gap-5 py-13">
      <img src={EmptyImg} className="w-4" />
      <span className="text-body-2 text-ec-sub">{label}</span>
    </div>
  );
}

export default TableEmptyState;
