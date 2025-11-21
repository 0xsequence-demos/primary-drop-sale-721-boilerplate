import { compareAddress } from "@0xsequence/connect";
import { zeroAddress } from "viem";

export const isNativeCurrency = (address: string) =>
  compareAddress(address, zeroAddress);

