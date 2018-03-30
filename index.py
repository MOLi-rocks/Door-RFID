#!/usr/bin/python
import sys
import usb.core
import usb.util
import json
import requests
from pprint import pprint

# read env and keyholders
ENV = json.load(open('env.json'))
keyholders = json.load(open('keyholders.json'))

# reader key page
key_pages = [
    '', '', '', '',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '\n', '^]', '^H',
    '^I', ' ', '-', '=', '[', ']', '\\', '&gt;', ';', "'", '`', ',', '.',
    '/', 'CapsLock', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    'PS', 'SL', 'Pause', 'Ins', 'Home', 'PU', '^D', 'End', 'PD', '-&gt;', '&lt;-', '-v', '-^', 'NL',
    'KP/', 'KP*', 'KP-', 'KP+', 'KPE', 'KP1', 'KP2', 'KP3', 'KP4', 'KP5', 'KP6', 'KP7', 'KP8',
    'KP9', 'KP0', '\\', 'App', 'Pow', 'KP=', 'F13', 'F14' 
]

# set reader and endpoint
reader = None
endpoint = None

# use cardID find keyholders
def findKeyholders(cardID):
    for keyholder in keyholders:
        try:
            card = keyholder['cards'][cardID]
            if card is not None:
                pprint(keyholder)
                message = keyholder['name'] + ' (@' + keyholder['telegram'] + ') 用 '+ card
                return message
        except KeyError:
            continue
    return False

# init device
def init():
    global reader
    global endpoint
    # device id
    VENDOR_ID = int(ENV['VENDOR_ID'], 16)
    PRODUCT_ID = int(ENV['PRODUCT_ID'], 16)

    # find USB devices
    reader = usb.core.find(idVendor=VENDOR_ID, idProduct=PRODUCT_ID)

    # wether found it
    if reader is None:
        raise ValueError('Device not found')

    # to unload the kernel driver, so it does not output anymore the Ids on the console
    if reader.is_kernel_driver_active(0):
        try:
            reader.detach_kernel_driver(0)
        except usb.core.USBError as e:
            sys.exit("Could not detatch kernel driver: %s" % str(e))

    # set configuration
    try:
        reader.set_configuration()
        reader.reset()
    except usb.core.USBError as e:
        sys.exit("Could not set configuration: %s" % str(e))

    #print('test')
    endpoint = reader[0][(0,0)][0]

init()

while True:
    try:
        cardID = ''
        data = ''
        while data is not 40:
            data = endpoint.read(endpoint.wMaxPacketSize)[2]
            if data is not 0 or 40:
                cardID += key_pages[data]
        cardID = cardID.rstrip()
        message = findKeyholders(cardID)
        print(message)
        if message is not False:
            response = requests.post(
                ENV['LOCK_SERVER']+'/switch',
                data = {
                    "token": ENV['TOKEN'],
                    "message": message
                }
            )
            print(response.text)
    except usb.core.USBError as e:
        cardID = ''
        data = ''
        print(str(e))
        if e.errno is 19:
            init()
        continue

