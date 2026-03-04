
```
aiprediction
├─ backened
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  ├─ migrations
│  │  │  ├─ 20251112165625_init
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20251220132444_update_student_schema
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20251221091054_schema_update
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20251223004335_remove_student_relation
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20251223184938_add_student_analysis
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20251224223118_add_login
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  └─ schema.prisma
│  ├─ readme
│  ├─ script
│  │  └─ createUser.js
│  ├─ server.js
│  └─ src
│     ├─ config
│     │  ├─ cloudinary.js
│     │  └─ prisma.js
│     ├─ controllers
│     │  ├─ aiResultController.js
│     │  ├─ authController.js
│     │  ├─ mentorController.js
│     │  ├─ psycologistController.js
│     │  ├─ studedentResponseController.js
│     │  ├─ studentController.js
│     │  └─ videoResponseController.js
│     └─ routes
│        ├─ aiResultRoutes.js
│        ├─ authRoutes.js
│        ├─ mentorRoutes.js
│        ├─ psycologistRoutes.js
│        ├─ studentResponseRoute.js
│        └─ studentRoutes.js
├─ frontened
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api.js
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ Footer.jsx
│  │  │  └─ Navbar.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ dashboard
│  │  │  │  ├─ CollegePage.jsx
│  │  │  │  ├─ DashboardLayout.jsx
│  │  │  │  ├─ MentorPage.jsx
│  │  │  │  ├─ PsychologistPage.jsx
│  │  │  │  └─ StudentPage.jsx
│  │  │  ├─ Landing.jsx
│  │  │  ├─ Login.jsx
│  │  │  └─ Signup.jsx
│  │  ├─ state
│  │  │  └─ AuthContext.jsx
│  │  └─ supabaseClient.js
│  ├─ vercel.json
│  └─ vite.config.js
├─ ml_service
│  ├─ app.py
│  ├─ Dockerfile
│  ├─ requirements.txt
│  ├─ runtime.txt
│  └─ __pycache__
│     └─ app.cpython-312.pyc
└─ README.md

```

// for creating password manually --
        node scripts/createUser.js <role> <id> <password>

// for backened--
     nodemon server.js

// for prisma on local host --
    npx prisma studio

// for frontened-- npm run dev

// mlservices are uploade on huggingface
