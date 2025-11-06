# 🤝 מדריך עבודה משותפת - Zenith CRM

## 📋 מטרה
מדריך זה מיועד לתיאום עבודה בין שני AI assistants (או יותר) שעובדים על אותו פרויקט במקביל.

---

## 🎯 האסטרטגיה המומלצת: Git Workflow עם Branches

### הגישה הטובה ביותר:
כל AI עובד על **branch נפרד**, ואז עושים merge מסודר.

---

## 📐 מבנה Branches

```
main (production-ready)
├── feature/backend-api           ← AI #1 עובד כאן
├── feature/google-integration    ← AI #2 עובד כאן  
├── feature/state-management      ← AI #1 עובד כאן
├── feature/ai-enhancements       ← AI #2 עובד כאן
└── feature/testing-setup         ← כל AI יכול
```

---

## 🔄 Workflow מומלץ - Step by Step

### **שלב 0: הכנה ראשונית (פעם אחת בלבד)**

**AI #1 (הנוכחי - אני) יוצר:**
```bash
cd /home/user/webapp

# 1. צור COLLABORATION_GUIDE.md (מסמך זה)
# 2. צור TASKS.md - רשימת משימות מפורטת
# 3. Commit ל-main
git add COLLABORATION_GUIDE.md TASKS.md NEXT_ITERATION_PLAN.md
git commit -m "docs: Add collaboration guide and task breakdown"
git push origin main
```

---

### **שלב 1: AI #1 מתחיל עבודה על Backend**

```bash
# צור branch חדש
git checkout -b feature/backend-api

# עבוד על הקבצים:
# - צור /server directory
# - התקן dependencies
# - צור basic server.ts

# Commit בתוך ה-branch
git add .
git commit -m "feat(backend): Initialize Express server with basic routes"
git push origin feature/backend-api

# חזור ל-main כדי שה-AI השני יתחיל עבודה נקייה
git checkout main
```

**Status Update ב-TASKS.md:**
```markdown
## ✅ הושלם (AI #1)
- [x] Backend basic setup
- [x] Express server initialized
- [x] Dependencies installed

## 🔄 בתהליך (AI #1)
- [ ] Database schema
- [ ] Auth middleware

## 📌 ממתין (AI #2)
- [ ] Google OAuth setup
- [ ] Gmail integration
```

---

### **שלב 2: AI #2 מתחיל עבודה על Google Integration**

**האם השני נכנס ועושה:**
```bash
# Pull את העדכונים האחרונים
git pull origin main

# צור branch חדש לעבודה שלו
git checkout -b feature/google-integration

# עבוד על:
# - Google OAuth config
# - Gmail service
# - Calendar service

# Commit
git add .
git commit -m "feat(google): Add Gmail and Calendar integration services"
git push origin feature/google-integration

# חזור ל-main
git checkout main
```

**Status Update ב-TASKS.md:**
```markdown
## ✅ הושלם (AI #2)
- [x] Google OAuth2 config
- [x] Gmail service created
- [x] Calendar service created

## 🔄 בתהליך (AI #2)
- [ ] Drive integration
- [ ] Sheets integration
```

---

### **שלב 3: Merge המשותף (אתה או AI מנהל)**

כשה-features מוכנים, עושים merge:

```bash
# Merge branch של Backend
git checkout main
git merge feature/backend-api
git push origin main

# Merge branch של Google Integration
git merge feature/google-integration

# אם יש conflicts - פותרים אותם
# בעדיפות לקוד החדש יותר
git push origin main
```

---

## 📝 קובץ TASKS.md - Task Tracking

**צור קובץ `TASKS.md` עם breakdown מפורט:**

```markdown
# 🎯 Zenith CRM - Task Breakdown

## Sprint 1: Foundation (Week 1)

### Backend Setup
- [ ] **Task 1.1:** Initialize Express server (AI #1) 
  - Branch: `feature/backend-api`
  - Files: `/server/src/server.ts`
  - Status: 🔄 In Progress
  - Assigned: AI #1
  
- [ ] **Task 1.2:** Database schema (AI #1)
  - Branch: `feature/backend-api`
  - Files: `/server/src/config/database.config.ts`
  - Status: 📌 Pending
  - Assigned: AI #1

- [ ] **Task 1.3:** Environment setup (AI #1 or #2)
  - Branch: `feature/backend-api`
  - Files: `/server/.env.example`, `.env.local`
  - Status: 📌 Pending
  - Assigned: Anyone

### Security
- [ ] **Task 1.4:** Input validation with Zod (AI #1)
  - Branch: `feature/backend-api`
  - Files: `/server/src/schemas/*.ts`
  - Status: 📌 Pending
  
- [ ] **Task 1.5:** Auth middleware (AI #1)
  - Branch: `feature/backend-api`
  - Files: `/server/src/middleware/auth.middleware.ts`
  - Status: 📌 Pending

---

## Sprint 2: Google Integration (Week 2)

### Google OAuth
- [ ] **Task 2.1:** OAuth2 config (AI #2)
  - Branch: `feature/google-integration`
  - Files: `/server/src/config/google.config.ts`
  - Status: 📌 Pending
  - Assigned: AI #2

### Gmail Integration
- [ ] **Task 2.2:** EmailService class (AI #2)
  - Branch: `feature/google-integration`
  - Files: `/server/src/services/emailService.ts`
  - Status: 📌 Pending
  - Assigned: AI #2
  - Dependencies: Task 2.1

### Calendar Integration
- [ ] **Task 2.3:** CalendarService class (AI #2)
  - Branch: `feature/google-integration`
  - Files: `/server/src/services/calendarService.ts`
  - Status: 📌 Pending
  - Assigned: AI #2
  - Dependencies: Task 2.1

### Drive Integration
- [ ] **Task 2.4:** DriveService class (AI #2)
  - Branch: `feature/google-integration`
  - Files: `/server/src/services/driveService.ts`
  - Status: 📌 Pending
  - Assigned: AI #2

### Sheets Integration
- [ ] **Task 2.5:** SheetsService class (AI #2)
  - Branch: `feature/google-integration`
  - Files: `/server/src/services/sheetsService.ts`
  - Status: 📌 Pending
  - Assigned: AI #2

### Docs Integration
- [ ] **Task 2.6:** DocsService class (AI #2)
  - Branch: `feature/google-integration`
  - Files: `/server/src/services/docsService.ts`
  - Status: 📌 Pending
  - Assigned: AI #2

### Workflow Automation
- [ ] **Task 2.7:** Google Controller with automation (AI #2)
  - Branch: `feature/google-integration`
  - Files: `/server/src/controllers/googleController.ts`
  - Status: 📌 Pending
  - Assigned: AI #2
  - Dependencies: Tasks 2.2-2.6

---

## Sprint 3: Frontend & AI (Week 3)

### State Management
- [ ] **Task 3.1:** Context API setup (AI #1)
  - Branch: `feature/state-management`
  - Files: `/src/contexts/CRMContext.tsx`
  - Status: 📌 Pending
  - Assigned: AI #1

- [ ] **Task 3.2:** Custom hooks (AI #1)
  - Branch: `feature/state-management`
  - Files: `/src/hooks/*.ts`
  - Status: 📌 Pending

### AI Enhancements
- [ ] **Task 3.3:** Enhanced GeminiService (AI #2)
  - Branch: `feature/ai-enhancements`
  - Files: `/server/src/services/geminiService.ts`
  - Status: 📌 Pending
  - Assigned: AI #2

- [ ] **Task 3.4:** Email draft generation (AI #2)
  - Branch: `feature/ai-enhancements`
  - Files: Update `geminiService.ts`
  - Status: 📌 Pending

- [ ] **Task 3.5:** Lead scoring (AI #2)
  - Branch: `feature/ai-enhancements`
  - Status: 📌 Pending

### Frontend Integration
- [ ] **Task 3.6:** Connect AnalysisModal to backend (AI #1)
  - Branch: `feature/frontend-integration`
  - Files: `/src/components/AnalysisModal.tsx`
  - Status: 📌 Pending
  - Dependencies: Tasks 2.7, 3.3

---

## Sprint 4: Testing & Polish (Week 4)

### Testing
- [ ] **Task 4.1:** Vitest setup (AI #1 or #2)
  - Branch: `feature/testing-setup`
  - Files: `vitest.config.ts`, `/tests/setup.ts`
  - Status: 📌 Pending

- [ ] **Task 4.2:** Unit tests for components (AI #1)
  - Branch: `feature/testing-setup`
  - Files: `/tests/unit/*.test.tsx`
  - Status: 📌 Pending

- [ ] **Task 4.3:** API endpoint tests (AI #2)
  - Branch: `feature/testing-setup`
  - Files: `/server/tests/*.test.ts`
  - Status: 📌 Pending

### Documentation
- [ ] **Task 4.4:** Update README (AI #1 or #2)
  - Branch: `feature/documentation`
  - Files: `README.md`
  - Status: 📌 Pending

- [ ] **Task 4.5:** API documentation (AI #2)
  - Branch: `feature/documentation`
  - Files: `API_DOCS.md`
  - Status: 📌 Pending

---

## 📊 Progress Dashboard

**Overall Progress:** 0/30 tasks (0%)

**By AI:**
- AI #1: 0/12 tasks
- AI #2: 0/15 tasks
- Either: 0/3 tasks

**By Status:**
- ✅ Completed: 0
- 🔄 In Progress: 0
- 📌 Pending: 30
- ⚠️ Blocked: 0

**By Sprint:**
- Sprint 1 (Foundation): 0/5 tasks
- Sprint 2 (Google): 0/7 tasks
- Sprint 3 (Frontend/AI): 0/6 tasks
- Sprint 4 (Testing): 0/5 tasks
```

---

## 🔑 עקרונות מנחים לשני ה-AIs

### ✅ DO:
1. **תמיד pull לפני עבודה חדשה**
   ```bash
   git pull origin main
   ```

2. **צור branch ייעודי לכל feature**
   ```bash
   git checkout -b feature/descriptive-name
   ```

3. **Commit messages ברורים**
   ```bash
   git commit -m "feat(backend): Add Express server setup"
   git commit -m "fix(google): Fix OAuth2 token refresh"
   git commit -m "docs(tasks): Update task status"
   ```

4. **עדכן את TASKS.md אחרי כל עבודה**
   - שנה status מ-📌 ל-🔄 כשמתחיל
   - שנה status מ-🔄 ל-✅ כשגומר

5. **Push את ה-branch שלך**
   ```bash
   git push origin feature/your-branch-name
   ```

6. **תעד בהערות מה עשית**
   ```typescript
   /**
    * 🤖 AI #2 - 2025-11-06
    * Created Gmail integration service
    * Implements: sendAutoReply, createDraft, getRecentMessages
    */
   export class EmailService {
     // ...
   }
   ```

### ❌ DON'T:
1. **אל תעבוד ישירות על main** (חוץ מ-docs קטנים)
2. **אל תמחק קוד של AI אחר** בלי סיבה טובה
3. **אל תעבוד על אותו קובץ בו-זמנית** (תאם מראש)
4. **אל תשכח לעדכן TASKS.md**

---

## 🔄 Conflict Resolution Protocol

כשיש conflict בין שני branches:

### אופן 1: Merge עם עדיפות לקוד החדש יותר
```bash
git checkout main
git merge feature/backend-api    # AI #1
git merge feature/google-integration  # AI #2

# אם יש conflict:
git status  # ראה אילו קבצים
# פתור ידנית או בעזרת AI
git add .
git commit -m "merge: Resolve conflicts between backend and google features"
```

### אופן 2: Rebase (למתקדמים)
```bash
git checkout feature/google-integration
git rebase main
# פתור conflicts
git add .
git rebase --continue
```

---

## 📢 תקשורת בין AIs

### דרך 1: TASKS.md עם Comments
```markdown
- [x] **Task 2.1:** OAuth2 config
  - ✅ Done by AI #2
  - 💬 Note: Token refresh implemented, expires after 1 hour
  - 🔗 Files: `/server/src/config/google.config.ts`
```

### דרך 2: GIT_LOG.md
צור קובץ `GIT_LOG.md`:
```markdown
# Git Activity Log

## 2025-11-06

### AI #1
- ✅ Created backend server setup
- ✅ Added Express routes structure
- 🔄 Working on database schema
- Branch: `feature/backend-api`

### AI #2
- ✅ Configured Google OAuth2
- ✅ Implemented EmailService
- 📌 Next: CalendarService
- Branch: `feature/google-integration`
```

### דרך 3: Commit Messages מפורטים
```bash
git commit -m "feat(backend): Add database schema

- Created users, contacts, deals, tasks tables
- Added foreign key constraints
- Implemented initDatabase function

AI #1 - Ready for AI #2 to add Google token fields"
```

---

## 🎯 תרחיש לדוגמה: יום עבודה טיפוסי

### בוקר - AI #1 (אני)
```bash
# התחל את היום
cd /home/user/webapp
git pull origin main
git checkout -b feature/backend-api

# עבוד 2-3 שעות
# צור server setup + database

# סיים את המשמרת
git add .
git commit -m "feat(backend): Complete backend foundation

- Express server with routes
- SQLite database with schema
- Auth middleware skeleton

Next steps for AI #2:
- Can now add Google services
- Database has users table ready for google_tokens"

git push origin feature/backend-api

# עדכן TASKS.md
# עדכן GIT_LOG.md

git checkout main
```

### אחר צהריים - AI #2 (השני)
```bash
# התחל עבודה
cd /home/user/webapp
git pull origin main
git checkout -b feature/google-integration

# עבוד 2-3 שעות
# צור Google services

# סיים
git add .
git commit -m "feat(google): Complete Google Workspace integration

- OAuth2 configuration
- EmailService, CalendarService, DriveService
- SheetsService, DocsService
- Workflow automation endpoint

Ready to merge with backend (feature/backend-api)"

git push origin feature/google-integration

# עדכן TASKS.md
# עדכן GIT_LOG.md

git checkout main
```

### ערב - Merge Together (אתה או AI מנהל)
```bash
git checkout main
git merge feature/backend-api
git merge feature/google-integration

# אם הכל OK:
git push origin main

# עכשיו שני ה-AIs יכולים להמשיך על בסיס משותף!
```

---

## 📊 Dashboard - Quick Status View

**צור `STATUS.md` עם סטטוס real-time:**

```markdown
# 📊 Project Status - Updated: 2025-11-06 14:30

## 🚀 Current Sprint: Foundation (Week 1)

### Progress
- Overall: ██████░░░░░░░░░░ 30%
- Backend: ████████░░░░░░░░ 40%
- Google: ██░░░░░░░░░░░░░░ 10%
- Frontend: ░░░░░░░░░░░░░░░░ 0%

### Active Branches
- `feature/backend-api` (AI #1) - 🔄 In Progress
- `feature/google-integration` (AI #2) - 📌 Ready to Start

### Next Merge
- Target: Friday EOD
- Branches: backend-api + google-integration

### Blockers
- None currently

### Communication
- Last sync: Today 10:00 AM
- Next sync: Tomorrow 10:00 AM
```

---

## 🛠️ Tools & Commands חשובים

### בדיקת מצב
```bash
# ראה את כל ה-branches
git branch -a

# ראה commits אחרונים
git log --oneline -10

# ראה מה השתנה
git diff main..feature/backend-api

# ראה מי עשה מה
git log --all --pretty=format:"%h %an %s" --since="1 week ago"
```

### ניקיון
```bash
# מחק branches מקומיים שכבר merge
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# עדכן branches מרוחקים
git fetch --prune
```

---

## ✅ Checklist לפני Merge

לפני כל merge, ודא:

- [ ] כל ה-tests עוברים
- [ ] אין console.errors
- [ ] הקוד מתועד (comments + JSDoc)
- [ ] TASKS.md מעודכן
- [ ] אין סודות או API keys בקוד
- [ ] package.json מעודכן (dependencies)
- [ ] README מעודכן אם צריך

---

## 🎓 סיכום - Best Practices

1. **Branch per feature** - כל משימה בbranch נפרד
2. **Frequent commits** - commit קטנים וברורים
3. **Update TASKS.md** - תמיד לעדכן את הסטטוס
4. **Communicate** - השאר הערות לAI השני
5. **Pull before work** - תמיד pull לפני עבודה חדשה
6. **Test before merge** - ודא שהכל עובד
7. **Document changes** - הסבר מה עשית ולמה

---

## 🚀 Ready to Start?

**AI #1 (אני) יכול להתחיל עם:**
```bash
# צור את קבצי התיאום
git add COLLABORATION_GUIDE.md TASKS.md STATUS.md
git commit -m "docs: Add collaboration framework for multi-AI development"
git push origin main

# התחל את Backend
git checkout -b feature/backend-api
# ... עבודה ...
```

**AI #2 (השני) יכול לקרוא:**
1. `COLLABORATION_GUIDE.md` (זה!)
2. `TASKS.md` - לראות מה לעשות
3. `STATUS.md` - לראות את המצב
4. `NEXT_ITERATION_PLAN.md` - התכנית המלאה

ואז להתחיל עם ה-feature שלו!

---

**בהצלחה! 🎉**
