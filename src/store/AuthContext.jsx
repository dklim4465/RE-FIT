import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "refit_user";

//로그인 관련해서 정보를 로컬에 저장해 놓는곳
function getStoredUser() {
  try {
    //저장 된 유저의 키값들
    const storedUser = localStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}
//자식에게서 (로그인 form 값) 받아오기
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const login = async ({ name, password }) => {
    setIsAuthLoading(true);

    try {
      const nextUser = await loginUser({ name, password });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      //값이 맞으면
      return {
        success: true,
      };
      //값이 틀리면
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "로그인 처리 중 문제가 발생했습니다.",
      };
    } finally {
      setIsAuthLoading(false);
      //값이 틀리든 문제가 생기면 안되게
    }
  };

  //회원가입 기능
  const signup = async ({ name, password, confirmPassword }) => {
    setIsAuthLoading(true);

    try {
      const nextUser = await registerUser({ name, password, confirmPassword });
      // 이름 , 비밀번호, 비밀번호 확인
      return {
        success: true,
        user: nextUser,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "회원가입 처리 중 문제가 발생했습니다.",
      };
    } finally {
      setIsAuthLoading(false);
    }
  }; // 아무튼 실행 안되게

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }; //로그아웃하면 키값 비우고 유저 이름 비우기

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      isAuthLoading,
      login,
      signup,
      logout,
    }),
    [isAuthLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }

  return context;
}
