import React from "react";
import { Download } from "lucide-react";
import { Button } from "../UI/Button";
import { useExport } from "../../hooks/useExport";

export const ExportButton: React.FC = () => {
  const { exportCSV, exporting } = useExport();

  return (
    <div className="flex gap-2 shrink-0">
      <Button
        variant="outline"
        size="sm"
        disabled={exporting}
        loading={exporting}
        onClick={exportCSV}
        className="gap-1.5"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Export CSV</span>
      </Button>
    </div>
  );
};
