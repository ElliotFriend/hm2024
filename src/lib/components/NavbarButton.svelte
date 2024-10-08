<script>
    export let item;
</script>

<a href={item.href} class="btn hover:variant-soft-primary">
    <span><svelte:component this={item.icon} /></span>
    <span>{item.name}</span>
</a>
