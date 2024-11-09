import requests

auth = input('auth:')
pageSize = input('page size:')
page = input('page:')

url = f"https://hdapi.huseyinonalalpha.com/api/clients?pagination[pageSize]={pageSize}&pagination[page]={page}"

payload = {}
headers = {
  'Accept': 'application/json',
  'Authorization': f'Bearer {auth}'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.json())

input('...')