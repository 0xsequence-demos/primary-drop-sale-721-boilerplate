import { SequenceCollections } from "@0xsequence/metadata";
import { ethers } from "ethers";
import { uploadAsset } from "../utils/uploadAsset";
import { generateNFTsMetadata, getRandomImage, mergeAttributes } from "../utils/dataGenerators";

async function createTokenIds(
  startTokenId,
  metadatas: any[],
  collectionsService,
  projectId,
  collectionId,
  projectAccessKey,
  jwtAccessKey
) {
  if (startTokenId < 0) throw new Error("Invalid startTokenId");
  if (metadatas.length > 500)
    throw new Error(
      "Invalid metadatas length. Please send maximum 500 metadatas."
    );
  if (!projectId || !collectionId)
    throw new Error("Empty fields in create token ids");

  return await Promise.all(
    metadatas.map(async (metadata, index) => {
      const { name, description, attributes } = metadata;
      try {
        const { token } = await collectionsService.createToken({
          projectId: projectId,
          collectionId,
          token: {
            tokenId: (index + startTokenId).toString(),
            name,
            description,
            decimals: 0,
            properties: mergeAttributes(attributes),
          },
        });

        const randomTokenIDSpace = ethers.BigNumber.from(
          ethers.utils.hexlify(ethers.utils.randomBytes(20))
        );

        const jsonCreateAsset = await collectionsService.createAsset({
          projectId: projectId,
          asset: {
            id: Number(String(randomTokenIDSpace).slice(0, 10)),
            collectionId,
            tokenId: (index + startTokenId).toString(),
            metadataField: "image",
          },
        });

        await uploadAsset(
          projectId,
          780,
          jsonCreateAsset.asset.id,
          "8",
          getRandomImage(),
          projectAccessKey,
          jwtAccessKey
        );

        const updateTokenBody = {
          projectId: projectId,
          collectionId: 780,
          private: false,
          tokenId: token.tokenId,
          token: { ...token },
        };

        const data = await collectionsService.updateToken(updateTokenBody);

        return data;
      } catch (error) {
        return {
          ...error,
          tokenId: index + startTokenId,
        };
      }
    })
  );
}

export async function createToken(request, env) {
  const password = env.PASSWORD;
  const authHeader = request.headers.get("Authorization");

  if (authHeader !== `Bearer ${password}`) {
    return new Response(JSON.stringify({ result: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
    
  const { quantity, startTokenId } = await request.json();
  if (!quantity || !startTokenId) {
    return new Response(JSON.stringify({ result: "Bad Request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  };

  const METADATA_URL = "https://metadata.sequence.app";
  const jwtAccessKey = env.JWT_ACCESS_KEY;
  const projectAccessKey = env.PROJECT_ACCESS_KEY;
  const projectId = env.PROJECT_ID;
  const collectionsService = new SequenceCollections(
    METADATA_URL,
    jwtAccessKey
  );
  const metadatas = generateNFTsMetadata(quantity);
  const metadataStatuses = await createTokenIds(
    startTokenId,
    metadatas,
    collectionsService,
    projectId,
    780,
    projectAccessKey,
    jwtAccessKey
  );
  const data = {
    message: "Created Tokens",
    status: "success",
    metadataStatuses,
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
