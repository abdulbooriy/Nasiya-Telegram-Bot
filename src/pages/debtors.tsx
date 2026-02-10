import { useEffect, useState, useMemo } from "react";
import {
  List,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Stack,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import {
  Search,
  AlertTriangle,
  Calendar,
  X,
  Clock,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Banknote,
  Filter,
  CheckCircle,
  XCircle,
} from "lucide-react";

import ContractDebtorItem from "../components/ContractDebtorItem";
import { IDebtorContract, ICustomer } from "../types/ICustomer";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getCustomersDebtor } from "../store/actions/customerActions";
import Loader from "../components/Loader/Loader";
import CustomerDialog from "../components/CustomerDialog/CustomerDialog";
import { borderRadius, shadows } from "../theme/colors";
import { useDebounce } from "../hooks/useDebounce";
import dayjs from "../utils/dayjs-config";
import DashboardCardImproved from "../components/DashboardCard/DashboardCardImproved";
import { responsive } from "../theme/responsive";

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

type FilterType = "all" | "overdue" | "today" | "upcoming";

export default function DebtorsPage({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { customersDebtor, isLoading } = useSelector(
    (state: RootState) => state.customer,
  );

  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { dashboard } = useSelector((state: RootState) => state.dashboard);

  const todayDollar = dashboard?.today?.dollar ?? 0;
  const todaySum = dashboard?.today?.sum ?? 0;
  const todayCount = dashboard?.today?.count ?? 0;

  useEffect(() => {
    if (activeTabIndex === index) {
      const dateFilter =
        selectedDate && selectedDate.trim() !== "" ? selectedDate : undefined;
      dispatch(getCustomersDebtor(dateFilter));
    }
  }, [activeTabIndex, index, selectedDate, dispatch]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleShowAll = () => {
    setSelectedDate("");
  };

  const groupedDebtors = useMemo(() => {
    const filtered = customersDebtor.filter((contract) => {
      const fullName = contract.fullName.toLowerCase();
      const productName = contract.productName?.toLowerCase() || "";
      return (
        fullName.includes(debouncedSearch.toLowerCase()) ||
        contract.phoneNumber.includes(debouncedSearch) ||
        productName.includes(debouncedSearch.toLowerCase())
      );
    });

    const today = dayjs();

    const todayPayments: IDebtorContract[] = [];
    const upcomingPayments: IDebtorContract[] = [];
    const overduePayments: IDebtorContract[] = [];

    filtered.forEach((contract) => {
      const paymentDate =
        contract.nextPaymentDate ? dayjs(contract.nextPaymentDate) : null;

      if (!paymentDate || !paymentDate.isValid()) {
        overduePayments.push(contract);
        return;
      }

      const diffDays = paymentDate.diff(today, "day");

      if (diffDays === 0) {
        todayPayments.push(contract);
      } else if (diffDays > 0 && diffDays <= 15) {
        upcomingPayments.push(contract);
      } else if (diffDays < 0) {
        overduePayments.push(contract);
      } else {
        upcomingPayments.push(contract);
      }
    });

    const sortByDate = (a: IDebtorContract, b: IDebtorContract) => {
      const dateA =
        a.nextPaymentDate ? dayjs(a.nextPaymentDate) : dayjs().add(100, "year");
      const dateB =
        b.nextPaymentDate ? dayjs(b.nextPaymentDate) : dayjs().add(100, "year");
      return dateA.diff(dateB);
    };

    const sortedToday = todayPayments.sort(sortByDate);
    const sortedUpcoming = upcomingPayments.sort(sortByDate);
    const sortedOverdue = overduePayments.sort(sortByDate);

    let displayData: IDebtorContract[] = [];
    let displayTotal = 0;

    switch (filterType) {
      case "overdue":
        displayData = sortedOverdue;
        displayTotal = sortedOverdue.length;
        break;
      case "today":
        displayData = sortedToday;
        displayTotal = sortedToday.length;
        break;
      case "upcoming":
        displayData = sortedUpcoming;
        displayTotal = sortedUpcoming.length;
        break;
      case "all":
      default:
        displayTotal = filtered.length;
        break;
    }

    return {
      today: sortedToday,
      upcoming: sortedUpcoming,
      overdue: sortedOverdue,
      total: displayTotal,
      allTotal: filtered.length,
      displayData,
      showGrouped: filterType === "all",
    };
  }, [customersDebtor, debouncedSearch, filterType]);

  const handleContractClick = (contract: IDebtorContract) => {
    const customer: ICustomer = {
      _id: contract.customerId,
      fullName: contract.fullName,
      phoneNumber: contract.phoneNumber,
    };
    setSelectedCustomer(customer);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 0, sm: 2, md: 3 },
      }}>
      <Box>
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            mb: 1,
            background: "#ef4444",
            borderRadius: borderRadius.lg,
            color: "white",
            boxShadow: shadows.colored("rgba(235, 51, 73, 0.3)"),
          }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={1}>
            <AlertTriangle size={28} />
            <Box>
              <Typography
                variant="caption"
                sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
                Jami qarzdorlar
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {groupedDebtors.allTotal}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Kechikkan to'lovlar
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(2, 1fr)",
              xl: "repeat(auto-fit, minmax(300px, 1fr))",
            },
            gap: responsive.spacing.gap,
            mb: 3,
          }}>
          <DashboardCardImproved
            title="Bugungi to'lovlar ($)"
            total={`${todayDollar} $`}
            subtitle={`${todayCount} ta to'lov`}
            icon={<DollarSign size={responsive.icon.medium.xs} />}
            color="primary"
          />

          <DashboardCardImproved
            title="Bugungi to'lovlar (So'm)"
            total={`${todaySum.toLocaleString()} UZS`}
            subtitle={`${todayCount} ta to'lov`}
            icon={<Banknote size={responsive.icon.medium.xs} />}
            color="info"
          />
        </Box>
      </Box>

      <Paper
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: borderRadius.lg,
          bgcolor: "white",
          boxShadow: shadows.md,
        }}>
        <Stack spacing={2}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}>
              <Typography
                variant="subtitle2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.primary",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}>
                <Filter size={18} />
                To'lovlar filtri
              </Typography>
            </Box>

            <ToggleButtonGroup
              value={filterType}
              exclusive
              onChange={(_, newFilter) => {
                if (newFilter !== null) {
                  setFilterType(newFilter);
                }
              }}
              fullWidth
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  py: 1,
                  px: 1.5,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "none",
                  border: "1.5px solid #e0e0e0",
                  "&.Mui-selected": {
                    bgcolor: "#667eea",
                    color: "white",
                    borderColor: "#667eea",
                    "&:hover": {
                      bgcolor: "#5568d3",
                    },
                  },
                },
              }}>
              <ToggleButton value="all">
                <CheckCircle size={16} style={{ marginRight: 4 }} />
                Barchasi ({groupedDebtors.allTotal})
              </ToggleButton>
              <ToggleButton value="overdue">
                <XCircle size={16} style={{ marginRight: 4 }} />
                Kechikkan ({groupedDebtors.overdue.length})
              </ToggleButton>
              <ToggleButton value="accepted">
                <CheckCircle size={16} style={{ marginRight: 4 }} />
                Tasdiqlangan ({groupedDebtors.today.length})
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}>
              <Typography
                variant="subtitle2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.primary",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}>
                <Calendar size={18} />
                Sana bo'yicha filter
              </Typography>

              {selectedDate && (
                <Chip
                  label="Tozalash"
                  onClick={handleShowAll}
                  size="small"
                  color="error"
                  variant="filled"
                  deleteIcon={<X size={14} />}
                  onDelete={handleShowAll}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 28,
                    "& .MuiChip-deleteIcon": {
                      fontSize: "1rem",
                    },
                  }}
                />
              )}
            </Box>

            <TextField
              fullWidth
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              size="medium"
              placeholder="Sanani tanlang"
              InputProps={{
                sx: {
                  borderRadius: borderRadius.md,
                  bgcolor: "grey.50",
                  "& fieldset": {
                    border: "1.5px solid #e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#eb3349",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#eb3349",
                    borderWidth: "2px",
                  },
                  "& input": {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  },
                },
              }}
              helperText={
                selectedDate ?
                  `${dayjs(selectedDate).format("DD MMMM YYYY")} gacha bo'lgan kechikkan to'lovlar`
                : "Bugungi kungacha barcha kechikkan to'lovlar"
              }
              FormHelperTextProps={{
                sx: {
                  fontSize: "0.75rem",
                  color: selectedDate ? "error.main" : "success.main",
                  fontWeight: 500,
                  mt: 0.75,
                },
              }}
            />
          </Box>

          <TextField
            fullWidth
            placeholder="Ism, familiya yoki telefon raqam bo'yicha qidiring..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#eb3349" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: borderRadius.md,
                bgcolor: "grey.50",
                "& fieldset": { border: "none" },
                "&:hover": {
                  bgcolor: "rgba(235, 51, 73, 0.05)",
                },
                "&.Mui-focused": {
                  bgcolor: "rgba(235, 51, 73, 0.05)",
                },
              },
            }}
          />
        </Stack>
      </Paper>

      {groupedDebtors.total > 0 ?
        <Box>
          {groupedDebtors.showGrouped ?
            <>
              {groupedDebtors.today.length > 0 && (
                <Box mb={3}>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: borderRadius.lg,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      boxShadow: shadows.colored("rgba(102, 126, 234, 0.3)"),
                    }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Clock size={24} />
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          BUGUNGI TO'LOVLAR
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {groupedDebtors.today.length} ta to'lov
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                  <List disablePadding>
                    {groupedDebtors.today.map((contract) => (
                      <ContractDebtorItem
                        key={contract._id}
                        contract={contract}
                        onClick={handleContractClick}
                      />
                    ))}
                  </List>
                </Box>
              )}

              {groupedDebtors.upcoming.length > 0 && (
                <Box mb={3}>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: borderRadius.lg,
                      background:
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      color: "white",
                      boxShadow: shadows.colored("rgba(240, 147, 251, 0.3)"),
                    }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <TrendingUp size={24} />
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          KUNI KO'CHGAN (15 KUNGA)
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {groupedDebtors.upcoming.length} ta to'lov
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                  <List disablePadding>
                    {groupedDebtors.upcoming.map((contract) => (
                      <ContractDebtorItem
                        key={contract._id}
                        contract={contract}
                        onClick={handleContractClick}
                      />
                    ))}
                  </List>
                </Box>
              )}

              {groupedDebtors.overdue.length > 0 && (
                <Box mb={3}>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: borderRadius.lg,
                      background:
                        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                      color: "white",
                      boxShadow: shadows.colored("rgba(250, 112, 154, 0.3)"),
                    }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <AlertCircle size={24} />
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          KECHIKKAN TO'LOVLAR
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {groupedDebtors.overdue.length} ta to'lov
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                  <List disablePadding>
                    {groupedDebtors.overdue.map((contract) => (
                      <ContractDebtorItem
                        key={contract._id}
                        contract={contract}
                        onClick={handleContractClick}
                      />
                    ))}
                  </List>
                </Box>
              )}
            </>
          : <List disablePadding>
              {groupedDebtors.displayData.map((contract) => (
                <ContractDebtorItem
                  key={contract._id}
                  contract={contract}
                  onClick={handleContractClick}
                />
              ))}
            </List>
          }
        </Box>
      : <Paper
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: borderRadius.lg,
            bgcolor: "grey.50",
          }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {filterType === "all" ?
              "Qarzdor shartnomalar topilmadi"
            : filterType === "overdue" ?
              "Kechikkan to'lovlar topilmadi"
            : filterType === "today" ?
              "Bugungi to'lovlar topilmadi"
            : "15 kun ichidagi to'lovlar topilmadi"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedDate ?
              `${dayjs(selectedDate).format("DD MMMM YYYY")} sanasiga qadar ${
                filterType === "all" ? "qarzdor shartnomalar" : "to'lovlar"
              } yo'q`
            : `Bugungi kunga qadar ${
                filterType === "all" ? "qarzdor shartnomalar" : "to'lovlar"
              } yo'q`
            }
          </Typography>
        </Paper>
      }

      <CustomerDialog
        open={!!selectedCustomer}
        customer={selectedCustomer}
        onClose={handleCloseDetails}
      />
    </Box>
  );
}
