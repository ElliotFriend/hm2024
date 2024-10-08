<script lang="ts">
    import '../app.postcss';
    import { initializeStores, Toast } from '@skeletonlabs/skeleton';
    initializeStores();

    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<Toast />

<div class="h-screen grid grid-rows-[auto_1fr_auto]">
    <Header />

    <div class="container mx-auto grid grid-cols-1">
        <main class="p-4 space-y-4 mt-8">
            <slot />
        </main>
    </div>

    <Footer />
</div>
