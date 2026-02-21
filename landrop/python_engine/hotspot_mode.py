import os

def start_hotspot():
    os.system("netsh wlan set hostednetwork mode=allow ssid=LANDrop key=12345678")
    os.system("netsh wlan start hostednetwork")
