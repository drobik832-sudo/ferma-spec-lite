# Ferma Design Lite - Система генерации интерьеров

## Обзор

Приложение для генерации интерьеров с использованием AI моделей Flux. Поддерживает различные стили (скандинавский, неоклассический, джапанди, эко) и помещения (кухня, гостиная, спальня, ванная, детская, балкон, прихожая).

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- ComfyUI с моделью Flux
- Git

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/[ваш-username]/ferma-spec-lite.git
cd ferma-spec-lite
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local` с настройками:
```bash
cp .env.example .env.local
```

## 🔧 Настройка моста к ComfyUI

### Шаг 1: Запустите ComfyUI

Убедитесь, что ComfyUI запущен и доступен по адресу `http://127.0.0.1:8188`

### Шаг 2: Настройте переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# ComfyUI Settings
NEXT_PUBLIC_COMFY_API_URL=http://127.0.0.1:8188
NEXT_PUBLIC_COMFY_MODEL=flux1-schnell-Q4_K_S.gguf
NEXT_PUBLIC_FLUX_CLIP_1=clip_l.safetensors
NEXT_PUBLIC_FLUX_CLIP_2=t5xxl_fp8_e4m3fn.safetensors
NEXT_PUBLIC_FLUX_VAE=ae.safetensors
NEXT_PUBLIC_FLUX_MAX_SHIFT=1.15
NEXT_PUBLIC_FLUX_BASE_SHIFT=0.5
NEXT_PUBLIC_FLUX_WIDTH=1024
NEXT_PUBLIC_FLUX_HEIGHT=1024

# Stars (if needed)
NEXT_PUBLIC_STARS_PER_GENERATION=1

# Loading videos (optional)
NEXT_PUBLIC_LOADING_VIDEOS=[]
NEXT_PUBLIC_LOADING_PROVIDER=pixabay
NEXT_PUBLIC_LOADING_QUERY=ai videos
NEXT_PUBLIC_LOADING_INTERVAL_MS=5000
```

### Шаг 3: Запустите приложение

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## 📁 Структура проекта

```
ferma-spec-lite/
├── app/
│   ├── lib/                 # Утилиты и конфигурации
│   │   ├── features.ts       # Описания стилей и элементов
│   │   └── generation/      # Логика генерации
│   ├── components/           # React компоненты
│   └── create/page.tsx      # Основная страница генерации
├── public/
│   └── icons/pictogram/    # Иконки стилей
└── README.md
```

## 🎨 Поддерживаемые стили

- **Скандинавский** - минимализм, светлые тона, натуральные материалы
- **Неоклассический** - роскошь, мрамор, латунь, лепнина
- **Джапанди** - японский минимализм + скандинавский уют
- **Эко** - природные материалы, экологичность

## 🏠 Помещения

- Кухня
- Гостиная  
- Спальня
- Ванная
- Детская
- Балкон
- Прихожая

## 🛋 Дополнительные предметы

Каждый стиль содержит уникальные элементы мебели и декора:

- **Скандинавский:** парящие тумбы, минималистичные шкафы, светлое дерево
- **Неоклассический:** бархатная мебель, каминные порталы, мраморные столики
- **Джапанди:** низкая мебель, натуральное дерево, простые формы
- **Эко:** переработанные материалы, натуральные текстуры

## 💡 Сценарии света

- **День:** естественное освещение, солнечные лучи
- **Ночь:** искусственное освещение, теплая атмосфера, черные окна

## 🚀 Развертывание

### Production

```bash
npm run build
npm start
```

### Docker (опционально)

```bash
docker build -t ferma-spec-lite .
docker run -p 3000:3000 -e NEXT_PUBLIC_COMFY_API_URL=http://host.docker.internal:8188 ferma-spec-lite
```

## 🐛 Устранение неполадок

### Проблема: Нет подключения к ComfyUI

**Решение:**
1. Проверьте, что ComfyUI запущен: `http://127.0.0.1:8188`
2. Проверьте переменную `NEXT_PUBLIC_COMFY_API_URL` в `.env.local`
3. Убедитесь, что модель Flux загружена в ComfyUI

### Проблема: Генерация не запускается

**Решение:**
1. Проверьте консоль браузера на ошибки
2. Проверьте логи ComfyUI
3. Убедитесь, что все файлы модели доступны

### Проблема: Изображения не генерируются

**Решение:**
1. Проверьте VRAM на вашей системе
2. Уменьшите разрешение в `.env.local`: `NEXT_PUBLIC_FLUX_WIDTH=512`
3. Используйте более легкую модель

## 📝 Лицензия

MIT License

## 🤝 Вклад

1. Fork проекта
2. Создайте ветку: `git checkout -b feature/new-feature`
3. Внесите изменения
4. Отправьте: `git push origin feature/new-feature`
5. Создайте Pull Request

## 📞 Поддержка

По вопросам и предложениям:
- Создайте Issue в репозитории
- Свяжитесь с разработчиком

---

**Важно:** Для работы генерации требуется локально запущенный ComfyUI с моделью Flux. Приложение работает как мост между веб-интерфейсом и ComfyUI API.
