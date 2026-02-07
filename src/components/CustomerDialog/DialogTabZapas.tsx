import { FC, useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  MdAccountBalanceWallet,
  MdCheckCircle,
  MdHistory,
} from "react-icons/md";
import { getPrepaidRecords } from "../../server/prepaid";
import { IPrepaidRecord } from "../../types/IPrepaidRecord";

interface Contract {
  _id: string;
  productName: string;
  prepaidBalance?: number;
  totalPrice: number;
  monthlyPayment: number;
  period: number;
  customId?: string;
}

interface IProps {
  contracts: Contract[];
  customerId: string;
}

const DialogTabZapas: FC<IProps> = ({ contracts, customerId }) => {
  const [prepaidRecords, setPrepaidRecords] = useState<IPrepaidRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Umumiy zapasni hisoblash (PrepaidRecords'dan)
  const totalPrepaidFromRecords = useMemo(() => {
    return prepaidRecords.reduce(
      (sum, record) => sum + (record.amount || 0),
      0,
    );
  }, [prepaidRecords]);

  // Umumiy zapasni hisoblash (shartnomalardan - fallback)
  const totalPrepaidFromContracts = useMemo(() => {
    return contracts.reduce(
      (sum, contract) => sum + (contract.prepaidBalance || 0),
      0,
    );
  }, [contracts]);

  // Ikkisining maksimumini olish (data consistency uchun)
  const totalPrepaid = Math.max(
    totalPrepaidFromRecords,
    totalPrepaidFromContracts,
  );

  // Zapas bo'lgan shartnomalar
  const contractsWithPrepaid = useMemo(() => {
    return contracts.filter(
      (contract) => contract.prepaidBalance && contract.prepaidBalance > 0,
    );
  }, [contracts]);

  // Zapas tarihini olish
  useEffect(() => {
    const fetchPrepaidHistory = async () => {
      if (!customerId) return;

      setLoadingRecords(true);
      try {
        const response = await getPrepaidRecords(customerId);
        if (response.data) {
          // Eng yangi ma'lumotlar avvali bo'lsin
          setPrepaidRecords(
            response.data.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            ),
          );
        }
      } catch (error) {
        console.error("❌ Zapas tarixi o'qishda xatolik:", error);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchPrepaidHistory();
  }, [customerId]);

  return (
    <Box sx={{ p: 2 }}>
      {/* Umumiy zapas */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "black",
          borderRadius: 3,
        }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <MdAccountBalanceWallet size={32} />
          <Typography variant="h6" fontWeight={700}>
            Umumiy Zapas
          </Typography>
        </Stack>

        <Typography variant="h3" fontWeight={800} mb={1}>
          ${totalPrepaid.toFixed(2)}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <MdCheckCircle size={18} />
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {contractsWithPrepaid.length} ta shartnomada zapas mavjud
          </Typography>
        </Stack>
      </Paper>

      {/* ✅ YANGI: ZAPAS TARIXI BO'LIMI */}
      {prepaidRecords.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ my: 3 }} />

          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <MdHistory size={24} />
            <Typography variant="h6" fontWeight={700}>
              Zapas Tarixi
            </Typography>
            <Chip
              label={prepaidRecords.length}
              size="medium"
              color="info"
              variant="filled"
            />
          </Stack>

          {loadingRecords ?
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          : <Stack spacing={2}>
              {prepaidRecords.map((record) => {
                // const parsedNote = parseFormattedNote(record.notes);

                return (
                  <Paper
                    key={record._id}
                    elevation={1}
                    sx={{
                      p: 2.5,
                      borderLeft: "4px solid",
                      borderColor: "info.main",
                      bgcolor: "info.lighter",
                      borderRadius: 1.5,
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: 3,
                      },
                    }}>
                    <Stack spacing={1.5}>
                      {/* Sarlavha - Summa va Sana */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start">
                        <Box>
                          <Typography
                            variant="button"
                            fontWeight={700}
                            color="info.main">
                            ${record.amount.toFixed(2)} ortiqcha to'lov
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text"
                            sx={{ mt: 0.5, display: "block" }}>
                            {new Date(record.date).toLocaleDateString("uz-UZ", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            record.paymentMethod === "som_cash" ? "So'm naqd"
                            : record.paymentMethod === "som_card" ?
                              "So'm karta"
                            : record.paymentMethod === "dollar_cash" ?
                              "Dollar naqd"
                            : "Dollar karta"
                          }
                          size="small"
                          color="primary"
                          variant="filled"
                        />
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          }
        </Box>
      )}
    </Box>
  );
};

export default DialogTabZapas;
