<template>
      <div class="h-screen ">

        {{ data }}
        <div class="h-2/3 overflow-y-auto py-3">
        <div v-for="item in data" :key="item.id" class="my-5 mx-2" @click="openToPost(item)">
          <div class="bg-white py-2 px-2 rounded-lg min-h-14">
          <div class="text-violet-950 font-semibold  flex  justify-between">
            <h1 class="text-violet-950 font-semibold ">{{ item.title}}</h1>
            <h1>{{ new Date(item.send_at).toLocaleDateString() }}</h1>
  <div class="p-3">
    <h1 class="text-white text-xl underline font-semibold ">current content</h1>
    <div class="w-full overflow-y-auto gap-3 flex justify-between p-3 ">
      <div v-for="item in data" :key="item.id">
        <div class="bg-fuchsia-700 min-w-52 h-40 rounded-lg flex flex-col-reverse">
          <div class="w-full bg-white h-1/3 rounded-b-lg relative shadow-2xl  ">
            <p class="px-2 font-semibold text-gray-500 text-sm">{{ item.message }}</p>
          </div>
          <p class="text-end px-2 font-semibold text-white">{{ new Date(item.send_at).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const runtime = useRuntimeConfig();
const store = getUserStore();


const data = ref([] as any);

store.$subscribe(async () => {

  const user = store.getUser;
  await getNotifications();


}, {detached: true })

async function getNotifications() {

  const currentUser = store.getUser;


  const response = await fetch(runtime.public.api + '/public/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      code:  currentUser.code
    })
  });
    const content = await response.json();
    data.value = content.data;

}

function openToPost(item: any) {

  navigateTo(item.post, {external: true});



}



</script>