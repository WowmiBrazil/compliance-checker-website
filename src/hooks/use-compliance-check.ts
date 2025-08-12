import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/query-keys"
import { useMutation } from "@tanstack/react-query"

interface ComplianceError {
    title: string
    errors: string[]
}

export interface ComplianceResponse {
    errors: ComplianceError[]
}

interface ComplianceRequest {
    script: string
}

const checkCompliance = async ({ script }: ComplianceRequest): Promise<ComplianceResponse> => {
    const formData = new FormData()
    formData.append("transcription", script)

    return await api.post("compliance/test-compliance", { body: formData }).json()
}

export const useComplianceCheck = () => {
    return useMutation({
        mutationFn: checkCompliance,
    });
};
