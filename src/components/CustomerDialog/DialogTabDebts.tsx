import { FC, useState, useEffect, JSX } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Typography,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import {
  MdError,
  MdAccessTime,
  MdCheckCircle,
  MdCalendarToday,
  MdAttachMoney,
} from "react-icons/md";

import { getDebts } from "../../server/debtor";

interface DebtItem {
  contractId: string;
  contractCustomId: string;
  productName: string;
  customerId: string;
  paymentId: string;
  amount: number;
  dueDate: string | null;
  overdueDays: number;
  isPaid: boolean;
  status: string | null;
  rawPayment: any;
}

interface DebtResponse {
  success: boolean;
  data?:
    | { overdue: DebtItem[]; pending: DebtItem[]; normal: DebtItem[] }
    | DebtItem[];
}

interface DialogTabDebtsProps {
  customerId: string;
}

const DialogTabDebts: FC<DialogTabDebtsProps> = ({ customerId }) => {
  const [filter, setFilter] = useState<
    "all" | "overdue" | "pending" | "normal"
  >("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<{
    overdue: DebtItem[];
    pending: DebtItem[];
    normal: DebtItem[];
  }>({
    overdue: [],
    pending: [],
    normal: [],
  });

  // Fetch debts when customerId or filter changes
  useEffect(() => {
    let mounted = true;

    const fetchDebts = async () => {
      try {
        setLoading(true);
        setError("");

        const response: DebtResponse = await getDebts(customerId, filter);

        if (mounted) {
          if (response.success && response.data) {
            if (
              Array.isArray(response.data.overdue) ||
              Array.isArray(response.data.pending)
            ) {
              // Grouped format
              setData(
                response.data as {
                  overdue: DebtItem[];
                  pending: DebtItem[];
                  normal: DebtItem[];
                },
              );
            } else if (Array.isArray(response.data)) {
              // Single array format (single filter)
              setData({
                overdue: filter === "overdue" ? response.data : [],
                pending: filter === "pending" ? response.data : [],
                normal: filter === "normal" ? response.data : [],
              });
            }
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Qarzdorlarni yuklashda xatolik");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDebts();

    return () => {
      mounted = false;
    };
  }, [customerId, filter]);

  // Filter button handlers
  const handleFilterChange = (
    newFilter: "all" | "overdue" | "pending" | "normal",
  ) => {
    setFilter(newFilter);
  };

  // Render single debt card
  const DebtCard: FC<{ debt: DebtItem }> = ({ debt }) => (
    <Card
      sx={{
        mb: 1.5,
        borderLeft: `4px solid ${
          debt.overdueDays > 0 ? "#d32f2f"
          : debt.status === "PENDING" ? "#f57c00"
          : "#388e3c"
        }`,
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      }}>
      <CardContent sx={{ pb: 1.5 }}>
        <Stack spacing={1.5}>
          {/* Header: Product & Amount */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {debt.productName}
            </Typography>
            <Chip
              icon={<MdAttachMoney />}
              label={`$${debt.amount.toFixed(2)}`}
              size="small"
              color={debt.overdueDays > 0 ? "error" : "success"}
              variant="outlined"
            />
          </Box>

          {/* Due Date & Overdue Info */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              fontSize: "0.875rem",
            }}>
            {debt.dueDate && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <MdCalendarToday size={16} color="#666" />
                  <Typography variant="caption">
                    {new Date(debt.dueDate).toLocaleDateString("uz-UZ")}
                  </Typography>
                </Box>
              </>
            )}

            {debt.overdueDays > 0 && (
              <Chip
                icon={<MdError />}
                label={`${debt.overdueDays} kun kechikkan`}
                size="small"
                color="error"
                variant="filled"
              />
            )}

            {debt.status === "PENDING" && (
              <Chip
                icon={<MdAccessTime />}
                label="Tasdiqlash kutilmoqda"
                size="small"
                color="warning"
                variant="filled"
              />
            )}

            {debt.isPaid && (
              <Chip
                icon={<MdCheckCircle />}
                label="To'langan"
                size="small"
                color="success"
                variant="filled"
              />
            )}
          </Box>

          {/* Contract ID */}
          <Typography variant="caption" sx={{ color: "#999" }}>
            Shartnoma: {debt.contractCustomId}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  // Render section (category)
  const Section: FC<{
    title: string;
    icon: JSX.Element;
    items: DebtItem[];
    color: string;
  }> = ({ title, icon, items, color }) => {
    if (items.length === 0) return null;

    return (
      <Box sx={{ mb: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
            pb: 1,
            borderBottom: `2px solid ${color}`,
          }}>
          <Box sx={{ color, fontSize: "1.5rem" }}>{icon}</Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color }}>
            {title} ({items.length})
          </Typography>
        </Box>

        {items.map((debt, idx) => (
          <DebtCard key={idx} debt={debt} />
        ))}
      </Box>
    );
  };

  // Calculate totals
  const allDebts = [...data.overdue, ...data.pending, ...data.normal];
  const totalAmount = allDebts.reduce((sum, d) => sum + d.amount, 0);
  const totalOverdue = data.overdue.reduce((sum, d) => sum + d.amount, 0);
  const totalPending = data.pending.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Box sx={{ p: 2, width: "100%", maxWidth: "100%" }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}>
            <CardContent sx={{ textAlign: "center", py: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.8)" }}>
                Jami Qarzdorlik
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: "bold", mt: 0.5 }}>
                ${totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}>
            <CardContent sx={{ textAlign: "center", py: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.8)" }}>
                Kechikkan
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: "bold", mt: 0.5 }}>
                ${totalOverdue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            }}>
            <CardContent sx={{ textAlign: "center", py: 1.5 }}>
              <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.7)" }}>
                Tasdiqlash Kutilmoqda
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "black", fontWeight: "bold", mt: 0.5 }}>
                ${totalPending.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2 }} />

      {/* Filter Buttons */}
      <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
        <Button
          variant={filter === "all" ? "contained" : "outlined"}
          size="small"
          onClick={() => handleFilterChange("all")}
          sx={{ textTransform: "none", borderRadius: 2 }}>
          Hammasini Ko'rsat ({allDebts.length})
        </Button>

        <Button
          variant={filter === "overdue" ? "contained" : "outlined"}
          color="error"
          size="small"
          onClick={() => handleFilterChange("overdue")}
          sx={{ textTransform: "none", borderRadius: 2 }}>
          Kechikkan ({data.overdue.length})
        </Button>

        <Button
          variant={filter === "pending" ? "contained" : "outlined"}
          color="warning"
          size="small"
          onClick={() => handleFilterChange("pending")}
          sx={{ textTransform: "none", borderRadius: 2 }}>
          Tasdiqlash Kutilmoqda ({data.pending.length})
        </Button>

        <Button
          variant={filter === "normal" ? "contained" : "outlined"}
          color="success"
          size="small"
          onClick={() => handleFilterChange("normal")}
          sx={{ textTransform: "none", borderRadius: 2 }}>
          Boshlang'ich ({data.normal.length})
        </Button>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Content */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && allDebts.length === 0 && (
        <Alert severity="info">Qarzdorlik topilmadi</Alert>
      )}

      {!loading && allDebts.length > 0 && (
        <>
          <Section
            title="🔴 Kechikkan To'lovlar"
            icon={<MdError />}
            items={data.overdue}
            color="#d32f2f"
          />

          <Section
            title="🟡 Tasdiqlash Kutilmoqda"
            icon={<MdAccessTime />}
            items={data.pending}
            color="#f57c00"
          />

          <Section
            title="🟢 Boshlang'ich Qarzdorliklar"
            icon={<MdCheckCircle />}
            items={data.normal}
            color="#388e3c"
          />
        </>
      )}
    </Box>
  );
};

export default DialogTabDebts;
