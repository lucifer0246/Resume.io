import { useState, useEffect } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import authAPI from "@/API/API";

export function OTPVerification({ email, onSuccess, onClose }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 min
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return toast.error("Please enter the 6-digit OTP");

    try {
      const { data } = await authAPI.verifyOtp(email, otp);
      toast.success(data.message);
      if (onSuccess) onSuccess();
      if (onClose) onClose(); // auto-close
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { data } = await authAPI.resendOtp(email);
      toast.success(data.message || "OTP resent successfully");
      setTimeLeft(300);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 text-[var(--foreground)]">
      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Enter the 6-digit OTP sent to{" "}
        <span className="font-medium text-[var(--foreground)]">{email}</span>
      </p>

      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={otp}
        onChange={setOtp}
      >
        <InputOTPGroup className="gap-2">
          {[...Array(6)].map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="w-12 h-12 border rounded-lg text-center text-lg font-semibold bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--ring)]"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button
        onClick={handleVerify}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium py-2 rounded-lg shadow-md transition-colors"
      >
        Verify OTP
      </Button>

      <div className="flex flex-col items-center gap-2 mt-2 w-full">
        <span className="text-sm text-[var(--muted-foreground)]">
          OTP expires in {formatTime(timeLeft)}
        </span>
        <Button
          onClick={handleResend}
          disabled={resending}
          variant="outline"
          size="sm"
          className="w-full border-[var(--border)] hover:bg-[var(--input-hover)] text-[var(--foreground)]"
        >
          {resending ? "Resending..." : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}
