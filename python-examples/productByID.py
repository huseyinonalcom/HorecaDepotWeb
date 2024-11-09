import requests

productID = input('ID:')
auth = input('auth:')

url = f"https://hdapi.huseyinonalalpha.com/api/products/{productID}?populate=*"

payload = {}
headers = {
  'Accept': 'application/json',
  'Authorization': f'Bearer {auth}'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.json())

input('...')