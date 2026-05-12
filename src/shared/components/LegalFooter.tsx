import { Link } from "react-router-dom";

function LegalFooter() {
  return (
    <footer className="mt-auto flex max-w-full flex-col items-end gap-2 pt-10 text-right">
      <Link
        to="/privacy-policy"
        className="typo-caption text-ec-blue max-w-full transition-opacity hover:underline hover:opacity-80"
      >
        개인정보 처리방침
      </Link>
      <p className="typo-caption text-ec-sub max-w-full">
        LIKELION KNU 2026. 모든 권리 보유.
      </p>
    </footer>
  );
}

export default LegalFooter;
