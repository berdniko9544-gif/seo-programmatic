# 🔑 Как получить VERCEL_TOKEN

## Ссылка на создание токена

👉 **https://vercel.com/account/tokens**

## Инструкция

### Шаг 1: Откройте страницу токенов
Перейдите по ссылке: https://vercel.com/account/tokens

### Шаг 2: Создайте новый токен
1. Нажмите **"Create Token"**
2. Введите название: `SEO Satellites Deployment`
3. Выберите Scope: **Full Account** (или выберите конкретные проекты)
4. Expiration: **No Expiration** (или выберите срок)
5. Нажмите **"Create"**

### Шаг 3: Скопируйте токен
⚠️ **ВАЖНО**: Токен показывается только один раз! Скопируйте его сразу.

Токен выглядит примерно так:
```
vercel_1234567890abcdefghijklmnopqrstuvwxyz
```

### Шаг 4: Сохраните токен в .env.local

Создайте файл `.env.local` в корне проекта:

```bash
VERCEL_TOKEN=ваш_токен_здесь
```

Или используйте команду:
```bash
echo VERCEL_TOKEN=ваш_токен_здесь > .env.local
```

### Шаг 5: Запустите передеплой

```bash
redeploy-with-network.bat
```

Или вручную:
```bash
node scripts/vercel-deploy-all.js
```

## Альтернатива: Использовать vercel login

Если не хотите создавать токен, можете авторизоваться через браузер:

```bash
vercel login
```

Выберите метод (GitHub/Email) и подтвердите в браузере.

## Проверка

После авторизации проверьте:
```bash
vercel whoami
```

Должно показать ваш username.

## Безопасность

⚠️ **НЕ КОММИТЬТЕ .env.local В GIT!**

Файл `.env.local` уже добавлен в `.gitignore`, но проверьте:
```bash
git status
```

Если видите `.env.local` в списке - НЕ добавляйте его!

## Что дальше?

После получения токена:
1. ✅ Сохраните в .env.local
2. ✅ Запустите `redeploy-with-network.bat`
3. ✅ Дождитесь завершения (~15-20 минут)
4. ✅ Проверьте результаты в `satellites/vercel-deploy-log.json`
