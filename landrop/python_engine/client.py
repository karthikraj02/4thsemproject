import socket
import sys
import os

IP = sys.argv[3]   # passed from backend
#IP = "192.168.1.5"
PORT = 5001

mode = sys.argv[1]

s = socket.socket()
s.connect((IP, PORT))

if mode == "msg":
    message = sys.argv[2].encode()
    s.sendall(b"MSG " + str(len(message)).zfill(10).encode() + message)

elif mode == "file":
    path = sys.argv[2]
    name = os.path.basename(path).encode()
    size = os.path.getsize(path)

    s.sendall(
        b"FILE"
        + str(size).zfill(10).encode()
        + str(len(name)).zfill(4).encode()
        + name
    )

    with open(path, "rb") as f:
        while chunk := f.read(4096):
            s.sendall(chunk)

s.close()
