export interface FeatureOption {
  id: string;
  label: string;
  prompt: string;
  image: string;
}

export interface LightOption {
  id: string;
  label: string;
  prompt: string;
  image: string;
}

const PLACEHOLDER_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e9e1d2"/>
        <stop offset="1" stop-color="#fdfbf7"/>
      </linearGradient>
    </defs>
    <rect width="256" height="256" fill="url(#g)"/>
    <path d="M176 86c-40 6-70 29-86 70 41-16 64-46 70-86z" fill="#856c45" opacity="0.65"/>
    <path d="M82 178c54-2 95-41 98-98-54 2-95 41-98 98z" fill="#856c45" opacity="0.25"/>
  </svg>`
);

const PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=utf-8,${PLACEHOLDER_SVG}`;

type StyleId = "neoclassic" | "eco" | "scandinavian";
type RoomId = "kitchen" | "living" | "bathroom" | "bedroom";

const CATALOG: Record<StyleId, Record<RoomId, FeatureOption[]>> = {
  neoclassic: {
    kitchen: [
      {
        id: "neo_kitchen_glass_fronts_lit",
        label: "Фасады со стеклом и подсветкой",
        prompt: "glass-front cabinet doors, glass display cabinets, upper cabinets with glass doors, interior shelf lighting, integrated LED strip lighting inside cabinets, illuminated glass cabinetry, classic kitchen fronts with glass inserts",
        image: "/icons/pictogram/neo/kuhna/fasadi.jpg"
      },
      {
        id: "neo_kitchen_stone_countertop",
        label: "Столешница из камня",
        prompt: "stone countertop, marble or quartz worktop, refined classic kitchen surface",
        image: "/icons/pictogram/neo/kuhna/stolechka.jpg"
      },
      {
        id: "neo_kitchen_small_square_backsplash",
        label: "Мелкая плитка на фартуке (квадрат)",
        prompt: "small square tile backsplash, classic ceramic mosaic, neat grid pattern",
        image: "/icons/pictogram/neo/kuhna/fartuk.jpg"
      },
      {
        id: "neo_kitchen_plate_collection_wall",
        label: "Коллекция тарелок на стене",
        prompt: "decorative plate collection on wall, curated ceramic plates display, classic wall decor",
        image: "/icons/pictogram/neo/kuhna/tarelki.jpg"
      },
      {
        id: "neo_kitchen_porcelain_stoneware_rosette_floor",
        label: "Ковёр с розеткой из керамогранита на полу",
        prompt: "porcelain stoneware floor medallion, ceramic tile rosette inlay, decorative floor rosette, tiled rug effect on the floor, refined stone inlay pattern",
        image: "/icons/pictogram/neo/kuhna/kover.jpg"
      },
      {
        id: "neo_kitchen_roman_shades",
        label: "Римские шторы",
        prompt: "roman shades, tailored fabric window shades, classic window treatment",
        image: "/icons/pictogram/neo/kuhna/shtori.jpg"
      },
      {
        id: "neo_kitchen_range_hood_portal",
        label: "Портал с вытяжкой над плитой",
        prompt: "classic range hood portal, framed kitchen hood surround, architectural hood detail",
        image: "/icons/pictogram/neo/kuhna/portal.jpg"
      },
      {
        id: "neo_kitchen_classic_dining_table",
        label: "Классический стол из дерева в цвете рам",
        prompt: "classic wooden dining table, wood tone matching window frames, refined traditional dining set",
        image: "/icons/pictogram/neo/kuhna/stol.jpg"
      },
      {
        id: "neo_kitchen_plants_vase_on_table",
        label: "Растения и цветы в вазе на столе",
        prompt: "indoor plants, fresh flowers in vase on dining table, elegant centerpiece",
        image: "/icons/pictogram/neo/kuhna/vaza.jpg"
      }
    ],
    living: [
      { id: "neo_living_divan", label: "Диван честерфилд (современный, бархат)", prompt: "Neoclassical modern chesterfield sofa with velvet upholstery, deep button tufting, rolled arms, elegant brass nailhead trim, luxurious living room with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/gostinaya/001.png" },
      { id: "neo_living_kreslo", label: "Кресло с каретной стяжкой", prompt: "Neoclassical armchair with carriage-style upholstery, elegant curved back, carved mahogany frame, brass accents, luxurious living room with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/gostinaya/003.png" },
      { id: "neo_living_fireplace_portal", label: "Классический каминный портал (лепнина)", prompt: "Neoclassical fireplace portal with ornate plaster moldings, carved marble mantel, elegant columns, classical motifs, luxurious living room with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/gostinaya/007.png" },
      { id: "neo_living_zhurnalniy_stolik", label: "Журнальный столик (мрамор, латунь)", prompt: "High-detail 3D render of a modern coffee table. The table features a large, perfectly circular top made of brushed brass. This top is supported by four slender, square-profile legs. The legs are connected at the very bottom by a matching open square frame that rests on the floor. The entire structure is minimalist and clean-lined. Negative prompt: deformed, fused, overlapping geometry, broken, solid block, thick legs.", image: "/icons/pictogram/neo/gostinaya/002.png" },
      { id: "neo_living_nesting_tables", label: "Наборные столики (латунь, стекло)", prompt: "Neoclassical nesting tables with brass frames and glass tops, elegant geometric design, intricate brass details, luxurious living room with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/gostinaya/005.png" },
      { id: "neo_living_puf", label: "Пуф-банкетка с каретной стяжкой", prompt: "Neoclassical ottoman bench with carriage-style upholstery, elegant tufting, brass nailhead trim, carved mahogany legs, luxurious living room with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/gostinaya/006.png" },
      { id: "neo_living_vitrina", label: "Встроенные книжные шкафы (с карнизами)", prompt: "Neoclassical built-in bookshelves with ornate cornices, carved mahogany woodwork, elegant glass doors, classical columns, luxurious living room with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/gostinaya/004.png" },
      { id: "neo_living_sofa_console_table", label: "Консольный стол (за спинкой дивана)", prompt: "Neoclassical console table behind sofa, carved mahogany with brass inlay, elegant curved legs, marble top, luxurious living room with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/gostinaya/008.png" },
      { id: "neo_living_ottoman", label: "Мягкие банкетки под окном", prompt: "Neoclassical window benches with velvet upholstery, elegant tufting, brass nailhead trim, carved mahogany frames, luxurious living room with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/gostinaya/009.png" }
    ],
    bathroom: [
      { id: "neo_bath_freestanding_tub_lion_feet", label: "Отдельно стоящая ванна (ножки-львы)", prompt: "freestanding bathtub with lion feet, classic clawfoot tub", image: "/icons/pictogram/neo/vanna/001.png" },
      { id: "neo_bath_vanity_turned_legs", label: "Тумба под раковину (точеные ножки)", prompt: "bathroom vanity with turned legs, classic sink cabinet with decorative legs", image: "/icons/pictogram/neo/vanna/002.png" },
      { id: "neo_bath_tall_cabinet_glass", label: "Высокий шкаф-пенал (стекло)", prompt: "tall bathroom linen cabinet with glass door, classic tall storage unit", image: "/icons/pictogram/neo/vanna/003.png" },
      { id: "neo_bath_vanity_pouf", label: "Мягкий пуф у туалетного столика", prompt: "soft pouf for vanity table, classic upholstered stool", image: "/icons/pictogram/neo/vanna/004.png" },
      { id: "neo_bath_undermount_sink", label: "Керамическая раковина (под столешницу)", prompt: "undermount ceramic sink, classic bathroom sink", image: "/icons/pictogram/neo/vanna/005.png" },
      { id: "neo_bath_classic_mirror", label: "Зеркало (классическая рама)", prompt: "classic framed mirror, ornate bathroom mirror", image: "/icons/pictogram/neo/vanna/006.png" },
      { id: "neo_bath_shower_cabin_brass", label: "Душевая кабина (латунь/золото)", prompt: "glass shower cabin with brass or gold hardware, classic shower enclosure", image: "/icons/pictogram/neo/vanna/007.png" },
      { id: "neo_bath_towel_rack", label: "Отдельно стоящая вешалка-стойка (полотенца)", prompt: "freestanding towel rack, classic towel stand, brass or gold finish", image: "/icons/pictogram/neo/vanna/008.png" },
      { id: "neo_bath_decorative_shelf", label: "Декоративная настенная полка (консоли)", prompt: "decorative wall shelf with classic corbels, console shelf", image: "/icons/pictogram/neo/vanna/009.png" }
    ],
    bedroom: [
      { id: "neo_bed_high_headboard", label: "Кровать (высокое изголовье, стяжка)", prompt: "Neoclassical bed with high tufted headboard, deep button tufting, elegant carved mahogany frame, brass nailhead trim, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Кровать (высокое изголовье, стяжка).png" },
      { id: "neo_bed_foot_bench", label: "Банкетка в изножье", prompt: "Neoclassical bench at foot of bed, velvet upholstery, elegant tufting, brass nailhead trim, carved mahogany legs, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Банкетка в изножье.png" },
      { id: "neo_bed_accent_chair", label: "Мягкое акцентное кресло", prompt: "Neoclassical accent armchair, velvet upholstery, elegant curved back, carved mahogany frame, brass accents, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Мягкое акцентное кресло.png" },
      { id: "neo_bed_dresser_knob_handles", label: "Комод (ручки-кнопки/кольца)", prompt: "Neoclassical dresser with brass knob handles, carved mahogany woodwork, elegant marble top, brass details, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Комод (ручки-кнопкикольца).png" },
      { id: "neo_bed_bedside_tables", label: "Прикроватные тумбы", prompt: "Neoclassical bedside tables, carved mahogany with brass inlay, elegant curved legs, marble tops, brass details, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Прикроватные тумбы.png" },
      { id: "neo_bed_floor_mirror", label: "Напольное зеркало (массивная рама)", prompt: "Neoclassical floor mirror with ornate carved frame, gold leaf details, elegant proportions, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Напольное зеркало (массивная рама).png" },
      { id: "neo_bed_vanity_table", label: "Туалетный столик (с зеркалом)", prompt: "Neoclassical vanity table with matching mirror, carved mahogany with brass inlay, elegant curved legs, marble top, brass details, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Туалетный столик (с зеркалом).png" },
      { id: "neo_bed_coffee_table", label: "Прикроватный кофейный столик", prompt: "Neoclassical bedside coffee table, carved mahogany with brass inlay, elegant curved legs, marble top, brass details, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Прикроватный кофейный столик.png" },
      { id: "neo_bed_wardrobe_milled_facades", label: "Шкаф (филенчатые фасады)", prompt: "Neoclassical wardrobe with milled panel doors, carved mahogany woodwork, elegant brass handles, classical cornices, luxurious bedroom with crystal chandelier, marble floors, ornate ceiling moldings, photorealistic, high detail, 8k", image: "/icons/pictogram/neo/spalna/Шкаф (филенчатые фасады).png" }
    ]
  },
  eco: {
    kitchen: [
      {
        id: "japandi_bar_stool",
        label: "Барный стул",
        prompt: "Japandi style bar stool, minimalist, light wood, clean lines, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/2_Барный стул.png"
      },
      {
        id: "japandi_kitchen_island",
        label: "Кухонный остров",
        prompt: "Minimalist Japandi kitchen island with light wood countertop, simple clean lines, functional workspace, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/1_Кухонный остров.png"
      },
      {
        id: "japandi_tall_cabinet_shoji",
        label: "Высокий шкаф-пенал (сёдзи фасады)",
        prompt: "Tall Japandi storage cabinet with Shoji screen doors, light wood frame, translucent panels, minimalist storage, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/5_Высокий шкаф-пенал (сёдзи фасады).png"
      },
      {
        id: "japandi_hanging_shelf_open",
        label: "Открытая навесная полка",
        prompt: "Open hanging shelf made of light wood, Japandi style, floating design, holding a few ceramic items, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/4_Открытая навесная полка.png"
      },
      {
        id: "japandi_cart_on_wheels",
        label: "Деревянная тележка на колесах",
        prompt: "Wooden kitchen cart on wheels, light wood, minimalist Japandi design, with shelves for storage, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/6_Деревянная тележка на колесах.png"
      },
      {
        id: "japandi_dining_table_low",
        label: "Низкий обеденный стол",
        prompt: "Low-profile Japandi dining table, light wood, minimalist design, close to the floor, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/3_Низкий обеденный стол.png"
      },
      {
        id: "japandi_sink_ceramic_built_in",
        label: "Керамическая мойка (встроенная)",
        prompt: "Built-in ceramic kitchen sink, minimalist Japandi style, seamless integration, clean lines, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/7_Керамическая мойка_встроенная.png"
      },
      {
        id: "japandi_faucet_minimalist",
        label: "Кухонный смеситель (минимализм)",
        prompt: "Minimalist kitchen faucet, Japandi style, simple design, light metal finish, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/8_Кухонный смеситель_минимализм.png"
      },
      {
        id: "japandi_cutting_board_solid_slab",
        label: "Разделочная доска (цельный спил)",
        prompt: "Solid wood cutting board, live-edge design, Japandi style, natural wood grain, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/kuhna/resized/9_Разделочная доска_цельный спил.png"
      },
          ],
    living: [
      {
        id: "japandi_living_low_modular_sofa",
        label: "Низкий модульный диван (светлая ткань)",
        prompt: "Low-profile modular sofa in light beige fabric, minimalist Japandi style, deep comfortable seats, clean lines, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1111 Низкий модульный диван (светлая ткань).png"
      },
      {
        id: "japandi_living_bionic_coffee_table",
        label: "Журнальный стол бионической формы (массив)",
        prompt: "Japandi coffee table with a live-edge, biomorphic solid wood top, minimalist black metal legs, organic shape, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1112 Журнальный стол бионической формы (массив).png"
      },
      {
        id: "japandi_living_rattan_armchair",
        label: "Кресло с плетением из ротанга (Woven Rattan)",
        prompt: "Woven rattan armchair, Japandi style, light wood frame, natural caning on back and seat, minimalist design, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1113 Кресло с плетением из ротанга (Woven Rattan).png"
      },
      {
        id: "japandi_living_low_tv_console",
        label: "Низкая консоль под ТВ (светлый шпон)",
        prompt: "Low and long TV console, light oak veneer, minimalist, handleless drawers, Japandi style, clean lines, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1114 Низкая консоль под ТВ (светлый шпон).png"
      },
      {
        id: "japandi_living_wooden_slat_screen",
        label: "Деревянная реечная ширма",
        prompt: "Japandi style folding screen, made of vertical light wood slats, room divider, minimalist and airy, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1115 Деревянная реечная ширма.png"
      },
      {
        id: "japandi_living_built_in_wardrobes",
        label: "Встроенные шкафы (под цвет стен)",
        prompt: "Seamless built-in wardrobes, flush with the wall, handleless push-to-open doors, painted in a neutral off-white matte color, Japandi minimalist storage, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1116 Встроенные шкафы (под цвет стен).png"
      },
      {
        id: "japandi_living_bamboo_stool",
        label: "Табурет из бамбука с функцией хранения (Wabi-sabi)",
        prompt: "Wabi-sabi style bamboo stool with a lid for storage, simple, natural, and functional, Japandi aesthetic, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1117 Табурет из бамбука с функцией хранения (Wabi-sabi).png"
      },
      {
        id: "japandi_living_floor_cushions",
        label: "Напольные подушки для сидения",
        prompt: "A stack of minimalist floor cushions for sitting, covered in neutral-colored linen fabric, Japandi style, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1118 Напольные подушки для сидения.png"
      },
      {
        id: "japandi_living_freestanding_shelving_unit",
        label: "Отдельно стоящий стеллаж (тонкие полки)",
        prompt: "Freestanding Japandi shelving unit, minimalist black metal frame and thin light wood shelves, asymmetrically arranged, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/gostinaya/1119 Отдельно стоящий стеллаж (тонкие полки).png"
      }
    ],
    bathroom: [
      {
        id: "japandi_bathroom_hanging_cupboard",
        label: "Подвесная тумба под раковину (светлый шпон)",
        prompt: "Wall-mounted bathroom vanity, light oak veneer, minimalist handleless design, Japandi style, floating cabinet, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1311 Подвесная тумба под раковину (светлый шпон).png"
      },
      {
        id: "japandi_bathroom_wooden_bench",
        label: "Деревянная скамья для влажной зоны",
        prompt: "Small wooden bench for a wet room or bathroom, made of teak or hinoki wood, simple and robust design, Japandi spa aesthetic, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1312 Деревянная скамья для влажной зоны.png"
      },
      {
        id: "japandi_bathroom_tall_narrow_pencil_case",
        label: "Высокий узкий деревянный пенал",
        prompt: "Tall and narrow wooden bathroom storage cabinet, pencil-thin profile, light oak wood, minimalist Japandi design, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1313 Высокий узкий деревянный пенал.png"
      },
      {
        id: "japandi_bathroom_minimalist_wooden_laundry_basket",
        label: "Минималистичная деревянная корзина для белья",
        prompt: "Minimalist wooden laundry basket, Japandi style, light wood slats with a fabric liner inside, clean lines, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1314 Минималистичная деревянная корзина для белья.png"
      },
      {
        id: "japandi_bathroom_solid_stone_sink",
        label: "Раковина из цельного камня",
        prompt: "Vessel sink carved from a single piece of natural stone, round or rectangular, wabi-sabi texture, Japandi style, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1315 Раковина из цельного камня.png"
      },
      {
        id: "japandi_bathroom_wooden_shelf_tray_on_the_bathtub",
        label: "Деревянная полка-поднос на ванну",
        prompt: "Wooden bathtub caddy tray, made of bamboo or teak, with a slot for a book or tablet, minimalist spa accessory, Japandi style, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1316 Деревянная полка-поднос на ванну.png"
      },
      {
        id: "japandi_bathroom_frameless_mirror",
        label: "Зеркало без рамы (подсветка)",
        prompt: "Large frameless bathroom mirror with integrated LED backlighting, soft ambient glow, round or rectangular shape, minimalist design, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1317 Зеркало без рамы (подсветка).png"
      },
      {
        id: "japandi_bathroom_built_in_wooden_bench_in_the_shower",
        label: "Встроенная деревянная скамья в душевой",
        prompt: "Built-in wooden shower bench, floating design, made of water-resistant teak wood slats, Japandi spa style, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1318 Встроенная деревянная скамья в душевой.png"
      },
      {
        id: "japandi_bathroom_hidden_storage_behind_the_mirror",
        label: "Скрытое хранение за зеркалом",
        prompt: "Bathroom mirror with hidden storage, recessed medicine cabinet with a mirrored door, seamless and minimalist, Japandi style, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/vannaya/1319 Скрытое хранение за зеркалом.png"
      }
    ],
    bedroom: [
      {
        id: "japandi_bedroom_low_bed_podium",
        label: "Низкая кровать-подиум (дерево)",
        prompt: "Low-profile wooden bed platform, Japandi style, light oak or walnut wood, minimalist frame, close to the floor, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1211 Низкая кровать-подиум (дерево).png"
      },
      {
        id: "japandi_bedroom_hanging_console_tables",
        label: "Подвесные консольные тумбы (светлые)",
        prompt: "Floating bedside tables, wall-mounted, light wood with a single drawer, minimalist handleless design, Japandi bedroom furniture, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1212 Подвесные консольные тумбы (светлые).png"
      },
      {
        id: "japandi_bedroom_shoji_wardrobe",
        label: "Шкаф (фасады-слайдеры сёдзи)",
        prompt: "Japandi wardrobe with sliding Shoji screen doors, dark wood frame and translucent rice paper panels, minimalist storage, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1213 Шкаф (фасады-слайдеры сёдзи).png"
      },
      {
        id: "japandi_bedroom_wooden_bench",
        label: "Деревянная банкетка в изножье",
        prompt: "Simple wooden bench for the foot of the bed, Japandi style, woven seat or solid light wood, minimalist design, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1214 Деревянная банкетка в изножье.png"
      },
      {
        id: "japandi_bedroom_low_dressing_table",
        label: "Низкий туалетный столик (массив)",
        prompt: "Low dressing table made of solid wood, minimalist Japandi design, can be used while sitting on the floor, with a small matching stool, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1215 Низкий туалетный столик (массив).png"
      },
      {
        id: "japandi_bedroom_accent_chair_rattan",
        label: "Акцентное кресло (ротанг)",
        prompt: "Japandi accent chair with a black wood frame and natural rattan woven seat and back, low-slung and elegant, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1216 Акцентное кресло (ротанг).png"
      },
      {
        id: "japandi_bedroom_floor_mirror",
        label: "Напольное зеркало (простая рама)",
        prompt: "Full-length floor mirror with a simple, thin frame in black metal or light wood, leaning against a wall, minimalist Japandi style, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1217 Напольное зеркало (простая рама).png"
      },
      {
        id: "japandi_bedroom_bedside_hanger",
        label: "Прикроватная вешалка-камердинер",
        prompt: "Minimalist valet stand or bedside clothes hanger, made of dark wood, Japandi style, for hanging a shirt and trousers, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1218 Прикроватная вешалка-камердинер.png"
      },
      {
        id: "japandi_bedroom_built_in_storage",
        label: "Встроенные незаметные системы хранения",
        prompt: "Seamless built-in bedroom storage, flush with the wall, handleless push-to-open doors, painted in a neutral matte color, minimalist Japandi design, isolated on white background, 3d render",
        image: "/icons/pictogram/japandi/spalna/1219 Встроенные незаметные системы хранения.png"
      }
    ]
  },
  scandinavian: {
    kitchen: [
      { id: "scandi_kitchen_distressed_wood_table", label: "Обеденный стол из состаренного дерева", prompt: "Scandinavian dining table made of distressed reclaimed wood, natural weathered texture, simple rectangular shape, metal hairpin legs, minimalist design, isolated on white background, 3d render", image: "/icons/pictogram/scandi/kuhna/resized_обеденный_стол_из_состаренного_дерева.png" },
      { id: "scandi_kitchen_simple_back_chair", label: "Кухонный стул с простой спинкой", prompt: "Scandinavian kitchen chair with simple backrest, light oak wood frame, woven paper cord seat, minimalist design, clean lines, isolated on white background, 3d render", image: "/icons/pictogram/scandi/kuhna/resized_Кухонный стул с простой спинкой.png" },
      { id: "scandi_kitchen_open_wood_shelves", label: "Открытые полки из дерева", prompt: "open wooden shelves, minimal open shelving, light timber shelves, simple Scandinavian styling", image: "/icons/pictogram/scandi/kuhna/resized_Открытые полки из дерева.png" },
      { id: "scandi_kitchen_white_subway_tile", label: "Белая плитка “кабанчик”", prompt: "white subway tile backsplash, clean glossy or matte ceramic, simple grid pattern, Scandinavian backsplash", image: "/icons/pictogram/scandi/kuhna/resized_Белая плитка кабанчик.png" },
      { id: "scandi_kitchen_linen_shades", label: "Текстиль: шторы/римские", prompt: "linen or cotton curtains, roman shades, soft natural fabric window treatment, light neutral textiles", image: "/icons/pictogram/scandi/kuhna/resized_Текстиль шторы римские.png" },
      { id: "scandi_kitchen_jute_or_wool_rug", label: "Джутовый/шерстяной ковёр", prompt: "jute rug or wool rug, simple texture, neutral woven rug, Scandinavian floor textile", image: "/icons/pictogram/scandi/kuhna/resized_Джутовый шерстяной ковёр.png" },
      { id: "scandi_kitchen_window_plants", label: "Зелень на подоконнике", prompt: "plants and herbs on windowsill, potted greenery, fresh herbs in kitchen, Scandinavian biophilic touch", image: "/icons/pictogram/scandi/kuhna/resized_Зелень на подоконнике.png" },
      { id: "scandi_kitchen_ceramics_glassware", label: "Керамика и стекло на полках", prompt: "ceramics and glassware on open shelves, simple jars, neutral pottery, clear glass vases, curated shelf styling", image: "/icons/pictogram/scandi/kuhna/resized_Керамика и стекло на полках.png" },
      { id: "scandi_kitchen_light_stone_countertop", label: "Светлая каменная столешница", prompt: "light stone countertop, pale quartz or marble look, subtle veining, calm neutral worktop", image: "/icons/pictogram/scandi/kuhna/resized_светлая каменная столешница.png" },
      { id: "scandi_kitchen_wall_kitchenette", label: "Кухонный гарнитур (настенный)", prompt: "Scandinavian wall-mounted kitchenette, compact white cabinets, fold-down table, space-saving design, minimalist wall unit, isolated on white background, 3d render", image: "/icons/pictogram/scandi/kuhna/resized_gemini-3-pro-image-preview-2k (nano-banana-pro)_b_Кухонный_гарнитур_(н.png" }
    ],
    living: [
      { id: "scandi_living_modular_sofa", label: "Модульный диван (светлая ткань)", prompt: "Scandinavian modular sofa in light gray linen fabric, minimalist design, clean geometric lines, low profile, wooden legs in light oak, cozy cushions, bright living room with large windows, natural daylight, white walls, light wood floor, minimalist decor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Модульный диван (светлая ткань).png" },
      { id: "scandi_living_coffee_table", label: "Кофейный столик (светлое дерево)", prompt: "Scandinavian coffee table made of light oak wood, rectangular shape with tapered legs, minimalist design, natural wood grain, simple clean lines, bright living room, white walls, floor-to-ceiling windows, natural light, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Кофейный столик (светлое дерево).png" },
      { id: "scandi_living_floor_lamp", label: "Напольный торшер (скандинавский)", prompt: "Scandinavian arc floor lamp with minimalist design, matte black metal arched arm, warm LED light, simple round base, clean lines, bright living room with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Напольный торшер (скандинавский).png" },
      { id: "scandi_living_bookshelf", label: "Книжный стеллаж (открытый)", prompt: "Scandinavian open bookshelf in light oak wood, simple rectangular frame, minimal shelves, clean lines, holding books and decorative objects, bright living room, white walls, natural daylight, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Книжный стеллаж (открытый).png" },
      { id: "scandi_living_armchair", label: "Кресло (обивка из льна)", prompt: "Scandinavian armchair with natural linen upholstery, light oak wooden frame, minimalist design, clean lines, comfortable seating, bright living room with large windows, natural light, white walls, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Кресло (обивка из льна).png" },
      { id: "scandi_living_rug", label: "Ковёр (шерсть, нейтральный)", prompt: "Scandinavian wool rug in neutral gray, simple texture, rectangular shape, minimalist design, light wood floor, bright living room, natural daylight, clean aesthetic, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Ковёр (шерсть, нейтральный).png" },
      { id: "scandi_living_side_table", label: "Журнальный столик (круглый)", prompt: "Scandinavian round side table with light oak top, simple tripod base, minimalist design, clean lines, bright living room, white walls, natural light, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Журнальный столик (круглый).png" },
      { id: "scandi_living_wall_shelves", label: "Настенные полки (геометрические)", prompt: "Scandinavian wall-mounted floating shelves in light oak wood, geometric arrangement, minimalist design, clean lines, holding decorative objects, bright living room with natural light, white walls, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Настенные полки (геометрические).png" },
      { id: "scandi_living_plant_stand", label: "Подставка для растений (дерево)", prompt: "Scandinavian plant stand in light oak wood, simple design, multiple levels, minimalist aesthetic, holding green plants, bright living room with natural daylight, white walls, clean lines, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/gostinaya/resized_Подставка для растений (дерево).png" }
    ],
    bathroom: [
      { id: "scandi_bath_floating_vanity", label: "Парящая тумба (светлое дерево)", prompt: "Scandinavian floating bathroom vanity with light oak wood, minimalist design, clean lines, wall-mounted, simple rectangular shape, integrated sink, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/1-Парящая тумба (светлое дерево).png" },
      { id: "scandi_bath_freestanding_tub", label: "Отдельно стоящая ванна овальной формы", prompt: "Scandinavian freestanding oval bathtub, minimalist design, clean lines, simple white finish, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/2-Отдельно стоящая ванна овальной формы.png" },
      { id: "scandi_bath_minimalist_cabinet", label: "Навесной минималистичный шкаф-пенал", prompt: "Scandinavian wall-mounted minimalist cabinet, light oak wood, clean lines, handleless design, simple rectangular shape, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/3-Навесной минималистичный шкаф-пенал.png" },
      { id: "scandi_bath_teak_stool", label: "Табурет из массива тика", prompt: "Scandinavian teak wood stool, minimalist design, clean lines, simple rectangular shape, natural teak finish, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/4-Табурет из массива тика.png" },
      { id: "scandi_bath_integrated_sink", label: "Раковина (интегрированная)", prompt: "Scandinavian integrated sink with vanity, light oak wood, minimalist design, clean lines, simple rectangular shape, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/5-Раковина (интегрированная).png" },
      { id: "scandi_bath_round_mirror_backlit", label: "Круглое зеркало (без рамы, подсветка)", prompt: "Scandinavian round mirror with backlit LED lighting, frameless design, clean lines, simple circular shape, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/6-Круглое зеркало (без рамы, подсветка).png" },
      { id: "scandi_bath_ladder_shelf", label: "Минималистичная лестница (полотенца)", prompt: "Scandinavian minimalist ladder shelf for towels, light oak wood, clean lines, simple ladder design, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/7-Минималистичная лестница (полотенца).png" },
      { id: "scandi_bath_wall_hung_toilet", label: "Унитаз со скрытым бачком (инсталляция)", prompt: "Scandinavian wall-hung toilet with hidden cistern, minimalist design, clean lines, simple white finish, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/8-Унитаз со скрытым бачком (инсталляция).png" },
      { id: "scandi_bath_laundry_dresser", label: "Комод (сортировка белья)", prompt: "Scandinavian laundry dresser with sorting compartments, light oak wood, minimalist design, clean lines, simple rectangular shape, bright bathroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/vannaya/9-Комод (сортировка белья).png" }
    ],
    bedroom: [
      { id: "scandi_bed_simple_solid_wood", label: "Кровать из массива (простая)", prompt: "Scandinavian bed made of solid light wood, minimalist design, clean lines, simple headboard, natural wood grain, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/1-Кровать из массива (простая).png" },
      { id: "scandi_bed_floating_nightstands", label: "Парящие прикроватные тумбы (шпон)", prompt: "Scandinavian floating nightstands with light oak veneer, minimalist design, clean lines, wall-mounted, simple rectangular shape, no visible hardware, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/2-Парящие прикроватные тумбы (шпон).png" },
      { id: "scandi_bed_smooth_wardrobes", label: "Шкафы (гладкие матовые фасады)", prompt: "Scandinavian wardrobes with smooth matte white doors, minimalist design, clean lines, handleless push-to-open, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/3-Шкафы (гладкие матовые фасады).png" },
      { id: "scandi_bed_minimalist_bench", label: "Минималистичная скамья в изножье", prompt: "Scandinavian minimalist bench at foot of bed, light oak wood, simple clean lines, rectangular shape, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/4-Минималистичная скамья в изножье.png" },
      { id: "scandi_bed_floating_vanity", label: "Туалетный столик (парящий)", prompt: "Scandinavian floating vanity table with light oak wood, minimalist design, clean lines, wall-mounted, simple rectangular shape, no visible hardware, soft-close drawers with minimalist pulls, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/5-Туалетный столик (парящий).png" },
      { id: "scandi_bed_reading_chair", label: "Кресло для чтения (эргономичное)", prompt: "Scandinavian ergonomic reading chair, light oak wood frame, simple clean lines, comfortable seating, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/6-Кресло для чтения (эргономичное).png" },
      { id: "scandi_bed_leaning_mirror", label: "Зеркало, прислоненное к стене", prompt: "Scandinavian leaning mirror with light oak wood frame, minimalist design, clean lines, rectangular shape, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/7-Зеркало, прислоненное к стене.png" },
      { id: "scandi_bed_wall_rod", label: "Настенная штанга для одежды", prompt: "Scandinavian wall-mounted clothing rod with light oak wood brackets, minimalist design, clean lines, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/8-Настенная штанга для одежды.png" },
      { id: "scandi_bed_low_dresser", label: "Низкий комод (без ручек)", prompt: "Scandinavian low dresser with light oak wood, minimalist design, clean lines, handleless drawers, bright bedroom with natural light, white walls, light wood floor, photorealistic, high detail, 8k", image: "/icons/pictogram/scandi/spalna/9-Низкий комод (без ручек).png" }
    ]
  }
};

const LIGHT_CATALOG: Partial<Record<StyleId, Partial<Record<RoomId, LightOption[]>>>> = {
  neoclassic: {
    living: [
      {
        id: "neo_living_light_chandelier_set",
        label: "Люстра + бра + торшер/лампы",
        prompt: "multi-arm classic chandelier with fabric shades, matching wall sconces from the same collection, classic floor lamp, table lamps with fabric shades, warm layered practical lighting, brass accents",
        image: "/icons/pictogram/neo/svet/gostinaya/lustra).jpg"
      },
      {
        id: "neo_living_light_cove_molding",
        label: "Линейная подсветка из-за лепнины",
        prompt: "hidden linear LED strip behind ceiling cornice molding, indirect cove lighting, soft perimeter ceiling glow, gentle wall wash light",
        image: "/icons/pictogram/neo/svet/gostinaya/svetlep.jpg"
      },
      {
        id: "neo_living_light_floor_lamp",
        label: "Классический торшер",
        prompt: "classic floor lamp with fabric shade, elegant silhouette, warm ambient pool of light, brass or bronze finish",
        image: "/icons/pictogram/neo/svet/gostinaya/torsher.jpg"
      },
      {
        id: "neo_living_light_bookcase_vitrine",
        label: "Световой книжный шкаф-витрина",
        prompt: "illuminated bookcase vitrine, glass-front display cabinet, internal LED shelf lighting, accent display lighting for books and decor",
        image: "/icons/pictogram/neo/svet/gostinaya/shkaf.jpg"
      },
      {
        id: "neo_living_light_table_lamps_shades",
        label: "Настольные лампы с абажурами",
        prompt: "table lamps with fabric lampshades, classic lamp bases, warm practical lighting on console or side tables",
        image: "/icons/pictogram/neo/svet/gostinaya/nastlampi.jpg"
      },
      {
        id: "neo_living_light_spots",
        label: "Точечный направленный свет",
        prompt: "recessed adjustable ceiling spotlights, directional downlights, accent lighting, clean light beams",
        image: "/icons/pictogram/neo/svet/gostinaya/vstroyka.jpg"
      },
      {
        id: "neo_living_light_backlit_panel",
        label: "Панно",
        prompt: "decorative wall panel in stone or wood, backlit accent panel, perimeter LED contour lighting around the panel, subtle backlighting glow",
        image: "/icons/pictogram/neo/svet/gostinaya/panno.jpg"
      },
      {
        id: "neo_living_light_decor_objects",
        label: "Световой декор",
        prompt: "illuminated decor objects: backlit globe, illuminated map, glowing tabletop, subtle luminous accents, light-up decor",
        image: "/icons/pictogram/neo/svet/gostinaya/глобус.jpg"
      },
      {
        id: "neo_living_light_art_lights",
        label: "Подсветка картин",
        prompt: "directed picture lights above artwork, wall-mounted art lights, gallery accent lighting for paintings and frames",
        image: "/icons/pictogram/neo/svet/gostinaya/podkar.jpg"
      }
    ]
  }
};

export function getFeatureOptions(styleId: string | null, roomId: string | null) {
  const style = (styleId || "") as StyleId;
  const room = (roomId || "") as RoomId;
  const options = CATALOG[style]?.[room];
  return options || [];
}

export function getLightOptions(styleId: string | null, roomId: string | null) {
  const style = (styleId || "") as StyleId;
  const room = (roomId || "") as RoomId;
  const options = LIGHT_CATALOG[style]?.[room];
  return options || [];
}

export function featureIdsToPromptFragments(styleId: string | null, roomId: string | null, raw: string) {
  const ids = raw.split(",").map(value => value.trim()).filter(Boolean);
  if (!ids.length) return [];
  const options = getFeatureOptions(styleId, roomId);
  const map = new Map(options.map(option => [option.id, option]));
  return ids.map(id => {
    const option = map.get(id);
    return option ? option.prompt : id;
  });
}

export function lightIdsToPromptFragments(styleId: string | null, roomId: string | null, raw: string) {
  const ids = raw.split(",").map(value => value.trim()).filter(Boolean);
  if (!ids.length) return [];
  const options = getLightOptions(styleId, roomId);
  const map = new Map(options.map(option => [option.id, option]));
  return ids.map(id => {
    const option = map.get(id);
    return option ? option.prompt : id;
  });
}

export function featureIdsToLabels(styleId: string | null, roomId: string | null, raw: string) {
  const ids = raw.split(",").map(value => value.trim()).filter(Boolean);
  if (!ids.length) return [];
  const options = getFeatureOptions(styleId, roomId);
  const map = new Map(options.map(option => [option.id, option]));
  return ids.map(id => map.get(id)?.label || id);
}

export function lightIdsToLabels(styleId: string | null, roomId: string | null, raw: string) {
  const ids = raw.split(",").map(value => value.trim()).filter(Boolean);
  if (!ids.length) return [];
  const options = getLightOptions(styleId, roomId);
  const map = new Map(options.map(option => [option.id, option]));
  return ids.map(id => map.get(id)?.label || id);
}
