import socket
import platform

UDP_PORT = 5002

# ⭐ Get device name (computer name)
DEVICE_NAME = platform.node()

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(("0.0.0.0", UDP_PORT))

print("Discovery server running...")

while True:
    data, addr = sock.recvfrom(1024)

    if data == b"DISCOVER":
        response = f"LANDROP_DEVICE|{DEVICE_NAME}".encode()
        sock.sendto(response, addr)