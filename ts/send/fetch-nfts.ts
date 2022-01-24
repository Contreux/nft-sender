import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getKeyringFromUri, fetchNFTData } from "../utils/utils";
require('dotenv').config({path:'../../.env'})

import * as fs from 'fs';


// Send nft to recipients
export const fetchNFT = async () => {
   try {

      console.log("Fetch NFT begin -------");

      await cryptoWaitReady();
      
      // Retreive signing credentials
      const phrase = process.env.MNEMONIC_PHRASE; 
      const kp = getKeyringFromUri(phrase); 

      //  Retreive accounts nfts
      const accountsNFTs = await fetchNFTData([encodeAddress(kp.address,2)]) // Encode address from base format

      let json = JSON.stringify(accountsNFTs)
      fs.writeFileSync("../../nfts.json", json)
      let file = fs.readFileSync("../../nfts.json", )
      console.log("Finished fetching and updating nft data. ", accountsNFTs.length, " nfts")

   } catch (error: any) {
     console.error(error);
   }
 };




