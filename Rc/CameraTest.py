#!/usr/bin/python
import io
import logging
import socketserver
from http import server
import threading

from picamera2 import Picamera2
from picamera2.encoders import MJPEGEncoder
from picamera2.outputs import FileOutput

import base64
import json
import time
import atexit

############################################## GLOBAL ##################################################
SPEED = [80,120,150,180,220,250]
GEAR = 5
STATE = {'GEAR' : 0, 'SPEED' : 0, 'SERVO_ANGLE': 410}
SERVO_ANGLE = 410
########################################################################################################


############################################## Moter Load ##############################################
from Raspi_MotorHAT import Raspi_MotorHAT, Raspi_DCMotor

# create a default object, no changes to I2C address or frequency
mh = Raspi_MotorHAT(addr=0x6f)

def turnOffMotors():
	mh.getMotor(1).run(Raspi_MotorHAT.RELEASE)
	mh.getMotor(2).run(Raspi_MotorHAT.RELEASE)
	mh.getMotor(3).run(Raspi_MotorHAT.RELEASE)
	mh.getMotor(4).run(Raspi_MotorHAT.RELEASE)
 
atexit.register(turnOffMotors)

# myMotor
myMotor = mh.getMotor(1)
myMotor.run(Raspi_MotorHAT.FORWARD)

# Moter init
myMotor.setSpeed(0)

    
# KEYBOARD INIT #
# UP : 38
# DOWN : 40
# LEFT : 37
# RIGHT : 39
# GEAR > Q W E A S D : 81, 87, 69, 65, 83, 68

# MOVE
# def MOVE(data):
#     print("[MOVE] data : ", data)
#     global GEAR
#     # 기어 변경  Q W E A S D -> 0, 1, 2, 3, 4, -1 단
#     if data.get('81', False):
#         print("[GEAR] GEAR CHANGE 0")
#         GEAR = 0
#     elif data.get('87', False):
#         print("[GEAR] GEAR CHANGE 1")
#         GEAR = 1
#     elif data.get('69', False):
#         print("[GEAR] GEAR CHANGE 2")
#         GEAR = 2
#     elif data.get('65', False):
#         print("[GEAR] GEAR CHANGE 3")
#         GEAR = 3
#     elif data.get('83', False):
#         print("[GEAR] GEAR CHANGE 4")
#         GEAR = 4
#     elif data.get('68', False):
#         print("[GEAR] GEAR CHANGE 5")
#         GEAR = 5
    
#     #UP KEY
#     if data.get('38',False):
#         # 후진 상태일때
#         myMotor.run(Raspi_MotorHAT.FORWARD)
#         # 기어 변경
#         print("[MOVE] FORWARD ", SPEED[GEAR])
#         myMotor.setSpeed(SPEED[GEAR])
#     #DOWN    
#     elif data.get('40', False):
#         myMotor.run(Raspi_MotorHAT.BACKWARD)
#         myMotor.setSpeed(SPEED[GEAR])
#         return
#     else:
#         myMotor.setSpeed(0)
        
    
#     #LEFT
#     if data.get('37', False):
#         print("[TURN] LEFT")
#         SET_SERVOANGLE(1)
#     #RIGHT
#     elif data.get('39', False):
#         print("[TURN] RIGHT")
#         SET_SERVOANGLE(0)
        
        
        
def MOVE(data):
    print("[MOVE] data : ", data)
    global STATE
    # 기어 변경  Q W E A S D -> 0, 1, 2, 3, 4, -1 단
    if data.get('81', False):
        print("[GEAR] GEAR CHANGE 0")
        STATE['SPEED'] = SPEED[0]
    elif data.get('87', False):
        print("[GEAR] GEAR CHANGE 1")
        STATE['SPEED'] = SPEED[1]
    elif data.get('69', False):
        print("[GEAR] GEAR CHANGE 2")
        STATE['SPEED'] = SPEED[2]
    elif data.get('65', False):
        print("[GEAR] GEAR CHANGE 3")
        STATE['SPEED'] = SPEED[3]
    elif data.get('83', False):
        print("[GEAR] GEAR CHANGE 4")        
        STATE['SPEED'] = SPEED[4]
    elif data.get('68', False):
        print("[GEAR] GEAR CHANGE 5")
        STATE['SPEED'] = SPEED[5]
    
    #UP KEY
    if data.get('38',False):
        # 후진 상태일때
        myMotor.run(Raspi_MotorHAT.FORWARD)
        # 기어 변경
        print("[MOVE] FORWARD ", SPEED[GEAR])
        myMotor.setSpeed(SPEED[GEAR])
    #DOWN    
    elif data.get('40', False):
        myMotor.run(Raspi_MotorHAT.BACKWARD)
        myMotor.setSpeed(SPEED[GEAR])
    else:
        myMotor.setSpeed(0)
        
    
    #LEFT
    if data.get('37', False):
        print("[TURN] LEFT")
        SET_SERVOANGLE(1)
    #RIGHT
    if data.get('39', False):
        print("[TURN] RIGHT")
        SET_SERVOANGLE(0)

########################################################################################################


############################################## Servo Load ##############################################

mh._pwm.setPWMFreq(60)

# init
mh._pwm.setPWM(0,0,420)
time.sleep(0.5)
mh._pwm.setPWM(0,0,400)
time.sleep(0.5)
mh._pwm.setPWM(0,0,SERVO_ANGLE)
time.sleep(0.5)

# def SET_SERVOANGLE(direction):
#     global SERVO_ANGLE
#     if(direction == 1):
#         print("MOVE LEFT", SERVO_ANGLE)
#         SERVO_ANGLE = 280
#         if SERVO_ANGLE <= 280:
#             SERVO_ANGLE = 280
#     else:
#         print("MOVE RIGHT", SERVO_ANGLE)
#         SERVO_ANGLE = 520
#         if SERVO_ANGLE >= 520:
#             SERVO_ANGLE = 520
    
#     mh._pwm.setPWM(0,0,SERVO_ANGLE)

def SET_SERVOANGLE(direction):
    global STATE
    if(direction == 1):
        STATE['SERVO_ANGLE'] -= 60
        if(STATE['SERVO_ANGLE'] <= 280): STATE['SERVO_ANGLE'] = 280
    else:
        STATE['SERVO_ANGLE'] += 60
        if(STATE['SERVO_ANGLE'] >= 520): STATE['SERVO_ANGLE'] = 520
########################################################################################################

def MOVE_THREAD():
    global STATE
    while True:
        # print(STATE['SERVO_ANGLE'])
        mh._pwm.setPWM(0,0,STATE['SERVO_ANGLE'])
        time.sleep(0.01)


THREAD = threading.Thread(target=MOVE_THREAD)
THREAD.start()

########################################################################################################
USERNAME = "your_name" #아이디
PASSWORD = "your_password" #비번

def check_auth(headers):
    auth = headers.get('Authorization')
    if not auth:
        return False
    token = auth.split()[1]
    given_user, given_pass = base64.b64decode(token).decode('utf-8').split(':')
    return given_user == USERNAME and given_pass == PASSWORD


# index.html 파일을 읽어와서 PAGE 변수에 저장합니다.
with open('index.html', 'r') as file:
    PAGE = file.read()


class StreamingOutput(io.BufferedIOBase):
    def __init__(self):
        self.frame = None
        self.condition = threading.Condition()

    def write(self, buf):
        with self.condition:
            self.frame = buf
            self.condition.notify_all()

class StreamingHandler(server.BaseHTTPRequestHandler):
    def do_GET(self):
        if not check_auth(self.headers):
            self.send_response(401)
            self.send_header('WWW-Authenticate', 'Basic realm=\"Authentication required\"')
            self.end_headers()
            self.wfile.write('Authentication failed'.encode('utf-8'))
            return

        if self.path == '/':
            self.send_response(301)
            self.send_header('Location', '/index.html')
            self.end_headers()
        elif self.path == '/index.html':
            content = PAGE.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content)
        elif self.path == '/stream.mjpg':
            self.send_response(200)
            self.send_header('Age', 0)
            self.send_header('Cache-Control', 'no-cache, private')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')
            self.end_headers()
            try:
                while True:
                    with output.condition:
                        output.condition.wait()
                        frame = output.frame
                    self.wfile.write(b'--FRAME\r\n')
                    self.send_header('Content-Type', 'image/jpeg')
                    self.send_header('Content-Length', len(frame))
                    self.end_headers()
                    self.wfile.write(frame)
                    self.wfile.write(b'\r\n')
            except Exception as e:
                logging.warning(
                    'Removed streaming client %s: %s',
                    self.client_address, str(e))
        else:
            self.send_error(404)
            self.end_headers()
            
    def do_POST(self):
        if not check_auth(self.headers):
            self.send_response(401)
            self.send_header('WWW-Authenticate', 'Basic realm=\"Authentication required\"')
            self.end_headers()
            self.wfile.write('Authentication failed'.encode('utf-8'))
            return

        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        # 처리할 키 입력
        key_code = data.get('keyCode')
        MOVE(data.get('keyCode'))

        self.send_response(200)
        self.end_headers()

class StreamingServer(socketserver.ThreadingMixIn, server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True


picam2 = Picamera2()
picam2.configure(picam2.create_video_configuration(main={"size": (640, 480)}))
output = StreamingOutput()
picam2.start_recording(MJPEGEncoder(), FileOutput(output))

try:
    address = ('', 8000)
    server = StreamingServer(address, StreamingHandler)
    server.serve_forever()
finally:
    picam2.stop_recording()