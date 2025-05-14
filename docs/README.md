# Fortune Cookies VTEX IO App

Una aplicación personalizada para VTEX IO que muestra la lista de “galleta de la fortuna” y a la cual se pueden agregar nuevas galletas. 

---

## 🚀 Características

- Obtención de frases desde Master Data (entidad `CF`)
- Agregar nuevas galletas desde el modal
- Eliminar galletas (no finalizado, la mutacion devuelve bad request)

---
## Ver aplicación
Dirigirse al admin del workspace "romanchallenge" e ir a la sección de Apps -> Galletas de la fortuna o en el buscador escribir galletas de la fortuna
[Dirigirse al workspace de romanchallenge](https://romanchallenge--valtech.myvtex.com/admin/fortune-cookies)

---

## 📋 Requisitos

- Node.js ≥ 14
- VTEX Toolbelt (`vtex`)
- Acceso a un workspace en VTEX IO
- Master Data configurado con entidad `CF` y campo `CookieFortune`

---

## ⚙️ Instalación

1. Clona el repositorio:
- `git clone git@github.com:LuisguiRoman/vtex-cookies-admin.git`

---

## Enlaza tu app en un workspace de VTEX:
- `vtex login youraccount`
- `vtex use yourworkspace`
- `vtex link`

---

## Deploy
- `vtex publish`
- `vtex deploy vendor.appname@x.x.x`
- `vtex install vendor.appname@x.x.x`

