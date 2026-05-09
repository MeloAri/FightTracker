# FightTracker — Frontend Angular

Frontend Angular 17 completo para o FightTracker, integrado com o backend Spring Boot.

---

## 📦 Instalação

```bash
npm install
```

## 🚀 Rodando em desenvolvimento

```bash
npm start
# ou
ng serve
```

Acesse: http://localhost:4200

---

## ⚙️ Configuração da API

Edite o arquivo `src/environments/environment.ts` e ajuste a URL da sua API:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'   // ← altere se necessário
};
```

---

## 🗂 Estrutura do projeto

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts          # Proteção de rotas (authGuard / guestGuard)
│   ├── interceptors/
│   │   └── jwt.interceptor.ts     # Injeta Bearer token em todas as requisições
│   └── services/
│       ├── auth.service.ts        # POST /auth/login | /auth/register
│       ├── fighter.service.ts     # GET /fighters/search | POST /fighters
│       ├── fight.service.ts       # GET /fights (paginado) | /fights/fighter/:id
│       ├── event.service.ts       # GET /events/upcoming | POST /events
│       ├── follow.service.ts      # GET /follows | POST /follows
│       └── toast.service.ts       # Notificações globais
│
├── shared/
│   ├── models/index.ts            # Interfaces TypeScript (espelham DTOs Java)
│   └── components/
│       ├── shell/shell.component.ts   # Layout: sidebar + topbar
│       └── toast/toast.component.ts  # Stack de notificações
│
└── features/
    ├── auth/
    │   ├── login/login.component.ts
    │   ├── register/register.component.ts
    │   └── auth.routes.ts
    ├── dashboard/dashboard.component.ts
    ├── following/following.component.ts
    ├── fighters/fighters.component.ts
    ├── fights/fights.component.ts
    └── events/events.component.ts
```

---

## 🔌 Endpoints do backend utilizados

| Método | Rota                        | Uso                              |
|--------|-----------------------------|----------------------------------|
| POST   | `/auth/register`            | Cadastro de usuário              |
| POST   | `/auth/login`               | Login → retorna JWT              |
| GET    | `/fighters/search?name=`    | Buscar lutadores por nome        |
| POST   | `/fighters`                 | Cadastrar novo lutador           |
| GET    | `/fights?page=&size=`       | Listar lutas paginadas           |
| GET    | `/fights/fighter/:id`       | Lutas de um lutador específico   |
| GET    | `/events/upcoming`          | Próximos eventos                 |
| POST   | `/events`                   | Criar novo evento                |
| GET    | `/follows`                  | Lutadores seguidos pelo usuário  |
| POST   | `/follows`                  | Seguir um lutador                |

> Todas as rotas (exceto `/auth/**`) exigem o header `Authorization: Bearer <token>`  
> O interceptor `jwt.interceptor.ts` injeta isso automaticamente.

---

## 🔐 Autenticação

- O JWT é salvo no `localStorage` após login/registro
- O `authGuard` redireciona para `/auth/login` se não estiver autenticado
- O `guestGuard` redireciona para `/dashboard` se já estiver logado
- O `jwtInterceptor` anexa o token em cada requisição HTTP

---

## 📋 Plano gratuito

- Usuários gratuitos podem seguir até **3 lutadores** (`FREE_FOLLOW_LIMIT = 3`)
- Essa constante está em `src/app/shared/models/index.ts`
- A barra de progresso no sidebar e nas páginas reflete esse limite em tempo real

---

## 🛠 Build para produção

```bash
ng build --configuration production
```

Os arquivos serão gerados em `dist/fighttracker/`.
