import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
} from "@solana/web3.js";
import wallet from "../../keys/turbin3.json";

import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("9MrsUu1wDtS9vmPST1L6WgeyUCTga9PZ5gFHauXquUHJ");

const to = new PublicKey("6Ps4s9TPf9vxMCQouX5oLHETj7rJjMPRyp7BXx6c1TM7");

(async () => {
  try {
    const fromAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    const toAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );

    const txSig = await transfer(
      connection,
      keypair,
      fromAta.address,
      toAta.address,
      keypair,
      1_000_000
    );
    console.log("txSig, ", txSig);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
