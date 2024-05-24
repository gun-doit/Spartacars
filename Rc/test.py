from Raspi_MotorHAT import Raspi_MotorHAT, Raspi_DCMotor
from Raspi_PWM_Servo_Driver import PWM
from time import sleep

mh = Raspi_MotorHAT(addr=0x6f) 
myMotor = mh.getMotor(2) #핀번호

servo = PWM(0x6F)
servo.setPWMFreq(60)  # Set frequency to 60 Hz

def GO():
    myMotor.setSpeed(100)
    myMotor.run(Raspi_MotorHAT.FORWARD)
    
def LEFT():
    servo.setPWM(0, 0, 420)

def RIGHT():
    servo.setPWM(0, 0, 250)

def BACK():
    myMotor.setSpeed(100)
    myMotor.run(Raspi_MotorHAT.BACKWARD)

def STOP():
    myMotor.run(Raspi_MotorHAT.RELEASE)
    servo.setPWM(0, 0, 345)

def MIDDLE():
    servo.setPWM(0, 0, 345)

try:
    while True:
        command = input('command : ')
        if command == '1':
            GO()
        if command == '2':
            LEFT()
        if command == '3':
            RIGHT()
        if command == '4':
            BACK()
        if command == '5':
            STOP()
        if command == '6':
            MIDDLE()

finally:    myMotor.run(Raspi_MotorHAT.RELEASE)