<template>
      <div class="h-screen ">
        <div class="h-2/3 overflow-y-auto py-3">
        <div v-for="item in data" :key="item.id" class="my-5 mx-2" @click="openToPost(item)">
          <div class="bg-white py-2 px-2 rounded-lg min-h-14">
          <div class="text-violet-950 font-semibold  flex  justify-between">
            <h1 class="text-violet-950 font-semibold ">{{ item.title}}</h1>
            <h1>{{ new Date(item.send_at).toLocaleDateString() }}</h1>
          </div>
            <div>
              <p class="text-black font-normal font-sans py-2">{{ item.message }}</p>
            </div>
            <div class="bg-violet-950 w-full h-40 rounded-lg">
            </div>
          </div>
          </div>
        </div>
      </div>
</template>
<script lang="ts" setup>
import {notifications} from "~/data/notifications";
const runtime = useRuntimeConfig();
const routes = useRoute();
const store = getUserStore();


const data = ref([] as any);

store.$subscribe(async () => {

  const user = store.getUser;

  console.log(user.userId, user.code);
  await getNotifications();


}, {detached: true })

async function getNotifications() {

  const currentUser = store.getUser;

  const response = await fetch(runtime.public.api + '/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      code:  currentUser.code,
      userId: currentUser.userId
    })
  });

    data.value = notifications;

}

function openToPost(item: any) {

  navigateTo(item.post, {external: true});



}



</script>