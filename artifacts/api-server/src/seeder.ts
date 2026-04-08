import { pool, productsTable, categoriesTable, brandsTable, slidesTable, contactInfoTable, carBrandsTable, carModelsTable } from "@workspace/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

const SCHEMA_PATCHES = [
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text`,
  `ALTER TABLE car_models ADD COLUMN IF NOT EXISTS image_url text`,
  `ALTER TABLE categories ADD COLUMN IF NOT EXISTS show_in_footer boolean NOT NULL DEFAULT false`,
];

const CATEGORIES = [
  {
    "id": 3,
    "name": "Wipers",
    "slug": "wipers",
    "description": "Premium wiper blades for clear visibility in all conditions",
    "imageUrl": "/api/storage/objects/uploads/604f2d0a-b31a-4012-9372-2b1dbb0169bb",
    "productCount": 0,
    "sortOrder": 10
  },
  {
    "id": 4,
    "name": "Air Fresheners",
    "slug": "air-fresheners",
    "description": "Keep your car smelling fresh with our premium air fresheners",
    "imageUrl": "/api/storage/objects/uploads/b06c2110-b78c-4ab3-b691-7df5bb6a2359",
    "productCount": 0,
    "sortOrder": 2
  },
  {
    "id": 5,
    "name": "Seat Covers",
    "slug": "seat-covers",
    "description": "Protect and style your car interior with quality seat covers",
    "imageUrl": "/cat-seat-covers.jpg",
    "productCount": 0,
    "sortOrder": 12
  },
  {
    "id": 7,
    "name": "Car Care",
    "slug": "car-care",
    "description": "Cleaning and maintenance products to keep your car looking its best",
    "imageUrl": "/cat-car-care.jpg",
    "productCount": 0,
    "sortOrder": 9
  },
  {
    "id": 8,
    "name": "Fog Lamps",
    "slug": "fog-lamps",
    "description": null,
    "imageUrl": "/api/storage/objects/uploads/bd9ab166-4071-4011-a626-e8c36264ef65",
    "productCount": 3,
    "sortOrder": 4
  },
  {
    "id": 9,
    "name": "Car Mats",
    "slug": "car-mats",
    "description": null,
    "imageUrl": "/api/storage/objects/uploads/e13f3326-21ad-4f41-8db6-b9c03447dcae",
    "productCount": 0,
    "sortOrder": 5
  },
  {
    "id": 10,
    "name": "Steering Wheel Covers",
    "slug": "steering-wheel-covers",
    "description": null,
    "imageUrl": "/api/storage/objects/uploads/eb9867de-d3e8-4e7a-a300-f945e285fe02",
    "productCount": 0,
    "sortOrder": 13
  },
  {
    "id": 16,
    "name": "Parking Sensors",
    "slug": "parking-sensors",
    "description": null,
    "imageUrl": "/api/storage/objects/uploads/844f7c8c-b970-466c-b80c-8d458d462f1e",
    "productCount": 0,
    "sortOrder": 11
  },
  {
    "id": 17,
    "name": "Roof Box",
    "slug": "roof-box",
    "description": null,
    "imageUrl": "/cat-exterior.png",
    "productCount": 1,
    "sortOrder": 3
  },
  {
    "id": 18,
    "name": "Find By Car Model",
    "slug": "find-by-car",
    "description": null,
    "imageUrl": "/api/storage/objects/uploads/69ed4825-4fbe-48dd-9560-aaad892be17d",
    "productCount": 0,
    "sortOrder": 1
  },
  {
    "id": 19,
    "name": "Cargo Tray",
    "slug": "cargo-tray",
    "description": null,
    "imageUrl": "/api/storage/objects/uploads/52f499ad-f1b3-49b1-b93b-39c3e5286e14",
    "productCount": 0,
    "sortOrder": 7
  },
  {
    "id": 20,
    "name": "Side Running Board",
    "slug": "side-running-board",
    "description": null,
    "imageUrl": "/api/storage/objects/uploads/7b751758-72d7-471a-b9c5-3b039b91f6be",
    "productCount": 0,
    "sortOrder": 6
  },
  {
    "id": 21,
    "name": "Armrest",
    "slug": "armrest",
    "description": null,
    "imageUrl": "/api/storage/objects/uploads/72f44e1b-a70c-4b5a-b5fe-546a628d45b5",
    "productCount": 0,
    "sortOrder": 8
  }
];
const BRANDS = [
  {
    "id": 1,
    "name": "CARALL",
    "imageUrl": "/brand-carall.png",
    "sortOrder": 1,
    "active": true
  },
  {
    "id": 2,
    "name": "CARBOY",
    "imageUrl": "/brand-carboy.png",
    "sortOrder": 2,
    "active": true
  },
  {
    "id": 3,
    "name": "DLAA",
    "imageUrl": "/brand-dlaa.png",
    "sortOrder": 3,
    "active": true
  },
  {
    "id": 4,
    "name": "Pentair",
    "imageUrl": "/brand-pentair.png",
    "sortOrder": 6,
    "active": true
  },
  {
    "id": 5,
    "name": "PONYAN",
    "imageUrl": "/brand-ponyan.png",
    "sortOrder": 4,
    "active": true
  },
  {
    "id": 6,
    "name": "SHIEN",
    "imageUrl": "/api/storage/objects/uploads/fc307261-59d8-4007-a1db-2e78bf43d50b",
    "sortOrder": 5,
    "active": true
  }
];
const CAR_BRANDS = [
  {
    "id": 1,
    "name": "Proton",
    "origin": "Malaysian",
    "sortOrder": 1
  },
  {
    "id": 2,
    "name": "Perodua",
    "origin": "Malaysian",
    "sortOrder": 2
  },
  {
    "id": 3,
    "name": "Honda",
    "origin": "Japanese",
    "sortOrder": 3
  },
  {
    "id": 4,
    "name": "Toyota",
    "origin": "Japanese",
    "sortOrder": 4
  },
  {
    "id": 5,
    "name": "Mazda",
    "origin": "Japanese",
    "sortOrder": 5
  },
  {
    "id": 6,
    "name": "Mitsubishi",
    "origin": "Japanese",
    "sortOrder": 6
  },
  {
    "id": 7,
    "name": "Nissan",
    "origin": "Japanese",
    "sortOrder": 7
  },
  {
    "id": 8,
    "name": "Hyundai",
    "origin": "Korean",
    "sortOrder": 8
  },
  {
    "id": 9,
    "name": "Kia",
    "origin": "Korean",
    "sortOrder": 9
  },
  {
    "id": 10,
    "name": "Suzuki",
    "origin": "Japanese",
    "sortOrder": 10
  },
  {
    "id": 11,
    "name": "BMW",
    "origin": "European",
    "sortOrder": 11
  },
  {
    "id": 12,
    "name": "Mercedes-Benz",
    "origin": "European",
    "sortOrder": 12
  },
  {
    "id": 13,
    "name": "Volkswagen",
    "origin": "European",
    "sortOrder": 13
  },
  {
    "id": 14,
    "name": "Ford",
    "origin": "American",
    "sortOrder": 14
  }
];
const CAR_MODELS = [
  {
    "id": 2,
    "brandId": 1,
    "name": "Persona 3rd Gen (BH6)",
    "years": "2016–2019",
    "imageUrl": "/api/storage/objects/uploads/c51807b2-75a8-4d7e-ac6d-2f0155c54385",
    "sortOrder": 13
  },
  {
    "id": 3,
    "brandId": 1,
    "name": "Iriz 1st Gen",
    "years": "2014–2019",
    "imageUrl": "/api/storage/objects/uploads/bdab059e-038e-4774-aef1-ba91469361a2",
    "sortOrder": 20
  },
  {
    "id": 4,
    "brandId": 1,
    "name": "X50",
    "years": "2020–present",
    "imageUrl": "/api/storage/objects/uploads/43cf3e3c-2572-421f-9235-73121ebe22d3",
    "sortOrder": 25
  },
  {
    "id": 5,
    "brandId": 1,
    "name": "X70 1st Gen",
    "years": "2018–2022",
    "imageUrl": "/api/storage/objects/uploads/47ed75ff-285b-49a9-9ef5-f333a8c9f427",
    "sortOrder": 23
  },
  {
    "id": 6,
    "brandId": 1,
    "name": "Exora 1st Gen",
    "years": "2009–2012",
    "imageUrl": "/api/storage/objects/uploads/847e93c8-cee0-4d3f-b408-5502bbfcf5a4",
    "sortOrder": 17
  },
  {
    "id": 7,
    "brandId": 1,
    "name": "Waja",
    "years": "2000–2007",
    "imageUrl": "/api/storage/objects/uploads/42d10460-8f25-4918-82f5-3bb63048b7bd",
    "sortOrder": 9
  },
  {
    "id": 8,
    "brandId": 1,
    "name": "Persona Gen 2",
    "years": "2007-2010",
    "imageUrl": "/api/storage/objects/uploads/a461bd2c-a9b8-4aec-adcd-9cfc66b66da0",
    "sortOrder": 11
  },
  {
    "id": 9,
    "brandId": 1,
    "name": "Wira ",
    "years": "1993–2009",
    "imageUrl": null,
    "sortOrder": 8
  },
  {
    "id": 11,
    "brandId": 2,
    "name": "Myvi 2nd Gen (M600)",
    "years": "2011-2017",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 12,
    "brandId": 2,
    "name": "Axia",
    "years": "2014–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 13,
    "brandId": 2,
    "name": "Alza (M500)",
    "years": "2009–2014",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 14,
    "brandId": 2,
    "name": "Aruz",
    "years": "2019–present",
    "imageUrl": null,
    "sortOrder": 9
  },
  {
    "id": 15,
    "brandId": 2,
    "name": "Bezza (A700)",
    "years": "2016–2019",
    "imageUrl": "/api/storage/objects/uploads/4f6b0546-5b8b-4b8f-8de3-f13e69e2f73b",
    "sortOrder": 10
  },
  {
    "id": 16,
    "brandId": 2,
    "name": "Ativa",
    "years": "2021–present",
    "imageUrl": null,
    "sortOrder": 12
  },
  {
    "id": 17,
    "brandId": 2,
    "name": "Kancil",
    "years": "1994–2009",
    "imageUrl": null,
    "sortOrder": 13
  },
  {
    "id": 18,
    "brandId": 2,
    "name": "Viva",
    "years": "2007–2014",
    "imageUrl": null,
    "sortOrder": 14
  },
  {
    "id": 19,
    "brandId": 2,
    "name": "Kelisa",
    "years": "2001–2007",
    "imageUrl": null,
    "sortOrder": 15
  },
  {
    "id": 20,
    "brandId": 3,
    "name": "City",
    "years": "2002–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 21,
    "brandId": 3,
    "name": "Civic",
    "years": "2006–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 22,
    "brandId": 3,
    "name": "Jazz / Fit",
    "years": "2002–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 23,
    "brandId": 3,
    "name": "HR-V",
    "years": "2015–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 24,
    "brandId": 3,
    "name": "CR-V",
    "years": "2001–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 25,
    "brandId": 3,
    "name": "BR-V",
    "years": "2016–present",
    "imageUrl": null,
    "sortOrder": 6
  },
  {
    "id": 26,
    "brandId": 3,
    "name": "WR-V",
    "years": "2023–present",
    "imageUrl": null,
    "sortOrder": 7
  },
  {
    "id": 27,
    "brandId": 3,
    "name": "Accord",
    "years": "1994–present",
    "imageUrl": null,
    "sortOrder": 8
  },
  {
    "id": 28,
    "brandId": 3,
    "name": "Odyssey",
    "years": "1999–present",
    "imageUrl": null,
    "sortOrder": 9
  },
  {
    "id": 30,
    "brandId": 4,
    "name": "Camry",
    "years": "2002–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 31,
    "brandId": 4,
    "name": "Corolla Cross",
    "years": "2020–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 32,
    "brandId": 4,
    "name": "Hilux",
    "years": "2005–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 33,
    "brandId": 4,
    "name": "Fortuner",
    "years": "2005–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 34,
    "brandId": 4,
    "name": "Rush",
    "years": "2018–present",
    "imageUrl": null,
    "sortOrder": 6
  },
  {
    "id": 35,
    "brandId": 4,
    "name": "Veloz",
    "years": "2022–present",
    "imageUrl": null,
    "sortOrder": 7
  },
  {
    "id": 36,
    "brandId": 4,
    "name": "Yaris",
    "years": "2014–present",
    "imageUrl": null,
    "sortOrder": 8
  },
  {
    "id": 37,
    "brandId": 4,
    "name": "Innova",
    "years": "2005–present",
    "imageUrl": null,
    "sortOrder": 9
  },
  {
    "id": 38,
    "brandId": 4,
    "name": "Alphard",
    "years": "2002–present",
    "imageUrl": null,
    "sortOrder": 10
  },
  {
    "id": 39,
    "brandId": 5,
    "name": "CX-30",
    "years": "2019–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 40,
    "brandId": 5,
    "name": "CX-5",
    "years": "2012–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 41,
    "brandId": 5,
    "name": "CX-8",
    "years": "2018–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 42,
    "brandId": 5,
    "name": "Mazda 3",
    "years": "2003–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 43,
    "brandId": 5,
    "name": "Mazda 6",
    "years": "2002–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 44,
    "brandId": 5,
    "name": "BT-50",
    "years": "2006–present",
    "imageUrl": null,
    "sortOrder": 6
  },
  {
    "id": 45,
    "brandId": 6,
    "name": "ASX",
    "years": "2010–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 46,
    "brandId": 6,
    "name": "Outlander",
    "years": "2003–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 47,
    "brandId": 6,
    "name": "Eclipse Cross",
    "years": "2018–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 48,
    "brandId": 6,
    "name": "Xpander",
    "years": "2018–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 49,
    "brandId": 6,
    "name": "Triton",
    "years": "2005–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 50,
    "brandId": 6,
    "name": "Pajero Sport",
    "years": "2009–present",
    "imageUrl": null,
    "sortOrder": 6
  },
  {
    "id": 51,
    "brandId": 7,
    "name": "Almera",
    "years": "2011–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 52,
    "brandId": 7,
    "name": "X-Trail",
    "years": "2007–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 53,
    "brandId": 7,
    "name": "Navara",
    "years": "2005–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 54,
    "brandId": 7,
    "name": "Note",
    "years": "2005–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 55,
    "brandId": 7,
    "name": "Serena",
    "years": "2013–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 56,
    "brandId": 8,
    "name": "Elantra",
    "years": "2011–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 57,
    "brandId": 8,
    "name": "Tucson",
    "years": "2010–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 58,
    "brandId": 8,
    "name": "Santa Fe",
    "years": "2006–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 59,
    "brandId": 8,
    "name": "Kona",
    "years": "2017–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 60,
    "brandId": 8,
    "name": "i10",
    "years": "2007–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 61,
    "brandId": 8,
    "name": "Creta",
    "years": "2015–present",
    "imageUrl": null,
    "sortOrder": 6
  },
  {
    "id": 62,
    "brandId": 9,
    "name": "Sonet",
    "years": "2020–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 63,
    "brandId": 9,
    "name": "Sorento",
    "years": "2002–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 64,
    "brandId": 9,
    "name": "Carnival",
    "years": "1999–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 65,
    "brandId": 9,
    "name": "Sportage",
    "years": "2004–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 66,
    "brandId": 9,
    "name": "Stinger",
    "years": "2017–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 67,
    "brandId": 10,
    "name": "Swift",
    "years": "2004–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 68,
    "brandId": 10,
    "name": "Ertiga",
    "years": "2012–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 69,
    "brandId": 10,
    "name": "Jimny",
    "years": "1998–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 70,
    "brandId": 10,
    "name": "XL7",
    "years": "2020–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 71,
    "brandId": 10,
    "name": "Fronx",
    "years": "2023–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 72,
    "brandId": 11,
    "name": "1 Series",
    "years": "2004–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 73,
    "brandId": 11,
    "name": "3 Series",
    "years": "1998–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 74,
    "brandId": 11,
    "name": "5 Series",
    "years": "2003–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 75,
    "brandId": 11,
    "name": "X1",
    "years": "2009–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 76,
    "brandId": 11,
    "name": "X3",
    "years": "2003–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 77,
    "brandId": 11,
    "name": "X5",
    "years": "1999–present",
    "imageUrl": null,
    "sortOrder": 6
  },
  {
    "id": 78,
    "brandId": 11,
    "name": "7 Series",
    "years": "2001–present",
    "imageUrl": null,
    "sortOrder": 7
  },
  {
    "id": 79,
    "brandId": 12,
    "name": "A-Class",
    "years": "2012–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 80,
    "brandId": 12,
    "name": "C-Class",
    "years": "1999–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 81,
    "brandId": 12,
    "name": "E-Class",
    "years": "2002–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 82,
    "brandId": 12,
    "name": "GLA",
    "years": "2013–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 83,
    "brandId": 12,
    "name": "GLB",
    "years": "2019–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 84,
    "brandId": 12,
    "name": "GLC",
    "years": "2015–present",
    "imageUrl": null,
    "sortOrder": 6
  },
  {
    "id": 85,
    "brandId": 12,
    "name": "GLE",
    "years": "2015–present",
    "imageUrl": null,
    "sortOrder": 7
  },
  {
    "id": 86,
    "brandId": 13,
    "name": "Golf",
    "years": "2003–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 87,
    "brandId": 13,
    "name": "Passat",
    "years": "2005–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 88,
    "brandId": 13,
    "name": "Tiguan",
    "years": "2007–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 89,
    "brandId": 13,
    "name": "Polo",
    "years": "2009–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 90,
    "brandId": 13,
    "name": "Arteon",
    "years": "2017–present",
    "imageUrl": null,
    "sortOrder": 5
  },
  {
    "id": 91,
    "brandId": 14,
    "name": "Ranger",
    "years": "2011–present",
    "imageUrl": null,
    "sortOrder": 1
  },
  {
    "id": 92,
    "brandId": 14,
    "name": "EcoSport",
    "years": "2013–present",
    "imageUrl": null,
    "sortOrder": 2
  },
  {
    "id": 93,
    "brandId": 14,
    "name": "Everest",
    "years": "2015–present",
    "imageUrl": null,
    "sortOrder": 3
  },
  {
    "id": 94,
    "brandId": 14,
    "name": "Mustang",
    "years": "2015–present",
    "imageUrl": null,
    "sortOrder": 4
  },
  {
    "id": 96,
    "brandId": 1,
    "name": "Saga Iswara",
    "years": "1992–2003",
    "imageUrl": "/api/storage/objects/uploads/0fee99dd-57c2-42d0-b68d-e41ab84d22ad",
    "sortOrder": 1
  },
  {
    "id": 99,
    "brandId": 1,
    "name": "Persona Elegance",
    "years": "2010-2016",
    "imageUrl": "/api/storage/objects/uploads/ddb3fe9e-6cb0-41ed-b28e-7332b72226f8",
    "sortOrder": 12
  },
  {
    "id": 104,
    "brandId": 1,
    "name": "Inspira",
    "years": "2010–2015",
    "imageUrl": "/api/storage/objects/uploads/aba0beb9-2a03-436f-8e1b-40a9c15e57ac",
    "sortOrder": 16
  },
  {
    "id": 106,
    "brandId": 1,
    "name": "Ertiga",
    "years": "2016–2019",
    "imageUrl": "/api/storage/objects/uploads/afc74461-2d1a-46d5-b3b2-49123fe2e86e",
    "sortOrder": 19
  },
  {
    "id": 107,
    "brandId": 1,
    "name": "X90",
    "years": "2023–present",
    "imageUrl": "/api/storage/objects/uploads/cd9d4f09-61cd-4616-a75d-0f56d2a1dffd",
    "sortOrder": 26
  },
  {
    "id": 108,
    "brandId": 1,
    "name": "S70",
    "years": "2024–present",
    "imageUrl": "/api/storage/objects/uploads/3742d437-0c66-4821-a9fc-f6b5c985e6b2",
    "sortOrder": 27
  },
  {
    "id": 109,
    "brandId": 1,
    "name": "Saga BLM (MK1)",
    "years": "2008-2010",
    "imageUrl": "/api/storage/objects/uploads/662f68a6-9648-4777-8bcc-0871811769ab",
    "sortOrder": 3
  },
  {
    "id": 117,
    "brandId": 1,
    "name": "Exora Bold (Facelift)",
    "years": "2012–2023",
    "imageUrl": "/api/storage/objects/uploads/1efd3fb9-5b82-47be-9e66-7e47cef53554",
    "sortOrder": 18
  },
  {
    "id": 119,
    "brandId": 1,
    "name": "Iriz (Facelift)",
    "years": "2019–2021",
    "imageUrl": "/api/storage/objects/uploads/5654742d-31a4-4fc7-963e-7888bd5df12d",
    "sortOrder": 21
  },
  {
    "id": 120,
    "brandId": 1,
    "name": "X70 (Facelift)",
    "years": "2022–present",
    "imageUrl": "/api/storage/objects/uploads/386b3826-fecf-40a2-9ba2-50e7301bcb72",
    "sortOrder": 24
  },
  {
    "id": 122,
    "brandId": 1,
    "name": "Persona 3rd Gen (Facelift) (BH6)",
    "years": "2019-2021",
    "imageUrl": "/api/storage/objects/uploads/3e18ad3f-0685-49f9-b6ed-ab68525f7b0f",
    "sortOrder": 14
  },
  {
    "id": 123,
    "brandId": 1,
    "name": "Persona 3rd Gen (2nd Facelift) (BH6)",
    "years": "2021-Present",
    "imageUrl": "/api/storage/objects/uploads/dc8a99fc-3ef6-4974-a733-fd2e48b77442",
    "sortOrder": 15
  },
  {
    "id": 124,
    "brandId": 1,
    "name": "Saga 3rd Gen (MK4)",
    "years": "2016-2019",
    "imageUrl": "/api/storage/objects/uploads/0b8d2c00-2848-4e05-9de9-fa3a90e7f892",
    "sortOrder": 5
  },
  {
    "id": 125,
    "brandId": 1,
    "name": "Saga 3rd Gen Facelift (MC1/MC2)",
    "years": "2019-2025",
    "imageUrl": "/api/storage/objects/uploads/fea142bc-121e-4732-9064-3c489c595c27",
    "sortOrder": 6
  },
  {
    "id": 126,
    "brandId": 1,
    "name": "Saga (MC3)",
    "years": "2025-Present",
    "imageUrl": "/api/storage/objects/uploads/c4906ff3-612b-457f-ad4e-d2af4f03306b",
    "sortOrder": 7
  },
  {
    "id": 127,
    "brandId": 2,
    "name": "Bezza (Facelift) (A700)",
    "years": "2020-Present",
    "imageUrl": "/api/storage/objects/uploads/f35ba0da-4dcd-4ec4-a8b5-2318b99ff80d",
    "sortOrder": 11
  },
  {
    "id": 128,
    "brandId": 2,
    "name": "Myvi 1st Gen (M300)",
    "years": "2005-2008",
    "imageUrl": "/api/storage/objects/uploads/673c973d-0146-4493-afde-02c1fed12ef9",
    "sortOrder": 1
  },
  {
    "id": 129,
    "brandId": 2,
    "name": "Myvi 1st Gen (Facelift) (M300)",
    "years": "2008-2011",
    "imageUrl": "",
    "sortOrder": 2
  },
  {
    "id": 130,
    "brandId": 2,
    "name": "Alza (1st Facelist) (M500)",
    "years": "2014-2018",
    "imageUrl": null,
    "sortOrder": 6
  },
  {
    "id": 131,
    "brandId": 2,
    "name": "Alza (2nd Facelift) (M500)",
    "years": "2018-2022",
    "imageUrl": null,
    "sortOrder": 7
  },
  {
    "id": 132,
    "brandId": 2,
    "name": "Alza (W150)",
    "years": "2022-Present",
    "imageUrl": null,
    "sortOrder": 8
  },
  {
    "id": 133,
    "brandId": 1,
    "name": "Saga FL/FLX (MK2/ MK3)",
    "years": "2010-2019",
    "imageUrl": "/api/storage/objects/uploads/9f0af4af-4e0d-4040-8dfe-0976eae9830c",
    "sortOrder": 4
  },
  {
    "id": 135,
    "brandId": 1,
    "name": "Saga LMST",
    "years": "2003-2008",
    "imageUrl": "/api/storage/objects/uploads/eab62cb2-d721-4903-a54c-9753fa43bc23",
    "sortOrder": 2
  },
  {
    "id": 136,
    "brandId": 1,
    "name": "Iriz (2nd Facelift)",
    "years": "2021-Present",
    "imageUrl": "/api/storage/objects/uploads/0d2c230a-e4d9-45d4-be81-6784ff8e567b",
    "sortOrder": 22
  },
  {
    "id": 137,
    "brandId": 1,
    "name": "Waja (Facelift)",
    "years": "2007-2011",
    "imageUrl": "/api/storage/objects/uploads/58eab607-9a19-4ad5-af22-3c0bab80d540",
    "sortOrder": 10
  },
  {
    "id": 138,
    "brandId": 4,
    "name": "Corolla Altis (E120)",
    "years": "2001-2004",
    "imageUrl": "/api/storage/objects/uploads/01f894d9-030c-4d3c-bbaf-10a108082b11",
    "sortOrder": 11
  },
  {
    "id": 139,
    "brandId": 4,
    "name": "Corolla Altis (E140)",
    "years": "2008-2011",
    "imageUrl": "/api/storage/objects/uploads/2edc40ac-9e0d-4ae3-8ba4-6e6581f350ab",
    "sortOrder": 14
  },
  {
    "id": 140,
    "brandId": 4,
    "name": "Corolla Altis (E170)",
    "years": "2014-2016",
    "imageUrl": "/api/storage/objects/uploads/75e3cabc-d4bc-4c57-8b25-f8a1a753cf7c",
    "sortOrder": 16
  },
  {
    "id": 141,
    "brandId": 4,
    "name": "Corolla Altis (E210)",
    "years": "2019-Present",
    "imageUrl": "/api/storage/objects/uploads/e0655a94-81de-427e-9f2d-38c9f21014bb",
    "sortOrder": 18
  },
  {
    "id": 142,
    "brandId": 4,
    "name": "Corolla Altis (E180)",
    "years": "2016-2019",
    "imageUrl": "/api/storage/objects/uploads/446d8d39-14c5-488b-a885-5a2716368a4d",
    "sortOrder": 17
  },
  {
    "id": 143,
    "brandId": 4,
    "name": "Corolla Altis (E130)",
    "years": "2004-2006",
    "imageUrl": "/api/storage/objects/uploads/4fc1dbe5-bcf2-4fa5-adbf-ac733d5f257b",
    "sortOrder": 12
  },
  {
    "id": 144,
    "brandId": 4,
    "name": "Corolla Altis",
    "years": "2006-2008",
    "imageUrl": "/api/storage/objects/uploads/14d7f1fb-33ae-49a4-8bad-0a641de3500e",
    "sortOrder": 13
  },
  {
    "id": 145,
    "brandId": 4,
    "name": "Corolla Altis (E150)",
    "years": "2011-2013",
    "imageUrl": "/api/storage/objects/uploads/43474c6b-6f2b-4107-9755-47fa9f79fed1",
    "sortOrder": 15
  },
  {
    "id": 146,
    "brandId": 4,
    "name": "Vios (NCP42)",
    "years": "2003-2004",
    "imageUrl": "/api/storage/objects/uploads/3a40823a-e2f1-43af-aea4-a5f80d28a4d4",
    "sortOrder": 19
  },
  {
    "id": 147,
    "brandId": 4,
    "name": "Vios (Facelift) (NCP42)",
    "years": "2005-2007",
    "imageUrl": "/api/storage/objects/uploads/f037160f-4bc0-408a-85cc-dd3aaeb7949b",
    "sortOrder": 20
  },
  {
    "id": 148,
    "brandId": 4,
    "name": "Vios (NCP93)",
    "years": "2007-2010",
    "imageUrl": "/api/storage/objects/uploads/11f856d9-98d0-4251-ab84-40ed05406e97",
    "sortOrder": 21
  },
  {
    "id": 149,
    "brandId": 4,
    "name": "Vios (Facelift)(NCP93)",
    "years": "2010-2013",
    "imageUrl": "/api/storage/objects/uploads/099c2b01-d20f-419f-814e-56bdd779a936",
    "sortOrder": 22
  },
  {
    "id": 150,
    "brandId": 4,
    "name": "Vios (NCP150)",
    "years": "2013-2016",
    "imageUrl": "/api/storage/objects/uploads/94e05792-45ab-46d5-89a2-99eea6e269a5",
    "sortOrder": 23
  },
  {
    "id": 151,
    "brandId": 4,
    "name": "Vios (NSP151)",
    "years": "2016-2018",
    "imageUrl": "/api/storage/objects/uploads/dbdcf585-8c5b-4df9-8fa2-85942f198824",
    "sortOrder": 24
  },
  {
    "id": 152,
    "brandId": 4,
    "name": "Vios (NSP151) (Facelift)",
    "years": "2019-2021",
    "imageUrl": "/api/storage/objects/uploads/42e1972a-f24e-4f5d-9e90-f2c04e190f9b",
    "sortOrder": 25
  },
  {
    "id": 153,
    "brandId": 4,
    "name": "Vios (NSP151) (2nd Facelift)",
    "years": "2021-2023",
    "imageUrl": "/api/storage/objects/uploads/02c4edc9-cca4-4b61-840f-15cf79a62e5e",
    "sortOrder": 26
  },
  {
    "id": 154,
    "brandId": 4,
    "name": "Vios (AC100)",
    "years": "2023-Present",
    "imageUrl": "/api/storage/objects/uploads/7037cfe5-9e9d-4084-a4e2-d28143eab6ad",
    "sortOrder": 27
  }
];
const SLIDES = [
  {
    "id": 1,
    "imageUrl": "/api/storage/objects/uploads/42bfccfe-6b7e-4f5d-98aa-5f9082d15353",
    "tag": "Premium Air Fresheners",
    "title": "CARALL",
    "highlight": "AIR FRESHENER",
    "subtitle": "Transform every journey with signature scents crafted for the modern driver. Pure freshness, every ride.",
    "categorySlug": "air-fresheners",
    "sortOrder": 2
  },
  {
    "id": 2,
    "imageUrl": "/cat-exterior.png",
    "tag": "Exterior Collection",
    "title": "BUILT FOR",
    "highlight": "THE ROAD.",
    "subtitle": "Aerodynamic styling and protection that looks as good as it performs.",
    "categorySlug": "roof-box",
    "sortOrder": 1
  },
  {
    "id": 3,
    "imageUrl": "/cat-interior.png",
    "tag": "Interior Series",
    "title": "COMFORT",
    "highlight": "REDEFINED.",
    "subtitle": "Premium interior upgrades that transform every drive into an experience.",
    "categorySlug": "seat-covers",
    "sortOrder": 3
  },
  {
    "id": 4,
    "imageUrl": "/cat-lighting.png",
    "tag": "Lighting Systems",
    "title": "SEE &",
    "highlight": "BE SEEN.",
    "subtitle": "High-intensity lighting solutions engineered for visibility and presence.",
    "categorySlug": "wipers",
    "sortOrder": 4
  }
];
const CONTACT_INFO = [
  {
    "id": 1,
    "label": "Address",
    "value": "No.2A, Jalan KPB 3, Batu 10, Kawasan Perindustrian Budiman, 43200 Cheras, Selangor D.E, Malaysia "
  },
  {
    "id": 2,
    "label": "Phone",
    "value": "+60 3-1234 5678"
  },
  {
    "id": 3,
    "label": "Email",
    "value": "tienweimkt@gmail.com"
  },
  {
    "id": 4,
    "label": "Operating Hours",
    "value": "Mon – Fri: 9:30 AM – 6:00 PM\n"
  },
  {
    "id": 5,
    "label": "Google Maps Embed URL",
    "value": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3646.9719653802294!2d101.77612587452909!3d3.0479654537672376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc34bedb335ca7%3A0xc6b7c4b722c3a8af!2sTien%20Wei%20Marketing%20SDN%20BHD!5e1!3m2!1sen!2smy!4v1775231101273!5m2!1sen!2smy\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>"
  }
];
const PRODUCTS = [
  {
    "id": 17,
    "name": "CARBOY PERODUA ARUZ ROOF BOX ",
    "slug": "carboy-perodua-aruz-roof-box",
    "description": "",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": "/api/storage/objects/uploads/0c384456-2529-4c1f-bfcf-3dc9f93051f6",
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 17,
    "brand": "CARBOY",
    "sku": "",
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      17
    ],
    "carBrandIds": [
      2
    ],
    "carModelIds": [
      14
    ],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 19,
    "name": "CARALL Regalia Enrich Air 2 Packs (2.4g x 2Packs)",
    "slug": "carall-regalia-enrich-air-2-packs-2-4g-x-2packs",
    "description": "New Edition for Velvet Musk scent \r\n\r\nA warm design using carefully selected materials with the silver wording\r\nAir Conditioner louver mounting type appeared in the popular Regalia series !\r\nHigh-quality and rich scent.\r\n\r\nベルベットムスクの香りに新登場\r\n厳選素材を使用した温かみのあるデザインにシルバーの文字\r\n人気のレガリアシリーズにエアコンルーバー取付タイプが登場！\r\n上質でリッチな香り。\r\n\r\nBrand : CARALL カーオール\r\nModel : REGALIA ENRICH AIR 2 PACKS\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nVolume : 2.4g \r\nLasting: 1 - 2 Months\r\n** For Vehicle Ventilator\r\n\r\nFlavour:\r\n3641 Velvet musk ベルベットムスク\r\n* A scent that spreads lightly with mellow sweetness\r\n\r\n* 3641 Velvet Musk Refill (1pc)",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 2
  },
  {
    "id": 20,
    "name": "CARALL Savon Time Clip (2 Packs x 2.4g)",
    "slug": "carall-savon-time-clip-2-packs-x-2-4g",
    "description": "A clean space with the scent of soap.\r\nA deodorant with a clean soap scent. \r\nContains \"deodorizing aroma\" and plant deodorizing ingredients that make it difficult to feel bad odors. \r\nThe scent and deodorizing effect make the inside of your car a clean space. \r\nAir conditioner louver installation type that spreads the scent with the air conditioner breeze.\r\n\r\n石けん香る、清らかな空間。\r\n清潔感のある石けんの香りを集めた消臭剤。\r\n悪臭を感じにくくする香料“消臭アロマ”と植物消臭成分を配合。\r\n香りと消臭効果で、車内を清らかな空間に。\r\nエアコンの風で香り広がるエアコンルーバー取付タイプ。\r\n\r\nBrand : CARALL カーオール\r\nModel : SAVON TIME 2 PACKS サボンタイム リキッド\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nVolume : 2.4g \r\nLasting: 1 - 2 Months\r\n** For Vehicle Ventilator\r\n\r\n\r\nThree (3) Flavour : -\r\n3591 FLORAL MUSK フローラルムスク\r\n- A pleasant soapy scent reminiscent of an elegant bath time.\r\n\r\n3592 MILD COTTON マイルドコットン\r\n- Soft, soapy scent like a freshly washed towel\r\n\r\n3593 WHITY SHOWER ホワイティシャワー\r\n- A clear, soapy scent that feels like after taking a shower.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": "",
    "sku": "",
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 3
  },
  {
    "id": 21,
    "name": "CARALL Eldran Kiss Gel (105ml)",
    "slug": "carall-eldran-kiss-gel-105ml",
    "description": "The bewitching appearance and high-quality scent will captivate you.\r\nDeep, vivid colors transform the inside of your car into an adult space. \r\nA gel type with a long-lasting luxurious scent.\r\n\r\n妖艶な佇まい、上質な香りがあなたを魅了する。\r\n深みのある鮮やかなカラーが車内を大人の空間へ。\r\n贅沢な香りが長く続くゲルタイプ。\r\n\r\nBrand : CARALL カーオール\r\nModel : Eldran Kiss Gel エルデュラン キス ゲル\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nTexture : Hard Gel\r\nVolume : 105ml\r\n\r\nFlavor : -\r\n3472 Luxist Aroma ラグジストアロマ\r\n- Soft, sweet, high-quality adult scent",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 4
  },
  {
    "id": 22,
    "name": "CARALL Omnibus (160ml)",
    "slug": "carall-omnibus-160ml",
    "description": "A masterpiece that expresses the finest fragrance quality through design.\r\n最高級の香質を追求し、デザインで表現した逸品\r\n\r\n\"Omnibus\" is a collection of the finest fragrances, each of which is individually perfected. \r\nオムニバス」は、個々に完成されたものを集めた最高級フレグランスです。\r\n\r\nAs the name suggests, the scent, which was created with the theme \"for everyone,\" will envelop you, the person who seeks authenticity.\r\n「その語源の通り「すべての人のために」をテーマに調香された香りが本物志向のあなたを包みます。\r\n\r\nBrand : CARALL カーオール\r\nModel : Omnibus オムニバス\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD\r\nTexture : Liquid\r\nVolume : 160ml\r\nLasting : 3-4 months (Depends on Usage)\r\n\r\nThree (3) Flavors : -\r\n3244 Luxury Amber \r\n*  It is neither a sweet fruity scent nor a pungent freshener. The warm amber tone is mixed with a hint of wood and musk, like the scent of a mature adult. It is very suitable for business cars or spaces shared by couples.\r\n\r\n3245 AQUATIC HOMME\r\n* The main scent is fresh ocean notes, blended with elegant woody notes, bringing a feeling like the sea breeze. This scent has both the calmness of men and the fresh vitality, suitable for you who pursue quality life.\r\n\r\n3246 RICH MAGNOLIA\r\n*  Built around the lush, creamy scent of magnolia flowers, blended with delicate floral and fruity notes. It’s the kind of fragrance that whispers elegance — soft, romantic, and effortlessly classy. Think spring breeze through blooming trees.\r\nPerfect for those who love a subtle yet charming presence in their space.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 5
  },
  {
    "id": 23,
    "name": "CARALL Wide Deodorant For Cigarette/ Rokok (800g)",
    "slug": "carall-wide-deodorant-for-cigarette-rokok-800g",
    "description": "Perfect for minivans and large vehicles!\r\nFormulated with natural deodorizing ingredients derived from plants. \r\nContains natural deodorant ingredients that are effective for cigarette smell.\r\nA clean scent spreads in the car. Large capacity 800g!\r\n\r\nミニバン・大型車に最適 !\r\n植物うまれの天然消臭成分配合。清潔感のある香りが車内に広がります。\r\nタバコ臭に効果的な天然消臭成分配合。\r\n大容量800g！\r\n\r\nBrand : CARALL カーオール\r\nModel : Wide Deodorant\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nTexture : Hard Gel\r\nVolume : 800g\r\nLasting : 3 - 4 months\r\n\r\nScent: \r\n1880 - Squash for Tobacco \r\nタバコ用スカッシュ",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 6
  },
  {
    "id": 24,
    "name": "CARALL Awesome Days Box (165ml)",
    "slug": "carall-awesome-days-box-165ml",
    "description": "Relaxing fragrance to relax with scent\r\nCreate a comfortable space in your car with a scent inspired by a calm moment spent in nature. An under-seat type that colors the interior of the car with a calming earth color and a voluminous design.\r\n\r\n香りでくつろぐリラクシングフレグランス\r\n自然の中で過ごす穏やかなひとときをイメージした香りで車内を心地よい空間に。落ち着きのあるアースカラーとボリューム感のあるデザインで車内を彩るシート下タイプ。\r\n\r\nBrand : CARALL カーオール\r\nModel : Awesome Days Box オーサムデイズ ボックス\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nTexture : Hard Gel\r\nVolume : 165ml \r\nLasting: 2 - 3 Months \r\n\r\nThree (3) Flavor : \r\n1) 3515 White Musk ホワイトムスク\r\nTOP: Green Apple, Berry\r\nMIDDLE: Rose, Violet, Jasmine\r\nLAST: Woody, Musk\r\n*The scent of a flower garden when you take a leisurely stroll surrounded by flowers in full bloom\r\n\r\n2) 3516 Forest Glow フォレストグロウ\r\nTOP: Orange, Apple, Peach, Leaty Green \r\nMIDDLE: Rose, Lilac, Muguet, Jasmine \r\nLAST : Musk, Powdery, Woody, Amber\r\n* The scent of the forest when you take a deep breath in a forest with lush young leaves\r\n\r\n3) 3517 Lake Breeze レイクブリーズ\r\nTOP: Lemon, Chamomile Roman\r\nMIDDLE: White Tea, Muguet, Jasmine, Rose\r\nLAST : White Musk, Heliotrope, Amber\r\n*The scent of the gentle wind blowing through while you take a breather while gazing out at the magnificent lake.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 7
  },
  {
    "id": 25,
    "name": "CARALL Eldran Glister (2 Packs x 2.4g)",
    "slug": "carall-eldran-glister-2-packs-x-2-4g",
    "description": "The finest luxury space just by installing a luxury design with an overwhelming presence that is typical of the El Duran series, fascinating from the air conditioner louvers. \r\nThe finest scent carefully selected wraps around the inside of the car.\r\n取り付けるだけで極上の贅沢空間\r\nエアコンルーバーから魅了する、エルデュランシリーズらしい圧倒的な存在感のあるラグジュアリーデザイン。厳選された極上の香りが車内を包み込む。\r\n\r\nBrand : CARALL カーオール\r\nModel : ELDRAN GLISTER 2 PACKS\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nVolume : 2.4g \r\nLasting: 1 - 2 Months\r\n** For Vehicle Ventilator\r\n\r\n\r\nThree (3) Flavour : - \r\n3386 White musk ホワイトムスク\r\n*A transparent and gentle adult scent\r\n\r\n3387 Rich bloom リッチブルーム\r\n*Gorgeous and elegant adult scent\r\n\r\n3388 Platinum shower プラチナシャワー\r\n*Sweet, gentle and sexy adult scent",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 8
  },
  {
    "id": 26,
    "name": "CARALL Scratch Removal & Coat Glitter For Light Color Cars (250g)",
    "slug": "carall-scratch-removal-coat-glitter-for-light-color-cars-250g",
    "description": "**Note: Please use it after confirming the adaptive paint color and carefully reading the precautionary statements.\r\n\r\n- 8 kinds of active ingredients make the body and lights shine of a new car!\r\n- Contains 8 kinds of active ingredients! It removes car wash scratches, polishing scratches, and water stains, prepares the body like a mirror, and forms a protective film that is strong against car wash. \r\n- Furthermore, when used for dull headlights, the transparency is revived and the finish is impressive.\r\n\r\n**How To Use**\r\n1. Wash the car in advance, remove dirt that may cause scratches such as sand and mud, and wipe off the water.\r\n2. Apply an appropriate amount to a sponge and spread it thinly to polish it.\r\n3. When the surface is dry (5-10 minutes), wipe it off with a clean towel.\r\n\r\n**Usable items**\r\nPainted surface, plastic lens visor (It has no effect on deterioration inside the resin)\r\n\r\n**Unusable items**\r\nGlass, mirrors, tires, plated parts, open car hoods, uneven processing and matte plastic parts (unpainted bumpers), etc.\r\n\r\n**Precautions**\r\n1. Do not use under the scorching sun or when the body is hot.\r\n2. Do not leave it on for a long time without wiping it off.\r\n3. Do not use for deteriorated painting or repainting.\r\n4. Do not use for vehicles with professional coating. (Because it contains compound)\r\n5. Do not use for materials for which you do not know.\r\n6. Do not use when the wind is strong or where there is a lot of sand dust.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 7,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      7
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 27,
    "name": "CARALL Seasonable (160ml)",
    "slug": "carall-seasonable-160ml",
    "description": "A fragrance where you can enjoy the blessings of Japan with its scent\r\n日本の自然の恵みを香りで楽しむフレグランス\r\n\r\nA rich and refreshing scent that blends the scents of domestic fruits and flowers spreads comfortably in the car. Can also be installed in a drink holder.\r\n国産の果実や花の香りをブレンドした豊かで爽やかな香りが心地よく車内に広がります。ドリンクホルダーにも設置可能。\r\n\r\nBrand : CARALL カーオール\r\nModel : Seasonable シーズナブル\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD\r\nTexture : Liquid\r\nVolume : 160ml\r\nLasting : 3-4 months\r\n\r\nThree (3) Flavour : -\r\n3479 Oshima Sakura 大島桜\r\n* In the shining sunshine of spring, the warm scent of Oshima cherry blossoms that blooms for 7 minutes.\r\n\r\n3480 Setouchi Lemon 瀬戸内レモン \r\n* A fresh and fresh scent that combines the scents of Setouchi lemon and sea breeze.\t\r\n\r\n3481 Oita Kabosu 大分カボス\r\n* The refreshing and refreshing scent of kabosu that grew lushly in the sunlight.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 9
  },
  {
    "id": 28,
    "name": "CARALL Car Body & Aluminium Wheel Iron Powder Cleaner (500ml)",
    "slug": "carall-car-body-aluminium-wheel-iron-powder-cleaner-500ml",
    "description": "**Note: Paint and parts that have deteriorated over time may cause discoloration and stains.\r\n**Applicable to all paint colors (excluding yellow color)\r\n\r\n- A chemical reaction cleans and removes stubborn stains!\r\n- From the rough iron powder on the body to the brake dust stuck to the aluminum wheels, this one can be used for powerful cleaning! \r\n- The body can be easily washed just like shampoo!\r\n\r\n**How To Use**\r\n1. Rinse sand and mud with water in advance.\r\n2. Shake the bottle well and set the <ON> side of the spray tip up.\r\n3. Spray directly on the area of ​​use and leave for 2-3 minutes.\r\n* Work on each part such as the door to prevent the liquid from drying out.\r\n* Be careful not to get liquid on the brake part.\r\n4. Gently rub with a sponge to remove dirt.\r\n5. Rinse thoroughly with water and wipe off any remaining water droplets.\r\n* If liquid or water droplets after rinsing remain on the inside of tires, wheels, gaps in the body, etc., there is a risk of discoloration or scale-like water stains.\r\n* Although there is a peculiar odor to the liquid, it does not adversely affect the skin or the environment.\r\n\r\nUnusable items\r\n● Pro-coated vehicles ● Wheels other than aluminum (iron, magnesium, etc.) ● Wheels such as plating, sputtering, alumite, and matte paint ● Deteriorated body and wheels (scratches, cracks, peeling, etc.) Normally, a top coat (clear paint) is applied, but depending on the type and usage conditions, it may deteriorate over time in 1 to 2 years and the top coat may come off. ● Special painting ・ Repainting (including repair painting) ・ Yellow color body and wheels ● Cars without clear painting ● BMW rubber molding ● Painted nuts and pierce bolts ● Automatic stop function and safety devices such as cameras\r\n\r\n**Precaution for use**\r\n● Do not use when the body and wheels are hot, such as under the scorching sun or after running, as it may cause stains and unevenness.\r\n● Do not leave the product in the liquid.\r\n● After cleaning, check the braking force of the brakes at low speed before driving.\r\n● Be careful not to get it on your clothes as it will cause stains.\r\n● Wash your hands thoroughly with soap after use.\r\n● If the liquid on the brake part (caliper, balance weight, etc.) is left unattended, it may cause discoloration or stains, so immediately wash it off completely with sufficient water.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 7,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      7
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 29,
    "name": "CARALL Cleaning & Polishing Liquid Wax (500ml)",
    "slug": "carall-cleaning-polishing-liquid-wax-500ml",
    "description": "**Note: Be sure to try each part in an inconspicuous part before using it. Be especially careful of areas that have deteriorated over time as they may cause discoloration and stains.\r\n● Do not use under the scorching sun or when the place of use is hot.\r\n\r\n- Contains glass-based polymer! Increases gloss, water repellency, and durability!\r\n- A powerful type of \"whole car wax spray\" is finally here. In addition to body, glass and wheels, it can also be used for resin parts and plating. \r\n- Car wash + WAX without using water! Just spray and wipe to strongly repel water and give a beautiful luster. \r\n- Easy premium wax for anyone who can use it on a wet body after washing the car!\r\n\r\n**How To Use**\r\n1. Rinse sand and mud in advance as it may cause scratches.\r\n* Can be used even when wet with water. Work while diligently squeezing the cloth.\r\n2. Shake the container well, set the tip of the trigger to <ON>, spray it, and finish it evenly with a cloth.\r\n* Microfiber cloth recommended\r\n* Please use each part so that the liquid does not dry out.\r\n* If the cloth becomes dirty, change it to a clean surface before starting work. The guideline for spraying is about 5 times on half the hood of a medium-sized car.\r\n\r\n**Unusable**\r\nParts repaint, special paint, deteriorated paint / material (scratches, cracks, discoloration, etc.) Cars without clear paint, specially processed glass and mirrors, wheels other than genuine aluminum wheels, tires / rubber, automatic stop Functions, safety devices such as cameras, and places that interfere with it\r\n* If liquid gets on it, wipe it off immediately.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 7,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      7
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 30,
    "name": "CARALL Seasonable Plate (3 Packs x 12g)",
    "slug": "carall-seasonable-plate-3-packs-x-12g",
    "description": "**Note: Price for 1 Pack With 3 Pieces/Packs. \r\n\r\nA fragrance where you can enjoy the blessings of Japan with its scent\r\n日本の自然の恵みを香りで楽しむフレグランス\r\n\r\nA rich and refreshing scent that blends the scents of domestic fruits and flowers spreads comfortably in the car. Paper type with gorgeous watercolor design.\r\n国産の果実や花の香りをブレンドした豊かで爽やかな香りが心地よく車内に広がります。水彩デザインが華やかな、ペーパータイプ。\r\n\r\nBrand : CARALL カーオール\r\nModel : Seasonable Plate Pack of 3\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD\r\nVolume : 12g x 3pieces\r\nLasting: 30days to 45days per piece\r\n\r\nThree (3) Flavour : -\r\n3489 Oshima Sakura 大島桜\r\n* In the shining sunshine of spring, the warm scent of Oshima cherry blossoms that blooms for 7 minutes.\r\n\r\n3490 Setouchi Lemon 瀬戸内レモン \r\n* A fresh and fresh scent that combines the scents of Setouchi lemon and sea breeze.\t\r\n\r\n3491 Oita Kabosu 大分カボス\r\n* The refreshing and refreshing scent of kabosu that grew lushly in the sunlight.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 10
  },
  {
    "id": 31,
    "name": "CARALL Glass Water Fur Removal Pad (2 x 17g)",
    "slug": "carall-glass-water-fur-removal-pad-2-x-17g",
    "description": "**Note: 2 Pieces in a Pack**\r\n**Be careful as rubbing strongly may scratch the glass and mirror.\r\n\r\n- Easily eliminate scale-like water stains stuck to windows!\r\n- The work is easy, just rub it with water! \r\n- The newly developed hybrid polishing technology (special pad + original abrasive formulation) brings out a high polishing effect with a light force. \r\n- You can also remove white scale-like stains on the mirror in the bathroom.\r\n\r\n**How To Use**\r\n1. Rinse off dirt such as sand dust in advance.\r\n2. Soak the white surface (thin felt layer) of the pad with appropriate water and rub it with a light force.\r\n* Do not rub with force as it may cause scratches.\r\n* You can easily remove dirt by rubbing it many times with a light force.\r\n3. When the pad dries, add water.\r\n4. After rubbing, rinse thoroughly with plenty of water and wipe off the water.\r\n* If the dirt does not come off, repeat the work.\r\n* If the ingredients remain and cannot be removed, use again and rinse with water while rubbing lightly with a sponge.\r\n\r\n**Unusable items**\r\nWater-repellent glass, cracked glass, resin windows, mirrors (room side), glass coated by dealers and specialists, glass for foreign and imported cars, glass surface inside cars, glasses Lenses, frosted glass, other specially processed glass and mirrors (anti-fog processing, etc.)",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 7,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      7
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 32,
    "name": "CARALL Scratch Removal & Coat Glitter For Dark Color Cars (250g)",
    "slug": "carall-scratch-removal-coat-glitter-for-dark-color-cars-250g",
    "description": "**Note: Please use it after confirming the adaptive paint color and carefully reading the precautionary statements.\r\n\r\n- 8 kinds of active ingredients make the body and lights shine of a new car!\r\n- Contains 8 kinds of active ingredients! It removes car wash scratches, polishing scratches, and water stains, prepares the body like a mirror, and forms a protective film that is strong against car wash. \r\n- Furthermore, when used for dull headlights, the transparency is revived and the finish is impressive.\r\n\r\n**How To Use**\r\n1. Wash the car in advance, remove dirt that may cause scratches such as sand and mud, and wipe off the water.\r\n2. Apply an appropriate amount to a sponge and spread it thinly to polish it.\r\n3. When the surface is dry (5-10 minutes), wipe it off with a clean towel.\r\n\r\n**Usable items**\r\nPainted surface, plastic lens visor (It has no effect on deterioration inside the resin)\r\n\r\n**Unusable items**\r\nGlass, mirrors, tires, plated parts, open car hoods, uneven processing and matte plastic parts (unpainted bumpers), etc.\r\n\r\n**Precautions**\r\n1. Do not use under the scorching sun or when the body is hot.\r\n2. Do not leave it on for a long time without wiping it off.\r\n3. Do not use for deteriorated painting or repainting.\r\n4. Do not use for vehicles with professional coating. (Because it contains compound)\r\n5. Do not use for materials for which you do not know.\r\n6. Do not use when the wind is strong or where there is a lot of sand dust.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 7,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      7
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 33,
    "name": "CARALL Glass Oil Film Removal Pad (2 x 15g)",
    "slug": "carall-glass-oil-film-removal-pad-2-x-15g",
    "description": "**Note: 2 Pieces in a Pack**\r\n**Be careful as rubbing strongly may scratch the glass.\r\n\r\n- Quickly clears glare oil film and deteriorated glass coating agent!\r\n- Achieves an overwhelming speed finish with the removal accelerator P / A / A combination! \r\n- Work is easy, just soak in water and rub lightly! \r\n- Even beginners and women can firmly remove the oil film.\r\n\r\n**How To Use**\r\n1. Rinse off dirt such as sand dust in advance.\r\n2. Soak the white surface of the pad with a moderate amount of water and rub it with a light force until the liquid does not repel.\r\n* Do not rub it with force as it may cause scratches.\r\n* You can work more easily by holding it lightly with your palm and rubbing it smoothly.\r\n3. When the pad dries, add water.\r\n4. After rubbing, rinse thoroughly with plenty of water and wipe off the water.\r\n* If the dirt does not come off, repeat the work.\r\n* If the ingredients remain white and cannot be removed, use them again and wash them off with water while rubbing lightly with a sponge.\r\n\r\n**Unusable items**\r\nWater-repellent glass, cracked glass, resin windows, mirrors, glass coated by dealers and specialists, glass for foreign and imported cars, inner glass surface, and other special glass.\r\n\r\nFAQ\r\n1) Can I use it repeatedly?\r\nIt's a used-up product. If there is less chemical solution soaked in it, the dirt removal will get worse. In addition, mold grows and the ingredients may deteriorate, so it can't be reused.\r\n\r\n2) I want to keep what I used once.\r\nPlease note that this product is a used-up type and cannot be stored once used.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 7,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      7
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 34,
    "name": "CARALL Maintenance Shampoo (1000ml)",
    "slug": "carall-maintenance-shampoo-1000ml",
    "description": "**Note: Applicable to all paint colors\r\n\r\nMaintenance shampoo for cars with professional coating\r\nJust wash! Car wash & maintenance!\r\n- A maintenance shampoo that does not use any compound, wax, silicon, alcohol, petroleum-based solvents, or fragrances, and is compatible with all types of professional coatings such as genuine body coats applied by car dealers. \r\n- Ultra-micro foam like whipped cream gently cleans the construction film.\r\n\r\n**How To Use**\r\n1. Rinse off sand and mud that cause scratches with water.\r\n2. Mix 1 liter of water with 1 cup (15 ml) of Shampoo and whisk well.\r\n3. Soak a sponge with plenty of shampoo and wash gently.\r\n4. After washing the car, rinse it thoroughly with water and be sure to wipe off any remaining water droplets with a towel or the like.\r\n* When the water droplets dry, they may remain white due to the components contained in the water.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 7,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      7
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 35,
    "name": "CARALL Brown Marks Sachet (14g)",
    "slug": "carall-brown-marks-sachet-14g",
    "description": "Interior fragrance with a natural scent in the car\r\nA warm design using carefully selected materials. A sachet type that spreads the scent firmly just by hanging it. Contains deodorant ingredients extracted from plants.\r\n車内に自然な香り広がるインテリアフレグランス\r\nこだわりの素材を使った、温かみのあるデザイン。吊るだけでしっかりと香り広がるサシェタイプ。植物から抽出した消臭成分配合\r\n\r\nBrand : CARALL カーオール\r\nModel : BROWN MARKS Sachet\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nVolume : 14g\r\n\r\nThree (3) Flavor :-\r\n3465 White Floral ホワイトフローラル\r\n*Blended with refreshing green and strong amber, mainly elegant roses.\r\n*Gorgeous elegant floral fragrance\r\n\r\n3466 White Citrus ホワイトシトラス\r\n*Blend clean grapefruit with luscies apple and gentle veciber.\r\n*Fresh fruity citrus fragrance\t\r\n\r\n3467 White Musk ホワイトムスク\r\n*A blend of gentle apple and pleasant musk, mainly with pretty jasmine.\r\n*Gentle floral musk fragrance",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 11
  },
  {
    "id": 36,
    "name": "CARALL Grand Chelia 65L (55ml)",
    "slug": "carall-grand-chelia-65l-55ml",
    "description": "Well-honed design, richly scented carefully selected fragrances.\r\nThe lineup includes a glitter type and a bright blue type. \r\nA luxurious fragrance. The highly palatable scent creates a luxurious space\r\n\r\n研ぎ澄まされたデザイン、豊かに香る厳選香料。\r\n輝き放つラメタイプと、鮮やかなブルータイプのラインアップ。\r\n高級感溢れるフレグランス。嗜好性の高い香りがラグジーな空間を演出。\r\n\r\nBrand : CARALL カーオール\r\nModel : Grand Chelia 65L レガリア\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nTexture : Gel\r\nVolume : 55ml\r\n\r\nFlavor : -\r\n3173 White Musk   \r\n* Gentle sweetness and transparent fragrance",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 12
  },
  {
    "id": 37,
    "name": "CARALL Cue Glyph (2.4g)",
    "slug": "carall-cue-glyph-2-4g",
    "description": "Luxury fragrance with beautiful and sparkling diamond cuts\r\nDesigned with a thickness that fits neatly into the air conditioner louver while claiming luxury.\r\nThe sparkling design and high-quality scent create a luxurious atmosphere inside the car.\r\nA large tablet that uses a highly concentrated fragrance for a long-lasting scent.\r\nダイヤカットが美しくきらめくラグジュアリーフレグランス\r\n高級感は主張しながらも、エアコンルーバーにすっきりフィットする厚みに設計。\r\nきらめき溢れるデザインと、上質な香りが車内の雰囲気をラグジュアリーに演出します。\r\n高濃縮香料を使用した大型タブレットで香り長続き。\r\n\r\nBrand : CARALL カーオール\r\nModel : CUE GLYPH キュー グリフ\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nVolume : 2.4g \r\n** For Vehicle Ventilator\r\n\r\nThree (3) Flavour : - \r\n1719 Pinky Musk ピンキームスク\r\n* Sweet and sour cute scent.\r\n\r\n1720 Platinum Shower プラチナシャワー\r\n* A faintly sweet and clean scent\r\n\r\n1787 White Musk ホワイトムスク\r\n* A transparent and gentle scent\r\n\r\n\r\nRefill (4) Flavour :-\r\nRefill 1719 Pinky Musk ピンキームスク\r\n* Sweet and sour cute scent.\r\nRefill Code: 1442\r\n\r\nRefill 1720 Platinum Shower プラチナシャワー\r\n* A faintly sweet and clean scent\r\nRefill Code: 1446\r\n\r\nRefill 1721 Shower rich シャワーリッチ\r\n* Clean musk scent\r\nRefill Code: 1722\r\n\r\nRefill 1787 White Musk ホワイトムスク\r\n* A transparent and gentle scent\r\nRefill Code: 1788",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 13
  },
  {
    "id": 38,
    "name": "CARALL Shoshu Nano Air Clip Kabishu Pro (2 Packs x 2.4g)",
    "slug": "carall-shoshu-nano-air-clip-kabishu-pro-2-packs-x-2-4g",
    "description": "Quick reset the mold smell of the air conditioner!\r\nエアコンのカビ臭を速攻リセット !\r\n\r\nUses \"Deodorise fragrance\" that changes the musty odor into a good scent!\r\nNano deodorant component eliminates the odor of air conditioners!\r\nAir conditioner louver mounting type that can easily and speedily deodorize\r\nカビ臭を良い香りに変化させる「デオドライズ香料」を採用 !\r\nナノ消臭成分がエアコンのニオイを分解消臭 !\r\nかんたん&スピーディーに消臭できるエアコンルーバー取付タイプ。\r\n\r\nBrand : CARALL カーオール\r\nModel : SHOSHU NANO AIR CLIP 2PACKS KABISHU PRO\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nVolume : 2.4g \r\n** For Vehicle Ventilator\r\n\r\nFlavour : 3423 Fresh Clear フレッシュクリア",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 14
  },
  {
    "id": 39,
    "name": "CARALL Shoshu Nano Air Aircon Spray (90ml)",
    "slug": "carall-shoshu-nano-air-aircon-spray-90ml",
    "description": "Nanoparticles adhere to deodorization in the air conditioner!\r\nEasily deodorize and disinfect with just by spraying for about 1 second! \r\nIn addition, the antifungal effect is also added!\r\nNot only does the deodorizing and disinfection components decompose odors and odor bacteria in the air conditioner, but nanoparticles stay with platinum high adhesion formulation, and the effect lasts for a long time!\r\n\r\nナノ粒子がエアコン内で密着消臭！\r\n約1秒スプレーするだけで、かんたん消臭＆除菌! さらに防カビ効果\r\nもプラス ！ \r\n消臭・除菌成分がエアコン内にただよう悪臭やニオイ菌を分解するだけでなく、プラチナ高密着処方でナノ粒子がとどまり、効果が長期間持続!\r\n\r\nBrand : CARALL  カーオール\r\nModel : SHOSHU NANO AIR AIRCON SPRAY \r\nVolume : 90ml \r\nType: Air Conditioner Spray \r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\n\r\nFlavor : \r\n1. 3082 Unscented 無香料\r\n2. 3274 Slight Soap 微香ソープ",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 15
  },
  {
    "id": 40,
    "name": "CARALL Gloss Finish (180ml)",
    "slug": "carall-gloss-finish-180ml",
    "description": "No need to repaint! Instantly glossy finish with a single coat!\r\n\r\n- Contains a non-inorganic glassy gloss polymer that has excellent adhesion to the body, durability, and gloss restoration effect. \r\n- Even if you don't apply multiple coats, you can fill in the small scratches on the surface of the body with a single application and bring out the color and luster of a new car. \r\n- The highly antifouling glassy film and hydrophobic effect make it easy to remove stains even when washed with water, making it difficult for stains to stick to the body. \r\n- Since it is a no-compound, it can also be used for vehicles with a professional coat.\r\n\r\n**How To Use**\r\n1. After washing the car, wipe off the water. (There is no problem even if some water remains.)\r\n2. Shake the bottle well and set the tip of the trigger to <ON>.\r\n3. Spray on the body, spread with the included cloth before the liquid dries, and immediately wipe with the dry side of the cloth.\r\n* Estimated amount of use: Spray once for 50 cm x 50 cm\r\n* Be sure to try it in an inconspicuous area before using.\r\n* Work on each part so that the liquid does not dry out.\r\n* If liquid adheres to anything other than body paint, immediately wipe it off with a towel moistened with water.\r\n\r\n**Work points**\r\nIf liquid is likely to be applied other than body painting, spray it on the cloth and use it.\r\n\r\n**Precautions for use**\r\n- Do not use for glass, mirrors, lenses, plating, tires, etc. other than painting. If it adheres, wipe it off immediately.\r\n- Do not use under the scorching sun or when the body is hot.\r\n- For imported cars, deteriorated paint, repaint, and special paint, it may not be effective or problems may occur, so try it on an inconspicuous part before use.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": "/api/storage/objects/uploads/e38ff0c9-d081-47a4-ae35-f6756ea0a615",
    "imageUrls": [
      "/api/storage/objects/uploads/e38ff0c9-d081-47a4-ae35-f6756ea0a615",
      "/api/storage/objects/uploads/52a2877a-a1a3-403f-9985-8c7619ed0458",
      "/api/storage/objects/uploads/6fbc8f82-25cd-4263-abff-41bb06aca7e4",
      "/api/storage/objects/uploads/70cf4ac4-6486-4a76-ad43-2d0236f85ae0",
      "/api/storage/objects/uploads/3e257eac-113d-420d-9aae-344a848c4712"
    ],
    "videoUrl": "/api/storage/objects/uploads/e106d870-44bf-41d7-809b-d1f97b67b5c6",
    "categoryId": 7,
    "brand": "CARALL",
    "sku": "2079",
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      7
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 41,
    "name": "CARALL Regalia Enrich G Glitter 2nd Gen (60ml)",
    "slug": "carall-regalia-enrich-g-glitter-2nd-gen-60ml",
    "description": "Second Generation of CARALL Regalia Enrich (Velvet Musk 1386)\r\n\r\nA new design on the bottle and with black linings on the cap \r\nA luxury fragrance with sparkling glitter that adds a refined beauty. \r\nHigh-quality and rich scent.\r\nボトルの新しいデザインとキャップの黒い裏地\r\nきらめくラメが洗練された美しさを添える、ラグジュアリーフレグランス。\r\n上質で濃厚な香り。\r\n\r\nBrand : CARALL カーオール\r\nModel : Regalia Enrich G Glitter レガリア エンリッチ G グリッター\r\nCode : 3357 \r\nTexture : Gel \r\nVolume : 60ml \r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\n\r\nFlavor : 3357 Velvet Musk ベルベットムスク\r\n* A fragrance that spreads lightly with a mellow sweetness",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 16
  },
  {
    "id": 42,
    "name": "CARALL Brown Marks Clip (2 Packs x 2.4g)",
    "slug": "carall-brown-marks-clip-2-packs-x-2-4g",
    "description": "Interior fragrance with a natural scent in the car\r\nA warm design using carefully selected materials. An air conditioner mounting type that spreads the scent from the air conditioner louver. Contains deodorant ingredients extracted from plants.\r\n車内に自然な香り広がるインテリアフレグランス\r\nこだわりの素材を使った、温かみのあるデザイン。エアコンルーバーから香り広がるエアコン取り付けタイプ。植物から抽出した消臭成分配合。\r\n\r\n2-pack brown marks clips \r\nブラウンマークス クリップのお得な2個パック\r\n\r\nBrand : CARALL カーオール\r\nModel : BROWN MARKS CLIP 2PACKS\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nVolume : 2.4g \r\nLasting: 1 - 2 Months\r\n** For Vehicle Ventilator\r\n\r\nFour (4) Flavour : - \r\n3444 White Floral ホワイトフローラル\r\n*Blended with refreshing green and strong amber, mainly elegant roses.\r\n*Gorgeous elegant floral fragrance\r\n\r\n3445 White Citrus ホワイトシトラス\r\n*Blend clean grapefruit with luscies apple and gentle veciber.\r\n*Fresh fruity citrus fragrance\t\r\n\r\n3446 White Musk ホワイトムスク\r\n*A blend of gentle apple and pleasant musk, mainly with pretty jasmine.\r\n*Gentle floral musk fragrance\r\n\r\n3528 White Amber ホワイトアンバー\r\n*A blend of gorgeous pair-friendly jasmine and deep amber. \r\n*Elegant fruity musk scent.\r\n\r\n\r\nFour (4) Refill Flavour :-\r\n3447 White Floral ホワイトフローラル\r\n*Blended with refreshing green and strong amber, mainly elegant roses.\r\n*Gorgeous elegant floral fragrance\r\n\r\n3448 White Citrus ホワイトシトラス\r\n*Blend clean grapefruit with luscies apple and gentle veciber.\r\n*Fresh fruity citrus fragrance\t\r\n\r\n3449 White Musk ホワイトムスク\r\n*A blend of gentle apple and pleasant musk, mainly with pretty jasmine.\r\n*Gentle floral musk fragrance\r\n\r\n3529 White Amber ホワイトアンバー\r\n*A blend of gorgeous pair-friendly jasmine and deep amber. \r\n*Elegant fruity musk scent.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 17
  },
  {
    "id": 43,
    "name": "CARALL Cue Air (2 Packs x 2.4g)",
    "slug": "carall-cue-air-2-packs-x-2-4g",
    "description": "The cue series has a cute pop color and round shape!\r\nRound and cute clear color air conditioner louver mounting type.\r\nA wide variety of scents containing deodorant ingredients spreads firmly inside the car.\r\nポップなカラーとまんまるフォルムがカワイイ、キューシリーズ！\r\nまんまるかわいいクリアカラーのエアコンルーバー取付タイプ。\r\n消臭成分を配合したバリエーション豊かな香りが、しっかりと車内に広がります。\r\n\r\nBrand : CARALL カーオール\r\nModel : CUE AIR 2PACKS キュー エア 2個パック\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nVolume : 2.4g x 2pcs\r\n** For Vehicle Ventilator\r\n\r\nFour (4) Flavour : - \r\n3095 Aqua Shower アクアシャワー\r\n* Fresh and transparent scent.\r\n\r\n3097 Squash スカッシュ\r\n*A refreshing and refreshing scent.\r\n\r\n3098 Platinum Shower プラチナシャワー\r\n*A faintly sweet and clean scent.\r\n\r\n3099 White Musk ホワイトムスク\r\n*A transparent and gentle scent.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 18
  },
  {
    "id": 44,
    "name": "CARALL Botanish Mist (200ml)",
    "slug": "carall-botanish-mist-200ml",
    "description": "Clean air with the power of nature 自然のチカラできれいな空気\r\n\r\nA mist-type deodorant is a premium odor elimination spray that contains natural deodorant ingredients \"Kakishibu Extract\" and \"Phytoncide\". The botanical blessing makes the inside of the car refreshing.\r\nYou can deodorize spaces and deodorize and sterilize textile products such as sheets and floor mats.\r\n天然消臭成分「柿渋エキス」と「フィトンチッド」を配合したミストタイプの消臭剤。\r\nボタニカルの恵みで車内がさわやかに。\r\n空間の消臭や、シートやフロアマットなどの繊維製品の消臭・除菌ができます。\r\n\r\nIngredients: \r\nNatural plant essential oil, persimmon extract, disinfectant, fragrance, surfactant, ethanol, stabilizer, water\r\n\r\nBrand : CARALL  カーオール\r\nModel : Botanish Mist  ボタニッシュ ミスト\r\nTexture : Liquid\r\nVolume : 200ml \r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\n\r\nThree (3) Flavor : -\r\n1) 3368 - Garden Bloom ガーデンブルーム\t\r\n* A pleasant scent with feeling of transparency\r\n\r\n2) 3369 - Classic citrus クラシックシトラス\t\r\n* Fresh and refreshing scent\r\n\r\n3) 3370 - White musk  ホワイトムスク\r\n* Gentle and gorgeous scent",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 19
  },
  {
    "id": 45,
    "name": "CARALL Dolly Kiss Tiara (60ml)",
    "slug": "carall-dolly-kiss-tiara-60ml",
    "description": "The heart becomes a tiara and it's so cute!\r\nA cute women's fragrance featuring a heart-based cap.\r\nA lineup of scents inspired by lovely and small devil girls.\r\nA gel type with a long-lasting scent.\r\nハートがティアラになってとってもキュート!\r\nハートを基調としたキャップが特長のキュートな女性向けフレグランス。\r\nラブリー系、小悪魔系お嬢様系をイメージした香りのラインアップ。\r\n香りが長続きするゲルタイプ。\r\n\r\nBrand : CARALL カーオール\r\nModel : DOLLY KISS TIARA ドーリーキッス ティアラ\r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nTexture : Gel\r\nVolume : 60ml \r\n\r\nTwo (2) Flavor : \r\n1) 1627 White Musk ホワイトムスク\r\n\r\n2) 1628 Sexy Richセクシーリッチ",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 20
  },
  {
    "id": 46,
    "name": "CARALL Masamune Premia (138ml)",
    "slug": "carall-masamune-premia-138ml",
    "description": "Masamune's unique commitment to design beauty and high quality\r\nA special edition made with a carefully selected blend of the finest fragrance ingredients. \r\nThe gunmetal cap is accented with pink gold to accentuate luxury cars. \r\nA deep, high-quality fragrance that gives a premium feeling of being enveloped in the fragrance.\r\n\r\nマサムネならではのデザインの美しさと品質の高さへのこだわりを深化\r\n極上の香料素材を厳選ブレンドした特別仕様。\r\nガンメタリックのキャップに施されたピンクゴールドの差し色は高級車のアクセントに。\r\n香りに包まれるようなプレミアム感ある深い上質な香り。\r\n\r\nBrand : CARALL カーオール\r\nModel : MASAMUNE PREMIA \r\nManufacturing Country : JAPAN (日本)\r\nManufacturing Company : Harukado CO.,LTD.\r\nLasting: 2 - 3 months \r\nTexture : Liquid\r\nVolume : 138ml \r\n\r\nFlavour:\r\n1774 PLATINUM FEMME プラチナファム \r\n* A gentle scent in a transparent feeling.\r\n\r\nTop: Peach, Apple, Pear\r\nMiddle: Rose, Jasmine, Lily\r\nBase: Amber, Musk",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 4,
    "brand": null,
    "sku": null,
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 21
  },
  {
    "id": 47,
    "name": "CARALL Omnibus Diffuser (160ml)",
    "slug": "carall-omnibus-diffuser-160ml",
    "description": "In-vehicle lead diffuser that spreads the scent from the stick .\nA lead diffuser dedicated to installing the cup holder.\nThe original design and the original blended scent wrap you in a genuine way.",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": "/api/storage/objects/uploads/261294fe-54d3-436b-88d8-218b6801c559",
    "imageUrls": [
      "/api/storage/objects/uploads/261294fe-54d3-436b-88d8-218b6801c559",
      "/api/storage/objects/uploads/0f0952ab-f4b3-4021-aa72-f2461151f58d",
      "/api/storage/objects/uploads/0b1a169a-b816-4ada-acbb-fdc1ec188e19"
    ],
    "videoUrl": null,
    "categoryId": 4,
    "brand": "CARALL",
    "sku": "OMNIBUS DIFFUSER",
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [
      {
        "name": "Flavors",
        "options": [
          "3339 Gold Osmanthus",
          "3340 Diamond Wood",
          "3341 White Musk"
        ]
      }
    ],
    "sortOrder": 1
  },
  {
    "id": 48,
    "name": "CARALL Regalia Enrich (65ml)",
    "slug": "carall-regalia-enrich-65ml",
    "description": "Platinum silver shine\nThe silver line has a powerful presence in metal black. \nA luxury fragrance with sparkling glitter that adds a refined beauty . High-quality and rich scent.\n\n",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": "/api/storage/objects/uploads/52fff564-6a6d-466a-81b9-0a4ac474a7d3",
    "imageUrls": [
      "/api/storage/objects/uploads/52fff564-6a6d-466a-81b9-0a4ac474a7d3"
    ],
    "videoUrl": null,
    "categoryId": 4,
    "brand": "CARALL",
    "sku": "Regalia Enrich ",
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      4
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [
      {
        "name": "Flavour",
        "options": [
          "1384 Silky Veil",
          "1385 Platinum Squash",
          "1386 Velvet Musk"
        ]
      }
    ],
    "sortOrder": 0
  },
  {
    "id": 80,
    "name": "DH-292 DLAA FOG LAMP for TY_RUSH (2008-2014) ",
    "slug": "dh-292-dlaa-fog-lamp-for-ty-rush-2008-2014",
    "description": "",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 8,
    "brand": "DLAA",
    "sku": "DH-292",
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      8
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 81,
    "name": "FD-355 DLAA FOG LAMP for FD_FIESTA (2009-2012) ",
    "slug": "fd-355-dlaa-fog-lamp-for-fd-fiesta-2009-2012",
    "description": "DLAA fog lamp for Ford Fiesta 2009 \r\n\r\n\r\n\r\n**Brand : DLAA \r\n\r\n**100% barang baru \r\n\r\n**100% High quality \r\n\r\n**H11 12V 55W Bulb\r\n\r\n\r\n\r\nWith Wiring Kit : One set fog lamp, one set cover, and wiring kit\r\n\r\nW/O Wiring Kit : One set fog lamp and one set cover only",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 8,
    "brand": "DLAA",
    "sku": "FD-355",
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      8
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  },
  {
    "id": 82,
    "name": "FD-455 DLAA FOG LAMP for FD_FIESTA 11' ",
    "slug": "fd-455-dlaa-fog-lamp-for-fd-fiesta-11",
    "description": "",
    "price": "0",
    "compareAtPrice": null,
    "imageUrl": null,
    "imageUrls": [],
    "videoUrl": null,
    "categoryId": 8,
    "brand": "DLAA",
    "sku": "FD-455",
    "stock": 0,
    "featured": false,
    "rating": null,
    "reviewCount": 0,
    "tags": [],
    "categoryIds": [
      8
    ],
    "carBrandIds": [],
    "carModelIds": [],
    "variations": [],
    "sortOrder": 0
  }
];

export async function seedIfEmpty(): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('[seed] Connected to database.');
    const db = drizzle(client as any);

    const seedTable = async (name: string, table: string, expected: number, seedFn: () => Promise<void>) => {
      const result = await client.query(`SELECT COUNT(*) as cnt FROM ${table}`);
      const count = parseInt(result.rows[0].cnt, 10);
      if (count >= expected) {
        console.log(`[seed] ${name}: ${count}/${expected} rows, up to date.`);
        return;
      }
      console.log(`[seed] ${name}: ${count}/${expected} rows, filling gaps...`);
      await seedFn();
      const after = await client.query(`SELECT COUNT(*) as cnt FROM ${table}`);
      const newCount = parseInt(after.rows[0].cnt, 10);
      console.log(`[seed] ${name}: now ${newCount} rows.`);
    };

    for (const patch of SCHEMA_PATCHES) {
      await client.query(patch);
    }
    console.log('[seed] Schema patches applied.');

    await seedTable('categories', 'categories', CATEGORIES.length, async () => {
      for (const row of CATEGORIES) {
        await db.insert(categoriesTable).values(row).onConflictDoNothing();
      }
      await client.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))`);
    });

    await seedTable('brands', 'brands', BRANDS.length, async () => {
      for (const row of BRANDS) {
        await db.insert(brandsTable).values(row).onConflictDoNothing();
      }
      await client.query(`SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands))`);
    });

    await seedTable('car_brands', 'car_brands', CAR_BRANDS.length, async () => {
      for (const row of CAR_BRANDS) {
        await db.insert(carBrandsTable).values(row).onConflictDoNothing();
      }
      await client.query(`SELECT setval('car_brands_id_seq', (SELECT MAX(id) FROM car_brands))`);
    });

    await seedTable('car_models', 'car_models', CAR_MODELS.length, async () => {
      for (const row of CAR_MODELS) {
        await db.insert(carModelsTable).values(row).onConflictDoNothing();
      }
      await client.query(`SELECT setval('car_models_id_seq', (SELECT MAX(id) FROM car_models))`);
    });

    await seedTable('slides', 'slides', SLIDES.length, async () => {
      for (const row of SLIDES) {
        await db.insert(slidesTable).values(row).onConflictDoNothing();
      }
      await client.query(`SELECT setval('slides_id_seq', (SELECT MAX(id) FROM slides))`);
    });

    await seedTable('contact_info', 'contact_info', CONTACT_INFO.length, async () => {
      for (const row of CONTACT_INFO) {
        await db.insert(contactInfoTable).values(row).onConflictDoNothing();
      }
      await client.query(`SELECT setval('contact_info_id_seq', (SELECT MAX(id) FROM contact_info))`);
    });

    await seedTable('products', 'products', PRODUCTS.length, async () => {
      for (const row of PRODUCTS) {
        await db.insert(productsTable).values(row as any).onConflictDoNothing();
      }
      await client.query(`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`);
    });

    console.log('[seed] All done.');
  } catch (err) {
    console.error('[seed] Error during seeding:', err);
  } finally {
    client.release();
  }
}
