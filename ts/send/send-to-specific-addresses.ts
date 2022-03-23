import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, sendAndFinalize } from "../utils/utils";
import {
  WS_URL,
} from "../constants";
require('dotenv').config({path:'../../.env'})

import {consolidatedNFTtoInstance} from "rmrk-tools";
import { NFTConsolidated } from "rmrk-tools/dist/tools/consolidator/consolidator";
import cowsay from 'cowsay';
import * as fs from 'fs';
import json from '../../nfts.json'; 


// Send nft to recipients
export const sendNFT = async () => {
   try {
 
    console.log("Send NFT begin -------");

    await cryptoWaitReady();
     
    // Retreive signing credentials
    const ws = WS_URL;                          
    const phrase = process.env.MNEMONIC_PHRASE; 
    const kp = getKeyringFromUri(phrase); 
    const api = await getApi(ws);

    // Initialise
    const accountsNFTs: NFTConsolidated[] = (json as unknown) as NFTConsolidated[]

    // Add recipients you want to send to here
    const recipients = [
      "HvYJHv34nsh827KiNhuRyvPZj46F3Y35W1x4RDGDCkHJFQe",
    ]

    const amountToSend = 1

    const commendation = 2

    console.log(accountsNFTs.length)
    let promises = []
    for (let recipient = 0; recipient < recipients.length; recipient++){
      // figure out how to remove ones I've already sent
      if (amountToSend <= accountsNFTs.length){
        for (let i = 0; i < amountToSend; i++){
          if (!locked(accountsNFTs[0].id) && commendationType(accountsNFTs[0].id, commendation)){
            let nft = consolidatedNFTtoInstance(accountsNFTs[0])
            let address = encodeAddress(recipients[recipient],2)
            promises = promises.concat(nft.send(address))
            accountsNFTs.shift()
          }else{
            accountsNFTs.shift()
            i=-1
          }
        }
      }else{
        console.log("NO MORE NFTS")
      }
    }

    console.log(promises)

    // Write to the nft data file
    // let newJson = JSON.stringify(accountsNFTs)
    // fs.writeFileSync("../../nfts.json",newJson)

    // // Await promises
    // const remarks = await Promise.all(promises);
    // // Whip up tx 
    // const txs = remarks.map((remark) => api.tx.system.remark(remark));
    // const tx = api.tx.utility.batchAll(txs);
    // // Send tx
    // const { block } = await sendAndFinalize(tx, kp);

    // // personal touch cause I like it
    // console.log(cowsay.say({
    // text: `You distributed Talisman NFTs at block ${block}`,
    // r: true
    // }));
 
    //  return block;
   } catch (error: any) {
     console.error(error);
   }
 };

 function locked(id : String) : boolean{
  let lockedIDs = ['0000001','0000002','0000003','0000888','0003333','0000420','0000069']
  for (let locked = 0; locked < lockedIDs.length; locked++){
    if (id.includes(lockedIDs[locked])){
      return true
    }
  }
  return false
}

function commendationType(id : String, commendation: number) : boolean{
  let adjustedID = id.slice(id.length - 5)
  console.log(adjustedID,commendation);
  if (Number(adjustedID) < 1501){ // silver
    return (commendation == 0) ? true: false
  }else if (Number(adjustedID) < 2001){ // gold 
    return (commendation == 1) ? true: false
  }else if (Number(adjustedID) < 2201){ // heirloom
    return (commendation == 2) ? true: false
  }else if(Number(adjustedID) < 2241){ // Artifact
    return (commendation == 3) ? true: false
  }else{
    return (commendation == 4) ? true: false
  }
}