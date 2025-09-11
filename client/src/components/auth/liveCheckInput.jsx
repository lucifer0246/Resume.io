import { useEffect } from "react";
import authAPI from "../../API/API";

export default function LiveCheckInput({
  type = "text",
  placeholder,
  value,
  onChange,
  checkType = "register",
  setValid,
  active = true,
}) {
  useEffect(() => {
    if (!active || !value || value.trim() === "") {
      setValid && setValid(true); // empty input considered valid
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await authAPI.checkUserExists(value);
        if (checkType === "register") setValid(!res.data.exists);
        else setValid(res.data.exists);
      } catch (err) {
        console.error("LiveCheckInput error:", err);
        setValid && setValid(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value, checkType, setValid, active]);

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black border-gray-300"
    />
  );
}
