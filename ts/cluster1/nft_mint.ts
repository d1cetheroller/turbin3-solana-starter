import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata";
import wallet from "../../keys/turbin3.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  let tx = createNft(umi, {
    mint,
    name: "SERIOUS JEFF",
    symbol: "JEFF",
    uri: "https://devnet.irys.xyz/GVzuHJpKTJBdchaZRPE49SpBMx1N8YovDwWSQunkNuKS",
    sellerFeeBasisPoints: percentAmount(1, 2), // 1%
    creators: [
      {
        address: myKeypairSigner.publicKey,
        share: 100,
        verified: false
      }
    ],
    collection: null,
    uses: null
  });

  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  console.log("Mint Address: ", mint.publicKey);
})();
