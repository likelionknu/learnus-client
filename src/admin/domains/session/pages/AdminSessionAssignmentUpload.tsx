import { TitleSection } from "@/shared/components";
import { AssignmentUploadForm } from "../components/assignments";

function AdminSessionAssignmentUpload() {
  return (
    <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:mx-0 xl:max-w-280 xl:px-8">
      <div className="flex w-full max-w-251.5 flex-col gap-5">
        <TitleSection title="새 과제 추가" />
        <AssignmentUploadForm />
      </div>
    </div>
  );
}

export default AdminSessionAssignmentUpload;
