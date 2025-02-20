<template>
    <div v-if="data" class="  flex h-screen w-screen flex-col " :style="getBackground">
      <div class="my-5 flex justify-end mx-5">
        <button class="bg-red-600 text-white p-2 rounded-lg " @click="deleteData" ><Trash :size="32"/></button>
      </div>
      <div class="w-10/12 mx-auto">

        <div class="w-9/12 mx-auto pt-5">
            <div class="mx-auto">
                <!-- <img :src="data.logo" class=" h-20 m-auto my-2 rounded-full" alt="logo" /> -->
                <h1 class="font-semibold text-center text-3xl uppercase text-white">{{ data.name }} </h1>
            </div>
            <div class="flex justify-between w-2/3 mx-auto my-3">
                <img v-for="item in data.socials" :src="`/${item.name}.svg`" class="h-8 "
                    @click="navigateTo(item.url, { external: true })" />
            </div>
        </div>
        <div>
          <wizard/>
        </div>

        <div>
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import {Trash} from 'lucide-vue-next';

const runtime = useRuntimeConfig();
const route = useRoute();
const userStore = getUserStore();

const getBackground = computed(() => {
  return {
    background: `linear-gradient(90deg, ${data.value.color.from} 0%, ${data.value.color.to} 100%)`
  }
});


function getParams() {
  return route.params.id;
}

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
  vapid: '',
  color: {
    from: '',
    to: '',
    text: '',
    bg: ''
  }
})


/**
 * fetch a new token for the user
 */
async function fetchTokens() {

  const response = await fetch(runtime.public.api + "/public/tokens?code=" + getParams(), {
    method: 'GET',
    credentials: 'include'
  })

  console.log(await response.text());
}


/**
 * fetch the basic info for the notification of the user
 */
async function fetchInfoNotification() {

  const response = await fetch(runtime.public.api + '/public/info?id=' + getParams(), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const content = await response.json();

  if(content.data.message == "CHANNEL_NOT_FOUND") {
    navigateTo(window.location.hostname, {external: true});


  }

  if (content.data) {
    userStore.code = getParams() as string;
    data.value = content.data;
  }
}

async function deleteData() {
    await storage.removeUser();
    userStore.$reset();





}

onMounted(async () => {
  await fetchTokens();
  await fetchInfoNotification();


})

</script>