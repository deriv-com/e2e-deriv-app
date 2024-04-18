import websocket
import sys
import ssl

test_env = sys.argv[1]
app_id = sys.argv[2]
token = sys.argv[3]

test_url = 'wss://'+test_env+'/websockets/v3?app_id='+app_id

ws = websocket.create_connection(test_url, sslopt={"cert_reqs": ssl.CERT_NONE})

ws.send(f'{{"authorize": "{token}"}}')
auth_response = ws.recv()

ws.send('{"logout": 1}')

logout_response = ws.recv()
print("Logout response:", logout_response)

ws.close()
