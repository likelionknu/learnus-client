import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImg from "../assets/logo.png";
import { lerarnusLogin } from "../api";
import { getDefaultRouteByRole, useAuthSessionStore } from "@auth/stores";

interface InputProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ value, placeholder, onChange }: InputProps) => {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full rounded-2xl border border-[#eaeaea] px-7 py-4"
    />
  );
};

const Button = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button
      className="bg-ec-black text-body-1 text-ec-white w-full cursor-pointer rounded-2xl py-3"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const SubText = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-ec-black text-[13px] font-normal">{children}</p>;
};

function LoginPage() {
  const navigate = useNavigate();
  const setSessionFromLoginResponse = useAuthSessionStore(
    (state) => state.setSessionFromLoginResponse,
  );
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const hadndleLogin = async () => {
    try {
      const { email, password } = info;
      const response = await lerarnusLogin({ email, password });
      const loginResponse = response.data?.data;

      if (!loginResponse) {
        window.alert(
          response.data?.error?.message ?? "로그인에 실패했습니다. 다시 시도해주세요.",
        );
        return;
      }

      setSessionFromLoginResponse(loginResponse);
      navigate(getDefaultRouteByRole(loginResponse.role), { replace: true });
    } catch (error) {
      console.log(error);
      window.alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <div className="mx-auto mt-40 max-w-110">
        <img src={LogoImg} className="w-40" />
        <p className="text-title text-ec-black mt-10">
          다시 돌아온 걸 환영해요!
        </p>
        <p className="text-body-1 text-ec-sub mt-5">
          학술 동아리의 여정이 끊이지 않도록 함께해요.
        </p>

        <div className="mt-10 flex flex-col gap-2">
          <Input
            value={info.email}
            placeholder={"이메일 주소"}
            onChange={(e) => {
              setInfo({ ...info, email: e.target.value });
            }}
          />
          <Input
            value={info.password}
            placeholder={"비밀번호"}
            onChange={(e) => {
              setInfo({ ...info, password: e.target.value });
            }}
          />
          <Button text={"시작하기"} onClick={hadndleLogin} />
        </div>
        <div className="mt-9 flex w-full justify-center">
          <div className="flex w-70 justify-between text-[12px]">
            <SubText>비밀번호를 잊으셨나요?</SubText>|
            <SubText>회원이 아니신가요?</SubText>
          </div>
        </div>
      </div>
      <div className="absolute right-18 bottom-10 flex flex-col gap-2 text-right">
        <p className="text-caption text-ec-black">개인정보 처리방침</p>
        <p className="text-caption text-ec-sub">
          LIKELION KNU 2026. 모든 권리 보유.
        </p>
      </div>
    </>
  );
}

export default LoginPage;
