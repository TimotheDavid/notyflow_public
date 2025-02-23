<template>
  <div class="bg-white w-full h-fit p-3 m-auto  rounded-lg ">
    <div class="grid grid-cols-7 gap-4 ">

    <div v-for="(item, index) in get_days_month()" :key="index" class="flex justify-between m-1" >
      <div class="w-full">
        <div class="w-full  h-10">
          <p class="text-orange-500 font-semibold   w-full  " >{{ get_label_name(item)}}</p>
          <div class=" w-6 h-fit  bg-orange-500 mx-auto flex flex-col justify-around  rounded-sm"><p class="flex flex-col justify-around m-auto text-white font-semibold">{{ item }}</p></div>
        </div>
      <div>


        </div>

      </div>
      <div>
      </div>


    </div>
    </div>
  </div>

</template>
<script setup lang="ts">

const current_days = ref(new Date());

function get_current_month() {
  return current_days.value.getMonth() + 1;
}

function get_current_year() {
  return current_days.value.getFullYear();
}

function get_label_name(day: number): string {

  const current_day = new Date(day, current_days.value.getMonth() + 1, current_days.value.getFullYear());

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short'
  }).format(current_day).toLowerCase();



}

function get_days_month() {

  const current_month = current_days.value.getMonth() + 1;

  const current_year = current_days.value.getFullYear();
  if(current_month == 2) {
    if ((current_year % 4 == 0) && (current_year % 100 == 0) || (current_year % 400 == 0)) return 29
    return 28;
  }

  return 31 - new Date(current_days.value.getFullYear(), current_days.value.getMonth() + 1, 31).getDate();
}

function get_weeks_month() {

  const days_month = get_days_month();
  return days_month % 7;

}



function generateDate() {




}



</script>