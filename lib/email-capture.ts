// Email capture and lead management

export type LeadData = {
  email: string;
  name?: string;
  investmentAmount?: number;
  paymentMethod?: "stripe" | "crypto";
  status: "interested" | "payment-pending" | "payment-completed" | "nft-minted";
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type EmailCaptureResult = {
  success: boolean;
  leadId?: string;
  error?: string;
};

/**
 * Captures email and initial lead information
 * @param data Lead data to capture
 * @returns Result with lead ID
 */
export async function captureEmail(data: LeadData): Promise<EmailCaptureResult> {
  try {
    // Save to database via API
    const response = await fetch("/api/leads/capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to capture email");
    }

    const leadId = result.leadId;

    // Send welcome email automatically (DESACTIVADO TEMPORALMENTE)
    // TODO: Reactivar cuando se verifique el dominio en Resend
    /*
    try {
      await fetch("/api/leads/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
          type: "welcome",
        }),
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the whole operation if email fails
    }
    */
    // console.log('📧 Email notifications disabled (testing mode)')

    // Also send to email marketing service (Mailchimp, SendGrid, etc.)
    await addToEmailList({
      email: data.email,
      name: data.name,
      tags: ["nft-investor", `amount-${data.investmentAmount}`, data.status],
    });

    return {
      success: true,
      leadId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Updates lead status (e.g., when payment is completed)
 * @param leadId Lead ID to update
 * @param status New status
 */
export async function updateLeadStatus(
  leadId: string,
  status: LeadData["status"],
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/leads/${leadId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, metadata }),
    });

    if (!response.ok) {
      throw new Error("Failed to update lead status");
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
}

/**
 * Adds email to marketing list
 * @param data Email list data
 */
async function addToEmailList(data: {
  email: string;
  name?: string;
  tags?: string[];
}): Promise<void> {
  // TODO: Integrate with your email service provider
  // Examples:
  // - Mailchimp: https://mailchimp.com/developer/marketing/api/
  // - SendGrid: https://docs.sendgrid.com/api-reference/contacts/add-or-update-a-contact
  // - ConvertKit: https://developers.convertkit.com/

  try {
    await fetch("/api/email/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Failed to add to email list:", error);
    // Don't throw - email capture is more important than list addition
  }
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Stores lead data in localStorage for recovery
 */
export function saveLeadToLocalStorage(data: Partial<LeadData>): void {
  try {
    const existingData = localStorage.getItem("urbanika_lead");
    const parsedData = existingData ? JSON.parse(existingData) : {};

    localStorage.setItem(
      "urbanika_lead",
      JSON.stringify({
        ...parsedData,
        ...data,
        lastUpdated: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

/**
 * Retrieves lead data from localStorage
 */
export function getLeadFromLocalStorage(): Partial<LeadData> | null {
  try {
    const data = localStorage.getItem("urbanika_lead");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Clears lead data from localStorage
 */
export function clearLeadFromLocalStorage(): void {
  try {
    localStorage.removeItem("urbanika_lead");
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}
