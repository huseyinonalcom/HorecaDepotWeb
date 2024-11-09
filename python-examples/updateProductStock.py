import requests
import json

url = "https://www.horecadepot.be/api/products/admin/putproduct?id=182"

payload = json.dumps({
  "data": {
    "description": "test",
    "stock": 15
  }
})
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer ----'
}

response = requests.request("PUT", url, headers=headers, data=payload)