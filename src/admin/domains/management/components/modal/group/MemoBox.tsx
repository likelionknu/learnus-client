function MemoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ec-white border-ec-outline rounded-ec-10 border px-6 py-5">
      {children}
    </div>
  );
}

export default MemoBox;
