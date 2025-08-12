"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useComplianceCheck } from "@/hooks/use-compliance-check";
import Image from "next/image";
import { LoadingLottie } from "@/components/loading-lottie";

export default function ScriptInputPage() {
  const [script, setScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const complianceCheck = useComplianceCheck();

  const handleSubmit = async () => {
    if (!script.trim()) {
      return;
    }
    setIsLoading(true);

    complianceCheck.mutate(
      { script },
      {
        onSuccess: (data) => {
          const params = new URLSearchParams({
            script: script,
            result: JSON.stringify(data),
            createdAt: new Date().toISOString(),
          });
          router.push(`/results?${params.toString()}`);
        },
      }
    );
  };

  if (complianceCheck.isPending || isLoading) {
    return <LoadingLottie />;
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto space-y-6 w-full">
        <div className="text-center space-y-2 flex flex-col items-center justify-center">
          <Image
            src="/logos/color-logo.png"
            alt="Compliance Checker"
            width={200}
            height={200}
          />
          <h1 className="text-2xl font-semibold">
            Video Script Compliance Checker
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Script Input</CardTitle>
            <CardDescription>
              Enter your video script below to check for compliance issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your video script here..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <Button
              onClick={handleSubmit}
              disabled={complianceCheck.isPending || !script.trim()}
              className="w-full"
            >
              {complianceCheck.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Compliance...
                </>
              ) : (
                "Check Compliance"
              )}
            </Button>
          </CardContent>
        </Card>

        {complianceCheck.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {complianceCheck.error instanceof Error
                ? complianceCheck.error.message
                : "An error occurred while checking compliance"}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
