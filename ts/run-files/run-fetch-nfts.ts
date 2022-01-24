import { fetchNFT } from "../send/fetch-nfts";

export const runFetchNFTs = async () => {
  try {
    await fetchNFT();
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runFetchNFTs();

