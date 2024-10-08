import { Account, StrKey } from '@stellar/stellar-sdk';
import { Server } from '@stellar/stellar-sdk/rpc';
import { PasskeyKit, SACClient } from 'passkey-kit';

import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_FACTORY_CONTRACT_ADDRESS,
    PUBLIC_NATIVE_CONTRACT_ADDRESS,
} from '$env/static/public';
import type { Tx } from '@stellar/stellar-sdk/contract';

export const mockPubkey = StrKey.encodeEd25519PublicKey(Buffer.alloc(32));
export const mockSource = new Account(mockPubkey, '0');

export const rpc = new Server(PUBLIC_STELLAR_RPC_URL);

export const account = new PasskeyKit({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    factoryContractId: PUBLIC_FACTORY_CONTRACT_ADDRESS,
});

const sac = new SACClient({
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
});

export const native = sac.getSACClient(PUBLIC_NATIVE_CONTRACT_ADDRESS);

export async function send(tx: Tx) {
    return fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
            xdr: tx.toXDR(),
        }),
    }).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}

export async function getContractId(signer: string) {
    return fetch(`/api/contract-id/${signer}`).then(async (res) => {
        if (res.ok) return res.text();
        else throw await res.text();
    });
}

export async function fundContract(address: string) {
    return fetch(`/api/fund/${address}`).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}
