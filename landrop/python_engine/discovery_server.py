import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(("0.0.0.0", 5002))

while True:
    data, addr = sock.recvfrom(1024)
    if data == b"DISCOVER":
        sock.sendto(b"LANDROP_DEVICE", addr)
