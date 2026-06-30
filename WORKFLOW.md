# WORKFLOW

## Запуск базы данных

```bash
docker compose up -d
```

## Переменные окружения

| Переменная    | Тип    | Описание                                                |
| ------------- | ------ | ------------------------------------------------------- |
| PORT          | number | Порт на котором запускается сервер                      |
| CLIENT_ID     | string | ID интеграции amoCRM                                    |
| CLIENT_SECRET | string | Секретный ключ интеграции amoCRM                        |
| REDIRECT_URI  | string | URI редиректа, указанный в настройках интеграции amoCRM |
| DB_HOST       | string | Хост базы данных PostgreSQL                             |
| DB_PORT       | number | Порт базы данных PostgreSQL                             |
| DB_USER       | string | Пользователь базы данных PostgreSQL                     |
| DB_PASSWORD   | string | Пароль базы данных PostgreSQL                           |
| DB_NAME       | string | Название базы данных PostgreSQL                         |

