import { createAuthErrorInfo, AuthFlowError } from "@auth/utils";

const GOOGLE_URL = "https://accounts.google.com/o/oauth2/v2/auth?";
const GOOGLE_OAUTH_STATE_KEY = "ecampus.auth.google.state";

function consumeGoogleOAuthState() {
  const savedState = window.sessionStorage.getItem(GOOGLE_OAUTH_STATE_KEY);

  window.sessionStorage.removeItem(GOOGLE_OAUTH_STATE_KEY);

  return savedState;
}

const GoogleLogin = () => {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim();
  const state = crypto.randomUUID();

  const googleAuthUrl =
    GOOGLE_URL +
    "client_id=" +
    CLIENT_ID +
    "&" +
    "redirect_uri=" +
    encodeURIComponent(REDIRECT_URI) +
    "&" +
    "response_type=code&" +
    "scope=email profile openid&" +
    "access_type=offline&" +
    "prompt=select_account&" +
    "state=" +
    encodeURIComponent(state);

  window.sessionStorage.setItem(GOOGLE_OAUTH_STATE_KEY, state);
  window.location.href = googleAuthUrl;
};

export function validateGoogleOAuthState(receivedState: string | null) {
  const savedState = consumeGoogleOAuthState();

  if (!savedState || !receivedState || savedState !== receivedState) {
    throw new AuthFlowError(
      createAuthErrorInfo({
        reason: "oauth",
        message:
          "로그인 요청이 만료되었거나 유효하지 않습니다. 다시 시도해주세요.",
      }),
    );
  }
}

export default GoogleLogin;
