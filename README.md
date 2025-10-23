# test-to-do

# 📌 API Endpoints

Berikut adalah daftar endpoint untuk manajemen **Tasks API**.

| **Method** | **Endpoint**                | **Deskripsi**                                                |
| ---------- | --------------------------- | ------------------------------------------------------------ |
| **GET**    | `/api/tasks`                | Ambil semua tasks                                            |
| **GET**    | `/api/tasks/:id`            | Ambil task berdasarkan ID                                    |
| **GET**    | `/api/tasks/status/:status` | Filter tasks berdasarkan status (`to_do`, `process`, `done`) |
| **GET**    | `/api/tasks/tag/:tagFilter` | tasks berdasarkan tag tertentu                               |
| **GET**    | `/api/tasks/overdue`        | Ambil semua tasks yang sudah lewat deadline                  |
| **GET**    | `/api/tasks/today`          | Ambil tasks dengan deadline hari ini                         |
| **POST**   | `/api/tasks`                | Buat task baru                                               |
| **PUT**    | `/api/tasks/:id`            | Update task lengkap                                          |
| **PATCH**  | `/api/tasks/:id/status`     | Update status task saja                                      |
| **DELETE** | `/api/tasks/:id`            | Hapus task                                                   |

---

## 🧩 Contoh Request dan Response

### 1. Ambil semua tasks

**Request**

```http
GET /api/tasks
```

**Response**

```http
[
  {
    "id": 1,
    "title": "Belajar Express.js",
    "status": "to_do"
  },
  {
    "id": 2,
    "title": "Implementasi API",
    "status": "process"
  }
]
```
