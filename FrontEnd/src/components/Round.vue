<script setup>
import { ref, onMounted } from "vue";
import { usePlayerStore } from "@/stores/data.js";
import { useProcessingStore } from "@/stores/process";

const ProcessingStore = useProcessingStore();
const Button_Text = ref("경기 시작");
const Player = usePlayerStore();
const isGame = ref(false);
const round = ref(false);
let Narrators;

const commentForm = (narrator) => {
    return `
    <div class="text-container">
        <div class="comment">${narrator}</div>
    </div>`
} 
async function Narrator_ready(){
    try{
        const comment = await ProcessingStore.narrator_ready();
        if(isGame.value) return;
        Narrators.innerHTML += commentForm(comment);
    } catch (error){
        console.log(error);
    }
}
const startBtn = () => {
    if(!isGame.value){
        Button_Text.value = "종료";
        isGame.value = true;
        setInterval(async() => {
            const player1_result = await ProcessingStore.round(1);
            const player2_result = await ProcessingStore.round(2);
            if(!round) {
                Narrators.innerHTML += await commentForm(`${Player.ROUND}라운드 경기 시작합니다!`);
                round.value = true;
            }

            if(player1_result){
                const comment = await ProcessingStore.narrator(player1_result);
                if(!isGame.value) return;
                console.log(comment);
                Narrators.innerHTML += commentForm(comment);
            }

            if(player2_result){
                const comment = await ProcessingStore.narrator(player2_result);
                if(!isGame.value) return;
                console.log(comment);
                Narrators.innerHTML += commentForm(comment);
            }
        }, 5000);
    } else {
        Narrators.innerHTML += commentForm(`${Player.ROUND}라운드 경기 종료`);
        Narrators.innerHTML += commentForm("다음 경기를 준비중 입니다");
        Button_Text.value = "경기 시작";
        round.value = false;
        isGame.value = false;
        // setInterval(Narrator_ready, 10000);
    }
}


onMounted(async() => {
    Narrators = document.querySelector(".say");
    Narrators.innerHTML += commentForm("경기 준비중 입니다");
    // setInterval(Narrator_ready, 10000);
});


</script>

<template>
    <div class="score mt-5">
        <div class="car-container">
            <div class="title shadow">PLAYER1</div>
            <!-- PLAYER 1 -->
            <div class="car shadow mt-3">
                <div class="body">
                    <div class="side bar" style="margin-right:13px;">
                        <div class="hp" style="background-color:red; translate: all 1s" :style="{ height: Player.PLAYER1.left + '%'}"></div>
                    </div>
                    <img class="car-image" src="/public/car1.jpg" alt="" >
                    <div class="side bar">
                        <div class="hp" style="background-color:red;" :style="{ height: Player.PLAYER1.right + '%'}"></div>
                    </div>
                </div>
                <div class="back bar">
                    <div class="hp" style="background-color:red;" :style="{ width: Player.PLAYER1.back + '%'}"></div>
                </div>
            </div>
        </div>

        
        <div class="car-container">
            <div class="title shadow">PLAYER2</div>
            <!-- PLAYER 2 -->
            <div class="car shadow mt-3">
                <div class="body">
                    <div class="side bar" style="margin-right:13px;">
                        <div class="hp" style="background-color:rgb(13, 110, 253);;" :style="{ height: Player.PLAYER2.left + '%'}"></div>
                    </div>
                    <img class="car-image" src="/public/car2.jpg" alt="" >
                    <div class="side bar">
                        <div class="hp" style="background-color:rgb(13, 110, 253);;" :style="{ height: Player.PLAYER2.right + '%'}"></div>
                    </div>
                </div>
                <div class="back bar">
                    <div class="hp" style="background-color:rgb(13, 110, 253);;" :style="{ width: Player.PLAYER2.back + '%'}"></div>
                </div>
            </div>
        </div>

        <div class="comments p-3">
            <div class="ai">
                <img src="/public/narrator.png" alt="" id="ai-image"> 
            </div>
            <div class="say">
            </div>
        </div>
    </div>
    <button class="btn custom-btn mt-4 shadow" @click="startBtn()">{{Button_Text}}</button>
</template>

<style scoped>
.shadow{
    border:2px solid white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 
                0 6px 20px rgba(0, 0, 0, 0.1);

}
/* 스코어 */
.car-container{
    position:relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    margin: 20px;
    width: 30%;
    height: 60vh;
    padding: 20px;
}

.score{
    position: relative;
    display: flex;
    align-items:center;
    width: 80%;
    height: 60vh;
}
.car{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.body{
    height: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.car-image{
    width: 150px;
    height: 300px;
    margin: 0px 15px 15px 15px;
}

/* HP */
.side{
    width: 20px;
    height: 50%;
    display: flex;
    flex-direction:column;
    justify-content: end;
}
.side > .hp{
    width: 100%;
    transition: all 2s;
    border-radius: 50px;
}

.back{
    width: 50%;
    height: 20px;
    display: flex;
    flex-direction:row;
}
.back > .hp{
    height: 100%;
    border-radius: 50px;
    transition: all 2s;
    translate: all 0.5s;
}
.bar{
    border: 1px solid rgb(0, 0, 0);
    border-radius: 50px;
}

/* 버튼 */
.custom-btn{
    border: 1px solid gray;
    border-radius: 50px;
    width: 20%;
    font-size: 40px;
    height: fit-content;
}

.custom-btn:hover{
    background-color: rgb(13, 110, 253);
    font-size: 50px;
    font-weight: bold;
    color: white;
    border: 3px solid black;
    transition: all 1s;
}
/* AI */

.comments{
    position:relative;
    width: 50%;
    height: 100%;
    font-size: 50vh;
    color: black;
    display: flex;
    flex-direction: row;
    
}
/* 스크롤바 스타일링 */
.say::-webkit-scrollbar {
  width: 10px; /* 스크롤바 너비 */
}

.say::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3); /* 스크롤바 색상 */
  border-radius: 5px; /* 스크롤바 모양 */
}

.say::-webkit-scrollbar-track {
  background-color: transparent; /* 스크롤바 트랙 배경색 */
}

#ai-image{
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 110px;
    height: 100px;
}

.ai{
    width: 20%;
}

.say{
    width: 40vw;
    overflow-y: auto;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: end
    
}
::v-deep .text-container {
    border: 3px solid black;
    border-radius: 40px;
    max-width: 100%; /* 최대 너비 설정 */
    background-color:white;
    margin: 10px;
    padding: 20px;
}

::v-deep .comment{
    font-size: 20px;
    display: flex;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    height: fit-content;
    word-wrap:break-word;
}

.title {
    width: 100%;
  height: max-content;
  font-size: 40px;
  font-weight: bold;
  padding-left: 20px;
}
</style>