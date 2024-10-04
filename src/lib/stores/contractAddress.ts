import { writable, type Writable } from 'svelte/store';

export const contractAddress: Writable<string> = writable();
