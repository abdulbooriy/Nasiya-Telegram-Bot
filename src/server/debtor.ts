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

/**
 * ✅ YANGI: Barcha qarzdorlarni olish (tasdiqlangan, kechikkan, kutilmoqda)
 * @param filterDate - Sana filtri (optional)
 * @returns { status: "success", data: IDebtorContract[] }
 */
export async function getAllDebtors(filterDate?: string) {
  try {
    const url =
      filterDate ?
        `/customer/get-all-debtors?date=${filterDate}`
      : "/customer/get-all-debtors";

    const response = await authApi.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all debtors:", error);
    throw new Error(
      error.response?.data?.message || "Barcha qarzdorlarni yuklashda xatolik",
    );
  }
}
