<template>
    <div v-if="data" class="  flex h-screen w-screen flex-col " :style="getBackground">

        <div class="w-2/3 mx-auto pt-10">
            <div class="mx-auto">
                <img :src="data.logo" class=" h-20 m-auto my-2 rounded-full" alt="logo" />
                <h1 class="font-semibold text-center text-3xl uppercase text-white">{{ data.name }} </h1>
            </div>
            <div class="flex justify-between w-2/3 mx-auto my-3">
                <img v-for="item in data.socials" :src="`/${item.name}.svg`" class="h-8 "
                    @click="navigateTo(item.url, { external: true })" />
            </div>

            {{ statusMessage }}
            {{ deferedPrompt }}

            <div v-if="statusMessage.status == 'INIT'" class="my-5">
                <input type="mail" class=" px-3 py-2 text-lg font-semibold border-2 border-white w-full rounded-lg"
                    v-model="emailSubscribe" placeholder="Enter your email" />
                <button @click="haveAnAccount"
                    class="text-lg font-semibold bg-violet-900 text-white w-full py-3 rounded-lg flex  justify-center my-3">
                    <p class="flex">subscribe
                        <MoveRight class="m-auto mx-2" />
                    </p>
                </button>
            </div>


            <div v-if="statusMessage.status == 'NOT_VERIFIED' && errorMessage.message.length < 1" class="my-5">
                <div>
                    <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">
                        {{ statusMessage.message }}
                    </p>
                </div>

            </div>



            <div v-if="statusMessage.status == 'NEED_INSTALL' && errorMessage.message.length < 1" class="my-5">
                <div>
                    <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">for get notification
                        from your creators, install the app first</p>
                    <button
                        class="text-lg font-semibold bg-violet-900 text-white w-full py-3 rounded-lg flex  justify-center my-3"
                        @click="askInstall">install</button>
                </div>
            </div>


            <div v-if="(statusMessage.status == 'NOTIFICATION' && errorMessage.message.length < 1) || !haveNotification"
                class="my-5">
                <div>
                    <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">Ready enable the
                        notification and get info from your content creator</p>
                    <button
                        class="text-lg font-semibold bg-violet-900 text-white w-full py-3 rounded-lg flex  justify-center my-3"
                        @click="askNotification">enable notification</button>
                </div>
            </div>

            <div v-if="(statusMessage.status == 'ERROR_NOTIFICATION' && errorMessage.message.length < 1) || !haveNotification"
                class="my-5">
                <div>
                    <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">You
                        {{ statusMessage.message }}
                    </p>
                </div>


            </div>

            <div v-if="statusMessage.status == 'INSTALLED'">
                <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">{{ statusMessage.message }}
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { MoveRight } from 'lucide-vue-next';
import { getMessaging, getToken } from 'firebase/messaging';
import { app } from '@/config';
import { storage } from '~/utils/storage';
import firebase from 'firebase/compat/app';

const route = useRoute();
const router = useRouter();



function isIOS() {
  const browserInfo = navigator.userAgent.toLowerCase();
  
  if (browserInfo.match('iphone') || browserInfo.match('ipad')) {
    return true;
  }  if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
    return true;
  }   return false;
}
const { $initializeFirebase } = useNuxtApp();

const haveNotification = computed(() => {
    if(isIOS()) return;


    return Notification.permission === 'granted';

});
const runtime = useRuntimeConfig();
const api = runtime.public.api + '/sw/read';


let deferedPrompt = ref({});

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferedPrompt.value = e;
    console.log('beforeinstallprompt');
});



const state = ref('');
const emailSubscribe = ref('timoth.david@gmail.com');

const statusMessage = ref({
    message: '',
    status: ''
})

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
    agent: {
        os: '',
        navigator: ''
    },
    color: {
        from: '',
        to: '',
        text: '',
        bg: ''
    }
})


function CopyLink() {

    const url = runtime.public.hostname + '/' + getParams();

    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard');
    }).catch((err) => {
        alert('An error occurred, please try again later');
    });
}

const getBackground = computed(() => {


    return {
        background: `linear-gradient(90deg, ${data.value.color.from} 0%, ${data.value.color.to} 100%)`
    }
});

function getParams() {

    const params = route.params.id;


    if (params) {
        return params as string;
    }


}



function loadDefered() {

    console.log('loadDefered');

}







async function askInstall() {

    if ('serviceWorker' in navigator) {

        try {

            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service worker registered', registration);

            console.log('Service worker registered', registration);


            if (registration.active) {

                console.log(deferedPrompt.value);
                

                deferedPrompt.value.prompt();
                deferedPrompt.value.userChoice.then(async (choiceResult: any) => {
                    if (choiceResult.outcome === 'accepted') {
                        deferedPrompt.value = null;

                        const payload = {
                            email: emailSubscribe.value,
                            code: ''
                        }


                        const response = await fetch(runtime.public.api + '/install', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload),
                        });

                        const content = await response.json();

                        if (content.status_code == 200) {
                        
                            await haveAnAccount();
                        }
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                });   
            }
        } catch (error) {
            console.log('error', error);
        }
    }
}


loadManifest();



function verifyPermission() {

    if(isIOS()) return;
    state.value = Notification.permission == 'granted' ? 'notification' : '';
}

const errorMessage = computed(() => {


    const url = runtime.public.hostname + '/' + getParams();

    data.value.agent = {
        os: 'android',
        navigator: 'chrome'
    }


    if (/firefox/.test(data.value.agent.navigator) && data.value.agent.os == 'android') {

        state.value = 'error';
        return {
            message: 'firefox is not implemented, please copy the link and open it on chrome',
            os: 'android'
        }
    }

    if (/chrome|firefox/.test(data.value.agent.navigator) && data.value.agent.os == 'iphone') {
        state.value = 'error';

        return {
            message: 'ios support notification only by safari, Tap the "Share" button (📤) and select "Open in Safari".',
            os: 'ios'
        }
    }

    if (/laptop/.test(data.value.agent.os) && data.value.agent.os == 'laptop') {
        state.value = 'error';

        return {
            message: 'This feature is not available on laptop, please use a mobile device we send you the link by email',
            os: 'laptop'
        }
    }

    return {
        message: '',
        os: ''
    };

})




async function haveAnAccount() {

    if (emailSubscribe.value.length == 0) {
        alert('Please enter your email');
        return;
    }

    const payload = {
        email: emailSubscribe.value,
        code: getParams()
    }
    const response = await fetch(runtime.public.api + '/account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    })

    const content = await response.json();


    const { user_id } = content.data;


    try {
        storage.saveUserId(user_id);
    } catch (error) {
        console.log('error', error);
    }

    console.log(content);
    

    if (content.status_code == 200) {

        if (content.data.message == "WELCOME_MAIL_SEND") {
            statusMessage.value = {
                message: 'An email has been sent to you, please check your inbox to verify your account',
                status: 'WELCOME_MAIL_SEND'
            }
            return;
        }

        if (content.data.message == 'NEED_VERIFICATION') {
            statusMessage.value = {
                message: 'Your account is not verified, please check your inbox to verify your account',
                status: 'NOT_VERIFIED'
            }
            return;
        }

        if (content.data.message == 'NEED_NOTIFICATION') {
            statusMessage.value = {
                message: 'enable notification for full support of the app',
                status: 'NOTIFICATION'
            }
        }


        if (content.data.message == 'NEED_INSTALL') {
            statusMessage.value = {
                message: 'Your account is verified, now install the app to receive notifications',
                status: 'NEED_INSTALL'
            }
            return;
        }

        if (content.data.message == "INSTALLED") {
            statusMessage.value = {
                message: 'You will receive soon the first notification from your content creator, stay tuned',
                status: 'INSTALLED'
            }
            return;
        }

        state.value = 'init';


        verifyPermission();
    }

}


async function loadManifest() {

    const response = await fetch(runtime.public.api + '/manifest/' + getParams(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const content = await response.json();

    if (content.data) {
        const manifestBlob = new Blob([JSON.stringify(content.data)], { type: "application/json" });
        const manifestURL = URL.createObjectURL(manifestBlob);
        const manifestLink = document.createElement("link");

        manifestLink.rel = "manifest";
        manifestLink.href = manifestURL;
        document.head.appendChild(manifestLink);

    }



}

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
    }
}

async function askNotification() {

    if(!firebase.messaging.isSupported()) {
        statusMessage.value = {
            message: 'Your browser does not support notification, please use chrome or firefox',
            status: 'ERROR_NOTIFICATION'
        }
    }

    try {
        const permission = await Notification.requestPermission();
        console.log(permission);
        if (permission === 'granted') {
            const initToken = $initializeFirebase();

            if(initToken) {
                haveAnAccount();
            }
        
        }
        if (permission === 'denied') {
            statusMessage.value = {
                message: 'have denied the notification, please enable it to receive notification',
                status: 'ERROR_NOTIFICATION'
            }
            return;

        }
    } catch (error) {
        console.log('error', error);
    }
}




onMounted(async () => {
    await fetchInfoNotification();
    statusMessage.value.status = 'INIT';
})

</script>