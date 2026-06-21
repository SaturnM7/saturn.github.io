import json
import requests
from mcstatus import JavaServer

# Your exact server address
ADDRESS = "play.schnitzelsmp.eu:25565"

def update_status():
    # Default data (Offline)
    data = {"online": False, "players": {"online": 0, "max": 0}}
    
    print(f"Checking status for {ADDRESS}...")

    # METHOD 1: Direct library check (Like the terminal command)
    try:
        # JavaServer.lookup handles SRV and Port resolution exactly like the CLI
        server = JavaServer.lookup(ADDRESS)
        status = server.status()
        data = {
            "online": True,
            "players": {"online": status.players.online, "max": status.players.max}
        }
        print("Success: Check completed using mcstatus library.")
        
    except Exception as e:
        print(f"Library check failed (Expected on GitHub for IPv6): {e}")
        
        # METHOD 2: Web API Fallback (The only way for GitHub to see an IPv6 server)
        try:
            print("Attempting check via IPv6-compatible API...")
            # We use mcstatus.io because their servers have IPv6 and can see your PC
            response = requests.get(f"https://api.mcstatus.io/v2/status/java/play.schnitzelsmp.eu")
            res = response.json()
            
            if res.get("online"):
                data = {
                    "online": True,
                    "players": {
                        "online": res["players"]["online"],
                        "max": res["players"]["max"]
                    }
                }
                print("Success: Check completed via API.")
        except Exception as api_e:
            print(f"API Fallback also failed: {api_e}")

    # Write result to file
    with open("serverstatus.json", "w") as f:
        json.dump(data, f, indent=4)
    print("serverstatus.json has been updated.")

if __name__ == "__main__":
    update_status()
