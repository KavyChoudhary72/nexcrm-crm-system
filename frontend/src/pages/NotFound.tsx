import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/Button";
import { ArrowLeft, Compass } from "lucide-react";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/5 animate-bounce">
        <Compass className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">404</h2>
        <h3 className="text-base font-bold text-gray-800 dark:text-slate-205">Page Not Found</h3>
        <p className="text-xs text-gray-400 leading-relaxed font-semibold">
          The pipeline stage, setting directory, or resource you are looking for has either been archived or moved.
        </p>
      </div>

      <Button
        onClick={() => navigate("/dashboard")}
        className="rounded-xl flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Button>
    </div>
  );
};
