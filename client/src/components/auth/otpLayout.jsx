import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { API } from "@/API/API"; // your axios instance

export function OTPVerification({ email, onSuccess }) {
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      const { data } = await API.post("/verify-account", { email, otp });
      toast.success(data.message);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={otp}
        onChange={(val) => setOtp(val)}
      >
        <InputOTPGroup>
          {[...Array(6)].map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button onClick={handleVerify} className="w-full">
        Verify OTP
      </Button>
    </div>
  );
}
