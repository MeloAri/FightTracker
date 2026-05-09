🥊 FightTracker API

API REST desenvolvida com Spring Boot para gerenciamento de usuários, lutadores e eventos de luta. O sistema permite que usuários se registrem, façam login e sigam seus lutadores favoritos, além de acompanhar eventos futuros.

🚀 Tecnologias utilizadas
Java 21
Spring Boot
Spring Security
JWT (JSON Web Token)
Spring Data JPA
PostgreSQL
Lombok
Maven

📌 Funcionalidades

🔐 Autenticação
Registro de usuário
Login com geração de token JWT
Senhas criptografadas com BCrypt
Rotas protegidas com Spring Security

👤 Usuários
Cadastro e autenticação

🥊 Lutadores
Cadastro e listagem (estrutura preparada)

⭐ Follows (Seguir lutadores)
Usuário pode seguir lutadores
Evita duplicidade de follow
Listagem dos lutadores seguidos

📅 Eventos
Cadastro de eventos de luta
Listagem de eventos futuros

🔔 Notificações (base implementada)
Preparado para notificar usuários que seguem lutadores
