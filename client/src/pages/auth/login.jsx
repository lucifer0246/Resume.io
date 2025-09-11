import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/userStore";
import authAPI from "../../API/API";
import LiveCheckInput from "../../components/auth/liveCheckInput";

function AuthLogin() {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  const [emailValid, setEmailValid] = useState(true);
  const [touched, setTouched] = useState(false); // becomes true after first typed character

  const onSubmit = async (data) => {
    try {
      // Login -> server sets cookie
      await authAPI.login(data.email, data.password);

      // Then fetch the authenticated user (avoids race)
      const me = await authAPI.checkAuth();
      setAuth({ user: me.data.user, token: null });

      toast.success("Logged in successfully!", {
        duration: 2000,
        onClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Email or password does not match!"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-4xl font-bold text-center mb-4">
        Login to Your Account
      </h2>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
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
                // only mark touched once the user types the first character
                if (!touched && e.target.value && e.target.value.length > 0)
                  setTouched(true);
              }}
              checkType="login"
              setValid={setEmailValid}
              active={!user}
            />
          )}
        />
        {/* Only show the message after user started typing */}
        {touched && !emailValid && (
          <p className="text-red-500 text-sm mt-1">User does not exist</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
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
              className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          )}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700"
      >
        Login
      </button>

      <p className="text-sm text-gray-600 mt-2 text-center">
        Don’t have an account?
        <Link to="/register" className="text-blue-600 hover:underline ml-1">
          Create one
        </Link>
      </p>
    </form>
  );
}

export default AuthLogin;
