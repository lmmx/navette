#!/usr/bin/env python3
import subprocess
import json
import struct
import sys


def send_message(process, message):
    content = json.dumps(message).encode("utf-8")
    length = struct.pack("@I", len(content))
    process.stdin.write(length)
    process.stdin.write(content)
    process.stdin.flush()


def read_message(process):
    length_bytes = process.stdout.read(4)
    if not length_bytes:
        return None
    length = struct.unpack("@I", length_bytes)[0]
    content = process.stdout.read(length).decode("utf-8")
    return json.loads(content)


native_path = "/usr/bin/python3"
native_args = ["/home/louis/dev/navette/native_file_reader.py"]

process = subprocess.Popen(
    [native_path] + native_args,
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)

send_message(
    process, {"action": "read_file", "path": "/home/louis/dev/navette/background.js"}
)
response = read_message(process)
print("Response:", response)

process.stdin.close()
process.terminate()
process.wait(timeout=0.2)

print("STDERR:", process.stderr.read().decode("utf-8"))
