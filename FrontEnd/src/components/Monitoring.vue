
<script setup>
import { ref, onMounted } from "vue";
import { usePlayerStore } from "@/stores/data.js";
import VueApexCharts from 'vue3-apexcharts';
import { useProcessingStore } from "@/stores/process.js";

const PlayerStore = usePlayerStore();
const ProcessingStore = useProcessingStore(); 
let PLAYER1_WHEEL;
let PLAYER2_WHEEL;

// 이미지를 회전시키는 함수
function rotateImage() {
  PLAYER1_WHEEL.value.style.transform = `rotate(${PlayerStore.PLAYER1_MOTOR_DEGRESS % 70}deg)`;
  PLAYER2_WHEEL.value.style.transform = `rotate(${PlayerStore.PLAYER2_MOTOR_DEGRESS % 70}deg)`;
}

onMounted(() => {
  PLAYER1_WHEEL = ref(document.querySelector('#PLAYER1_WHEEL')); 
  PLAYER2_WHEEL = ref(document.querySelector('#PLAYER2_WHEEL'));
  // 그래프
  setInterval(() =>{
    ProcessingStore.command(1);
    ProcessingStore.command(2);
  }, 1000)

  setInterval(() => {
    ProcessingStore.velocity(1);
    ProcessingStore.velocity(2);
    rotateImage();
  }, 50)

  // 이미지를 회전시키는 함수 호출
});

</script>

<template>
  <div class="main" style="max-width: fit-content;">
    <div class="container">
      <div class="title shadow">PLAYER1</div>
      <div class="player mt-3 shadow">
        <!-- 연결 정보 -->
        <div style="display: flex;">
          <div
            class="setting shadow "
            style="display: flex; flex-direction: column; justify-content: center; align-items: center; max-width: fit-content; padding: 10px; margin:10px;"
          >
            <img src="/public/car1.jpg" alt="" style="width: 120px; height: 200px;" />
            <div class="info" style="display: flex; flex-direction: row; justify-content: center; align-content: left;">
              <div
                style="border-radius: 20px; height: 30px; margin: 10px 5px 5px 5px; padding: 10px; display: flex; justify-content: center; align-items: center; cursor: pointer; background-color: lightgreen;"
              >
                <img src="/public/connect.png" alt="" style="width: 30px; height: 30px;" />
              </div>
              <div
                style="border-radius: 20px; height: 30px; margin: 10px 5px 5px 5px; padding: 10px; display: flex; justify-content: center; align-items: center; cursor: pointer; background-color: lightgreen;"
              >
                <img src="/public/controller.png" alt="" style="width: 30px; height: 30px;" />
              </div>
            </div>
          </div>

          <!-- DB 데이터 -->
          <div class="shadow" style="padding: 10px; margin:10px;"  >
            <VueApexCharts width="500px" type="line" :options="PlayerStore.PLAYER1_COMMAND_OPTIONS" :series="PlayerStore.PLAYER1_COMMAND_SERIES" />
          </div>
        </div>

        <div style="display: flex;">
          <!-- 모터 속도 -->
          <div class="shadow" style="display: flex; max-width: fit-content; padding: 10px; margin:10px; ">
            <VueApexCharts type="radialBar" height="300px" :options="PlayerStore.PLAYER1_SPEED_CHARTOPTIONS" :series="PlayerStore.PLAYER1_MOTOR_SERIES"/>
          </div>
          
          <!-- 바퀴 각도 -->
          <div class="wheel shadow" style="height: 300px; width: 340px;  padding: 10px; margin:10px; display: flex; justify-content: center;">
            <img id="PLAYER1_WHEEL" src="/public/wheel1.png" alt="" style="width: 100px;">
          </div>
        </div>  
      </div>
    </div>
    <div class="container">
      <div class="title shadow">PLAYER2</div>
      <div class="player shadow mt-3">
        <!-- 연결 정보 -->
        <div style="display: flex;">
          <div
            class="setting shadow "
            style="display: flex; flex-direction: column; justify-content: center; align-items: center; max-width: fit-content; padding: 10px; margin:10px;"
          >
            <img src="/public/car2.jpg" alt="" style="width: 120px; height: 200px;" />
            <div class="info" style="display: flex; flex-direction: row; justify-content: center; align-content: left;">
              <div
                style="border-radius: 20px; height: 30px; margin: 10px 5px 5px 5px; padding: 10px; display: flex; justify-content: center; align-items: center; cursor: pointer; background-color: lightgreen;"
              >
                <img src="/public/connect.png" alt="" style="width: 30px; height: 30px;" />
              </div>
              <div
                style="border-radius: 20px; height: 30px; margin: 10px 5px 5px 5px; padding: 10px; display: flex; justify-content: center; align-items: center; cursor: pointer; background-color: lightgray;"
              >
                <img src="/public/controller.png" alt="" style="width: 30px; height: 30px;" />
              </div>
            </div>
          </div>

          <!-- DB 데이터 -->
          <div class="shadow" style="padding: 10px; margin:10px;"  >
            <VueApexCharts width="500px" type="line" :options="PlayerStore.PLAYER2_COMMAND_OPTIONS" :series="PlayerStore.PLAYER2_COMMAND_SERIES" />
          </div>
        </div>

        <div style="display: flex;">
          <!-- 모터 속도 -->
          <div class="shadow" style="display: flex; max-width: fit-content; padding: 10px; margin:10px; ">
            <VueApexCharts type="radialBar" height="300px" :options="PlayerStore.PLAYER2_SPEED_CHARTOPTIONS" :series="PlayerStore.PLAYER2_MOTOR_SERIES"/>
          </div>
          
          <!-- 바퀴 각도 -->
          <div class="wheel shadow" style="height: 300px; width: 340px;  padding: 10px; margin:10px; display: flex; justify-content: center;">
            <img id="PLAYER2_WHEEL" src="/public/wheel1.png" alt="" style="width: 100px;">
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>


<style scoped>

.shadow {
  border: 2px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.1);
}

.main {
  width: 95%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
}

.title {
  height: max-content;
  font-size: 40px;
  font-weight: bold;
  padding-left: 20px;
}

.player {
  height: 90%;
  display: flex;
  flex-direction: column;
}

.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.3s ease, height 0.3s ease;
}
</style>


<style scoped>
.shadow{
    border:2px solid white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 
                0 2px 10px rgba(0, 0, 0, 0.1);

}
.main{
  width: 95%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.container{
  height: 80vh;
  display: flex;
  flex-direction: column;
  
}

.title{
  height: max-content;
  font-size: 40px;
  font-weight: bold;
  padding-left: 20px;
  
}
.player{
  height: fit-content;
  display: flex;
  flex-direction: column;
}

#chart {
  max-width: 650px;
  margin: 35px auto;
}

/* 바퀴 */
#PLAYER1_WHEEL{
  transition: transform 0.3s ease;
}
#PLAYER2_WHEEL{
  transition: transform 0.3s ease;
}
</style>
