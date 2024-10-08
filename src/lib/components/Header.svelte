<script lang="ts">
    import ConnectButtons from '$lib/components/ConnectButtons.svelte';
    import BookA from 'lucide-svelte/icons/book-a';
    import NavbarButton from './NavbarButton.svelte';

    const menuItems = [
        {
            name: 'About',
            href: '/about',
            icon: BookA,
        },
    ];
</script>

<header class="bg-surface-100-800-token shadow-xl p-4 z-5">
    <div class="flex justify-between">
        <div class="flex items-center">
            <a class="link" href="/" title="SvelteKit Passkeys Home">
                <span class="text-xl"><strong>SvelteKit Passkeys</strong></span>
            </a>
        </div>
        <div class="flex space-x-4 pl-8">
            {#each menuItems as item}
                <NavbarButton {item} />
            {/each}
        </div>
        <div class="flex gap-4">
            <ConnectButtons />
        </div>
    </div>
</header>
