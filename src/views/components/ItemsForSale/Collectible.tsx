import {
  Box,
  Card,
  Skeleton,
  Text,
  useMediaQuery,
} from "@0xsequence/design-system";
import CollectibleTileImage from "../CollectibleTileImage";
import { BuyWithCryptoCardButton } from "./BuyWithCryptoCardButton";
import { useEffect, useState } from "react";
import { ContractInfo, TokenMetadata } from "@0xsequence/indexer";
import { toast } from "react-toastify";
import { SendTransactionErrorType } from "viem";
import NftsMintedProgressBar from "../NftsMintedProgressBar";
import { NFT_TOKEN_CONTRACT_ABI } from "../../../utils/primarySales/abis/nftTokenContractAbi";
import { useReadContract } from "wagmi";
import PurchaseAnimation from "../blockchain/Connected/PurchaseAnimation";
import { formatPriceWithDecimals } from "../../../utils/primarySales/helpers";
import { UnpackedSaleConfigurationProps } from "../../../utils/primarySales/helpers";

interface CollectibleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // collectibleBalance: { [key: string]: any } | undefined;
  // tokenMetadata: TokenMetadata;
  chainId: number;
  currencyData: ContractInfo | undefined;
  totalMintedNftsPercentaje: number;
  totalSupply: string | 0;
  totalNftsMinted: string | undefined;
  userPaymentCurrencyBalance: bigint | undefined;
  price: bigint;
  currencyDecimals: number | undefined;
  saleConfiguration: UnpackedSaleConfigurationProps;
  refetchCollectionBalance: () => void;
  refetchTotalMinted: () => void;
}

function calculateMintedPercentage(minted: number, totalMax: number): number {
  if (totalMax <= 0) {
    return 0;
  }

  const percentage = (minted / totalMax) * 100;
  return Math.floor(percentage);
}

export const Collectible = ({
  chainId,
  currencyData,
  totalMintedNftsPercentaje,
  totalSupply,
  totalNftsMinted,
  userPaymentCurrencyBalance,
  price,
  currencyDecimals,
  saleConfiguration,
  refetchCollectionBalance,
  refetchTotalMinted,
}: CollectibleProps) => {
  const isMobile = useMediaQuery("isMobile");
  const [amount, setAmount] = useState(0);
  const [txExplorerUrl, setTxExplorerUrl] = useState("");
  const [txError, setTxError] = useState<SendTransactionErrorType | null>(null);
  const [purchasingNft, setPurchasingNft] = useState<boolean>(false);
  const logoURI = currencyData?.logoURI;

  const formmatedPrice = currencyDecimals
    ? formatPriceWithDecimals(price, currencyDecimals)
    : 0;

  useEffect(() => {
    if (!txError || JSON.stringify(txError) === "{}") return;
    toast(`Error to purchase NFT`, { type: "error" });
    setPurchasingNft(false);
    console.error(txError);
  }, [txError]);

  const increaseAmount = () => {
    if (purchasingNft) return;
    setAmount(amount + 1);
  };

  const decreaseAmount = () => {
    if (amount === 0 || purchasingNft) return;
    setAmount(amount - 1);
  };

  const resetAmount = () => {
    setAmount(0);
  };

  return (
    <Box
  padding="1"
  width="full"
  flexDirection="column"
  style={{
    flexBasis: isMobile ? "100%" : "50%",
    width: "fit-content",
    maxWidth: "50rem",
  }}
>
  <Card>
    <Box flexDirection="row" gap="6">
      <Box display="flex" flexDirection="column" gap="6">
        <Box display="flex" justifyContent="space-between" gap="4">
          <Box flexDirection="row" gap="2">
            <Text
              variant="normal"
              fontWeight="bold"
              color="text100"
              style={{ textAlign: "left" }}
            >
              Price: {formmatedPrice}
            </Text>

            <Skeleton style={{ width: 20, height: 20 }} />
          </Box>
        </Box>
        <Box
                display="flex"
                alignItems="center"
                gap="8"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  width: "fit-content",
                  padding: "0.5rem 1rem",
                }}
                borderRadius="lg"
              >
                <Text
                  variant="large"
                  fontWeight="bold"
                  onClick={decreaseAmount}
                  style={{
                    cursor: "pointer",
                    color: "#ffffff",
                    fontWeight: 900,
                  }}
                >
                  -
                </Text>
                <Text
                  variant="large"
                  fontWeight="bold"
                  style={{ color: "#ffffff" }}
                >
                  {amount}
                </Text>
                <Text
                  variant="large"
                  fontWeight="bold"
                  onClick={increaseAmount}
                  style={{
                    cursor: "pointer",
                    color: "#ffffff",
                    fontWeight: 900,
                  }}
                >
                  +
                </Text>
              </Box>
        <BuyWithCryptoCardButton
          amount={amount}
          chainId={chainId}
          collectionAddress={saleConfiguration.nftTokenAddress}
          // tokenId={tokenMetadata.tokenId}
          resetAmount={resetAmount}
          setTxExplorerUrl={setTxExplorerUrl}
          setTxError={setTxError}
          setPurchasingNft={setPurchasingNft}
          userPaymentCurrencyBalance={userPaymentCurrencyBalance}
          price={price}
          currencyData={currencyData}
          refetchCollectionBalance={refetchCollectionBalance}
          refetchTotalMinted={refetchTotalMinted}
          // refetchNftsMinted={refetchNftsMinted}
        />
        {/* {purchasingNft && (
          <PurchaseAnimation
            amount={amount}
            image={tokenMetadata.image || ""}
            name={tokenMetadata.name}
          />
        )} */}
        {txError && JSON.stringify(txError) != "{}" && (
          <span>Error to purchase NFT. Details in console</span>
        )}
        {txExplorerUrl && (
          <Box display="flex" flexDirection="column" marginBottom="3">
            <Text variant="large" color="text100">
              Purchase Completed Successfully
            </Text>
            <a href={txExplorerUrl} target="_blank" rel="noopener noreferrer">
              <span>View transaction in explorer</span>
              <br />
            </a>
          </Box>
        )}
      </Box>
    </Box>
  </Card>
</Box>

  );
};
