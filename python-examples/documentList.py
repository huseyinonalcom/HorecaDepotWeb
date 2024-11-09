import requests

url = "https://hdapi.huseyinonalalpha.com/api/documents?populate[document_products][populate][0]=product&populate=payments&populate[document_products][populate][product][populate][0]=images&populate[client][populate][0]=addresses&populate[docAddress][populate][0]=user&populate[delAddress][populate][0]=user&pagination[page]=2"

payload = {}
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer ----'
}

response = requests.request("GET", url, headers=headers, data=payload)