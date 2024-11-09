import requests
import json

url = "https://www.horecadepot.be/api/products/admin/putproduct?id=525"

payload = json.dumps({
  "data": {
    "id": 525,
    "name": "TOLIX",
    "supplierCode": "6150713294273",
    "internalCode": "HD.1.089.YE",
    "value": 59,
    "depth": 0,
    "width": 0,
    "height": 0,
    "material": "METAL LEG, WOODEN SEAT",
    "color": "YELLOW",
    "priceBeforeDiscount": 109,
    "active": True,
    "description": "",
    "product_extra": {
      "id": 401,
      "barcode": "6150713294273",
      "weight": 0,
      "per_box": 0,
      "packaged_weight": 0,
      "packaged_dimensions": None,
      "seat_height": 0,
      "diameter": 0,
      "packaged_weight_net": 0,
      "tags": "Horecadepot\nHoreca Depot\nChaise\nChaises\nStoelen \nStoel\nHoreca Chaise\nHoreca Stoel\nTerrasse Chaise\nTerrasse Chaises\nTerras Stoel\nTerras Stoelen\nTerras Stoel Kopen\nRestaurant Chaise\nRestaurant Chaises\nRestaurant Stoel\nRestaurant Stoelen\nTafels en Stoelen horeca kopen\nchaise de bureau ergonomique\nchaise de bureau ergonomique bruxelles\nchaise de bureau ergonomique belgique\nchaise salle a manger\nchaise de bureau\nchaise à manger\nchaise bureau\nchaise bar\nchaise beige\nchaise hotel\nchaise de jardin\nchaise a bascule\ntable et chaise de jardin\nchaise metal\nchaise noir\nchaise lot 6\nchaise longue jardin\nchaise salle d attente\nchaise cuisine\nchaises de cuisine\nchaise haute\nstoelen\nstoelen eetkamer\nbureau stoel\nfauteuil stoel\nei stoel\nei stoel buiten\nstoel bureau\nstoel beige\nstoel buiten\nbeige stoel\nstoel design\nstoelen set 4\nstoel comfortabel\nstoel eetkamer 6\nstoel in kamer\nstoel keuken rond\nstoel lounge\nstoel set 8\nstoel woonkamer\nstoelen eetkamer\nstoelen eetkamer met tafel\nstoelen zwart\nstoelen eetkamer hout\nstoelen grijs\nstoelen geel\nstoelen kapsalon\nstoelen met gouden poten\nstoelen met zwart potjes\neetkamer stoelen set van 2\nstoelen voor eettafel\nstoelen wit\nstoelen orange",
      "armrest_height": 0,
      "new": False
    },
    "categories": [
      {
        "id": 3,
        "Name": "Chaises Intérieur",
        "code": "1"
      }
    ],
    "images": [
      {
        "id": 641,
        "name": "tolix-yellow.png",
        "url": "/uploads/tolix_yellow_7732f0c005.png"
      }
    ],
    "product_color": None
  }
})
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer ----'
}

response = requests.request("PUT", url, headers=headers, data=payload)