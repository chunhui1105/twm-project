import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const SEED_SQL: string[] = [
  `INSERT INTO brands (id, name, image_url, sort_order, active) VALUES (1, 'CARALL', '/brand-carall.png', 1, true);`,
  `INSERT INTO brands (id, name, image_url, sort_order, active) VALUES (2, 'CARBOY', '/brand-carboy.png', 2, true);`,
  `INSERT INTO brands (id, name, image_url, sort_order, active) VALUES (3, 'DLAA', '/brand-dlaa.png', 3, true);`,
  `INSERT INTO brands (id, name, image_url, sort_order, active) VALUES (4, 'Pentair', '/brand-pentair.png', 6, true);`,
  `INSERT INTO brands (id, name, image_url, sort_order, active) VALUES (5, 'PONYAN', '/brand-ponyan.png', 4, true);`,
  `INSERT INTO brands (id, name, image_url, sort_order, active) VALUES (6, 'SHIEN', '/api/storage/objects/uploads/fc307261-59d8-4007-a1db-2e78bf43d50b', 5, true);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (1, 'Proton', 'Malaysian', 1);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (2, 'Perodua', 'Malaysian', 2);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (3, 'Honda', 'Japanese', 3);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (4, 'Toyota', 'Japanese', 4);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (5, 'Mazda', 'Japanese', 5);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (6, 'Mitsubishi', 'Japanese', 6);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (7, 'Nissan', 'Japanese', 7);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (8, 'Hyundai', 'Korean', 8);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (9, 'Kia', 'Korean', 9);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (10, 'Suzuki', 'Japanese', 10);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (11, 'BMW', 'European', 11);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (12, 'Mercedes-Benz', 'European', 12);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (13, 'Volkswagen', 'European', 13);`,
  `INSERT INTO car_brands (id, name, origin, sort_order) VALUES (14, 'Ford', 'American', 14);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (146, 4, 'Vios (NCP42)', '2003-2004', 19, '/api/storage/objects/uploads/3a40823a-e2f1-43af-aea4-a5f80d28a4d4');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (148, 4, 'Vios (NCP93)', '2007-2010', 21, '/api/storage/objects/uploads/11f856d9-98d0-4251-ab84-40ed05406e97');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (20, 3, 'City', '2002–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (21, 3, 'Civic', '2006–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (22, 3, 'Jazz / Fit', '2002–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (23, 3, 'HR-V', '2015–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (24, 3, 'CR-V', '2001–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (25, 3, 'BR-V', '2016–present', 6, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (26, 3, 'WR-V', '2023–present', 7, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (27, 3, 'Accord', '1994–present', 8, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (28, 3, 'Odyssey', '1999–present', 9, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (39, 5, 'CX-30', '2019–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (40, 5, 'CX-5', '2012–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (41, 5, 'CX-8', '2018–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (42, 5, 'Mazda 3', '2003–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (43, 5, 'Mazda 6', '2002–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (44, 5, 'BT-50', '2006–present', 6, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (45, 6, 'ASX', '2010–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (46, 6, 'Outlander', '2003–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (47, 6, 'Eclipse Cross', '2018–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (48, 6, 'Xpander', '2018–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (49, 6, 'Triton', '2005–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (50, 6, 'Pajero Sport', '2009–present', 6, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (51, 7, 'Almera', '2011–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (52, 7, 'X-Trail', '2007–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (53, 7, 'Navara', '2005–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (54, 7, 'Note', '2005–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (55, 7, 'Serena', '2013–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (56, 8, 'Elantra', '2011–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (57, 8, 'Tucson', '2010–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (58, 8, 'Santa Fe', '2006–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (59, 8, 'Kona', '2017–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (60, 8, 'i10', '2007–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (61, 8, 'Creta', '2015–present', 6, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (62, 9, 'Sonet', '2020–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (63, 9, 'Sorento', '2002–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (64, 9, 'Carnival', '1999–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (65, 9, 'Sportage', '2004–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (66, 9, 'Stinger', '2017–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (67, 10, 'Swift', '2004–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (68, 10, 'Ertiga', '2012–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (69, 10, 'Jimny', '1998–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (70, 10, 'XL7', '2020–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (71, 10, 'Fronx', '2023–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (72, 11, '1 Series', '2004–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (73, 11, '3 Series', '1998–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (74, 11, '5 Series', '2003–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (75, 11, 'X1', '2009–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (76, 11, 'X3', '2003–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (77, 11, 'X5', '1999–present', 6, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (78, 11, '7 Series', '2001–present', 7, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (79, 12, 'A-Class', '2012–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (80, 12, 'C-Class', '1999–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (81, 12, 'E-Class', '2002–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (82, 12, 'GLA', '2013–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (83, 12, 'GLB', '2019–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (84, 12, 'GLC', '2015–present', 6, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (85, 12, 'GLE', '2015–present', 7, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (86, 13, 'Golf', '2003–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (87, 13, 'Passat', '2005–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (88, 13, 'Tiguan', '2007–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (89, 13, 'Polo', '2009–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (90, 13, 'Arteon', '2017–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (91, 14, 'Ranger', '2011–present', 1, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (92, 14, 'EcoSport', '2013–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (93, 14, 'Everest', '2015–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (94, 14, 'Mustang', '2015–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (154, 4, 'Vios (AC100)', '2023-Present', 27, '/api/storage/objects/uploads/7037cfe5-9e9d-4084-a4e2-d28143eab6ad');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (152, 4, 'Vios (NSP151) (Facelift)', '2019-2021', 25, '/api/storage/objects/uploads/42e1972a-f24e-4f5d-9e90-f2c04e190f9b');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (150, 4, 'Vios (NCP150)', '2013-2016', 23, '/api/storage/objects/uploads/94e05792-45ab-46d5-89a2-99eea6e269a5');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (7, 1, 'Waja', '2000–2007', 9, '/api/storage/objects/uploads/42d10460-8f25-4918-82f5-3bb63048b7bd');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (3, 1, 'Iriz 1st Gen', '2014–2019', 20, '/api/storage/objects/uploads/bdab059e-038e-4774-aef1-ba91469361a2');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (96, 1, 'Saga Iswara', '1992–2003', 1, '/api/storage/objects/uploads/0fee99dd-57c2-42d0-b68d-e41ab84d22ad');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (31, 4, 'Corolla Cross', '2020–present', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (36, 4, 'Yaris', '2014–present', 8, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (8, 1, 'Persona Gen 2', '2007-2010', 11, '/api/storage/objects/uploads/a461bd2c-a9b8-4aec-adcd-9cfc66b66da0');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (99, 1, 'Persona Elegance', '2010-2016', 12, '/api/storage/objects/uploads/ddb3fe9e-6cb0-41ed-b28e-7332b72226f8');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (2, 1, 'Persona 3rd Gen (BH6)', '2016–2019', 13, '/api/storage/objects/uploads/c51807b2-75a8-4d7e-ac6d-2f0155c54385');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (106, 1, 'Ertiga', '2016–2019', 19, '/api/storage/objects/uploads/afc74461-2d1a-46d5-b3b2-49123fe2e86e');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (119, 1, 'Iriz (Facelift)', '2019–2021', 21, '/api/storage/objects/uploads/5654742d-31a4-4fc7-963e-7888bd5df12d');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (5, 1, 'X70 1st Gen', '2018–2022', 23, '/api/storage/objects/uploads/47ed75ff-285b-49a9-9ef5-f333a8c9f427');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (32, 4, 'Hilux', '2005–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (123, 1, 'Persona 3rd Gen (2nd Facelift) (BH6)', '2021-Present', 15, '/api/storage/objects/uploads/dc8a99fc-3ef6-4974-a733-fd2e48b77442');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (104, 1, 'Inspira', '2010–2015', 16, '/api/storage/objects/uploads/aba0beb9-2a03-436f-8e1b-40a9c15e57ac');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (120, 1, 'X70 (Facelift)', '2022–present', 24, '/api/storage/objects/uploads/386b3826-fecf-40a2-9ba2-50e7301bcb72');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (4, 1, 'X50', '2020–present', 25, '/api/storage/objects/uploads/43cf3e3c-2572-421f-9235-73121ebe22d3');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (38, 4, 'Alphard', '2002–present', 10, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (33, 4, 'Fortuner', '2005–present', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (13, 2, 'Alza (M500)', '2009–2014', 5, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (16, 2, 'Ativa', '2021–present', 12, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (30, 4, 'Camry', '2002–present', 2, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (37, 4, 'Innova', '2005–present', 9, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (35, 4, 'Veloz', '2022–present', 7, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (34, 4, 'Rush', '2018–present', 6, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (12, 2, 'Axia', '2014–present', 4, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (18, 2, 'Viva', '2007–2014', 14, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (19, 2, 'Kelisa', '2001–2007', 15, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (15, 2, 'Bezza (A700)', '2016–2019', 10, '/api/storage/objects/uploads/4f6b0546-5b8b-4b8f-8de3-f13e69e2f73b');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (140, 4, 'Corolla Altis (E170)', '2014-2016', 16, '/api/storage/objects/uploads/75e3cabc-d4bc-4c57-8b25-f8a1a753cf7c');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (145, 4, 'Corolla Altis (E150)', '2011-2013', 15, '/api/storage/objects/uploads/43474c6b-6f2b-4107-9755-47fa9f79fed1');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (142, 4, 'Corolla Altis (E180)', '2016-2019', 17, '/api/storage/objects/uploads/446d8d39-14c5-488b-a885-5a2716368a4d');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (141, 4, 'Corolla Altis (E210)', '2019-Present', 18, '/api/storage/objects/uploads/e0655a94-81de-427e-9f2d-38c9f21014bb');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (149, 4, 'Vios (Facelift)(NCP93)', '2010-2013', 22, '/api/storage/objects/uploads/099c2b01-d20f-419f-814e-56bdd779a936');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (147, 4, 'Vios (Facelift) (NCP42)', '2005-2007', 20, '/api/storage/objects/uploads/f037160f-4bc0-408a-85cc-dd3aaeb7949b');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (135, 1, 'Saga LMST', '2003-2008', 2, '/api/storage/objects/uploads/eab62cb2-d721-4903-a54c-9753fa43bc23');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (124, 1, 'Saga 3rd Gen (MK4)', '2016-2019', 5, '/api/storage/objects/uploads/0b8d2c00-2848-4e05-9de9-fa3a90e7f892');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (133, 1, 'Saga FL/FLX (MK2/ MK3)', '2010-2019', 4, '/api/storage/objects/uploads/9f0af4af-4e0d-4040-8dfe-0976eae9830c');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (126, 1, 'Saga (MC3)', '2025-Present', 7, '/api/storage/objects/uploads/c4906ff3-612b-457f-ad4e-d2af4f03306b');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (9, 1, 'Wira ', '1993–2009', 8, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (122, 1, 'Persona 3rd Gen (Facelift) (BH6)', '2019-2021', 14, '/api/storage/objects/uploads/3e18ad3f-0685-49f9-b6ed-ab68525f7b0f');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (109, 1, 'Saga BLM (MK1)', '2008-2010', 3, '/api/storage/objects/uploads/662f68a6-9648-4777-8bcc-0871811769ab');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (125, 1, 'Saga 3rd Gen Facelift (MC1/MC2)', '2019-2025', 6, '/api/storage/objects/uploads/fea142bc-121e-4732-9064-3c489c595c27');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (6, 1, 'Exora 1st Gen', '2009–2012', 17, '/api/storage/objects/uploads/847e93c8-cee0-4d3f-b408-5502bbfcf5a4');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (117, 1, 'Exora Bold (Facelift)', '2012–2023', 18, '/api/storage/objects/uploads/1efd3fb9-5b82-47be-9e66-7e47cef53554');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (136, 1, 'Iriz (2nd Facelift)', '2021-Present', 22, '/api/storage/objects/uploads/0d2c230a-e4d9-45d4-be81-6784ff8e567b');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (151, 4, 'Vios (NSP151)', '2016-2018', 24, '/api/storage/objects/uploads/dbdcf585-8c5b-4df9-8fa2-85942f198824');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (107, 1, 'X90', '2023–present', 26, '/api/storage/objects/uploads/cd9d4f09-61cd-4616-a75d-0f56d2a1dffd');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (108, 1, 'S70', '2024–present', 27, '/api/storage/objects/uploads/3742d437-0c66-4821-a9fc-f6b5c985e6b2');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (137, 1, 'Waja (Facelift)', '2007-2011', 10, '/api/storage/objects/uploads/58eab607-9a19-4ad5-af22-3c0bab80d540');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (153, 4, 'Vios (NSP151) (2nd Facelift)', '2021-2023', 26, '/api/storage/objects/uploads/02c4edc9-cca4-4b61-840f-15cf79a62e5e');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (128, 2, 'Myvi 1st Gen (M300)', '2005-2008', 1, '/api/storage/objects/uploads/673c973d-0146-4493-afde-02c1fed12ef9');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (127, 2, 'Bezza (Facelift) (A700)', '2020-Present', 11, '/api/storage/objects/uploads/f35ba0da-4dcd-4ec4-a8b5-2318b99ff80d');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (130, 2, 'Alza (1st Facelist) (M500)', '2014-2018', 6, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (11, 2, 'Myvi 2nd Gen (M600)', '2011-2017', 3, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (17, 2, 'Kancil', '1994–2009', 13, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (131, 2, 'Alza (2nd Facelift) (M500)', '2018-2022', 7, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (14, 2, 'Aruz', '2019–present', 9, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (132, 2, 'Alza (W150)', '2022-Present', 8, NULL);`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (129, 2, 'Myvi 1st Gen (Facelift) (M300)', '2008-2011', 2, '');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (138, 4, 'Corolla Altis (E120)', '2001-2004', 11, '/api/storage/objects/uploads/01f894d9-030c-4d3c-bbaf-10a108082b11');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (143, 4, 'Corolla Altis (E130)', '2004-2006', 12, '/api/storage/objects/uploads/4fc1dbe5-bcf2-4fa5-adbf-ac733d5f257b');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (144, 4, 'Corolla Altis', '2006-2008', 13, '/api/storage/objects/uploads/14d7f1fb-33ae-49a4-8bad-0a641de3500e');`,
  `INSERT INTO car_models (id, brand_id, name, years, sort_order, image_url) VALUES (139, 4, 'Corolla Altis (E140)', '2008-2011', 14, '/api/storage/objects/uploads/2edc40ac-9e0d-4ae3-8ba4-6e6581f350ab');`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (18, 'Find By Car Model', 'find-by-car', NULL, '/api/storage/objects/uploads/69ed4825-4fbe-48dd-9560-aaad892be17d', 0, 1);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (20, 'Side Running Board', 'side-running-board', NULL, '/api/storage/objects/uploads/7b751758-72d7-471a-b9c5-3b039b91f6be', 0, 6);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (16, 'Parking Sensors', 'parking-sensors', NULL, '/api/storage/objects/uploads/844f7c8c-b970-466c-b80c-8d458d462f1e', 0, 11);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (19, 'Cargo Tray', 'cargo-tray', NULL, '/api/storage/objects/uploads/52f499ad-f1b3-49b1-b93b-39c3e5286e14', 0, 7);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (21, 'Armrest', 'armrest', NULL, '/api/storage/objects/uploads/72f44e1b-a70c-4b5a-b5fe-546a628d45b5', 0, 8);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (17, 'Roof Box', 'roof-box', NULL, '/cat-exterior.png', 1, 3);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (10, 'Steering Wheel Covers', 'steering-wheel-covers', NULL, '/api/storage/objects/uploads/eb9867de-d3e8-4e7a-a300-f945e285fe02', 0, 13);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (4, 'Air Fresheners', 'air-fresheners', 'Keep your car smelling fresh with our premium air fresheners', '/api/storage/objects/uploads/b06c2110-b78c-4ab3-b691-7df5bb6a2359', 0, 2);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (7, 'Car Care', 'car-care', 'Cleaning and maintenance products to keep your car looking its best', '/cat-car-care.jpg', 0, 9);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (5, 'Seat Covers', 'seat-covers', 'Protect and style your car interior with quality seat covers', '/cat-seat-covers.jpg', 0, 12);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (3, 'Wipers', 'wipers', 'Premium wiper blades for clear visibility in all conditions', '/api/storage/objects/uploads/604f2d0a-b31a-4012-9372-2b1dbb0169bb', 0, 10);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (9, 'Car Mats', 'car-mats', NULL, '/api/storage/objects/uploads/e13f3326-21ad-4f41-8db6-b9c03447dcae', 0, 5);`,
  `INSERT INTO categories (id, name, slug, description, image_url, product_count, sort_order) VALUES (8, 'Fog Lamps', 'fog-lamps', NULL, '/api/storage/objects/uploads/bd9ab166-4071-4011-a626-e8c36264ef65', 3, 4);`,
  `INSERT INTO contact_info (id, key, label, value) VALUES (2, 'phone', 'Phone', '+60 3-1234 5678');`,
  `INSERT INTO contact_info (id, key, label, value) VALUES (1, 'address', 'Address', 'No.2A, Jalan KPB 3, Batu 10, Kawasan Perindustrian Budiman, 43200 Cheras, Selangor D.E, Malaysia ');`,
  `INSERT INTO contact_info (id, key, label, value) VALUES (3, 'email', 'Email', 'tienweimkt@gmail.com');`,
  `INSERT INTO contact_info (id, key, label, value) VALUES (4, 'operating_hours', 'Operating Hours', 'Mon – Fri: 9:30 AM – 6:00 PM
INSERT INTO contact_info (id, key, label, value) VALUES (5, 'map_embed_url', 'Google Maps Embed URL', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3646.9719653802294!2d101.77612587452909!3d3.0479654537672376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc34bedb335ca7%3A0xc6b7c4b722c3a8af!2sTien%20Wei%20Marketing%20SDN%20BHD!5e1!3m2!1sen!2smy!4v1775231101273!5m2!1sen!2smy" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>');`,
  `INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (20, 'CARALL Savon Time Clip (2 Packs x 2.4g)', 'carall-savon-time-clip-2-packs-x-2-4g', 'A clean space with the scent of soap.
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (17, 'CARBOY PERODUA ARUZ ROOF BOX ', 'carboy-perodua-aruz-roof-box', '', 0.00, NULL, '/api/storage/objects/uploads/0c384456-2529-4c1f-bfcf-3dc9f93051f6', '{}', 17, 'CARBOY', '', 0, false, NULL, 0, '{}', '2026-04-03 18:22:37.059838+00', '{17}', '{2}', '{14}', '[]', NULL, 0);`,
  `INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (19, 'CARALL Regalia Enrich Air 2 Packs (2.4g x 2Packs)', 'carall-regalia-enrich-air-2-packs-2-4g-x-2packs', 'New Edition for Velvet Musk scent 
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (45, 'CARALL Dolly Kiss Tiara (60ml)', 'carall-dolly-kiss-tiara-60ml', 'The heart becomes a tiara and it''s so cute!
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (26, 'CARALL Scratch Removal & Coat Glitter For Light Color Cars (250g)', 'carall-scratch-removal-coat-glitter-for-light-color-cars-250g', '**Note: Please use it after confirming the adaptive paint color and carefully reading the precautionary statements.
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (27, 'CARALL Seasonable (160ml)', 'carall-seasonable-160ml', 'A fragrance where you can enjoy the blessings of Japan with its scent
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (30, 'CARALL Seasonable Plate (3 Packs x 12g)', 'carall-seasonable-plate-3-packs-x-12g', '**Note: Price for 1 Pack With 3 Pieces/Packs. 
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (35, 'CARALL Brown Marks Sachet (14g)', 'carall-brown-marks-sachet-14g', 'Interior fragrance with a natural scent in the car
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (33, 'CARALL Glass Oil Film Removal Pad (2 x 15g)', 'carall-glass-oil-film-removal-pad-2-x-15g', '**Note: 2 Pieces in a Pack**
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (36, 'CARALL Grand Chelia 65L (55ml)', 'carall-grand-chelia-65l-55ml', 'Well-honed design, richly scented carefully selected fragrances.
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (34, 'CARALL Maintenance Shampoo (1000ml)', 'carall-maintenance-shampoo-1000ml', '**Note: Applicable to all paint colors
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (43, 'CARALL Cue Air (2 Packs x 2.4g)', 'carall-cue-air-2-packs-x-2-4g', 'The cue series has a cute pop color and round shape!
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (23, 'CARALL Wide Deodorant For Cigarette/ Rokok (800g)', 'carall-wide-deodorant-for-cigarette-rokok-800g', 'Perfect for minivans and large vehicles!
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (37, 'CARALL Cue Glyph (2.4g)', 'carall-cue-glyph-2-4g', 'Luxury fragrance with beautiful and sparkling diamond cuts
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (80, 'DH-292 DLAA FOG LAMP for TY_RUSH (2008-2014) ', 'dh-292-dlaa-fog-lamp-for-ty-rush-2008-2014', '', 0.00, NULL, NULL, '{}', 8, 'DLAA', 'DH-292', 0, false, NULL, 0, '{}', '2026-04-06 16:26:19.906693+00', '{8}', '{}', '{}', '[]', NULL, 0);`,
  `INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (48, 'CARALL Regalia Enrich (65ml)', 'carall-regalia-enrich-65ml', 'Platinum silver shine
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (46, 'CARALL Masamune Premia (138ml)', 'carall-masamune-premia-138ml', 'Masamune''s unique commitment to design beauty and high quality
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (82, 'FD-455 DLAA FOG LAMP for FD_FIESTA 11'' ', 'fd-455-dlaa-fog-lamp-for-fd-fiesta-11', '', 0.00, NULL, NULL, '{}', 8, 'DLAA', 'FD-455', 0, false, NULL, 0, '{}', '2026-04-06 16:26:20.430721+00', '{8}', '{}', '{}', '[]', NULL, 0);`,
  `INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (81, 'FD-355 DLAA FOG LAMP for FD_FIESTA (2009-2012) ', 'fd-355-dlaa-fog-lamp-for-fd-fiesta-2009-2012', 'DLAA fog lamp for Ford Fiesta 2009 
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (47, 'CARALL Omnibus Diffuser (160ml)', 'carall-omnibus-diffuser-160ml', 'In-vehicle lead diffuser that spreads the scent from the stick .
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (44, 'CARALL Botanish Mist (200ml)', 'carall-botanish-mist-200ml', 'Clean air with the power of nature 自然のチカラできれいな空気
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (31, 'CARALL Glass Water Fur Removal Pad (2 x 17g)', 'carall-glass-water-fur-removal-pad-2-x-17g', '**Note: 2 Pieces in a Pack**
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (41, 'CARALL Regalia Enrich G Glitter 2nd Gen (60ml)', 'carall-regalia-enrich-g-glitter-2nd-gen-60ml', 'Second Generation of CARALL Regalia Enrich (Velvet Musk 1386)
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (25, 'CARALL Eldran Glister (2 Packs x 2.4g)', 'carall-eldran-glister-2-packs-x-2-4g', 'The finest luxury space just by installing a luxury design with an overwhelming presence that is typical of the El Duran series, fascinating from the air conditioner louvers. 
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (39, 'CARALL Shoshu Nano Air Aircon Spray (90ml)', 'carall-shoshu-nano-air-aircon-spray-90ml', 'Nanoparticles adhere to deodorization in the air conditioner!
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (22, 'CARALL Omnibus (160ml)', 'carall-omnibus-160ml', 'A masterpiece that expresses the finest fragrance quality through design.
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (28, 'CARALL Car Body & Aluminium Wheel Iron Powder Cleaner (500ml)', 'carall-car-body-aluminium-wheel-iron-powder-cleaner-500ml', '**Note: Paint and parts that have deteriorated over time may cause discoloration and stains.
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (29, 'CARALL Cleaning & Polishing Liquid Wax (500ml)', 'carall-cleaning-polishing-liquid-wax-500ml', '**Note: Be sure to try each part in an inconspicuous part before using it. Be especially careful of areas that have deteriorated over time as they may cause discoloration and stains.
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (40, 'CARALL Gloss Finish (180ml)', 'carall-gloss-finish-180ml', 'No need to repaint! Instantly glossy finish with a single coat!
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (38, 'CARALL Shoshu Nano Air Clip Kabishu Pro (2 Packs x 2.4g)', 'carall-shoshu-nano-air-clip-kabishu-pro-2-packs-x-2-4g', 'Quick reset the mold smell of the air conditioner!
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (42, 'CARALL Brown Marks Clip (2 Packs x 2.4g)', 'carall-brown-marks-clip-2-packs-x-2-4g', 'Interior fragrance with a natural scent in the car
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (24, 'CARALL Awesome Days Box (165ml)', 'carall-awesome-days-box-165ml', 'Relaxing fragrance to relax with scent
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (32, 'CARALL Scratch Removal & Coat Glitter For Dark Color Cars (250g)', 'carall-scratch-removal-coat-glitter-for-dark-color-cars-250g', '**Note: Please use it after confirming the adaptive paint color and carefully reading the precautionary statements.
INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, image_urls, category_id, brand, sku, stock, featured, rating, review_count, tags, created_at, category_ids, car_brand_ids, car_model_ids, variations, video_url, sort_order) VALUES (21, 'CARALL Eldran Kiss Gel (105ml)', 'carall-eldran-kiss-gel-105ml', 'The bewitching appearance and high-quality scent will captivate you.
INSERT INTO slides (id, image_url, tag, title, highlight, subtitle, category_slug, sort_order) VALUES (2, '/cat-exterior.png', 'Exterior Collection', 'BUILT FOR', 'THE ROAD.', 'Aerodynamic styling and protection that looks as good as it performs.', 'roof-box', 1);`,
  `INSERT INTO slides (id, image_url, tag, title, highlight, subtitle, category_slug, sort_order) VALUES (1, '/api/storage/objects/uploads/42bfccfe-6b7e-4f5d-98aa-5f9082d15353', 'Premium Air Fresheners', 'CARALL', 'AIR FRESHENER', 'Transform every journey with signature scents crafted for the modern driver. Pure freshness, every ride.', 'air-fresheners', 2);`,
  `INSERT INTO slides (id, image_url, tag, title, highlight, subtitle, category_slug, sort_order) VALUES (3, '/cat-interior.png', 'Interior Series', 'COMFORT', 'REDEFINED.', 'Premium interior upgrades that transform every drive into an experience.', 'seat-covers', 3);`,
  `INSERT INTO slides (id, image_url, tag, title, highlight, subtitle, category_slug, sort_order) VALUES (4, '/cat-lighting.png', 'Lighting Systems', 'SEE &', 'BE SEEN.', 'High-intensity lighting solutions engineered for visibility and presence.', 'wipers', 4);`,
  `SELECT pg_catalog.setval('brands_id_seq', 6, true);`,
  `SELECT pg_catalog.setval('car_brands_id_seq', 15, true);`,
  `SELECT pg_catalog.setval('car_models_id_seq', 154, true);`,
  `SELECT pg_catalog.setval('categories_id_seq', 21, true);`,
  `SELECT pg_catalog.setval('contact_info_id_seq', 5, true);`,
  `SELECT pg_catalog.setval('products_id_seq', 82, true);`,
  `SELECT pg_catalog.setval('slides_id_seq', 5, true);`
];

const SCHEMA_PATCHES = [
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text`,
  `ALTER TABLE car_models ADD COLUMN IF NOT EXISTS image_url text`,
];

export async function seedIfEmpty(): Promise<void> {
  try {
    for (const patch of SCHEMA_PATCHES) {
      await db.execute(sql.raw(patch));
    }
    console.log('[seed] Schema patches applied.');

    const result = await db.execute(sql`SELECT COUNT(*) as count FROM categories`);
    const count = parseInt((result.rows[0] as { count: string }).count, 10);
    if (count > 0) {
      console.log(`[seed] Database already has data (categories: ${count}), skipping seed.`);
      return;
    }
    console.log('[seed] Database is empty, seeding production data...');
    for (const statement of SEED_SQL) {
      await db.execute(sql.raw(statement));
    }
    console.log(`[seed] Seeded ${SEED_SQL.length} statements successfully.`);
  } catch (err) {
    console.error('[seed] Seeding failed:', err);
  }
}
