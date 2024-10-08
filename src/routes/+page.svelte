<script lang="ts">
    // This may fail, if you removed or renamed your `hello_world` contract in
    // the `/contracts` directory.
    import helloWorld from '$lib/contracts/hello_world';

    let name: string = '';
    let greeting: string[] = [];

    async function sayHello(): Promise<void> {
        const { result } = await helloWorld.hello({
            to: name || 'HackMeridian',
        });
        greeting = result;
    }
</script>

{#await sayHello() then _void}
    <h1 class="h1">{greeting.join(' ')}!</h1>
{/await}

<h2 class="h2">Let's play with that smart contract!</h2>
<p>Enter a name and click the "say hello" button.</p>
<label class="label">
    <span>Name</span>
    <input class="input" type="text" placeholder="HackMeridian" bind:value={name} />
</label>
<button class="btn variant-filled-primary" on:click={sayHello}>Say Hello!</button>

<h2 class="h2">Let's get cracking bones!</h2>
<p>Start by exploring:</p>
<ul>
    <li><code class="code">/src/routes/+layout.svelte</code> - barebones layout</li>
    <li><code class="code">/src/app.postcss</code> - app wide css</li>
    <li>
        <code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
    </li>
    <li>
        <code class="code">/src/routes/about/+page.svelte</code> - a route for you to play around with
        and experiment with different SvelteKit routing techniques
    </li>
</ul>
