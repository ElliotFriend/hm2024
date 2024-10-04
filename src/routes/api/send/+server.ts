import { server } from '$lib/server/passkeyServer';
import { TransactionBuilder } from '@stellar/stellar-sdk';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';
import type { Tx } from '@stellar/stellar-sdk/contract';

export const POST: RequestHandler = async ({ request }) => {
    const { xdr } = await request.json();
    const tx = TransactionBuilder.fromXDR(xdr, PUBLIC_STELLAR_NETWORK_PASSPHRASE) as Tx;
    const res = await server.send(tx);
    return json(res);
};
