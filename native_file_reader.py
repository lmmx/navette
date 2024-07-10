import sys
import json
import struct
import logging
import os

# Set up logging
logging.basicConfig(filename='/tmp/native_file_reader.log', level=logging.DEBUG)

# Read a message from stdin and decode it.
def get_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    logging.debug(f"Received message: {message}")
    return json.loads(message)

# Encode a message for transmission, given its content.
def encode_message(message_content):
    encoded_content = json.dumps(message_content).encode('utf-8')
    encoded_length = struct.pack('=I', len(encoded_content))
    return {'length': encoded_length, 'content': encoded_content}

# Send an encoded message to stdout.
def send_message(encoded_message):
    sys.stdout.buffer.write(encoded_message['length'])
    sys.stdout.buffer.write(encoded_message['content'])
    sys.stdout.buffer.flush()

logging.debug("Native application started")

while True:
    try:
        message = get_message()
        if message['action'] == 'hello':
            send_message(encode_message({'success': True, 'message': 'Hello received'}))
            logging.debug("Responded to hello message")
        elif message['action'] == 'read_file':
            try:
                with open(message['path'], 'r') as file:
                    content = file.read()
                send_message(encode_message({'success': True, 'content': content}))
                logging.debug(f"Successfully read file: {message['path']}")
            except Exception as e:
                error_message = {'success': False, 'error': str(e)}
                send_message(encode_message(error_message))
                logging.error(f"Error reading file: {str(e)}")
        else:
            logging.warning(f"Unknown action received: {message['action']}")
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        break

logging.debug("Native application shutting down")