import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAuthStore from "../../store/userStore";
import authAPI from "../../API/API";
import LiveCheckInput from "../../components/auth/liveCheckInput";

function AuthLogin() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  const [emailValid, setEmailValid] = useState(true);
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await authAPI.login(data.email, data.password);
      const me = await authAPI.checkAuth();
      setAuth({ user: me.data.user, token: null });

      toast.success("Logged in successfully!", { duration: 2000 });

      // Navigate immediately after login
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Email or password does not match!"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md w-full 
                 bg-[var(--card)] text-[var(--card-foreground)] 
                 p-8 rounded-xl shadow-lg border border-[var(--border)]"
    >
      <h2 className="text-3xl font-bold text-center">Login to Your Account</h2>

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
                if (!touched && e.target.value?.length > 0) setTouched(true);
              }}
              checkType="login"
              setValid={setEmailValid}
              active={!user}
              className="bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)]"
            />
          )}
        />
        {touched && !emailValid && (
          <p className="text-red-500 text-sm mt-1">User does not exist</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...field}
                className="
                  mt-1 w-full rounded-md border px-3 py-2 shadow-sm
                  placeholder-[var(--muted-foreground)]
                  bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)]
                "
              />
            )}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="
          w-full rounded-md px-4 py-2 text-white font-medium
          bg-[var(--primary)] hover:bg-blue-700 transition-colors
        "
      >
        Login
      </button>

      {/* Footer */}
      <p className="text-sm mt-4 text-center">
        Don’t have an account?
        <Link to="/register" className="text-blue-600 hover:underline ml-1">
          Create one
        </Link>
      </p>
    </form>
  );
}

export default AuthLogin;
