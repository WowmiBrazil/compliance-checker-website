"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download } from "lucide-react";
import { ComplianceResponse } from "@/hooks/use-compliance-check";
import { generatePDF } from "@/lib/pdf-generator";

interface PositiveResultsProps {
  result: ComplianceResponse;
  script: string;
  createdAt: string;
}

export default function PositiveResults({
  result,
  script,
  createdAt,
}: PositiveResultsProps) {
  const downloadPDF = () => generatePDF(result, script, createdAt);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-xl font-semibold text-green-700">
                Compliance Check Passed
              </h3>
              <p className="text-green-600">
                No compliance issues detected in your script
              </p>
            </div>
          </div>
          <Button onClick={downloadPDF} variant="default">
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
