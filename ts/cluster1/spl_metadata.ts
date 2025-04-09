import wallet from "../../keys/turbin3.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
  MPL_TOKEN_METADATA_PROGRAM_ID
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { PublicKey } from "@solana/web3.js";

const mint = publicKey("9MrsUu1wDtS9vmPST1L6WgeyUCTga9PZ5gFHauXquUHJ");

const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    const [metadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), new PublicKey(mint).toBuffer()],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );

    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      // metadata: metadataPda,
      mint,
      mintAuthority: signer
    };

    let data: DataV2Args = {
      name: "Pudgy Penguin",
      symbol: "PENGU",
      uri: "https://arweave.net/nFo9Nwcam4ek0SwtKQchYD47T9dkTpGqL62CgcXSjZE",
      sellerFeeBasisPoints: 100, // 1%
      creators: null,
      collection: null,
      uses: null
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: false,
      collectionDetails: null
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args
    });
    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
