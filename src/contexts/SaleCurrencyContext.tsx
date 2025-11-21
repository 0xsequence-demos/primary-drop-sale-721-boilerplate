import { useAccount } from "wagmi";

import { createContext, ReactNode } from "react";
import useCustomContext from "./useCustomContext";
import { useCurrencyInfo } from "../hooks/data";
import { useSaleDetails } from "./SaleDetailsContext";

const SaleCurrencyContext = createContext<CurrencyInfo | undefined>(undefined);

type CurrencyInfo = {
  info: Awaited<ReturnType<typeof useCurrencyInfo>>["data"] | undefined;
  isLoading: boolean;
};

export function SaleCurrencyProvider({ children }: { children: ReactNode }) {
  const { chainId } = useAccount();
  const saleDetails = useSaleDetails();
  const {
    data: currencyContractInfo,
    isLoading: currencyContractInfoIsLoading,
  } = useCurrencyInfo(chainId!, saleDetails.paymentToken);

  return (
    <SaleCurrencyContext.Provider
      value={{
        info: currencyContractInfo,
        isLoading: currencyContractInfoIsLoading,
      }}
    >
      {children}
    </SaleCurrencyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSaleCurrency() {
  return useCustomContext(SaleCurrencyContext);
}
