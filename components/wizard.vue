<template>
<div>
  <div v-if="statusMessage.status == 'INIT'" class="my-5">
    <input v-model="emailSubscribe.email" class=" px-3 py-2 text-lg font-semibold border-2 border-white w-full rounded-lg"
           placeholder="Enter your email" type="mail" />
    <button class="text-lg font-semibold bg-violet-900 text-white w-full py-3 rounded-lg flex  justify-center my-3"
            @click="connectUser">
      <p class="flex">subscribe
        <MoveRight class="m-auto mx-2" />
      </p>
    </button>
    <div>
      <div v-if="emailSubscribe.error">
        <p class="bg-red-500 text-white font-semibold p-2 rounded-lg ">please use an email of forms of contact@notyflow.com</p>
      </div>
    </div>
  </div>
  <div v-if="statusMessage.status == 'NOT_VERIFIED'" class="my-5">
    <div>
      <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">
        {{ statusMessage.message }}
      </p>
    </div>
  </div>
  <div v-if="statusMessage.status == 'NEED_INSTALL'" class="my-5">
    <div>
      <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">for get notification
        from your creators, install the app first</p>
      <button
          class="text-lg font-semibold bg-violet-900 text-white w-full py-3 rounded-lg flex  justify-center my-3"
          @click="askInstall">install</button>
    </div>
  </div>
  <div v-if="statusMessage.status == 'NOTIFICATION' && checkStandalone" class="my-5">
    <div>
      <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">Ready enable the
        notification and get info from your content creator</p>
      <button
          class="text-lg font-semibold bg-violet-900 text-white w-full py-3 rounded-lg flex  justify-center my-3"
          @click="askNotification">enable notification</button>
    </div>
  </div>
  <div v-if="statusMessage.status == 'NOTIFICATION' && !checkStandalone" class="my-5">
    <div>
      <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">Open the app and get the best of your content creator</p>
    </div>
  </div>

  <div v-if="statusMessage.status == 'ENABLE_IOS_NOTIFICATION'" class="my-5">
    <div :class="notificationDisabled ? 'border-4 border-fuchsia-600': ''" class="bg-violet-900 w-full p-3  rounded-lg  text-white">
      <h1 class="text-white font-bold">Notification are disabled by default on IOS</h1>
      <p class="text-white underline">For enable them follow the process</p>
      <ol class="gap-2" type="A">
        <li>Open Settings</li>
        <li>Go To Safari</li>
        <li>Go To Notification</li>
        <li>Find the current App</li>
        <li>Come back and enable notification</li>
      </ol>
    </div>
    <button
        class="text-lg font-semibold bg-violet-900 text-white w-full py-3 rounded-lg flex  justify-center my-3"
        @click="askNotification">enable notification</button>

  </div>
  <div v-if="(statusMessage.status == 'ERROR') && statusMessage.message.length > 0" class=" my-5">
    <div>
      <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">
        {{ statusMessage.message }}
      </p>
    </div>
  </div>

  <div v-if="statusMessage.status == 'INSTALLED'">
    <p class="text-lg font-semibold text-white bg-violet-900/5 p-2 rounded-lg ">{{ statusMessage.message }}
    </p>
  </div>
  </div>
</template>
<script setup lang="ts">

import { MoveRight, Trash } from 'lucide-vue-next';
import { storage } from '~/utils/storage';

const route = useRoute();
const {$pwa} = useNuxtApp();
const runtime = useRuntimeConfig();
const userStore = getUserStore();

const checkStandalone = computed(() => {
  return window.matchMedia('(display-mode: standalone)').matches;


})

const emailSubscribe = ref({
  email: '',
  error: false
});


userStore.$subscribe(() => {
  const user = userStore.getUser;
  statusMessage.value.status = user.status;

})

const statusMessage = ref({
  message: '',
  status: ''
})

type SocialInfo = {
  name: string,
  url: string
}

const userId = ref<string|null>();

const agent = ref({
  os: '',
  navigator: ''
})

const notificationDisabled = ref(false);

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
  vapid: '',
  color: {
    from: '',
    to: '',
    text: '',
    bg: ''
  }
})

/**
 * check if pwa is installed
 */
async function checkPWAInstalled() {


  if(data.value.agent.navigator != 'safari' && data.value.agent.os != 'ios') return;

  const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

  if(!userId.value) return;

  if(isInstalled) {

    const response = await fetch(runtime.public.api + '/install', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        code: getParams(),
        userId: userId.value,
      })
    });
  }
}



async function registerServiceWorker() {

  if(!('serviceWorker' in navigator)) {
    statusMessage.value = {
      message: 'the app cannot be used in this navigator, please use chrome on android and safari on ios',
      status: 'ERROR'
    }
    return;
  };

  await navigator.serviceWorker.register('/sw.js');
  console.log("registerServiceWorker");
}

function verifyOsNavigator() {
  if (data.value.agent.navigator == 'firefox' && data.value.agent.os == 'android') {
    statusMessage.value = {
      message: 'You are using firefox on android, please install the app to receive notification',
      status: 'ERROR'
    }
    return false;
  }

  if(data.value.agent.navigator == "ecosia") {
    statusMessage.value = {
      message: 'You are using ecosia, please use chrome on android and safari on ios',
      status: 'ERROR'
    }
    return false;
  }

  if(data.value.agent.navigator == 'chrome' && data.value.agent.os == 'ios') {
    statusMessage.value = {
      message: 'You are using chrome on ios, please use safari to use the app',
      status: 'ERROR'
    }
    return false;
  }

  if(data.value.agent.navigator == 'firefox' && data.value.agent.os == 'ios') {
    statusMessage.value = {
      message: 'You are using firefox on ios, please use safari to use the app',
      status: 'ERROR'
    }
    return false;
  }
  return true;
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


async function deleteData() {
  await storage.removeUser();
  userId.value = null;
  statusMessage.value.status = 'INIT';
}


async function verifyIsInstalled() {

  if(!$pwa) return;

  if(!userId.value) return;

  if(!$pwa.isPWAInstalled) return;

  const payload = {
    userId: userId.value,
    code: getParams()
  }

  const response = await fetch(runtime.public.api + '/install', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

function verifyNotification () {
  if(Notification.permission == "denied") {
    statusMessage.value = {
      message: "You need to enable the notification to fully use the app",
      status: 'ERROR'
    }
    return;
  }else {
    return false;
  }

}


async function askInstall() {

  if(!$pwa) return;

  if(!userId.value) return;

  if ('serviceWorker' in navigator) {
    const installed = await $pwa.install();

    const payload = {
      userId: userId.value,
      code: getParams()
    }

    if(installed && installed.outcome == 'accepted') {
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
    }
  }
}

async function connectUser() {

  if(emailSubscribe.value.email == '') {
    alert('Please provide an email address');
    return;
  }

  if(emailSubscribe.value.email.indexOf('@') == -1) {
    emailSubscribe.value.error = true;
    return;
  }



  const response = await fetch(runtime.public.api + '/account', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      email: emailSubscribe.value.email,
      code: getParams()
    })
  });

  const content = await response.json();

  if(content.data.user_id) {

    userStore.$state = {
      userId: content.data.user_id,
      code: getParams() as string
    }

    await storage.saveUserId(content.data.user_id);
    userId.value = content.data.user_id;
    await haveAnAccount();
  }
}



async function haveAnAccount() {
  if(!userId.value) {
    statusMessage.value.status = 'INIT';
  }

  const payload = {
    userId: userId.value,
    code: getParams()
  }

  const response = await fetch(runtime.public.api + '/workflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const content = await response.json();



  if(data.value.agent.os == 'laptop') {
    statusMessage.value = {
      message: 'You are using a laptop, please use your navigator on your mobile, we send you a link to enable it',
      status: 'ERROR'
    }
    return;
  }

  if(!verifyOsNavigator()) return;

  if (content.status_code == 200) {

    statusMessage.value = {
      message: '',
      status: ''
    }




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

    if(content.data.message == 'NEED_NOTIFICATION' && !checkStandalone) {
      statusMessage.value = {
        status: "OPEN_THE_APP_CONTINUE",
        message: "open in the app to continue"
      }
      return;
    }

    if (content.data.message == 'NEED_NOTIFICATION' && checkStandalone) {
      if(data.value.agent.navigator == 'safari' && data.value.agent.os == 'ios' && Notification.permission === "denied") {
        statusMessage.value = {
          status: "ENABLE_IOS_NOTIFICATION",
          message: ""
        }
        return;
      }
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

    if(content.data.message == "RATE_LIMIT") {
      statusMessage.value = {
        message: 'we limit the number of user who can subscribe, please try again later',
        status: 'ERROR'
      }
    }
  }

}


async function loadManifest() {

  if(!userId.value) {
    statusMessage.value.status = 'INIT';
    return;
  }

  const user = userId.value;

  const response = await fetch(runtime.public.api + '/manifest/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: getParams(), userId: user  }),
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


/**
 * fetch the basic info for the notification of the user
 */
async function fetchInfoNotification() {

  const response = await fetch(runtime.public.api + '/info?id=' + getParams(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const content = await response.json();

  const currentUser =  await storage.getUserId();

  if (content.data) {
    data.value = content.data;
  }

  statusMessage.value.status = "INIT";

  if(currentUser && currentUser != "undefined") {

    userStore.$state = {
      userId:  currentUser as string,
      code: getParams() as string,
    }

    userId.value = currentUser;




    await haveAnAccount();
    return;
  }
}


/**
 * ask if the user allow notification
 */
async function askNotification() {

  if(!$pwa) return;

  if(!$pwa.isPWAInstalled) {
    await  askInstall();
  }

  if(!userId) {
    statusMessage.value.status = 'INIT';
    return;
  }

  await Notification.requestPermission(async (request) => {

    if(request == "granted") {

      const registration = await navigator.serviceWorker.getRegistration('/');

      if(!registration) return;

      const payload = {
        userVisibleOnly: true,
        applicationServerKey: data.value.vapid,
      }
      const subscription = await registration.pushManager.subscribe(payload);

      await fetch(runtime.public.api + '/notification', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription, code: getParams(), userId: userId.value }),
      });

      statusMessage.value = {
        message: 'You will receive soon the first notification from your content creator, stay tuned',
        status: 'INSTALLED'
      }
    } else {


      notificationDisabled.value = true;
      if(data.value.agent.navigator == 'safari') {
        statusMessage.value = {
          message: "",
          status: "ENABLE_IOS_NOTIFICATION"
        }


      }

    }
  })
}

onMounted(async () => {
  await registerServiceWorker();
  await checkPWAInstalled();
  await fetchInfoNotification();
  await loadManifest();

})




</script>