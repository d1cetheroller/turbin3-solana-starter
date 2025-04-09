import wallet from "../../keys/turbin3.json";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    const imageBuffer = await readFile("./cluster1/serious_jeff.jpg");

    const imgFile = createGenericFile(imageBuffer, "image.png", {
      contentType: "image/png"
    });

    const [imageUri] = await umi.uploader.upload([imgFile]);

    console.log("Your image URI: ", imageUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();

//  https://arweave.net/5uaERGat3787kpKSPaCNiTBfbBfx2owq3aQDWwr8pBxY
// https://devnet.irys.xyz/5Hna4arkfJNvBsBBgvthPybSKELcJV2vTbr6i8mfSgxu
