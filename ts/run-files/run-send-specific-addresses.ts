import { sendNFT } from "../send/send-to-specific-addresses";

export const runSendNFTsToSpecificAddresses = async () => {
  try {
    await sendNFT();
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runSendNFTsToSpecificAddresses();

