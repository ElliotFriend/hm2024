<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    let toastStore = getToastStore();

    async function signup() {
        console.log('signing up');
        try {
            // do your signing up stuff here
        } catch (err) {
            console.log('err', err);
            toastStore.trigger({
                message: 'Something went wrong signing up. Please try again later.',
                background: 'variant-filled-error'
            });
        }
    }

    async function login() {
        console.log('logging in');
        try {
            // do your logging in stuff here
        } catch (err) {
            console.log('err', err);
            toastStore.trigger({
                message: 'Something went wrong logging in. Please try again later.',
                background: 'variant-filled-error'
            });
        }
    }

    function logout() {
        console.log('logging out');
        try {
            // do your logging out stuff here
        } catch (err) {
            console.log('err', err);
            toastStore.trigger({
                message: 'Something went wrong logging out. Please try again later.',
                background: 'variant-filled-error'
            });
        }
    }
</script>

<button type="button" class="btn variant-filled-secondary" on:click={() => login()}
    >Login</button
>
<button type="button" class="btn variant-filled-primary" on:click={signup}>Signup</button>
<button type="button" class="btn variant-filled-secondary" on:click={logout}>Logout</button>
