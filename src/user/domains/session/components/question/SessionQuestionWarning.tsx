function SessionQuestionWarning() {
  return (
    <div className="text-ec-red font-pretendard tracking-ec-normal border-ec-red rounded-ec-10 xl:text-body-2 w-full border px-5 py-3 text-[12px]/[20px] font-medium whitespace-pre-wrap xl:whitespace-normal">
      이 질문은 해당 세션에 등록된 모든 사용자에게 공개됩니다. {"\n"}
      민감한 개인정보가 포함되지 않도록 유의해 주시기 바랍니다.
    </div>
  );
}

export default SessionQuestionWarning;
