# EcoPoint

MVP сервиса поиска пунктов приёма вторсырья и вещей в Саратове.

## Стек
- Frontend: React, TypeScript, Vite
- API: Node.js, TypeScript, Fastify
- Contracts: Zod-схемы и общие типы
- Package manager: pnpm workspaces

## Требования
- Node.js 22+
- pnpm 9+

## Запуск
```bash
pnpm install
pnpm dev
```

Frontend: http://localhost:5173  
API health: http://localhost:3001/health

## Статус
Начальный каркас. База данных, PostGIS, авторизация администратора, импорт OSM и пользовательские сценарии добавляются последовательно по задачам MVP.
