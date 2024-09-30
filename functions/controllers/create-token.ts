
import { SequenceCollections } from '@0xsequence/metadata'
import { ethers } from 'ethers'
import { extractProjectIdFromAccessKey } from "@0xsequence/utils";

export async function createToken(env) {
const METADATA_URL = 'https://metadata.sequence.app'
const projectAccessKey = env.JWT_ACCESS_KEY;
const projectId = extractProjectIdFromAccessKey(projectAccessKey);
const collectionsService = new SequenceCollections(METADATA_URL, projectAccessKey)
 
const randomTokenIDSpace = ethers.BigNumber.from(ethers.utils.hexlify(ethers.utils.randomBytes(20)))
 
const res1 = await collectionsService.createToken({
	projectId: projectId,
	collectionId: 780,
	token: {
		tokenId: String(randomTokenIDSpace),
		name: "Divine NFT",
		description: "description",
		decimals: 0,
		attributes: [{
      damage: 202002
    }]
	}
})
  const data = {
    message: "Created Token",
    status: "success",
    res1
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
