import socket
import os

HOST = "0.0.0.0"
PORT = 5001

# Create transfers folder if not exists
os.makedirs("../transfers", exist_ok=True)

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# ⭐ IMPORTANT FIX — Allows restart without port conflict
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

server.bind((HOST, PORT))
server.listen(5)

print(f"Receiver ready on port {PORT}...")

while True:
    conn, addr = server.accept()
    print("Connected:", addr)

    try:
        header = conn.recv(4).decode()

        if header == "MSG ":
            length = int(conn.recv(10).decode())
            msg = conn.recv(length).decode()
            print("💬 Message:", msg)

        elif header == "FILE":
            size = int(conn.recv(10).decode())
            name_len = int(conn.recv(4).decode())
            name = conn.recv(name_len).decode()

            filepath = os.path.join("../transfers", name)

            with open(filepath, "wb") as f:
                remaining = size
                while remaining > 0:
                    data = conn.recv(min(4096, remaining))
                    if not data:
                        break
                    f.write(data)
                    remaining -= len(data)

            print("📦 File received:", name)

    except Exception as e:
        print("Error:", e)

    conn.close()