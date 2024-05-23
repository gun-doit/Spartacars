import { api } from '@/utils/axios.js';
import { defineStore } from "pinia";
import { usePlayerStore } from './data.js';

function dateParsing(dateString){
    return dateString.substr(11,8);
}

function round(number) {
    return Math.round(number);
}
function isEquelHP(player, data){
    if(data.car == 1){
        if(player.PLAYER1.left == Math.round(data.hp_left * 33.3) && player.PLAYER1.right == Math.round(data.hp_right * 33.3) && player.PLAYER1.back == Math.round(data.hp_back * 33.3)){
            return true;
        }
        else{
            return false;
        }
    } else if(data.car == 2){
        if(player.PLAYER2.left == Math.round(data.hp_left * 33.3) && player.PLAYER2.right == Math.round(data.hp_right * 33.3) && player.PLAYER2.back == Math.round(data.hp_back * 33.3)) return true;
        else return false;
    }
}
function timeInterval(timeString1, timeString2) {
    // 주어진 두 시간 문자열을 Date 객체로 변환
    const date1 = new Date(`2000-01-01T${timeString1}`);
    const date2 = new Date(`2000-01-01T${timeString2}`);

    // 각 Date 객체를 밀리초로 변환
    const time1 = date1.getTime();
    const time2 = date2.getTime();

    // 두 시간의 차이 계산 (초 단위)
    const diffSeconds = Math.abs((time2 - time1) / 1000);

    // 분과 초로 변환
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = Math.floor(diffSeconds % 60);

    // "n분 m초 전" 형식의 문자열 생성
    const formattedString = `${minutes}분 ${seconds}초 전`;

    return formattedString;
}
async function processCommand(data){
    const length = data.length;
    const player = {
        time:[],
        speed:[],
        direction:[],
    }
    try{
        const currentTimeStamp = dateParsing(data[0].time);
        let prevTimestamp = 0;
        player.time.push(prevTimestamp);
        player.speed.push(Math.abs(data[length - 1].speed));
        player.direction.push(data[length - 1].direction);
    
        //데이터 수집
        let cnt = 1
        for(let i = length - 2; i >= 0; i--){
            if(prevTimestamp != timeInterval(dateParsing(data[i].time), currentTimeStamp)){
                player.speed[player.speed.length - 1] = round(player.speed[player.speed.length - 1]/cnt);
                player.direction[player.direction.length - 1] = round(player.direction[player.direction.length - 1] / cnt);
                
                player.time.push(timeInterval(dateParsing(data[i].time), currentTimeStamp));
                player.speed.push(Math.abs(data[i].speed));
                player.direction.push(data[i].direction);
                cnt = 1

                prevTimestamp = player.time[player.time.length - 1];
            } else{
                player.speed[player.speed.length - 1] += Math.abs(data[i].speed);
                player.direction[player.direction.length - 1] += data[i].direction;
                cnt++;
            }
        }

        // 마지막 항목
        if (cnt > 1) {
            player.speed[player.speed.length - 1] = round(player.speed[player.speed.length - 1]/cnt);
            player.direction[player.direction.length - 1] = round(player.direction[player.direction.length - 1] / cnt);
        }

        return player;

    } catch ( error ){
        console.log(error);
        return null;
    }
    return null;
}

async function processVelocity(data){
    const player = {
        speed:0,
        direction:0
    }
    player.speed = data.speed
    player.direction = data.direction

    return player;
}
// Command
// id, time, car, cmd_string, is_finish
export const useProcessingStore = defineStore("process", ()  => {
    const Player = usePlayerStore();
    
    async function command(id){
        const data = await api.getCommand(id);
        const result = await processCommand(data);
        if(result == null) return;
        if (id == 1) {
            Player.PLAYER1_COMMAND_OPTIONS.xaxis.categories = result.time;
            Player.PLAYER1_COMMAND_SERIES.find(item => item.name === 'speed').data = result.speed;
            Player.PLAYER1_COMMAND_SERIES.find(item => item.name === 'direction').data = result.direction;
        }
        else if(id == 2){
            Player.PLAYER2_COMMAND_OPTIONS.xaxis.categories = result.time;
            Player.PLAYER2_COMMAND_SERIES.find(item => item.name === 'speed').data = result.speed;
            Player.PLAYER2_COMMAND_SERIES.find(item => item.name === 'direction').data = result.direction;
        }
    }

    async function velocity(id){
        try{
            const data = await api.getVelocity(id);
            const result = await processVelocity(data);

            if (id == 1){
                Player.PLAYER1_MOTOR_SERIES = [Math.abs(result.speed)];
                Player.PLAYER1_MOTOR_DEGRESS = [result.direction];
            } else if(id == 2){
                Player.PLAYER2_MOTOR_SERIES = [Math.abs(result.speed)];
                Player.PLAYER2_MOTOR_DEGRESS = [result.direction];
            }
        } catch(err){
            console.log(err);
            return null;
        }

    }

    async function round(id){
        try{
            const data = await api.getScore(id);
            if(Player.ROUND != data.round) return "round change";
            Player.ROUND = data.round;
            let prompt = data.car == 1 ? "car1, " : "car2, ";
            if(isEquelHP(Player, data)){
                return null;
            } 

            if(data.car == 1){
                if(Player.PLAYER1.left != Math.round(data.hp_left * 33.3)){
                    prompt += "hp_left down ";
                    Player.PLAYER1.left = Math.round(data.hp_left * 33.3);
                }
                if(Player.PLAYER1.right != Math.round(data.hp_right * 33.3)){
                    prompt += "hp_right down ";
                    Player.PLAYER1.right = Math.round(data.hp_right * 33.3);
                }
                if(Player.PLAYER1.back != Math.round(data.hp_back * 33.3)){
                    prompt += "hp_back down ";
                    Player.PLAYER1.back = Math.round(data.hp_back * 33.3);
                }
            } else if(data.car == 2){
                if(Player.PLAYER2.left != Math.round(data.hp_left * 33.3)){
                    prompt += "hp_left down ";
                    Player.PLAYER2.left = Math.round(data.hp_left * 33.3);
                }
                if(Player.PLAYER2.right != Math.round(data.hp_right * 33.3)){
                    prompt += "hp_right down ";
                    Player.PLAYER2.right = Math.round(data.hp_right * 33.3);
                }
                if(Player.PLAYER2.back != Math.round(data.hp_back * 33.3)){
                    prompt += "hp_back down ";
                    Player.PLAYER2.back = Math.round(data.hp_back * 33.3);
                }
            }
            console.log("test: " ,prompt);
            return prompt;
            // AI
        } catch(err){
            console.log(err);
            return null;
        }
    }

    async function narrator(userPrompt){
        try{
            const data = await api.getGenAI(userPrompt);
            return data;
        } catch(err){
            console.log(err);
            return null;
        }
    }

    async function narrator_ready(){
        try{
            const data = await api.getGenAI_ready();
            console.log("data : " ,data);
            return data;
        } catch(err){
            console.log(err);
            return null;
        }
    }
    return {command, velocity, round, narrator, narrator_ready};
});
