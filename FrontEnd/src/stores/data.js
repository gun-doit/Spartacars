import { defineStore } from "pinia";
import {ref} from "vue";


export const usePlayerStore = defineStore("player", () => {

    // PLAYER CAR INFO
    const PLAYER1_MOTOR_SERIES = ref([0])
    const PLAYER1_MOTOR_DEGRESS = ref([0])
    const PLAYER2_MOTOR_SERIES = ref([0])
    const PLAYER2_MOTOR_DEGRESS = ref([0])

    //HP
    const ROUND = ref([0]);
    const PLAYER1 = ref({"left":100, "right":100, "back":100})
    const PLAYER2 = ref({"left":100, "right":100, "back":100})

    const PLAYER1_COMMAND_OPTIONS = ref({
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          min: -100,
          max: 100,
        }
    });
    const PLAYER1_COMMAND_SERIES = ref([
        {
            name: "speed",
            data: [],
        },
        {
            name: "direction",
            data: [],
        },
    ]);
      
    const PLAYER2_COMMAND_OPTIONS = ref({
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          min: -100,
          max: 100,
        }
    });
    const PLAYER2_COMMAND_SERIES = ref([
        {
            name: "speed",
            data: [],
        },
        {
            name: "direction",
            data: [],
        },
    ]);

    const PLAYER1_SPEED_CHARTOPTIONS = ref({
    plotOptions: {
        radialBar: {
        startAngle: -120,
        endAngle: 120,
        dataLabels: {
            name: {
            show: true,
            offsetY: 50,
            formatter: function(val){
                return "Speed"
            },
            fontSize: '30px',
            color: 'black',
            },
            value: {
            offsetY: -10,
            fontSize: '50px',
            fontFamily: 'Arial',
            formatter: function (val) {
                return val;
            },
            color: '#FF5733',
            },
        }
        }
    },
    fill:{
        colors: ['#FF5733', '#FFC300', '#DAF7A6'], 
        gradient: {
            shade: '#FFC300',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
        },
        },
        stroke: {
        dashArray: 3
        }}
    )
    
    const PLAYER2_SPEED_CHARTOPTIONS = ref({
    plotOptions: {
        radialBar: {
        startAngle: -120,
        endAngle: 120,
        dataLabels: {
            name: {
            show: true,
            offsetY: 50,
            formatter: function(val){
                return "Speed"
            },
            fontSize: '30px',
            color: 'black',
            },
            value: {
            offsetY: -10,
            fontSize: '50px',
            fontFamily: 'Arial',
            formatter: function (val) {
                return val;
            },
            color: 'rgb(13, 110, 253)',
            },
        }
        }
    },
    fill:{
        colors: ['rgb(13, 110, 253)', '#FFC300', '#DAF7A6'], 
        gradient: {
            shade: '#FFC300',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
        },
        },
        stroke: {
        dashArray: 3
        }}
    )
      

    return { 
        PLAYER1, PLAYER2,
        PLAYER1_COMMAND_OPTIONS, PLAYER1_COMMAND_SERIES, PLAYER2_COMMAND_OPTIONS, PLAYER2_COMMAND_SERIES,
        PLAYER1_MOTOR_SERIES, PLAYER2_MOTOR_SERIES,PLAYER1_MOTOR_DEGRESS, PLAYER2_MOTOR_DEGRESS,
        PLAYER1_SPEED_CHARTOPTIONS,PLAYER2_SPEED_CHARTOPTIONS
    };
})