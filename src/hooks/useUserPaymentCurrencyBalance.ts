import { useReadContract, useBalance } from "wagmi";

import { useSaleCurrency } from "../contexts/SaleCurrencyContext";
import { Address } from "viem";
import { initialChainId } from "../configs/chains";
import { ERC20_ABI } from "../abi/tokens/erc20";
import { isNativeCurrency } from "../helpers/isNativeCurrency";

export function useUserPaymentCurrencyBalance({
  address,
}: {
  address?: Address;
}) {
  const { info: currencyInfo } = useSaleCurrency();

  const isNative =
    isNativeCurrency(currencyInfo?.address || "");

  const { data: nativeBalance } = useBalance({
    address: address,
    chainId: initialChainId,
    query: {
      refetchInterval: 30000,
      enabled: Boolean(isNative && address),
    },
  });

  const { data: erc20Balance } = useReadContract({
    abi: ERC20_ABI,
    functionName: "balanceOf",
    chainId: initialChainId,
    address: currencyInfo?.address as Address,
    args: [address!],
    query: {
      enabled: Boolean(currencyInfo?.address && address),
    },
  });

  return isNative ? nativeBalance?.value : erc20Balance;
}
