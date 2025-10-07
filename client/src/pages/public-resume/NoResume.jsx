import React from "react";
import { Link } from "react-router-dom";
import FuzzyText from "../../components/ui/FuzzyText";

const NoResumeFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-black px-4">
      {/* 404 Text with Fuzzy Animation */}
      <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={0.5}
        enableHover={true}
        fontSize="clamp(4rem, 15vw, 12rem)"
        fontWeight={900}
        color="black"
      >
        404
      </FuzzyText>

      {/* Headline */}
      <h1 className="text-3xl md:text-5xl font-semibold mt-6 text-center">
        Oops! Page Not Found
      </h1>

      {/* Description */}
      <p className="text-center text-gray-400 mt-4 max-w-md">
        The page you are looking for does not exist, may have been removed, or
        the URL is incorrect.
      </p>
    </div>
  );
};

export default NoResumeFound;
