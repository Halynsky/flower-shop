INSERT INTO articles (title, content, created, image) VALUES ('Як росте тюльпан', 'Виростає тюльпан від 10 см до метра заввишки. Коренева система складається з додаткових коренів, що ростуть із денця цибулини і щороку відмирають.', '2019-04-23T15:09:42.0', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVtDJ0IIKtm0CnQtSOXKCFW-Otl9i0XNoZpTFqOl5mHw2L50qp');
INSERT INTO articles (title, content, created, image) VALUES ('Догляд за квітами', 'Універсальна температура свіжої води для квітів: + 18°С. Але влітку “зрадіють” більш прохолодній: +8 + 10°С. Є рослини, яким потрібна тепла вода, так як при охолодженні виділяється молочний сік застигає і закупорює судини.', '2019-04-21T16:10:22.0', 'https://www.flowers.ie/images/flower-care2.jpg');
INSERT INTO articles (title, content, created, image) VALUES ('Національна квітка України', 'Коли розквітають соняшники, їх яскраві гарячі пелюстки виграють золотом, милуючи людське око. До Європи “квітка сонця”, як називають цю рослину мексиканці, потрапила на початку 17-го століття і вважалася суто декоративною.', '2019-04-20T22:29:30.0', 'https://www.theflowerexpert.com/media/images/flowerbusiness/flowergrowersandsellers/nationalnativepopularflowersofukraine/Helianthus_annuus_flowers.jpg');
INSERT INTO articles (title, content, created, image) VALUES ('Як доглядати за трояндою', 'Трояндам потрібне сонячне світло і свіже повітря. Влітку їх слід ставити на відкрите вікно або на балкон, опустивши горщики в ящик з піском, і рясно поливати. Зимою краще тримати їх в прохолодній і провітрюваній кімнаті.', '2019-04-19T12:11:22.0', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3XcpJyHr-oZLSHUQ1yM-wvA44Sdh1UyHYK1lY5ccJy7-lPZU_mQ');
INSERT INTO articles (title, content, created, image) VALUES ('Як росте лілія', 'Рослина лілія є цибулинним багаторічником. Цибулини за розміром можуть бути крихітними – 1 см у діаметрі, а можуть бути більш ніж великими – до 30 см у діаметрі. За формою вони кулясті або яйцеподібні.','2019-04-20T11:09:42.0', 'https://www.planetnatural.com/wp-content/uploads/2012/12/fresh-lilies.jpg');
INSERT INTO articles (title, content, created, image) VALUES ('Літаюча качечка', 'Калеана-мажор, відома як велика качка орхідеї, - це невелика орхідея, що зустрічається в східній і південній Австралії. Ця наземне рослина має чудову квітку, що нагадує качку в польоті. Квітка є привабливою для комах, які запилюють квітку.', '2019-04-24T05:40:31.5', 'https://static.twentytwowords.com/wp-content/uploads/flyingduck.jpg');
INSERT INTO articles (title, content, created, image) VALUES ('Як цвіте орхідея', 'Орхідею квітникарі називають прекрасною, хвилюючою і вишуканою. Форма квітів кімнатній орхідеї може бути дуже різноманітна. Квіти, що розпускаються на рослинах, які ростуть в домашніх умовах, можуть нагадувати метеликів.','2019-04-24T13:05:32.1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4pz5P44MDlmDgT5vacSPFS3gstTp_USOcayzT1kHF1--3IYHx');
INSERT INTO articles (title, content, created, image) VALUES ('Механізм захлопування венериної мухоловки', 'Механізм захлопування листка залежить від складної взаємодії між його еластичністю, тургором та ростом. У відкритому стані частини листка відігнута назовні, в закритому — всередину, формуючи порожнину, вихід з якої закрито волосками.', '2019-04-23T08:03:12.1', 'https://cdn.shopify.com/s/files/1/0156/0137/files/venus-flytrap-1531345_1920.jpg?v=1498479119');
INSERT INTO articles (title, content, created, image) VALUES ('Запилення квітів', 'Для запилення необхідно, щоб пилок за допомогою комах, вітру чи води потрапив на приймочку маточки. Зовнішній шар оболонки пилкового зерна (екзина) має у своєму складі речовини терпеноїдної природи.', '2019-04-17T10:00:30.0', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnecS3EEAm70HecYnVbHKYQj1msislZYzyzRGyFxwVTqdkhKaK');
INSERT INTO articles (title, content, created, image) VALUES ('Як поливати квіти', 'Полив квітів – це обов''язкова частина догляду за ними. І, як іноді здається, найпростіша частина. Ну що тут складного: набрав води – полив квіти. Але так можуть думати тільки початківці квітникарі або ті, хто до рослин абсолютно байдужий.', '2019-04-28T13:20:35.3', 'https://wtop.com/wp-content/uploads/2015/05/garden_hose_thinkstock-727x485.jpg');

INSERT INTO flower_types (name) VALUES ('Лілії');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Sorbonne', 'Сорбонне');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Saltarello', 'Сальтарелло');

INSERT INTO flower_types (name) VALUES ('Гіацинти');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Indigo King', 'Індіго Кінг');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Jellow Hammer', 'Йеллоу Хаммер');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'King of the Blues', 'Кінг оф зе Блюз');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Honeymoon', 'Ханімун');

INSERT INTO flower_types (name) VALUES ('Тюльпани');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Monte Carlo', 'Монте Карло');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'White Prince', 'Вайт Прінс');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Big Chief', 'Біг Чіф');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Oxford', 'Оксфорд');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Long Ledi', 'Лонг Леді');

INSERT INTO flower_types (name) VALUES ('Гладіолуси');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Bastia', 'Бастія');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Windsong', 'Віндсонг');
INSERT INTO flowers (flower_type_id, name_original, name) VALUES ((SELECT currval(pg_get_serial_sequence('flower_types','id'))), 'Prince Claus', 'Прінс Клаус');

INSERT INTO sizes (name,min, max) VALUES ('8/10','8','10');
INSERT INTO sizes (name,min, max) VALUES ('11/13','11','13');
INSERT INTO sizes (name,min, max) VALUES ('14/16','14','16');

INSERT INTO flower_type_sizes (flower_type_id, size_id) VALUES ('1', '2');
INSERT INTO flower_type_sizes (flower_type_id, size_id) VALUES ('1', '1');
INSERT INTO flower_type_sizes (flower_type_id, size_id) VALUES ('2', '3');
INSERT INTO flower_type_sizes (flower_type_id, size_id) VALUES ('3', '1');
INSERT INTO flower_type_sizes (flower_type_id, size_id) VALUES ('3', '2');
INSERT INTO flower_type_sizes (flower_type_id, size_id) VALUES ('3', '3');
INSERT INTO flower_type_sizes (flower_type_id, size_id) VALUES ('4', '2');
INSERT INTO flower_type_sizes (flower_type_id, size_id) VALUES ('4', '1');
