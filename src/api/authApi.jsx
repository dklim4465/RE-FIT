export async function loginUser({ name, password }) {
  const trimmedName = name.trim();
  const trimmedPassword = password.trim();

  if (!trimmedName || !trimmedPassword) {
    throw new Error("이름과 비밀번호를 모두 입력해주세요.");
  }

  return {
    name: trimmedName,
  };
}
