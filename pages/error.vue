<template>
    <div class="">


{{  message }}

    </div>
</template>
<script lang="ts" setup>



const route = useRoute();

const message = ref('');

function getQuery() {


    const {code, navigator, os} = route.query;


    return {
        code: code as string,
        navigator: navigator as string,
        os: os as string
    }
}

function getMessage() {

    const {code, navigator, os} = getQuery();

    if(navigator == 'firefox' && os == 'android') {
        message.value = 'firefox is not implemented, please open the app on chrome'
    }

    if(/chrome|firefox/.test(navigator) && os == 'ios') {
        message.value = 'ios support notification only by safari, please open the app with safari'
    }

}

onMounted(async () => {
    getMessage();
})

</script>