# HackMeridian Workshop <!-- omit in toc -->

This is a frontend template, based on my own [SvelteKit + Passkeys template](https://github.com/elliotfriend/soroban-template-sveltekit-passkeys). It's customized and ready for use in my HackMeridian 2024 workshop.

## Intro <!-- omit in toc -->

Welcome back from lunch! My name is Elliot Voris. I’m so lucky to be a Developer Advocate, and Jack-of-all-trades at SDF, and I am super pumped to be with you all!

As a way to get back into the groove, after lunch, I wanted to play a game with everybody! This is actually going to demonstrate the end-product of some of the techniques and tools we’ll be covering today.

In this game, you’ll all be rolling three 6-sided dice. You’re trying to roll all sixes, and the first person to do so will win a prize! A Launchtube token for Mainnet! So, I’m going to deploy a new game contract right now, and you can use this QR code to access the game page. Go ahead and click the signup button, and you’ll be prompted to create a new (Testnet) smart wallet using a passkey on your device. After that, you can click the roll button, sign the transaction using your passkey and send it off to the blockchain.

You know what, this is taking a little too long, let’s speed this up here. I’m going to invoke this special call_it function, and then everyone will be a winner!

**Transition:** Ok, congratulations on winning, everybody! Let’s put our phones down and get back to the hackathon!

## Recap and Groundwork <!-- omit in toc -->

To recap what you’ve done so far with my amazing coworkers, you’ve:

- gotten setup and familiar with the Stellar network,
- you’ve got the CLI and Soroban Rust SDK installed and ready to go,
- and you’ve probably deployed and invoked a smart contract or two, maybe running some tests along the way

Way to go! That’s no trivial thing!! Now, what we’re going to do in this workshop is take those contract interactions out of the realm of the command line, and tie it together into a passkey-powered frontend. How are we going to do that? Great question! Here’s the roadmap for where we’re headed:

- [1. Look at this contract](#1-look-at-this-contract)
- [2. Add a frontend template using the CLI](#2-add-a-frontend-template-using-the-cli)
- [3. Generate some typescript bindings](#3-generate-some-typescript-bindings)
  - [Manual](#manual)
  - [Automated](#automated)
- [4. Import those bindings into the frontend](#4-import-those-bindings-into-the-frontend)
- [5. Run the frontend, see if it works](#5-run-the-frontend-see-if-it-works)
- [6. Invoke the (read-only) hello world contract](#6-invoke-the-read-only-hello-world-contract)
- [7. Connect using passkeys](#7-connect-using-passkeys)
  - [Three Passkey Functions](#three-passkey-functions)
    - [Signup](#signup)
    - [Login](#login)
    - [Logout](#logout)
- [8. Invoke the D20 contract](#8-invoke-the-d20-contract)

1. First, we’ll use that same stellar contract init command to bring in a frontend template that we’ll be able to hook into our existing smart contract code.
2. Next, we’ll generate some typescript bindings for our smart contract, making a fully-typed NPM package out of it (both manually, and automated)
3. Then, we’ll do some really basic frontend interactions with a smart contract, no authentication or gas fees required!
4. Then, with the groundwork laid, we’ll tie everything together with a passkey-powered smart wallet that will allow us to securely and seamlessly get people on-boarded onto our dapp with very little friction!
   - This passkey part will rely on three things: PasskeyKit, Launchtube, and the Mercury data indexer. We’ll try to cover Launchtube and Mercury later on, if we have time for it. But, PasskeyKit makes both of those much easier.

**Transition:** So, let’s get building!

## Let’s Build Something <!-- omit in toc -->

### 1. Look at this contract

If you’ve been following along, or poking around with the Stellar CLI, you’ll probably have a smart contract or two in a directory. This is the one I’ve made for the workshop today. It’s a really simple dice simulator. There’s one function, roll, and when you invoke it, the contract uses Soroban’s pseudo-random number generator to simulate rolling two twenty-sided dice (D20s). We don’t need to go through this whole thing, but I just want to point out a few things that might feel familiar, and will also come up later on.

- We have a custom contract type. This is what the contract is storing on-chain every time you roll the dice.
- We have a function parameter that will have to be supplied when we invoke the contract
- We have a return type that we’ll get back from a successful contract invocation

Otherwise, the function is just RNG-ing its way to sending you two numbers, representing the dice you rolled.

**Transition:** So, now we’ve got a contract we want to turn into a dapp. For that, we’ll bring in some frontend goodness.

### 2. Add a frontend template using the CLI

One of my favorite methods of doing this is to use the CLI. I’m going to use that same stellar contract init command that you saw Chris and Carsten using in the current directory. This time, though, I’m providing the --frontend-template flag and a git repository to clone.

```bash
stellar contract init . --frontend-template https://github.com/elliotfriend/soroban-template-sveltekit-passkeys
```

This is a template I’ve created, and it brings together SvelteKit and PasskeyKit to take care of a lot of the boilerplate code. I’m trying to make this workshop as Vanilla JS as I can, so even if you’re unfamiliar with SvelteKit, don’t worry, you should be able to follow along just fine.

Dropping a few links and resources, though, all of these are in the handbook. Use them to follow along, if you want.

- My template: www.example.com
- Search github for more templates: www.example.com (i’m not the only one writing these things)
- The meridian roller source code: www.example.com (this leans a bit more into the SvelteKit part of the template, but it is a useful resource nonetheless)
-
TODO: (brief tour of the directory now)

**Transition:** I’ll pnpm install, and we’re pretty much ready to start building.

### 3. Generate some typescript bindings

Let’s turn our attention to how we’ll interact with the deployed smart contract. This is where the TypeScript bindings come in! But, I hear you ask: What are TypeScript bindings?

These bindings are a feature of the Stellar CLI that will generate and produce a fully typed NPM package ready for integration into your frontend. This means you can import and invoke a smart contract as if it were any other nodejs package! You get typed functions for each of your contract’s functions, and those will result in a built, simulated, signable, and submittable assembled transaction!

This can be done with ANY contract that’s live on the network! Or, you can use it on contracts you’ve only compiled locally, too.

#### Manual

Let’s make some bindings for the hello world contract:

```bash
stellar contract build --package hello-world
stellar contract deploy --network testnet --source alice --wasm ./target/wasm32-unknown-unknown/release/hello_world.wasm
stellar contract bindings typescript --network testnet --id CONTRACT_ADDRESS --output-dir ./packages/hello_world --overwrite
```

So, let’s look at what we’ve got there. The /packages/hello_world directory looks just like any other javascript package. Let’s take a look at the exported types, and we can see it’s going to provide us with a roll function that takes a string called roller and returns an array of numbers. Just like our contract’s interface! Noice!

**Transition:** Now, that’s a pretty nifty trick! But, doing this for every single contract, and so many times, throughout the development process can be a real pain!

#### Automated

So, let’s take it a step further. Inside this frontend template, I’ve got an initialize.js script that will automate this whole process for all of the contracts in the /contracts directory. Most of this script is broken into a few distinct functions, and we can get a sense of what’s happening by looking at the end of the script, where all those functions are called. It’s creating and funding a keypair, building all the contracts, deploying all the contracts, generating the bindings for all of them, and importing the bindings packages into my frontend code. I made a package script out of it, so I can run it easily like:

```bash
pnpm run setup
```

> _Note:_ Something buggy happens with my script, and it will error the first time through. I haven’t yet figured out what is wrong with it, but the second time’s the charm! 🤷

We can now see in our /packages directory, we have a new d20_roller package, and a corresponding import file in our /src/lib/contracts directory. Amazing!

**Transition:** But, we’re getting an error in this import file. VS Code can’t find the d20_roller package to import?? 🤔

### 4. Import those bindings into the frontend

Oh yeah! This is a problem that trips up a lot of people. How do we get a local package (like these generated ts bindings) included into a larger project? We can use the bindings directory as a “local dependency”! It’s as easy as:

```bash
pnpm install --save-dev file:./packages/hello_world file:./packages/d20_roller
```

There’s more than one way to accomplish this. You can use npm link (or the equivalent in your chosen package manager), set up a workspace for your project, etc. I’ve found the most reliable way to accomplish this is to use this kind of file:./location strategy. ymmv.

**Transition:** Now that those bindings have been generated and imported, let’s see if we can start this barebones dapp and get some things working!

### 5. Run the frontend, see if it works

If all has gone according to plan, we can get this thing up and running with a quick and easy:

```bash
pnpm run dev
```

Fingers crossed, and everything works! Holy moly!

TODO!! Probably errors if i haven’t copied env file (or if i need to run pnpm run dev for the first time) (or if i need to restart the SvelteKit and/or TS language server)

**Transition:** It’s working, so let’s see how it interacts with one of these contracts.

### 6. Invoke the (read-only) hello world contract

So, we can make our way into the /src/routes/+page.svelte file, this is where the “main” part of this app is. Again, ignore the SvelteKit of it all for now. We’ve already got the function written for invoking the hello world contract inside the frontend template. Let’s look at what it’s doing.

```ts
import helloWorld from '$lib/contracts/hello_world';

let name: string = '';
let greeting: string[] = [];

async function sayHello(): Promise<void> {
    const { result } = await helloWorld.hello({
        to: name || 'HackMeridian',
    });
    greeting = result;
}
```

This is what it looks like to utilize one of these generated binding packages.

- We’re importing the contract client as helloWorld
- We have a name and greeting variable declared. name is bound to the value in our text input.
- And a sayHello function to invoke the contract
  - We provide name as the to parameter from our contract (or a substitute if name is a falsy value).
  - We store the result in the greeting variable

Further down, the greeting variable is used to populate the `h1` tag for this page. We can put whatever we like in this text box, click the button, and the smart contract runs, returns the array of strings, and updates the `h1` content.

You probably noticed we haven’t signed or submitted any transactions to the network. What gives!?

The generated bindings are smart enough to realize that this is a read-only contract invocation. That is, we’re not actually changing any on-chain state. So, it just simulates the transaction, realizes we don’t actually need to put the transaction on-chain, and calls it good. Super cool!

**Transition:** But, what about more complex interactions? How do we sign and submit transactions that do need to end up on-chain? That’s where we’ll take advantage of the power of passkeys!

### 7. Connect using passkeys

#### What are passkeys? <!-- omit in toc -->

If you’ve ever used a fingerprint or your face to unlock a phone, login to some website, etc. you’ve used passkeys! If you played along with our little game earlier today, you’ve used passkeys! They’re a secure, robust, and easy way to authenticate a user with the service they’re wanting to use. Big companies have worked hard to make this security available to everyone, and now we can natively use that technology to sign for transactions on-chain! Amazing!

#### What’s this passkey kit? <!-- omit in toc -->

Like I mentioned earlier. For this to be a seamless on-boarding process for users and for developers, we’re using a few moving pieces:

- Launchtube streamlines the process of getting transactions on-chain. It’s similar to a paymaster service, and takes out all the headache of gas fees, sequence numbers, etc. Just send a signed (soroban) transaction to it, and it takes care of the rest!
- Mercury indexes the data and events from smart wallet contracts, and gives us a means to reverse-lookup the smart wallet address, given the user’s passkey ID they provide when logging in. (Zephyr is a pretty important part of this process, but that’s a bit outside the scope of this workshop)
- Finally, PasskeyKit makes it super easy to utilize both of these. Barely an inconvenience!

#### How do we do it? <!-- omit in toc -->

First, let’s look at the pieces of the passkey kit that are already done and dusted as part of the frontend template. Most of this is going to be the same (or nearly) stuff for every dapp. So, I thought (for my own convenience) I’d throw it into the template, so I don’t have to keep re-writing it.

/src/lib/server/passkeyServer.ts exports an instance of the  PasskeyServer class (called server) and is a server-only module that facilitates the communication between your dapp and Mercury and Launchtube. It’s server-only because it uses JWTs and secrets from our .env file that we don’t want exposed client-side. This server instance is used in some of the /src/routes/api routes to make it easier for our client-side logic to send transactions through Launchtube, lookup contract addresses from Mercury, etc. (Again, these are typical needs for a passkey kit dapp, so I’ve just written everything in here already.)

/src/lib/passkeyClient.ts exports an instance of the PasskeyKit class (called account), as well as a bunch of other useful stuff. SAC clients, an RPC server instance, and wrapper functions for using this dapp’s API routes. This account is the primary means by which our client-facing code will interact with passkeys for transaction signing.

**Transition:** Now, for our dapp, we’ll need to fill out three functions to make use of this server and account setup we have.

#### Three Passkey Functions

These are all stubbed out in the template, and they all live in the ConnectButtons.svelte component. I’ve added some try/catch blocks, toast logic for errors, but it’s up to you to implement what you need.

I’m going to declare two variables up at the top of the component. contractId (our smart wallet address) and keyId (our passkey’s ID, of course). When a user signs up, or logs in, we’ll use those variables to hold that information. We’re going to end up using stashing them in localStorage, so they’re available throughout the rest of the dapp.

##### Signup

```ts
// do your signing up stuff here
const wallet = await account.createWallet('hack meridan', 'hacker')

keyId = wallet.keyId_base64,
console.log(keyId)
localStorage.setItem('hm:key', keyId)
contractId = wallet.contractId
localStorage.setItem('hm:contract', contractId)
console.log(contractId)

await send(wallet.built)
await fundContract(contractId)
```

##### Login

```ts
// do your logging in stuff here
const wallet = await account.connectWallet({
    keyId: keyId ?? undefined,
    getContractId: getContractId,
})

keyId = wallet.keyId_base64,
console.log(keyId)
localStorage.setItem('hm:key', keyId)
contractId = wallet.contractId
localStorage.setItem('hm:contract', contractId)
console.log(contractId)
```

##### Logout

```ts
// do your logging out stuff here
localStorage.removeItem('hm:key')
localStorage.removeItem('hm:contract')
window.location.reload()
```

**Transition:** Now that our users are authenticated, let’s put those passkeys to work!

### 8. Invoke the D20 contract

Back in our /src/routes/+page.svelte file, we’re ready to make a new function to invoke our dice contract. We’ll call it rollDice and it’s gonna look pretty similar to our sayHello function, but with added signing stuff.

```ts
let contractAddress: string
let keyId: string
let rollResult: number[] = []

onMount(async () => {
    if (browser) {
        if (!localStorage.hasOwnProperty('hm:key')) {
            let wallet = await account.connectWallet({
                keyId: keyId!,
                getContractId: getContractId,
            })
            contractAddress =  wallet.contractId;
            keyId = wallet.keyId_base64;
        } else {
            contractAddress =  localStorage.getItem('hm:contract')
            keyId = localStorage.getItem('hm:key')
        }
    }
})

const rollDice = async () => {
    console.log('rolling dice');
    try {
        const at = await diceGame.roll({
            roller: contractAddress
        });

        await account.sign(at, { keyId: $keyId });
        const res = await send(at.built!);

        let result = xdr.TransactionMeta.fromXDR(res.resultMetaXdr, 'base64');
        // @ts-ignore
        rollResult = scValToNative(result.value().sorobanMeta().returnValue());
    } catch (err) {
        console.error(err);
    }
};
```

Just like that, we have our frontend interacting with our smart contract, which is being interacted with by smart wallets, which is using passkeys for signature verification. It’s pretty much smart all the way down!

**Transition:** Now, let’s wrap up and recap what we’ve done during this workshop.

## Let's Wrap Up <!-- omit in toc -->
