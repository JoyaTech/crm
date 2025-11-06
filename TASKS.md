# 🎯 Zenith CRM - Task Breakdown & Tracking

**Last Updated:** 2025-11-06  
**Project Status:** 📌 Planning → Development  
**Team:** Multi-AI Development (AI #1 + AI #2)

---

## 📊 Progress Overview

| Sprint | Tasks | Completed | In Progress | Pending | Progress |
|--------|-------|-----------|-------------|---------|----------|
| Sprint 1: Foundation | 5 | 0 | 0 | 5 | 0% |
| Sprint 2: Google Integration | 7 | 0 | 0 | 7 | 0% |
| Sprint 3: Frontend & AI | 6 | 0 | 0 | 6 | 0% |
| Sprint 4: Testing & Polish | 7 | 0 | 0 | 7 | 0% |
| **TOTAL** | **25** | **0** | **0** | **25** | **0%** |

---

## 🔴 Sprint 1: Foundation & Security (Week 1)

**Goal:** Establish backend API, database, and security measures  
**Duration:** 8-10 hours  
**Branch prefix:** `feature/backend-*`

### Task 1.1: Initialize Backend Server ⚡ **HIGH PRIORITY**
- **ID:** TASK-1.1
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/backend-api`
- **Estimated:** 1.5 hours
- **Dependencies:** None

**Description:**
Set up Express.js server with TypeScript, basic middleware, and route structure.

**Acceptance Criteria:**
- [ ] `/server` directory created with proper structure
- [ ] Express app initialized with TypeScript
- [ ] Basic middleware: helmet, cors, body-parser
- [ ] Health check endpoint: `GET /api/health`
- [ ] Server runs on port 3001
- [ ] `package.json` with all dependencies

**Files to Create:**
```
/server
  /src
    - server.ts
    /routes
      - index.ts
    /middleware
      - errorHandler.middleware.ts
    /config
      - server.config.ts
  - package.json
  - tsconfig.json
```

**Testing:**
```bash
curl http://localhost:3001/api/health
# Expected: {"status": "ok", "timestamp": "..."}
```

---

### Task 1.2: Database Setup (SQLite)
- **ID:** TASK-1.2
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/backend-api`
- **Estimated:** 2 hours
- **Dependencies:** TASK-1.1

**Description:**
Create SQLite database with schema for users, contacts, deals, tasks, inquiries, activities.

**Acceptance Criteria:**
- [ ] `better-sqlite3` installed and configured
- [ ] Database schema created (all 6 tables)
- [ ] Foreign key constraints enabled
- [ ] `initDatabase()` function works
- [ ] Migration system optional but recommended

**Files to Create:**
```
/server/src/config/database.config.ts
/server/data/crm.db (auto-generated)
```

**Schema Tables:**
- users (id, email, password_hash, name, google_id, tokens, timestamps)
- contacts (id, first_name, last_name, email, phone, company, etc.)
- deals (id, name, amount, stage, probability, etc.)
- tasks (id, title, status, priority, due_date, etc.)
- inquiries (id, name, email, message, ai_analysis, etc.)
- activities (id, user_id, entity_type, entity_id, action, etc.)

**Testing:**
```typescript
// Should pass:
const db = require('./config/database.config');
db.initDatabase();
console.log('✅ Database initialized successfully');
```

---

### Task 1.3: Environment Variables Setup
- **ID:** TASK-1.3
- **Assigned:** AI #1 or AI #2 (whoever starts first)
- **Status:** 📌 Pending
- **Branch:** `feature/backend-api` or `feature/google-integration`
- **Estimated:** 0.5 hours
- **Dependencies:** TASK-1.1

**Description:**
Create `.env.example` files for both frontend and backend with all required variables.

**Acceptance Criteria:**
- [ ] `/server/.env.example` created
- [ ] `/.env.local` example documented in README
- [ ] `dotenv` configured in server.ts
- [ ] All variables documented with descriptions

**Files to Create:**
```
/server/.env.example
/.env.local (git-ignored, user creates manually)
```

**Required Variables:**
```bash
# Backend (.env.example)
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=./data/crm.db
GEMINI_API_KEY=your_key_here
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Frontend (.env.local)
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

### Task 1.4: Input Validation (Zod Schemas)
- **ID:** TASK-1.4
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/backend-api`
- **Estimated:** 2 hours
- **Dependencies:** TASK-1.2

**Description:**
Create Zod validation schemas for all entities and validation middleware.

**Acceptance Criteria:**
- [ ] `zod` installed
- [ ] Schemas created: Contact, Deal, Task, Inquiry, User
- [ ] Validation middleware created
- [ ] Error messages in Hebrew when needed
- [ ] Type inference working (`z.infer<>`)

**Files to Create:**
```
/server/src/schemas/contact.schema.ts
/server/src/schemas/deal.schema.ts
/server/src/schemas/task.schema.ts
/server/src/schemas/inquiry.schema.ts
/server/src/schemas/user.schema.ts
/server/src/middleware/validation.middleware.ts
```

**Example Schema:**
```typescript
export const ContactSchema = z.object({
  firstName: z.string().min(1, 'שם פרטי חובה').max(50),
  lastName: z.string().min(1, 'שם משפחה חובה').max(50),
  email: z.string().email('אימייל לא תקין'),
  phone: z.string().regex(/^[0-9\-\+\(\)\s]+$/),
  // ...
});
```

---

### Task 1.5: Authentication Middleware & JWT
- **ID:** TASK-1.5
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/backend-api`
- **Estimated:** 2 hours
- **Dependencies:** TASK-1.2, TASK-1.3

**Description:**
Implement JWT-based authentication middleware and helper functions.

**Acceptance Criteria:**
- [ ] `jsonwebtoken` installed
- [ ] `bcryptjs` installed for password hashing
- [ ] `authMiddleware` protects routes
- [ ] Token generation/verification functions
- [ ] Refresh token logic optional

**Files to Create:**
```
/server/src/middleware/auth.middleware.ts
/server/src/utils/jwt.utils.ts
/server/src/utils/password.utils.ts
```

**Testing:**
```bash
# Should fail without token:
curl http://localhost:3001/api/contacts
# Expected: 401 Unauthorized

# Should work with token:
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/contacts
# Expected: 200 OK
```

---

## 🟡 Sprint 2: Google Workspace Integration (Week 2)

**Goal:** Connect to all Google Workspace APIs  
**Duration:** 10-12 hours  
**Branch prefix:** `feature/google-*`

### Task 2.1: Google OAuth2 Configuration ⚡ **HIGH PRIORITY**
- **ID:** TASK-2.1
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/google-integration`
- **Estimated:** 1.5 hours
- **Dependencies:** TASK-1.3 (env variables)

**Description:**
Set up Google OAuth2 client with all required scopes for Workspace APIs.

**Acceptance Criteria:**
- [ ] `googleapis` package installed
- [ ] OAuth2 client configured
- [ ] All scopes defined (Gmail, Calendar, Drive, Sheets, Docs)
- [ ] `getAuthUrl()` function works
- [ ] Token refresh mechanism implemented

**Files to Create:**
```
/server/src/config/google.config.ts
```

**Required Scopes:**
- userinfo.email, userinfo.profile
- gmail.readonly, gmail.send, gmail.compose
- calendar, calendar.events
- drive, drive.file
- spreadsheets
- documents

**Testing:**
```typescript
const { getAuthUrl } = require('./config/google.config');
console.log(getAuthUrl());
// Should print valid OAuth URL
```

---

### Task 2.2: Gmail Integration Service
- **ID:** TASK-2.2
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/google-integration`
- **Estimated:** 2 hours
- **Dependencies:** TASK-2.1

**Description:**
Create EmailService class with methods for sending emails, creating drafts, reading messages.

**Acceptance Criteria:**
- [ ] `EmailService` class created
- [ ] `sendAutoReply(to, subject, body)` method
- [ ] `createDraft(to, subject, body)` method
- [ ] `getRecentMessages(maxResults)` method
- [ ] HTML email support
- [ ] Error handling for API failures

**Files to Create:**
```
/server/src/services/emailService.ts
```

**Methods:**
```typescript
class EmailService {
  async sendAutoReply(to: string, subject: string, body: string): Promise<void>
  async createDraft(to: string, subject: string, body: string): Promise<string>
  async getRecentMessages(maxResults: number): Promise<any[]>
}
```

---

### Task 2.3: Google Calendar Integration Service
- **ID:** TASK-2.3
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/google-integration`
- **Estimated:** 2 hours
- **Dependencies:** TASK-2.1

**Description:**
Create CalendarService class for managing meetings and availability.

**Acceptance Criteria:**
- [ ] `CalendarService` class created
- [ ] `createMeeting()` with Google Meet link
- [ ] `getUpcomingEvents()` method
- [ ] `findAvailableSlots()` method
- [ ] Timezone handling (Asia/Jerusalem)
- [ ] Email invitations sent automatically

**Files to Create:**
```
/server/src/services/calendarService.ts
```

**Methods:**
```typescript
class CalendarService {
  async createMeeting(params: MeetingParams): Promise<MeetingResult>
  async getUpcomingEvents(maxResults: number): Promise<Event[]>
  async findAvailableSlots(startDate: string, endDate: string): Promise<Slot[]>
}
```

---

### Task 2.4: Google Drive Integration Service
- **ID:** TASK-2.4
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/google-integration`
- **Estimated:** 2 hours
- **Dependencies:** TASK-2.1

**Description:**
Create DriveService class for folder management and file sharing.

**Acceptance Criteria:**
- [ ] `DriveService` class created
- [ ] `createFolder(name, parentId?)` method
- [ ] `shareFolder(folderId, email, role)` method
- [ ] `uploadFile(name, content, folderId?)` method
- [ ] Proper permissions handling
- [ ] Email notifications on share

**Files to Create:**
```
/server/src/services/driveService.ts
```

---

### Task 2.5: Google Sheets Integration Service
- **ID:** TASK-2.5
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/google-integration`
- **Estimated:** 1.5 hours
- **Dependencies:** TASK-2.1

**Description:**
Create SheetsService class for data logging and tracking.

**Acceptance Criteria:**
- [ ] `SheetsService` class created
- [ ] `createTrackingSheet(title)` method
- [ ] `logInquiry(sheetId, data)` method
- [ ] `readSheet(sheetId, range)` method
- [ ] RTL support for Hebrew text
- [ ] Cell formatting

**Files to Create:**
```
/server/src/services/sheetsService.ts
```

---

### Task 2.6: Google Docs Integration Service
- **ID:** TASK-2.6
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/google-integration`
- **Estimated:** 1 hour
- **Dependencies:** TASK-2.1

**Description:**
Create DocsService class for document creation and summaries.

**Acceptance Criteria:**
- [ ] `DocsService` class created
- [ ] `createSummaryDoc(title, content)` method
- [ ] Markdown-like formatting support
- [ ] RTL support for Hebrew

**Files to Create:**
```
/server/src/services/docsService.ts
```

---

### Task 2.7: Google Workflow Automation Controller ⭐ **CRITICAL**
- **ID:** TASK-2.7
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/google-integration`
- **Estimated:** 2.5 hours
- **Dependencies:** TASK-2.2, TASK-2.3, TASK-2.4, TASK-2.5, TASK-2.6

**Description:**
Create the main workflow automation endpoint that orchestrates all Google services.

**Acceptance Criteria:**
- [ ] `googleController.ts` created
- [ ] `automateInquiryWorkflow()` endpoint
- [ ] Calls all services based on AI analysis
- [ ] Proper error handling per service
- [ ] Returns detailed results object
- [ ] Logs all actions to activities table

**Files to Create:**
```
/server/src/controllers/googleController.ts
/server/src/routes/google.routes.ts
```

**Endpoint:**
```
POST /api/google/automate-inquiry
Body: { inquiry, analysis, actions }
Response: { success, results: { email, calendar, drive, sheets, docs } }
```

**This is the KILLER FEATURE! 🎯**

---

## 🟢 Sprint 3: Frontend Integration & AI Enhancements (Week 3)

**Goal:** Connect frontend to backend, enhance AI capabilities  
**Duration:** 8-10 hours  
**Branch prefix:** `feature/frontend-*` or `feature/ai-*`

### Task 3.1: State Management (Context API)
- **ID:** TASK-3.1
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/state-management`
- **Estimated:** 2.5 hours
- **Dependencies:** Sprint 1 completed

**Description:**
Implement Context API for global state management.

**Acceptance Criteria:**
- [ ] `CRMContext` created
- [ ] `CRMProvider` wraps app
- [ ] `useCRM()` custom hook
- [ ] Manages: contacts, deals, tasks, inquiries
- [ ] API calls integrated
- [ ] Loading and error states

**Files to Create:**
```
/src/contexts/CRMContext.tsx
/src/contexts/AuthContext.tsx (optional)
```

---

### Task 3.2: Custom Hooks
- **ID:** TASK-3.2
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/state-management`
- **Estimated:** 1 hour
- **Dependencies:** None

**Description:**
Create reusable custom hooks for common operations.

**Acceptance Criteria:**
- [ ] `useDebounce` hook
- [ ] `useLocalStorage` hook
- [ ] `useFetch` hook (optional)
- [ ] `useToast` hook (optional)

**Files to Create:**
```
/src/hooks/useDebounce.ts
/src/hooks/useLocalStorage.ts
```

---

### Task 3.3: Enhanced Gemini Service
- **ID:** TASK-3.3
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/ai-enhancements`
- **Estimated:** 2 hours
- **Dependencies:** TASK-1.1

**Description:**
Enhance the existing Gemini service with more AI features.

**Acceptance Criteria:**
- [ ] Move AI logic from frontend to backend
- [ ] Enhanced `analyzeInquiry()` with more fields
- [ ] Add sentiment analysis
- [ ] Add urgency detection
- [ ] Add estimated deal value
- [ ] Add probability scoring

**Files to Create/Update:**
```
/server/src/services/geminiService.ts (enhance existing)
```

---

### Task 3.4: AI Email Draft Generation
- **ID:** TASK-3.4
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/ai-enhancements`
- **Estimated:** 1.5 hours
- **Dependencies:** TASK-3.3

**Description:**
Add AI-powered email draft generation with customizable tone and context.

**Acceptance Criteria:**
- [ ] `generateEmailDraft()` method in GeminiService
- [ ] Supports: formal, casual, friendly tones
- [ ] Bilingual: Hebrew + English
- [ ] Context-aware (previous conversations)
- [ ] Returns: subject, body, CTA

**Endpoint:**
```
POST /api/ai/generate-email-draft
Body: { context, tone, language, recipientName }
Response: { subject, body, cta }
```

---

### Task 3.5: AI Next Best Action & Lead Scoring
- **ID:** TASK-3.5
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/ai-enhancements`
- **Estimated:** 2 hours
- **Dependencies:** TASK-3.3

**Description:**
AI suggests next best action for deals and scores leads automatically.

**Acceptance Criteria:**
- [ ] `suggestNextAction()` method
- [ ] `scoreLead()` method (0-100)
- [ ] Considers deal stage, last activity, history
- [ ] Returns reasoning and timing

**Endpoints:**
```
POST /api/ai/suggest-next-action
POST /api/ai/score-lead
```

---

### Task 3.6: Frontend-Backend Integration
- **ID:** TASK-3.6
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/frontend-integration`
- **Estimated:** 2.5 hours
- **Dependencies:** TASK-3.1, TASK-2.7

**Description:**
Connect all frontend components to backend APIs.

**Acceptance Criteria:**
- [ ] `AnalysisModal` calls backend for analysis
- [ ] Workflow automation button actually works
- [ ] All CRUD operations use API
- [ ] Error handling with toast notifications
- [ ] Loading states everywhere
- [ ] Remove mock data from frontend

**Files to Update:**
```
/src/components/AnalysisModal.tsx
/src/components/ContactModal.tsx
/src/components/InboxView.tsx
/src/App.tsx
```

---

## 📦 Sprint 4: Testing, Documentation & Polish (Week 4)

**Goal:** Production-ready with tests and docs  
**Duration:** 6-8 hours  
**Branch prefix:** `feature/testing-*` or `feature/docs-*`

### Task 4.1: Testing Setup (Vitest)
- **ID:** TASK-4.1
- **Assigned:** AI #1 or AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/testing-setup`
- **Estimated:** 1 hour
- **Dependencies:** None

**Acceptance Criteria:**
- [ ] `vitest` installed
- [ ] `@testing-library/react` installed
- [ ] `vitest.config.ts` created
- [ ] `/tests` directory structure
- [ ] Test scripts in package.json

**Files to Create:**
```
vitest.config.ts
/tests/setup.ts
/tests/unit/
/tests/integration/
```

---

### Task 4.2: Frontend Component Tests
- **ID:** TASK-4.2
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/testing-setup`
- **Estimated:** 2 hours
- **Dependencies:** TASK-4.1

**Acceptance Criteria:**
- [ ] Tests for ContactModal
- [ ] Tests for DealsView
- [ ] Tests for InboxView
- [ ] Tests for AnalysisModal
- [ ] At least 70% coverage

**Files to Create:**
```
/tests/unit/ContactModal.test.tsx
/tests/unit/DealsView.test.tsx
/tests/unit/InboxView.test.tsx
```

---

### Task 4.3: Backend API Tests
- **ID:** TASK-4.3
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/testing-setup`
- **Estimated:** 2 hours
- **Dependencies:** TASK-4.1

**Acceptance Criteria:**
- [ ] Tests for all API endpoints
- [ ] Tests for services (mocked Google APIs)
- [ ] Tests for middleware
- [ ] At least 60% coverage

**Files to Create:**
```
/server/tests/api/contacts.test.ts
/server/tests/api/google.test.ts
/server/tests/services/gemini.test.ts
```

---

### Task 4.4: Performance Optimization
- **ID:** TASK-4.4
- **Assigned:** AI #1
- **Status:** 📌 Pending
- **Branch:** `feature/performance`
- **Estimated:** 1.5 hours
- **Dependencies:** Sprint 3 completed

**Acceptance Criteria:**
- [ ] `React.memo` on heavy components
- [ ] `useMemo` for expensive calculations
- [ ] `useCallback` for event handlers
- [ ] Lazy loading for routes/components
- [ ] Virtual scrolling for long lists (optional)

**Files to Update:**
```
/src/components/ContactsView.tsx
/src/components/DealsView.tsx
/src/components/TasksView.tsx
```

---

### Task 4.5: Documentation - README Update
- **ID:** TASK-4.5
- **Assigned:** AI #1 or AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/documentation`
- **Estimated:** 1 hour
- **Dependencies:** All sprints completed

**Acceptance Criteria:**
- [ ] Clear setup instructions
- [ ] Prerequisites listed
- [ ] Environment variables documented
- [ ] Google Cloud setup guide
- [ ] Screenshots/GIFs (optional)
- [ ] Troubleshooting section

**Files to Update:**
```
README.md
```

---

### Task 4.6: API Documentation
- **ID:** TASK-4.6
- **Assigned:** AI #2
- **Status:** 📌 Pending
- **Branch:** `feature/documentation`
- **Estimated:** 1.5 hours
- **Dependencies:** Sprint 2 completed

**Acceptance Criteria:**
- [ ] All endpoints documented
- [ ] Request/response examples
- [ ] Authentication flow explained
- [ ] Error codes documented
- [ ] Postman collection (optional)

**Files to Create:**
```
API_DOCS.md
```

---

### Task 4.7: Deployment Setup
- **ID:** TASK-4.7
- **Assigned:** Either AI
- **Status:** 📌 Pending
- **Branch:** `feature/deployment`
- **Estimated:** 1 hour
- **Dependencies:** All sprints completed

**Acceptance Criteria:**
- [ ] Dockerfile created (optional)
- [ ] docker-compose.yml (optional)
- [ ] Deployment guide
- [ ] Production env variables guide
- [ ] HTTPS setup instructions

**Files to Create:**
```
Dockerfile (optional)
docker-compose.yml (optional)
DEPLOYMENT.md
```

---

## 📌 Unassigned / Flexible Tasks

### Task X.1: Error Boundaries
- **Assigned:** Either AI
- **Status:** 📌 Pending
- **Estimated:** 0.5 hours

### Task X.2: Toast Notifications
- **Assigned:** Either AI
- **Status:** 📌 Pending
- **Estimated:** 0.5 hours

### Task X.3: Loading Skeletons
- **Assigned:** Either AI
- **Status:** 📌 Pending
- **Estimated:** 1 hour

### Task X.4: Empty States
- **Assigned:** Either AI
- **Status:** 📌 Pending
- **Estimated:** 0.5 hours

---

## 🎯 Quick Reference

### Status Legend
- 📌 **Pending** - Not started yet
- 🔄 **In Progress** - Currently being worked on
- ✅ **Completed** - Done and merged
- ⚠️ **Blocked** - Waiting for dependencies
- 🔴 **Issue** - Has problems, needs attention

### Priority Legend
- ⚡ **High** - Must be done first
- ⭐ **Critical** - The main feature
- 📊 **Medium** - Important but not urgent
- 📝 **Low** - Nice to have

### AI Assignment
- **AI #1** - Backend, State Management, Testing
- **AI #2** - Google Integration, AI Features, API Tests
- **Either** - Flexible tasks both can do

---

## 📝 How to Update This File

When you complete a task:
1. Change status from 📌 to ✅
2. Add completion date
3. Add your AI identifier (AI #1 or AI #2)
4. Link to the PR or commit
5. Update the progress overview at the top

Example:
```markdown
### Task 1.1: Initialize Backend Server
- ✅ **Completed** by AI #1 on 2025-11-06
- Commit: `abc123f`
- PR: #1
- Notes: Added extra logging for debugging
```

---

**Last Updated:** 2025-11-06 by AI #1  
**Next Review:** After Sprint 1 completion
