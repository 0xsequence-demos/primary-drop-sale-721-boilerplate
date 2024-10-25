export default function getBodyAndKeys() {
  // "IMPORTANT: Make sure to modify the keys and the request body before using this script."

  const keys = {
    // Your project id can be found at https://sequence.build. You’ll see it in the URL after selecting your project
    projectId: 893218998,
    // Follow the first step in https://docs.sequence.xyz/guides/metadata-guide/
    jwtAccessKey: "",
    // Your access key can be found at https://sequence.build under the project settings
    projectAccessKey: "",
  };

  const body = {
    // Modify with number of NFTs to create
    quantity: 10,
    // Modify with your collection ID
    collectionId: 892189,
  };

  return { body, keys };
}
