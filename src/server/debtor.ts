import authApi from "./auth";

/**
 * Mijoz bo'yicha qarzdorlarni olish
 * @param customerId - Mijoz ID
 * @param filter - "all" | "overdue" | "pending" | "normal"
 * @returns { success: true, data: { overdue: [...], pending: [...], normal: [...] } }
 */
export async function getDebts(customerId: string, filter = "all") {
  try {
    const response = await authApi.get(
      `/debts/customer/${customerId}?filter=${filter}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching debts:", error);
    throw new Error(
      error.response?.data?.message || "Qarzdorlarni yuklashda xatolik",
    );
  }
}
