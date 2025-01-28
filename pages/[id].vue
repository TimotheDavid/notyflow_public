<template>
    <div v-if="data"  class="  flex h-screen w-screen flex-col" :style="getBackground" >

        <div class="w-2/3 mx-auto pt-10">
            <div class="mx-auto">
                <img :src="data.logo" class=" h-20 m-auto my-2 rounded-full" alt="logo"/>                
                <h1 class="font-semibold text-center text-3xl uppercase text-white">{{ data.name }} </h1>
            </div>
            <div class="flex justify-between w-2/3 mx-auto my-3">
                <img v-for="item in data.socials" :src="`/${item.name}.svg`" class="h-8 " @click="navigateTo(item.url, {external: true})"/>
            </div>
        </div>
        <div class="flex w-fit mx-auto my-auto" v-if="haveNotification">
            <button @click="askNotification"
                class=" mx-auto w-fit max-w-60 px-5 py-2 text-xl font-semibold  border-2 border-white rounded-lg" :style="`color: #${data.color.text ?? 'fff'}`">{{ data.notify }}</button> 
        </div>

        <div class="my-auto" v-else>
            <p class="w-2/3 mx-auto text-xl my-auto  rounded-lg p-3 font-sans font-semibold" :style="`color: #${ data.color.text ?? 'fff'};`" :class="`bg-[#${data.color.bg ?? '000'}]/30`">Thanks for subscribe, you will receive info soon</p>
        </div>

    </div>
</template>
<script lang="ts" setup>
import { getMessaging, getToken  } from 'firebase/messaging';
import { app } from '@/config';

const route = useRoute();
const router = useRouter();

const haveNotification = computed(() => {
    return Notification.permission !== 'granted';
    
});

const runtime = useRuntimeConfig();


type SocialInfo = {
    name: string,
    url: string
}

const data = ref({
    name: '',
    logo: '',
    socials: [] as SocialInfo[],
    description: '',
    notify: '',
    color: {
        from: '',
        to: '',
        text: '',
        bg: ''
    }
})

const getBackground = computed(() => {
    return {
        background: `linear-gradient(90deg, #${data.value.color.from} 0%, #${data.value.color.to} 100%)`
    }
});

function getParams() {

    const params = route.params.id;


    if (params) {
        return params as string;
    }


}

const messaging = getMessaging(app);



async function fetchInfoNotification() {

    const response = await fetch(runtime.public.api + '/info?id=' + getParams(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const content = await response.json();

    if (content.data) {
        data.value = content.data;
    } else {
        alert('No data found');
        router.back();
    }

}


async function askNotification() {


    getToken(messaging, { vapidKey: runtime.public.vapid_key }).then(async (currentToken) => {
        if (currentToken) {
            
            const body = {
                token: currentToken,
                url: getParams()
            };

            const content = await fetch(runtime.public.api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await content.json();

            

            if(data.data.status === 'already_exist') {
                alert('You are already subscribed to this content');
                return;
            }

            if (data.data.status === 'success') {
                alert('You will be notified when new content is available');
            } else {
                alert('An error occurred, please try again later');
            }

        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });
}

onMounted(async () => {
    await fetchInfoNotification();
})

</script>