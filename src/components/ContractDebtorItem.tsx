import { memo } from "react";
import {
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Clock, Package } from "lucide-react";
import { IDebtorContract } from "../types/ICustomer";
import { borderRadius, shadows } from "../theme/colors";
import { responsive } from "../theme/responsive";

interface ContractDebtorItemProps {
  contract: IDebtorContract;
  onClick: (contract: IDebtorContract) => void;
}

const MotionListItemButton = motion(ListItemButton);

const ContractDebtorItem: React.FC<ContractDebtorItemProps> = memo(
  ({ contract, onClick }) => {
    const getDelayColor = (days: number) => {
      if (days > 30) return "error.main";
      if (days > 7) return "warning.main";
      return "success.main";
    };

    // Smart name truncation
    const getDisplayName = (fullName: string) => {
      if (fullName.length > 20) {
        const parts = fullName.split(" ");
        if (parts.length > 1) {
          return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
        }
      }
      return fullName;
    };

    // Truncate product name for mobile
    const truncateProductName = (name: string) => {
      if (name.length > 30) {
        return `${name.slice(0, 30)}...`;
      }
      return name;
    };

    // Calculate paid months
    const getPaidMonths = () => {
      if (contract.paidMonthsCount !== undefined) {
        return contract.paidMonthsCount;
      }
      // Fallback calculation
      if (
        contract.period &&
        contract.monthlyPayment &&
        contract.initialPayment !== undefined
      ) {
        return Math.floor(
          (contract.totalPaid - contract.initialPayment) /
            contract.monthlyPayment,
        );
      }
      return 0;
    };

    const paidMonths = getPaidMonths();
    const totalMonths = contract.period || 0;

    return (
      <MotionListItemButton
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onClick={() => onClick(contract)}
        sx={{
          borderRadius: borderRadius.md,
          mb: 1.5,
          px: { xs: 1.5, sm: 3 },
          py: { xs: 1, sm: 2 },
          bgcolor: contract.isPending ? "success.lighter" : "background.paper",
          border: "2px solid",
          borderColor: contract.isPending ? "success.main" : "error.main",
          boxShadow:
            contract.isPending ?
              shadows.colored("rgba(16, 185, 129, 0.2)")
            : shadows.sm,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: contract.isPending ? "success.light" : "background.paper",
            borderColor: contract.isPending ? "success.dark" : "error.dark",
            boxShadow: shadows.md,
          },
        }}>
        {/* Avatar - responsive sizing */}
        {/* <Avatar
        sx={{
          mr: responsive.spacing.gap,
          width: responsive.avatar.medium.xs,
          height: responsive.avatar.medium.xs,
          bgcolor: contract.isPending ? "info.main" : "error.main",
          fontSize: responsive.typography.body1.xs,
          fontWeight: 700,
          boxShadow: shadows.sm,
        }}
      >
        {contract.fullName.charAt(0)}
      </Avatar> */}

        <ListItemText
          primary={
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              mb={0.5}
              sx={{
                flexWrap: { xs: "wrap", sm: "nowrap" },
                minHeight: { xs: 24, sm: "auto" },
              }}>
              {/* Day badge - NEW */}
              {(contract.initialPaymentDueDate || contract.startDate) && (
                <Chip
                  label={new Date(
                    contract.initialPaymentDueDate || contract.startDate!,
                  )
                    .getDate()
                    .toString()
                    .padStart(2, "0")}
                  size="small"
                  sx={{
                    height: { xs: 22, sm: 24 },
                    minWidth: { xs: 28, sm: 32 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    fontWeight: 700,
                    bgcolor: "primary.main",
                    color: "white",
                    "& .MuiChip-label": {
                      px: { xs: 0.5, sm: 0.75 },
                    },
                  }}
                />
              )}

              {/* Name - responsive */}
              <Typography
                fontWeight={700}
                color="text.primary"
                fontSize="1rem"
                sx={{
                  fontSize: { xs: "16px", sm: responsive.typography.body1 },
                  lineHeight: 1.3,
                  flex: 1,
                  minWidth: { xs: "120px", sm: "auto" },
                }}>
                {getDisplayName(contract.fullName)}
              </Typography>

              {/* ✅ YANGI: Status badge */}
              {contract.nextPaymentStatus && (
                <Chip
                  label={
                    contract.nextPaymentStatus === "PENDING" ? "KUTILMOQDA"
                    : contract.nextPaymentStatus === "TODAY" ?
                      "BUGUN"
                    : contract.nextPaymentStatus === "UPCOMING" ?
                      "YAQINDA"
                    : "KECHIKKAN"
                  }
                  size="small"
                  sx={{
                    height: { xs: 20, sm: 22 },
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    bgcolor:
                      contract.nextPaymentStatus === "PENDING" ? "#ffa726"
                      : contract.nextPaymentStatus === "TODAY" ? "#667eea"
                      : contract.nextPaymentStatus === "UPCOMING" ? "#f093fb"
                      : "#fa709a",
                    color: "white",
                    "& .MuiChip-label": {
                      px: { xs: 0.5, sm: 1 },
                    },
                  }}
                />
              )}

              <Typography
                sx={{
                  fontSize: { xs: "20px", sm: responsive.typography.body1 },
                  fontWeight: 800,
                  color:
                    contract.isPending ? "success.priceSuccess" : "error.main",
                }}>
                {`${contract.monthlyPayment} $`}
              </Typography>
              {/* Delay days badge - responsive */}
              {contract.delayDays !== undefined &&
                contract.delayDays > 0 &&
                !contract.isPending && (
                  <Chip
                    icon={<Clock size={responsive.icon.small.xs} />}
                    label={`${contract.delayDays > 99 ? "99+" : contract.delayDays} kun`}
                    size="small"
                    color="error"
                    sx={{
                      height: { xs: 20, sm: 22 },
                      fontSize: responsive.typography.caption,
                      fontWeight: 700,
                      bgcolor: getDelayColor(contract.delayDays),
                      color: "white",
                      "& .MuiChip-icon": {
                        ml: 0.5,
                        width: responsive.icon.small.xs,
                        height: responsive.icon.small.xs,
                        color: "white",
                      },
                      "& .MuiChip-label": {
                        px: { xs: 0.5, sm: 1 },
                      },
                    }}
                  />
                )}

              {contract.isPending &&
                (() => {
                  return (
                    <Chip
                      label={
                        contract.remainingDebt ? "TO'LIQ BERDI" : (
                          "TO'LIQ BERMADI"
                        )
                      }
                      sx={{
                        height: { xs: 14, sm: 16 },
                        fontSize: responsive.typography.caption,
                        fontWeight: 700,
                        color: contract.remainingDebt ? "#2E7D32" : "#D32F2F",
                        bgcolor: "transparent",
                        "& .MuiChip-label": {
                          px: { xs: 0.5, sm: 1 },
                          bgcolor: "transparent",
                        },
                      }}
                    />
                  );
                })()}
            </Box>
          }
          secondary={
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap={0.5}>
              {/* Product name */}
              <Box display="flex" alignItems="center" gap={0.5}>
                <Package size={responsive.icon.small.xs} color="#6B7280" />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: responsive.typography.body2,
                    lineHeight: 1.3,
                    fontWeight: 600,
                  }}>
                  {truncateProductName(contract.productName)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                {/* Kassa kutilmoqda - NEW */}
                {contract.isPending && (
                  <Chip
                    label="TASDIQ KUTILMOQDA"
                    size="small"
                    color="info"
                    sx={{
                      height: { xs: 18, sm: 20 },
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      animation: "pulse 2s infinite ease-in-out",
                      "@keyframes pulse": {
                        "0%": { opacity: 1, transform: "scale(1)" },
                        "50%": { opacity: 0.7, transform: "scale(0.98)" },
                        "100%": { opacity: 1, transform: "scale(1)" },
                      },
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                )}

                {/* Contract duration - NEW */}
                {totalMonths > 0 && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: responsive.typography.caption,
                        fontWeight: 700,
                        color: "primary.main",
                      }}>
                      {paidMonths}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: responsive.typography.caption,
                        color: "text.secondary",
                      }}>
                      / {totalMonths} oy
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          }
        />
      </MotionListItemButton>
    );
  },
);

ContractDebtorItem.displayName = "ContractDebtorItem";

export default ContractDebtorItem;
