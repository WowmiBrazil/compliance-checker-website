"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { ComplianceResponse } from "@/hooks/use-compliance-check";
import PositiveResults from "@/components/results/positive-results";
import NegativeResults from "@/components/results/negative-results";
import { format } from "date-fns";

function parseResultParam(value: string): ComplianceResponse | null {
  try {
    const firstParse = JSON.parse(value);
    if (typeof firstParse === "string") {
      return JSON.parse(firstParse) as ComplianceResponse;
    }
    return firstParse as ComplianceResponse;
  } catch {
    return null;
  }
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const script = searchParams.get("script") || "";
  const resultData = searchParams.get("result");
  const createdAt = searchParams.get("createdAt");

  if (!resultData) {
    router.push("/");
    return null;
  }

  const parsedResult = parseResultParam(resultData);
  if (!parsedResult) {
    router.push("/");
    return null;
  }
  const result: ComplianceResponse = parsedResult;
  const hasErrors = result?.errors.some(
    (category) => category.errors.length > 0
  );

  if (!result || !script) {
    return <div>Loading report...</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4 relative">
          <Button
            variant="ghost"
            className="absolute top-4 left-0"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="text-center space-y-1 flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Compliance Check Results
            </h1>
            <p className="text-md text-gray-600">
              The following results were generated from your script{" "}
              {(() => {
                const date = createdAt ? new Date(createdAt) : null;
                const isValid = date instanceof Date && !isNaN(date.getTime());
                return isValid
                  ? "on " + format(date, "MMM d, yyyy hh:mm a")
                  : "";
              })()}
              .
            </p>
          </div>
        </div>
        {hasErrors ? (
          <NegativeResults
            result={result}
            script={script}
            createdAt={createdAt || ""}
          />
        ) : (
          <PositiveResults
            result={result}
            script={script}
            createdAt={createdAt || ""}
          />
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
