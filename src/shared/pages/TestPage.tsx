// import { useState } from "react";
// import Button from "../components/Button";
// import SerachBar from "../components/SerachBar";
import { TabBar } from "../components";
import { DefaultBar } from "../components/DefaultBar";

// import Modal from "../components/Modal";

function TestPage() {
  // const [value, setValue] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  // const handleClick = () => {
  //   setIsLoading(true);
  // };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue((prev) => (prev === e.target.value ? prev : e.target.value));
  // };

  const testTabItems = [
    { label: "자료", path: "/test" },
    { label: "과제", path: "/user/sessions" },
    { label: "사용자 및 그룹", path: "/user/dashboard" },
    { label: "질문 및 답변", path: "/admin/sessions" },
  ];

  return (
    <DefaultBar>
      <TabBar items={testTabItems} />
      {/* <div className="w-100">
        <Button size="primary" onClick={handleClick}>
          확인
        </Button>
        <Button size="primary" isLoading={isLoading}>
          확인ㅇㄴㅁㅇㄴㅁㅇㅁ
        </Button>
        <Button size="primary" variant="danger" isLoading={isLoading}>
          확인
        </Button>
        <Button size="large" isLoading={isLoading}>
          확인
        </Button>
      </div> */}
    </DefaultBar>
  );
}

export default TestPage;
