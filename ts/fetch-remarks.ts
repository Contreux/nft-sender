import { fetchRemarks, getRemarksFromBlocks, getLatestFinalizedBlock, Consolidator } from 'rmrk-tools';
import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('wss://node.rmrk.app');

export const fetchRemarksScript = async () => {
    try {
        const api = await ApiPromise.create({ provider: wsProvider });
        const to = await getLatestFinalizedBlock(api);

        console.log(to)
        const remarkBlocks = await fetchRemarks(api, 10016000, to, ['']);
        if (remarkBlocks && (remarkBlocks.length > 0)) {
          const remarks = getRemarksFromBlocks(remarkBlocks, ['']);
          for (let i = 0; i < remarkBlocks.length; i++) {
            // console.log(remarks)
            for (let j = 0; i < remarkBlocks[i].calls.length; i++) {
               console.log(remarkBlocks[i].calls[j])
            }
          }
          const consolidator = new Consolidator();
         //  const { nfts, collections } = consolidator.consolidate(remarks);
         //  console.log('Consolidated nfts:', nfts);
         //  console.log('Consolidated collections:', collections);
        }else{
           console.log("Remarks returned was empty")
        }
    } catch (error) {
        console.log(error)
    }
}