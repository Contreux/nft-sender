# RMRK 1.0.0 Talisman NFT sender script

### Variable instructions

In the send-to-specific-addresses.ts file change two variables

1. `Recipients`, change to add as many or as few as you would like
2. `Amount to send`, the number of nfts you would like to send to each participant

### Run Intructions

1. npm install
2. cd into ts -> run-files

If (you don't have the latest nft data in nfts.json)
run `npx ts-node ./run-fetch-nfts.ts `
otherwise continue

3. run `npx ts-node ./run-send-specific-addresses.ts ` this will send the nfts to the set recipients and remove sent nfts from the nfts.json so you don't have to constantly download data.
