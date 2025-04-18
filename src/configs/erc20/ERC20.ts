/* eslint-disable @typescript-eslint/no-explicit-any */
import { getERC20Contract } from "./getERC20Contract";
import { ethers } from "ethers";
import type { Hex } from "viem";
import { encodeFunctionData, erc20Abi } from "viem";
import type { GetWalletClientData } from "wagmi/query";
import abi from "erc-20-abi";
import { ERC20_ABI } from "../../abi/tokens/erc20";
export class ERC20 {
  static approve = async (
    erc20Address: string,
    spender: string,
    amount: bigint,
    signer: GetWalletClientData<any, any>,
  ): Promise<string> => {
    const txHash = await signer.writeContract({
      chain: signer.chain,
      address: erc20Address as Hex,
      abi,
      functionName: "approve",
      args: [spender as Hex, amount],
    });

    return txHash;
  };

  static approve_data = (spender: string, amount: bigint): string => {
    return encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [spender as Hex, amount],
    });
  };

  static approveInfinite = async (
    erc20Address: string,
    spender: string,
    signer: GetWalletClientData<any, any>,
  ): Promise<string> => {
    const txHash = await signer.writeContract({
      chain: signer.chain,
      address: erc20Address as Hex,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [spender as Hex, BigInt(ethers.MaxUint256.toString())],
    });

    return txHash;
  };

  static approveInfinite_data = (spender: string): string => {
    return encodeFunctionData({
      abi: ERC20_ABI,
      functionName: "approve",
      args: [spender as Hex, BigInt(ethers.MaxUint256.toString())],
    });
  };

  static getAllowance = async (
    erc20Address: string,
    owner: string,
    spender: string,
    chainId: number,
  ): Promise<bigint> => {
    const contract = getERC20Contract({
      contractAddress: erc20Address,
      chainId,
    });
    return contract.read.allowance([owner as Hex, spender as Hex]);
  };

  static balanceOf = async (
    erc20Address: string,
    owner: string,
    chainId: number,
  ): Promise<bigint> => {
    const contract = getERC20Contract({
      contractAddress: erc20Address,
      chainId,
    });
    return contract.read.balanceOf([owner as Hex]);
  };
}
