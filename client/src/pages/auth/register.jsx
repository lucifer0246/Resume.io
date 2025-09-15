import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/userStore";
import authAPI from "../../API/API";
import LiveCheckInput from "../../components/auth/liveCheckInput";

function AuthRegister() {
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm();
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  const [usernameValid, setUsernameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [touchedUsername, setTouchedUsername] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const onSubmit = async (data) => {
    try {
      await authAPI.register(data.username, data.email, data.password);

      const me = await authAPI.checkAuth();
      setAuth({ user: me.data.user, token: null });

      toast.success("Registered successfully!", {
        duration: 2000,
        onClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
    space-y-4 max-w-md mx-auto 
    bg-[var(--card)]/60 backdrop-blur-lg
    text-[var(--card-foreground)]
    p-6 rounded-xl shadow-lg border border-[var(--border)]
  "
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
              active={!user}
              className="bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)]"
            />
          )}
        />
        {touchedUsername && !usernameValid && (
          <p className="text-red-500 text-sm mt-1">Username already exists</p>
        )}
      </div>

      {/* Email */}
      <div>
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
              }}
              checkType="register"
              setValid={setEmailValid}
              active={!user}
              className="bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)]"
            />
          )}
        />
        {touchedEmail && !emailValid && (
          <p className="text-red-500 text-sm mt-1">Email already exists</p>
        )}
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
              className="
                mt-1 w-full rounded-md border px-3 py-2 shadow-sm
                bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]
                placeholder-[var(--muted-foreground)]
                focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)]
              "
              style={{ color: "var(--foreground)" }}
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
            validate: (value) => value === password || "Passwords do not match",
          }}
          render={({ field }) => (
            <input
              type="password"
              placeholder="Confirm password"
              {...field}
              className={`
                mt-1 w-full rounded-md border px-3 py-2 shadow-sm
                bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]
                placeholder-[var(--muted-foreground)]
                focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)]
                ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-500"
                    : ""
                }
              `}
              style={{ color: "var(--foreground)" }}
            />
          )}
        />
        {confirmPassword && confirmPassword !== password && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}
      </div>

      <button
        type="submit"
        className="
          w-full rounded-md px-4 py-2 text-white font-medium
          bg-blue-600 hover:bg-blue-700 transition-colors
        "
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
  );
}

export default AuthRegister;
