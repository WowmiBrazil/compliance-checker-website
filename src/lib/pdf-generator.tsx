/* eslint-disable jsx-a11y/alt-text */
import type React from "react";
import { Document, Page, Text, View, pdf, Image } from "@react-pdf/renderer";
import { ComplianceResponse } from "@/hooks/use-compliance-check";
import { format } from "date-fns";

export const ComplianceReportPDF: React.FC<{
  result: ComplianceResponse;
  originalScript: string;
  generatedAt: string;
}> = ({ result, originalScript, generatedAt }) => {
  const hasErrors = result.errors.some(
    (category) => category.errors.length > 0
  );
  // const totalErrors = result.errors.reduce(
  //   (sum, category) => sum + category.errors.length,
  //   0
  // );

  return (
    <Document>
      <Page
        size="A4"
        style={{
          flexDirection: "column",
          backgroundColor: "#ffffff",
          padding: 30,
          fontFamily: "Helvetica",
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 30,
            paddingBottom: 20,
            borderBottomWidth: 2,
            borderBottomColor: "#e5e7eb",
            position: "relative",
          }}
        >
          <Image
            src="/logos/color-logo.png"
            style={{
              width: 60,
              height: 30,
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "contain",
            }}
          />
          <View
            style={{
              textAlign: "center",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#1f2937",
                // marginBottom: 10,
                textAlign: "center",
              }}
            >
              Video Script Compliance Report
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#6b7280",
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              Generated on {generatedAt}
            </Text>
          </View>
        </View>
        {!hasErrors && (
          <View
            style={{
              padding: 10,
              marginBottom: 25,
              borderRadius: 4,
              borderWidth: 1,
              backgroundColor: "#f0fdf4",
              borderColor: "#bbf7d0",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#16a34a",
              }}
            >
              {!hasErrors && "Compliance Check Passed"}
            </Text>
            <Text style={{ fontSize: 10, lineHeight: 1.5, color: "#5d5d5d" }}>
              {!hasErrors &&
                "No compliance issues were detected in the provided script."}
            </Text>
          </View>
        )}
        <View style={{ marginBottom: 15 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: 15,
            }}
          >
            Original Script
          </Text>
          <View
            style={{
              backgroundColor: "#f9fafb",
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Courier",
                lineHeight: 1.4,
                color: "#374151",
              }}
            >
              {originalScript}
            </Text>
          </View>
        </View>
        {hasErrors && (
          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: 15,
              }}
            >
              Compliance Issues
            </Text>
            {result.errors.map((category, categoryIndex) =>
              category.errors.length > 0 ? (
                <View
                  key={categoryIndex}
                  style={{
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: "#262A82",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#262A82",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#262A82",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {category.title} ({category.errors.length} issue
                      {category.errors.length !== 1 ? "s" : ""})
                    </Text>
                  </View>
                  {category.errors.map((error, errorIndex) => (
                    <View
                      key={errorIndex}
                      style={{
                        padding: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#262A82",
                        ...(errorIndex === category.errors.length - 1
                          ? { borderBottomWidth: 0 }
                          : {}),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          lineHeight: 1.4,
                          color: "#4d4d4d",
                        }}
                      >
                        {error}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null
            )}
          </View>
        )}
        <View
          style={{
            marginTop: 30,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 8, color: "#6b7280" }}>
            Video Script Compliance Checker Report
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const generatePDF = async (
  result: ComplianceResponse,
  originalScript: string,
  createdAt: string
) => {
  try {
    const generatedAtDisplay = format(createdAt, "MMM d, yyyy hh:mm:ss a");
    const generatedAtFile = format(createdAt, "MMM-d-yyyy-hh-mm-ss-a");

    const blob = await pdf(
      <ComplianceReportPDF
        result={result}
        originalScript={originalScript}
        generatedAt={generatedAtDisplay}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compliance-report-${generatedAtFile}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};
