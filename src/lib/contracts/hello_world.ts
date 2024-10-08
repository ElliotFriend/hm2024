import * as Client from 'hello_world';
import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
} from '$env/static/public';

export default new Client.Client({
    contractId: Client.networks.testnet.contractId,
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
});
