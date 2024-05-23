<script setup>
import Monitoring from "@/components/Monitoring.vue";
import LCD from "@/components/LCD.vue";
import ROUND from "@/components/Round.vue";
import { ref, onMounted, watch } from "vue";

const SELECT = ref("Monitoring");

function updateSelectedValue(value){
  SELECT.value = value;
}

</script>

<template>
  <main>
    <div class="select-view">
      <ul class="nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-5 shadow-sm" id="pillNav2" role="tablist" style="--bs-nav-link-color: var(--bs-white); --bs-nav-pills-link-active-color: var(--bs-primary); --bs-nav-pills-link-active-bg: var(--bs-white);">
        <li class="nav-item" role="presentation">
          <button class="nav-link active rounded-5" id="home-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="true" @click="updateSelectedValue('Monitoring')">Monitoring</button>
        </li>
        <!-- <li class="nav-item" role="presentation">
          <button class="nav-link rounded-5" id="profile-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="false" @click="updateSelectedValue('LCD')">LCD View</button>
        </li> -->
        <li class="nav-item" role="presentation">
          <button class="nav-link rounded-5" id="profile-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="false" @click="updateSelectedValue('ROUND')">Round</button>
        </li>
      </ul>
    </div>

    <div class="main-view">
      <LCD v-if="SELECT === 'LCD'" />
      <Monitoring v-if="SELECT === 'Monitoring'" />
      <ROUND v-if="SELECT === 'ROUND'" />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.select-view {
  width: 95%;
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
