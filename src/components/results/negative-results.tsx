"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComplianceResponse } from "@/hooks/use-compliance-check";
import { generatePDF } from "@/lib/pdf-generator";

interface NegativeResultsProps {
  result: ComplianceResponse;
  script: string;
  createdAt: string;
}

export default function NegativeResults({
  result,
  script,
  createdAt,
}: NegativeResultsProps) {
  const totalErrors =
    result?.errors.reduce((sum, category) => sum + category.errors.length, 0) ||
    0;
  const categoriesWithErrors = result.errors.filter(
    (cat) => cat.errors.length > 0
  );
  const downloadPDF = () => generatePDF(result, script, createdAt);

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="size-6 text-red-500" />
              <div>
                <h3 className="text-xl font-semibold text-black">
                  Compliance Issues Found
                </h3>
                <p className="text-gray-800">
                  {totalErrors} issue{totalErrors !== 1 ? "s" : ""} detected
                  across {categoriesWithErrors.length} categor
                  {categoriesWithErrors.length !== 1 ? "ies" : "y"}
                </p>
              </div>
            </div>
            <Button
              onClick={downloadPDF}
              variant="default"
              className="text-white"
            >
              <Download className="size-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>
            Review the following issues found in your script
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.errors.map(
            (category, index) =>
              category.errors.length > 0 && (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">{category.title}</Badge>
                    <span className="text-sm text-gray-500">
                      {category.errors.length} issue
                      {category.errors.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {category.errors.map((error, errorIndex) => (
                      <Alert key={errorIndex} variant="default">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                  {index < categoriesWithErrors.length - 1 && <Separator />}
                </div>
              )
          )}
        </CardContent>
      </Card>
    </>
  );
}
