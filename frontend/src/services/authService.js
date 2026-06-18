import api from "./api";

export const register = (name, email, password, role = "member") => {
  return api.post("/register/", { name, email, password, role });
};

export const login = async (email, password) => {
  const res = await api.post("/login/", { email, password });
  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data.user;
};

export const logout = async () => {
  const refresh = localStorage.getItem("refresh_token");
  try {
    await api.post("/logout/", { refresh });
  } finally {
    localStorage.clear();
    window.location.href = "/login";
  }
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("access_token");
};
