import wallet from "../../keys/turbin3.json";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://devnet.irys.xyz/5Hna4arkfJNvBsBBgvthPybSKELcJV2vTbr6i8mfSgxu";

    const metadata = {
      name: "Serious Jeff",
      symbol: "JEFF",
      description: "SERIOUS-MODE Jeff",
      image,
      attributes: [{ trait_type: "Actor", value: "Jeff" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image
          }
        ]
      },
      creators: []
    };

    const file = createGenericFile(JSON.stringify(metadata), "metadata.json", {
      contentType: "application/json"
    });

    const [myUri] = await umi.uploader.upload([file]);

    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();

//
// https://arweave.net/DPaMeShNFFHkP8CSjGQfse4pwTtqHMVbHtqKPBkNsozV
// https://devnet.irys.xyz/GVzuHJpKTJBdchaZRPE49SpBMx1N8YovDwWSQunkNuKS
