import json
import os
import socket
from mcstatus import JavaServer

# Corrected IP address
TARGET_DOMAIN = "play.schnitzelsmp.eu"
TARGET_PORT = 25565
OUTPUT_FILE = "serverstatus.json"

def update_status():
    socket.setdefaulttimeout(7.0) # Slightly longer timeout for stability
    
    try:
        # Check address and lookup server
        server = JavaServer.lookup(TARGET_DOMAIN)
        status = server.status()
        
        data = {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max
            }
        }
        print(f"Status: Online ({status.players.online}/{status.players.max})")
    except Exception as e:
        data = {
            "online": False,
            "players": {
                "online": 0,
                "max": 0
            }
        }
        print(f"Status: Offline. Error: {e}")
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    update_status()
