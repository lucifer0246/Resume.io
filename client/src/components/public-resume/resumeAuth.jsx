// src/components/AuthCheckerRoute.jsx
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { resumeAPI } from "../../API/API";

export default function AuthCheckerRoute() {
  const { username, slug } = useParams();
  const [isValid, setIsValid] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    const verifySlug = async () => {
      try {
        const res = await resumeAPI.checkResumeSlug(username, slug);
        console.log(username, slug, res.data);
        if (res.data?.exists) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      }
    };
    verifySlug();
  }, [username, slug]);

  if (isValid === null) {
    return <p className="text-center mt-10">Checking link...</p>;
  }

  if (!isValid) {
    return <Navigate to="/404" replace />; // redirect to 404 page
  }

  return <Outlet />; // continue to child route if valid
}
