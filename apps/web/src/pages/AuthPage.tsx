import { useState } from "react";
import { requestOtp, verifyOtp, setToken } from "../api/auth";

export default function AuthPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const phoneRegex = /^\+?[0-9]{10,15}$/;

  // =====================
  // SEND OTP
  // =====================
  const handleSendOtp = async () => {
    setError("");

    if (!phoneRegex.test(phone)) {
      setError("Enter valid phone number (10 digits)");
      return;
    }

    setLoading(true);

    try {
      const res = await requestOtp(phone);

      if (res?.message === "OTP sent") {
        setStep("otp");
      } else {
        setError(res?.message || "Failed to send OTP");
      }
    } catch {
      setError("Server error while sending OTP");
    }

    setLoading(false);
  };

  // =====================
  // VERIFY OTP
  // =====================
  const handleVerifyOtp = async () => {
    setError("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOtp(phone, otp);

      if (res?.accessToken) {
        setToken(res.accessToken);
        window.location.href = "/";
      } else {
        setError(res?.message || "Invalid OTP");
      }
    } catch {
      setError("Server error while verifying OTP");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl shadow-lg">

        <h1 className="text-xl font-bold text-white text-center">
          OTP Authentication
        </h1>

        <p className="text-slate-400 text-sm text-center mt-1">
          Sign in using your phone number
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">
            {error}
          </p>
        )}

        {/* ===================== */}
        {/* STEP 1: PHONE INPUT */}
        {/* ===================== */}
        {step === "phone" && (
          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-3 rounded bg-slate-800 text-white outline-none"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* ===================== */}
        {/* STEP 2: OTP INPUT */}
        {/* ===================== */}
        {step === "otp" && (
          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 rounded bg-slate-800 text-white outline-none"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="w-full text-sm text-slate-400 hover:text-white"
            >
              Change phone number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}