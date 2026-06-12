const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

// =====================
// OTP REQUEST
// =====================
export async function requestOtp(phone: string) {
  const res = await fetch(`${API_BASE}/auth/otp/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  return res.json();
}

// =====================
// OTP VERIFY
// =====================
export async function verifyOtp(phone: string, code: string) {
  const res = await fetch(`${API_BASE}/auth/otp/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, code }),
  });

  return res.json();
}

// =====================
// TOKEN HELPERS
// =====================
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearToken = () => {
  localStorage.removeItem("token");
};