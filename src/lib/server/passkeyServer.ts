import { PasskeyServer } from 'passkey-kit';

import {
    PUBLIC_LAUNCHTUBE_URL,
    PUBLIC_MERCURY_URL,
    PUBLIC_STELLAR_RPC_URL,
} from '$env/static/public';
import { PRIVATE_LAUNCHTUBE_JWT, PRIVATE_MERCURY_JWT } from '$env/static/private';

export const server = new PasskeyServer({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    launchtubeUrl: PUBLIC_LAUNCHTUBE_URL,
    launchtubeJwt: PRIVATE_LAUNCHTUBE_JWT,
    mercuryUrl: PUBLIC_MERCURY_URL,
    mercuryJwt: PRIVATE_MERCURY_JWT,
});
