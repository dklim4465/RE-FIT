const USERS_STORAGE_KEY = "refit_users";

//회원 가입 로직
function readUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];

    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export async function registerUser({ name, password, confirmPassword }) {
  const trimmedName = name.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();
  const users = readUsers();

  if (!trimmedName || !trimmedPassword || !trimmedConfirmPassword) {
    throw new Error("이름과 비밀번호를 모두 입력해주세요.");
  }

  if (trimmedName.length < 2) {
    throw new Error("이름은 2글자 이상 입력해주세요.");
  }

  if (trimmedPassword.length < 4) {
    throw new Error("비밀번호는 4글자 이상 입력해주세요.");
  }

  if (trimmedPassword !== trimmedConfirmPassword) {
    throw new Error("비밀번호 확인이 일치하지 않습니다.");
  }

  const isDuplicateUser = users.some((user) => user.name === trimmedName);

  if (isDuplicateUser) {
    throw new Error("이미 사용 중인 이름입니다.");
  }

  const nextUser = {
    id: Date.now().toString(),
    name: trimmedName,
    password: trimmedPassword,
    createdAt: new Date().toLocaleString("ko-KR"),
  };

  writeUsers([...users, nextUser]);

  return sanitizeUser(nextUser);
}

export async function loginUser({ name, password }) {
  const trimmedName = name.trim();
  const trimmedPassword = password.trim();
  const users = readUsers();

  if (!trimmedName || !trimmedPassword) {
    throw new Error("이름과 비밀번호를 모두 입력해주세요.");
  }

  const matchedUser = users.find(
    (user) => user.name === trimmedName && user.password === trimmedPassword
  );

  if (!matchedUser) {
    throw new Error("이름 또는 비밀번호가 올바르지 않습니다.");
  }

  return sanitizeUser(matchedUser);
}
