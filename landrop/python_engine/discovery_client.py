import socket
import time

UDP_PORT = 5002
TIMEOUT = 3

DISCOVER_MSG = b"DISCOVER"

devices = {}

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
sock.settimeout(0.5)

try:
    # Send broadcast
    sock.sendto(DISCOVER_MSG, ("255.255.255.255", UDP_PORT))

    start = time.time()

    while time.time() - start < TIMEOUT:
        try:
            data, addr = sock.recvfrom(1024)

            msg = data.decode()

            if msg.startswith("LANDROP_DEVICE"):
                parts = msg.split("|")

                name = parts[1] if len(parts) > 1 else "Unknown"
                ip = addr[0]

                devices[ip] = name

        except socket.timeout:
            pass

finally:
    sock.close()

# Output format for backend
for ip, name in devices.items():
    print(f"{name}|{ip}")