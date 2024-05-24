#!/usr/bin/python

from Raspi_PWM_Servo_Driver import PWM
import time
#!/usr/bin/python
from Raspi_MotorHAT import Raspi_MotorHAT, Raspi_DCMotor

import time
import atexit

# create a default object, no changes to I2C address or frequency
mh = Raspi_MotorHAT(addr=0x6f)

# recommended for auto-disabling motors on shutdown!
def turnOffMotors():
	mh.getMotor(1).run(Raspi_MotorHAT.RELEASE)
	mh.getMotor(2).run(Raspi_MotorHAT.RELEASE)
	mh.getMotor(3).run(Raspi_MotorHAT.RELEASE)
	mh.getMotor(4).run(Raspi_MotorHAT.RELEASE)

atexit.register(turnOffMotors)

################################# DC motor test!
myMotor = mh.getMotor(1)

# set the speed to start, from 0 (off) to 255 (max speed)
myMotor.setSpeed(150)
myMotor.run(Raspi_MotorHAT.FORWARD);
# turn on motor
myMotor.run(Raspi_MotorHAT.RELEASE);

SPEED = [80,120,150,180,220, 250]

# ===========================================================================
# Servo Init Code
# ===========================================================================

# Initialise the PWM device using the default address
# bmp = PWM(0x40, debug=True)
pwm = PWM(0x6F)

# servoMin = 150  # Min pulse length out of 4096
# servoMax = 600  # Max pulse length out of 4096

# def setServoPulse(channel, pulse):
#   pulseLength = 1000000                   # 1,000,000 us per second
#   pulseLength /= 60                       # 60 Hz
#   print ("%d us per period" % pulseLength)
#   pulseLength /= 4096                     # 12 bits of resolution
#   print ("%d us per bit" % pulseLength)
#   pulse *= 1000
#   pulse /= pulseLength
#   pwm.setPWM(channel, 0, pulse)

pwm.setPWMFreq(60)                        # Set frequency to 60 Hz
pwm.setPWM(0,0,300)
while (True):
  # Change speed of continuous servo on channel O
  servoAngle = int(input())
  if servoAngle < 0: servoAngle = 0
  servoAngle %= 4096
  
  
  pwm.setPWM(0, 0, servoAngle)


  gear = int(input())
  gear %= 6
  myMotor.run(Raspi_MotorHAT.FORWARD)
  myMotor.setSpeed(SPEED[gear])
  time.sleep(0.01)


