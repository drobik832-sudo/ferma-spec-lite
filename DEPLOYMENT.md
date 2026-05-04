# 🚀 Развертывание и настройка моста к ComfyUI

## 📋 Требования

### Обязательные:
- **Node.js 18+**
- **ComfyUI с моделью Flux**
- **8GB+ VRAM** для оптимальной работы
- **Git** для клонирования репозитория

### Рекомендуемые:
- **16GB+ VRAM** для генерации в 1024x1024
- **SSD диск** для быстрой загрузки моделей
- **Stable интернет** для загрузки больших файлов

## 🛠️ Настройка ComfyUI

### 1. Установка ComfyUI

```bash
# Клонируйте ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Установите зависимости
pip install -r requirements.txt

# Скачайте модель Flux
# Поместите flux1-schnell-Q4_K_S.gguf в папку models/checkpoints
```

### 2. Настройка моделей Flux

Убедитесь, что следующие файлы находятся в папках ComfyUI:

```
ComfyUI/
├── models/
│   ├── checkpoints/
│   │   └── flux1-schnell-Q4_K_S.gguf
│   ├── clip/
│   │   ├── clip_l.safetensors
│   │   └── t5xxl_fp8_e4m3fn.safetensors
│   └── vae/
│       └── ae.safetensors
```

### 3. Запуск ComfyUI

```bash
# Запустите ComfyUI
python main.py --listen 127.0.0.1 --port 8188

# Или с GPU ускорением (рекомендуется)
python main.py --listen 127.0.0.1 --port 8188 --gpu-only
```

Проверьте работу: http://127.0.0.1:8188

## 🌐 Настройка моста

### 1. Клонирование проекта

```bash
git clone https://github.com/[ваш-username]/ferma-spec-lite.git
cd ferma-spec-lite
```

### 2. Конфигурация окружения

Скопируйте файл примера:
```bash
cp .env.example .env.local
```

Отредактируйте `.env.local`:

```env
# URL вашего ComfyUI
NEXT_PUBLIC_COMFY_API_URL=http://127.0.0.1:8188

# Модель Flux (должна совпадать с загруженной)
NEXT_PUBLIC_COMFY_MODEL=flux1-schnell-Q4_K_S.gguf
NEXT_PUBLIC_FLUX_CLIP_1=clip_l.safetensors
NEXT_PUBLIC_FLUX_CLIP_2=t5xxl_fp8_e4m3fn.safetensors
NEXT_PUBLIC_FLUX_VAE=ae.safetensors

# Параметры генерации
NEXT_PUBLIC_FLUX_MAX_SHIFT=1.15
NEXT_PUBLIC_FLUX_BASE_SHIFT=0.5
NEXT_PUBLIC_FLUX_WIDTH=1024
NEXT_PUBLIC_FLUX_HEIGHT=1024

# Система звезд (опционально)
NEXT_PUBLIC_STARS_PER_GENERATION=1
```

### 3. Установка зависимостей

```bash
npm install
```

### 4. Запуск приложения

```bash
# Разработка
npm run dev

# Production
npm run build
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## 🔧 Проверка работы моста

### 1. Проверка API ComfyUI

Откройте в браузере: http://127.0.0.1:8188

Должны быть видны:
- Загруженная модель Flux
- Доступные узлы (nodes)
- Статус системы

### 2. Проверка моста

В приложении откройте консоль разработчика (F12) и проверьте:

- Запросы к `/api/comfy/*` должны проксироваться на ComfyUI
- Отсутствие ошибок CORS
- Корректную загрузку изображений

### 3. Тестовая генерация

1. Выберите стиль и помещение
2. Нажмите "Сгенерировать"
3. Проверьте логи в консоли и в терминале ComfyUI

## 🐳 Docker развертывание

### 1. Сборка образа

```bash
docker build -t ferma-spec-lite .
```

### 2. Запуск с мостом

```bash
# Для локального ComfyUI
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_COMFY_API_URL=http://host.docker.internal:8188 \
  ferma-spec-lite

# Для удаленного ComfyUI
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_COMFY_API_URL=http://your-comfyui-ip:8188 \
  ferma-spec-lite
```

## 🌍 Production развертывание

### 1. Подготовка сервера

```bash
# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Клонирование проекта
git clone https://github.com/[ваш-username]/ferma-spec-lite.git
cd ferma-spec-lite

# Установка зависимостей
npm ci --production
```

### 2. Настройка process manager

```bash
# Установка PM2
npm install -g pm2

# Создание конфигурации
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ferma-spec-lite',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_COMFY_API_URL: 'http://127.0.0.1:8188'
    }
  }]
};
EOF

# Запуск
pm2 start ecosystem.config.js
```

### 3. Настройка Nginx (опционально)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api/comfy/ {
        proxy_pass http://127.0.0.1:8188/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## 🔍 Диагностика проблем

### Проблема: Нет подключения к ComfyUI

**Симптомы:**
- Ошибки в консоли "Failed to fetch"
- Статус генерации не меняется

**Решение:**
1. Проверьте запущен ли ComfyUI:
```bash
curl http://127.0.0.1:8188/system_stats
```

2. Проверьте переменные окружения:
```bash
echo $NEXT_PUBLIC_COMFY_API_URL
```

3. Проверьте файрвол:
```bash
# Разрешите порт 8188
sudo ufw allow 8188
```

### Проблема: Медленная генерация

**Решение:**
1. Уменьшите разрешение:
```env
NEXT_PUBLIC_FLUX_WIDTH=512
NEXT_PUBLIC_FLUX_HEIGHT=512
```

2. Используйте более легкую модель:
```env
NEXT_PUBLIC_COMFY_MODEL=flux1-schnell-fp8.gguf
```

3. Проверьте загрузку GPU:
```bash
nvidia-smi
```

### Проблема: Ошибки памяти

**Симптомы:**
- ComfyUI падает при генерации
- Ошибки CUDA out of memory

**Решение:**
1. Уменьшите batch size в ComfyUI
2. Используйте более низкое разрешение
3. Освободите VRAM:
```bash
# Перезапустите ComfyUI
python main.py --listen 127.0.0.1 --port 8188 --gpu-only --force-fp16
```

## 📊 Мониторинг

### 1. Логи приложения

```bash
# PM2 логи
pm2 logs ferma-spec-lite

# Docker логи
docker logs ferma-spec-lite
```

### 2. Статус системы

Приложение предоставляет эндпоинт для мониторинга:
```
GET /api/admin/health
```

Возвращает статус ComfyUI и системные метрики.

## 🔒 Безопасность

### 1. Ограничение доступа

ComfyUI должен быть доступен только локально:
```bash
python main.py --listen 127.0.0.1 --port 8188
```

### 2. Защита API

В production настройте аутентификацию для API моста.

### 3. HTTPS

Используйте обратный прокси (Nginx) для HTTPS терминирования.

---

**Готово!** Теперь ваш сайт готов к публикации на GitHub и развертыванию с мостом к вашему ComfyUI.
