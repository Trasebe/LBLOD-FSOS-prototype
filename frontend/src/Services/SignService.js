import shajs from "sha.js";
import elliptic from "elliptic";
import { KEYUTIL } from "jsrsasign";

const preventMalleability = sig => {
  try {
    const ordersForCurve = {
      secp256r1: {
        halfOrder: elliptic.curves.p256.n.shrn(1),
        order: elliptic.curves.p256.n
      },
      secp384r1: {
        halfOrder: elliptic.curves.p384.n.shrn(1),
        order: elliptic.curves.p384.n
      }
    };
    const { halfOrder } = ordersForCurve.secp256r1;
    if (!halfOrder) {
      throw new Error(
        'Can not find the half order needed to calculate "s" value for immalleable signatures. Unsupported curve name: secp256r1'
      );
    }

    // in order to guarantee 's' falls in the lower range of the order, as explained in the above link,
    // first see if 's' is larger than half of the order, if so, it needs to be specially treated
    if (sig.s.cmp(halfOrder) === 1) {
      // module 'bn.js', file lib/bn.js, method cmp()
      // convert from BigInteger used by jsrsasign Key objects and bn.js used by elliptic Signature objects
      const bigNum = ordersForCurve.secp256r1.order;
      sig.s = bigNum.sub(sig.s); //eslint-disable-line
    }

    return sig;
  } catch (e) {
    throw new Error(`_preventMalleabilit: ${e}`);
  }
};

const signProposal = (unsignedProposal, key) => {
  try {
    const digest = shajs("sha256")
      .update(unsignedProposal)
      .digest("hex");

    const { prvKeyHex } = KEYUTIL.getKey(key);

    const { ec: EC } = elliptic;
    const ecdsaCurve = elliptic.curves.p256;

    const ecdsa = new EC(ecdsaCurve);
    const signKey = ecdsa.keyFromPrivate(prvKeyHex, "hex");
    let sig = ecdsa.sign(Buffer.from(digest, "hex"), signKey);
    sig = preventMalleability(sig, prvKeyHex.ecparams);

    // now we have the signature, next we should send the signed transaction proposal to the peer
    const signature = Buffer.from(sig.toDER());
    return {
      signature,
      proposal_bytes: unsignedProposal
    };
  } catch (e) {
    throw new Error(`signProposal: ${e}`);
  }
};

export default { signProposal };
