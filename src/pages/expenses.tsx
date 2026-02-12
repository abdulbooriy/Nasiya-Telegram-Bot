import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Avatar,
} from "@mui/material";
import { Plus, DollarSign, Banknote, TrendingUp, User } from "lucide-react";
import { borderRadius, shadows } from "../theme/colors";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { IExpenses } from "../types/IExpenses";
import {
  getActiveExpenses,
  getInActiveExpenses,
} from "../store/actions/expensesActions";
import { openExpensesModal } from "../store/slices/expensesSlice";
import ExpensesTab from "../sestions/Expenses/ExpensesTab";
import ActionExpenses from "../sestions/Expenses/action/action-expenses";
import ExpensesDialog from "../sestions/Expenses/ExpensesDialog";
import ExpensesInfo from "../sestions/Expenses/ExpensesInfo";
import DashboardCardImproved from "../components/DashboardCard/DashboardCardImproved";
import { getDashboard } from "../store/actions/dashboardActions";
import { responsive } from "../theme/responsive";

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

export default function ExpensesView({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { activeExpenses, inActiveExpenses } = useSelector(
    (state: RootState) => state.expenses,
  );
  // ====================== Dashboard ======================
  const { dashboard } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState<IExpenses | null>(null);

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getDashboard());
    }
  }, [activeTabIndex, index]);

  const balanceDollar = dashboard?.balance?.dollar ?? 0;
  const balanceSum = dashboard?.balance?.sum ?? 0;

  const getDisplayName = (fullName: string) => {
    if (fullName.length > 20) {
      const parts = fullName.split(" ");
      if (parts.length > 1) {
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
      }
    }
    return fullName;
  };

  const handleOpenDrawer = (expenses: IExpenses) => {
    setDrawerOpen(expenses);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(null);
  };

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getActiveExpenses());
      dispatch(getInActiveExpenses());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabIndex, index]);
  const totalUSD = activeExpenses?.reduce((acc, exp) => {
    return acc + exp.currencyDetails.dollar;
  }, 0);

  const totalUZS = activeExpenses?.reduce((acc, exp) => {
    return acc + exp.currencyDetails.sum;
  }, 0);
  return (
    <Box
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* User Greeting - Responsive */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          gap: responsive.spacing.gap,
          p: responsive.spacing.card,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Avatar
          sx={{
            width: responsive.avatar.large,
            height: responsive.avatar.large,
            bgcolor: "primary.main",
            fontSize: responsive.typography.h6,
            fontWeight: 700,
          }}
        >
          <User size={responsive.icon.medium.xs} />
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="text.primary"
            sx={{
              fontSize: responsive.typography.h6,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {getDisplayName(
              `${user?.firstname} ${user?.lastname}`.trim() || "Foydalanuvchi",
            )}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: responsive.typography.body2,
              mt: 0.5,
            }}
          >
            Xush kelibsiz!
          </Typography>
        </Box>
      </Box>
      
      {/* option 2 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // mobile (Telegram)
            sm: "repeat(1, 1fr)", // tablet
            md: "repeat(1, 1fr)", // desktop
          },
          gap: { xs: 1.5, sm: 2 },
          mb: 3,
        }}
      >
        {/* BALANCE – main card */}
        <DashboardCardImproved
          title="Mening balansim"
          total={`${balanceDollar} $`}
          subtitle={`${balanceSum.toLocaleString()} so‘m`}
          icon={<TrendingUp size={22} />}
          color="success"
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(2, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          {/* USD */}
          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: borderRadius.lg,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              boxShadow: shadows.colored("rgba(37, 99, 235, 0.18)"),
            }}
          >
            <Stack spacing={0.5}>
              <Stack direction="row" alignItems="center" gap={1}>
                <DollarSign size={20} />
                <Typography fontSize={12} sx={{ opacity: 0.85 }}>
                  Dollar
                </Typography>
              </Stack>

              <Typography
                fontSize={{ xs: 22, sm: 24 }}
                fontWeight={800}
                lineHeight={1.2}
              >
                {totalUSD?.toLocaleString()} $
              </Typography>
            </Stack>
          </Paper>

          {/* UZS */}
          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: borderRadius.lg,
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              color: "white",
              boxShadow: shadows.colored("rgba(14, 165, 233, 0.18)"),
            }}
          >
            <Stack spacing={0.5}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Banknote size={20} />
                <Typography fontSize={12} sx={{ opacity: 0.85 }}>
                  So‘m
                </Typography>
              </Stack>

              <Typography
                fontSize={{ xs: 22, sm: 24 }}
                fontWeight={800}
                lineHeight={1.2}
              >
                {totalUZS?.toLocaleString()}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => {
            dispatch(openExpensesModal({ type: "add", data: undefined }));
          }}
          sx={{
            ml: "auto",
            py: 1.5,
            px: 3,
            borderRadius: borderRadius.md,
            fontWeight: 700,
            background: "#10b981",
            boxShadow: shadows.colored("rgba(16, 185, 129, 0.15)"),
            "&:hover": {
              background: "#059669",
            },
          }}
        >
          Qo'shish
        </Button>
      </Box>
      <ExpensesTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box>
        {activeTab === 0 && (
          <List sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {activeExpenses?.map((expenses) => (
              <ListItem
                key={expenses.id}
                component={Paper}
                sx={{
                  cursor: "pointer",
                  borderRadius: borderRadius.md,
                  boxShadow: shadows.sm,
                  bgcolor: "background.paper",
                  mb: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: shadows.md,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleOpenDrawer(expenses)}
                secondaryAction={<ActionExpenses expenses={expenses} />}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" gap={5}>
                      {expenses.currencyDetails.dollar > 0 && (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {`${expenses.currencyDetails.dollar.toLocaleString()}$`}
                        </Typography>
                      )}
                      {expenses.currencyDetails.sum > 0 && (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {`${expenses.currencyDetails.sum.toLocaleString()} so‘m`}
                        </Typography>
                      )}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="subtitle1" color="text.secondary">
                      {expenses.notes}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        {activeTab === 1 && (
          <List sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {inActiveExpenses?.map((expenses) => (
              <ListItem
                key={expenses.id}
                component={Paper}
                sx={{
                  cursor: "pointer",
                  borderRadius: borderRadius.md,
                  boxShadow: shadows.sm,
                  bgcolor: "rgba(102, 126, 234, 0.05)",
                  mb: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: shadows.md,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleOpenDrawer(expenses)}
                // secondaryAction={<ActionExpenses expenses={expenses} />}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" gap={5}>
                      {expenses.currencyDetails.dollar > 0 && (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {`${expenses.currencyDetails.dollar.toLocaleString()}$`}
                        </Typography>
                      )}
                      {expenses.currencyDetails.sum > 0 && (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {`${expenses.currencyDetails.sum.toLocaleString()} so‘m`}
                        </Typography>
                      )}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="subtitle1" color="text.secondary">
                      {expenses.notes}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <ExpensesDialog />
      <ExpensesInfo open={drawerOpen} onClose={handleCloseDrawer} />
    </Box>
  );
}
