import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

sock.sendto(b"DISCOVER", ("255.255.255.255", 5002))

sock.settimeout(3)

try:
    while True:
        data, addr = sock.recvfrom(1024)
        print("Found:", addr[0])
except:
    pass
