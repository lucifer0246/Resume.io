// src/pages/auth/AuthRegister.jsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import authAPI from "../../API/API";
import LiveCheckInput from "../../components/auth/liveCheckInput";
import { OTPVerification } from "../../components/auth/otpLayout";

function AuthRegister() {
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm();

  const [usernameValid, setUsernameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [touchedUsername, setTouchedUsername] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const email = watch("email", "");

  const canSubmit = isVerified && email === emailForOtp;

  const onSubmit = async (data) => {
    if (!canSubmit) {
      toast.error("Please verify your email first!");
      return;
    }
    try {
      await authAPI.register(data.username, data.email, data.password);
      toast.success("Registered successfully!"); // just show toast
      navigate("/dashboard"); // navigate immediately
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed!");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto bg-[var(--card)]/60 backdrop-blur-lg text-[var(--card-foreground)] p-6 rounded-xl shadow-lg border border-[var(--border)]"
      >
        <h2 className="text-4xl font-bold text-center mb-4">
          Create Your Account
        </h2>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: "Username is required" }}
            render={({ field }) => (
              <LiveCheckInput
                type="text"
                placeholder="Enter username"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  if (!touchedUsername) setTouchedUsername(true);
                }}
                checkType="register"
                setValid={setUsernameValid}
                active={true}
                className="bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)]"
              />
            )}
          />
          {touchedUsername && !usernameValid && (
            <p className="text-red-500 text-sm mt-1">Username already exists</p>
          )}
        </div>

        {/* Email + clickable text */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Email</label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <LiveCheckInput
                  type="email"
                  placeholder="Enter email"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!touchedEmail) setTouchedEmail(true);
                    setIsVerified(false); // reset verification if email changes
                  }}
                  checkType="register"
                  setValid={setEmailValid}
                  active={true}
                  className="w-full bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)]"
                />
              )}
            />
            {touchedEmail && !emailValid && (
              <p className="text-red-500 text-sm mt-1">Email already exists</p>
            )}
          </div>

          {/* Clickable OTP text */}
          <span
            onClick={async () => {
              if (!email) return toast.error("Enter email first!");
              setEmailForOtp(email);

              try {
                // Call backend to send OTP
                const { data } = await authAPI.sendOtp(email);
                toast.success(data.message || "OTP sent successfully");
                setShowOtpModal(true); // then open modal
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Failed to send OTP"
                );
              }
            }}
            className={`text-sm font-medium cursor-pointer self-end pb-[10px] ${
              isVerified && email === emailForOtp
                ? "text-green-500 cursor-default"
                : "text-blue-600 hover:underline"
            }`}
          >
            {isVerified && email === emailForOtp ? "Verified" : "Get Verified"}
          </span>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <input
                type="password"
                placeholder="Enter password"
                {...field}
                className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm bg-[var(--input)] text-[var(--foreground)] border-[var(--border)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)]"
              />
            )}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <input
                type="password"
                placeholder="Confirm password"
                {...field}
                className={`mt-1 w-full rounded-md border px-3 py-2 shadow-sm bg-[var(--input)] text-[var(--foreground)] border-[var(--border)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)] ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-500"
                    : ""
                }`}
              />
            )}
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          onClick={(e) => {
            if (!canSubmit) {
              e.preventDefault(); // prevent form submission
              toast.error("Please verify your email first!");
            }
          }}
          className={`w-full rounded-md px-4 py-2 text-white font-medium ${
            canSubmit
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-[var(--primary)] hover:bg-[var(--destructive)] cursor-not-allowed"
          } transition-colors`}
        >
          Register
        </button>

        <p className="text-sm mt-2 text-center">
          Already have an account?
          <Link to="/login" className="text-blue-600 hover:underline ml-1">
            Login
          </Link>
        </p>
      </form>

      {/* OTP Modal */}
      {showOtpModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowOtpModal(false)} // click outside closes
        >
          <div
            className="bg-[var(--card)] text-[var(--card-foreground)] p-6 rounded-xl w-[400px] shadow-lg backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()} // prevent inner click close
          >
            <h3 className="text-xl font-bold mb-4 text-center">Verify Email</h3>
            <OTPVerification
              email={emailForOtp}
              onSuccess={() => setIsVerified(true)}
              onClose={() => setShowOtpModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default AuthRegister;
