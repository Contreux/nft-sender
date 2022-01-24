import { WS_URL } from "../constants";

require('dotenv').config({path:'../../.env'})

import { KeyringPair } from "@polkadot/keyring/types";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { CodecHash } from "@polkadot/types/interfaces";
import { NFTConsolidated } from "rmrk-tools/dist/tools/consolidator/consolidator";
import fetch from "node-fetch";

export const getKeys = (): KeyringPair[] => {
  const k = [];
  const keyring = new Keyring({ type: "sr25519" });
  k.push(keyring.addFromUri(process.env.MNEMONIC_PHRASE));
  return k;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

export const getKeyringFromUri = (phrase: string): KeyringPair => {
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri(phrase);
};

export const getApi = async (wsEndpoint: string): Promise<ApiPromise> => {
  const wsProvider = new WsProvider(wsEndpoint);
  const api = ApiPromise.create({ provider: wsProvider });
  return api;
};

export const chunkArray = (array: any[], size: number) => {
  let result = [];
  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
};


export const sendAndFinalize = async (
  tx: SubmittableExtrinsic<"promise", ISubmittableResult>,
  account: KeyringPair
): Promise<{
  block: number;
  success: boolean;
  hash: CodecHash;
  included: any[];
  finalized: any[];
}> => {
  return new Promise(async (resolve) => {
    let success = false;
    let included = [];
    let finalized = [];
    let block = 0;
    let unsubscribe = await tx.signAndSend(
      account,
      async ({ events = [], status, dispatchError }) => {
        if (status.isInBlock) {
          success = dispatchError ? false : true;
          console.log(
            `📀 Transaction ${tx.meta.name} included at blockHash ${status.asInBlock} [success = ${success}]`
          );
          const api = await getApi(WS_URL);
          const signedBlock = await api.rpc.chain.getBlock(status.asInBlock);
          block = signedBlock.block.header.number.toNumber();
          included = [...events];
        } else if (status.isBroadcast) {
          console.log(`🚀 Transaction broadcasted.`);
        } else if (status.isFinalized) {
          console.log(
            `💯 Transaction ${tx.meta.name}(..) Finalized at blockHash ${status.asFinalized}`
          );
          finalized = [...events];
          let hash = status.hash;
          unsubscribe();
          resolve({ success, hash, included, finalized, block });
        } else if (status.isReady) {
          // let's not be too noisy..
        } else {
          console.log(`🤷 Other status ${status}`);
        }
      }
    );
  });
};



// Retreive NFT Data
export const fetchNFTData = async (addresses: string[]) => {
  try {
    let data: NFTConsolidated[] = []
    for await (const address of addresses){
      console.log("address",address)
      const payload = await fetch(`https://singular.rmrk.app/api/rmrk1/account/${address}`);
      const nftData: JSON[] = await payload.json();
      const nftDataConsolidated: NFTConsolidated[] = (nftData as unknown) as NFTConsolidated[]
      console.log("consolidated",nftDataConsolidated)


     for (let i = 0; i < nftDataConsolidated.length; i++) {
        nftDataConsolidated[i].collection = nftData[i]["collectionId"]
     }
     data = data.concat(nftDataConsolidated);
    }
    console.log(data)
    return data
  } catch (error: any) {
    console.log(error);
  }
};