# 🚀 Zenith CRM - תכנית פיתוח מקיפה לאיטרציה הבאה

## 📊 מצב נוכחי - ניתוח After Review

### ✅ מה קיים:
- ✅ React + TypeScript + Vite setup
- ✅ UI מלא עם כל ה-views (Pipeline, Deals, Contacts, Tasks, Inbox, Reports, Settings)
- ✅ Gemini AI integration בסיסית (ניתוח פניות)
- ✅ Types מוגדרים היטב
- ✅ Dark mode UI מעוצב
- ✅ RTL support לעברית
- ✅ Vite config עם env variables

### ❌ מה חסר:
- ❌ **Backend API** - כל הלוגיקה בקליינט, API Key חשוף
- ❌ **Google Workspace Integration** - רק suggestions, אין חיבור אמיתי
- ❌ **State Management** - הכל ב-useState מקומי
- ❌ **Data Persistence** - אין DB או LocalStorage
- ❌ **Authentication** - אין מנגנון זיהוי משתמשים
- ❌ **Testing** - אפס בדיקות
- ❌ **Error Handling** - בסיסי מאוד
- ❌ **Performance Optimization** - אין memoization
- ❌ **.env.local** - לא קיים
- ❌ **Security measures** - validation, sanitization

---

## 🎯 הפרומפט המלא לאיטרציה הבאה

```markdown
שדרג את Zenith CRM לגרסה production-ready עם דגש על אינטגרציה מלאה עם Google Workspace.

זהו הערך המוסף העיקרי של בניית CRM באמצעות Google AI Studio - חיבור טבעי וחלק לכל שירותי Google.

---

## 🔴 PHASE 1: Foundation & Security (קריטי - 3-4 שעות)

### 1.1 Backend API Setup

**צור Backend Node.js/Express:**

```bash
# מבנה תיקיות:
/server
  /src
    /routes
      - auth.routes.ts
      - contacts.routes.ts
      - deals.routes.ts
      - tasks.routes.ts
      - inquiries.routes.ts
      - ai.routes.ts          # Gemini AI endpoints
      - google.routes.ts      # Google Workspace endpoints
    /controllers
      - authController.ts
      - contactsController.ts
      - dealsController.ts
      - tasksController.ts
      - inquiriesController.ts
      - aiController.ts
      - googleController.ts
    /services
      - geminiService.ts      # Gemini AI logic
      - googleService.ts      # Google APIs logic
      - emailService.ts       # Gmail integration
      - calendarService.ts    # Google Calendar
      - driveService.ts       # Google Drive
      - sheetsService.ts      # Google Sheets
    /middleware
      - auth.middleware.ts
      - validation.middleware.ts
      - errorHandler.middleware.ts
      - rateLimiter.middleware.ts
    /models
      - User.ts
      - Contact.ts
      - Deal.ts
      - Task.ts
      - Inquiry.ts
    /utils
      - logger.ts
      - validators.ts
    /config
      - database.config.ts
      - google.config.ts
      - server.config.ts
    - server.ts              # Main entry point
  - package.json
  - tsconfig.json
  - .env.example
```

**Dependencies להתקנה:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "googleapis": "^128.0.0",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "zod": "^3.22.4",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "better-sqlite3": "^9.2.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "tsx": "^4.7.0",
    "nodemon": "^3.0.2"
  }
}
```

**server/src/server.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.middleware';
import authRoutes from './routes/auth.routes';
import contactsRoutes from './routes/contacts.routes';
import dealsRoutes from './routes/deals.routes';
import tasksRoutes from './routes/tasks.routes';
import inquiriesRoutes from './routes/inquiries.routes';
import aiRoutes from './routes/ai.routes';
import googleRoutes from './routes/google.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/google', googleRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

**API Endpoints לממש:**

```typescript
// POST /api/ai/analyze-inquiry
// Body: { inquiry: Inquiry }
// Response: AnalysisResult

// POST /api/ai/generate-email-draft
// Body: { context: string, tone: string }
// Response: { draft: string }

// POST /api/ai/score-lead
// Body: { inquiry: Inquiry, contact?: Contact }
// Response: { score: number, reasoning: string }

// POST /api/ai/suggest-next-action
// Body: { dealId: string, history: Activity[] }
// Response: { action: string, priority: string, reasoning: string }
```

### 1.2 Environment Variables

**צור `.env.example`:**
```bash
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=./data/crm.db

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth2 (for Workspace integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**צור `.env.local` (frontend):**
```bash
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 1.3 Input Validation & Security

**התקן Zod והוסף schemas:**

```bash
npm install zod dompurify
npm install -D @types/dompurify
```

**צור `src/schemas/contact.schema.ts`:**
```typescript
import { z } from 'zod';

export const ContactSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, 'שם פרטי חובה').max(50),
  lastName: z.string().min(1, 'שם משפחה חובה').max(50),
  email: z.string().email('אימייל לא תקין'),
  phone: z.string().regex(/^[0-9\-\+\(\)\s]+$/, 'מספר טלפון לא תקין'),
  company: z.string().max(100),
  title: z.string().max(100),
  source: z.enum(['Inbound', 'Outbound', 'Referral']),
  status: z.enum(['New', 'Active', 'Inactive']),
  ownerId: z.string(),
  tags: z.array(z.string()).default([]),
  notes: z.string().default(''),
});

export type ContactInput = z.infer<typeof ContactSchema>;
```

**צור schemas נוספים:** DealSchema, TaskSchema, InquirySchema

**צור `src/utils/sanitize.ts`:**
```typescript
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = {} as T;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]) as any;
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};
```

### 1.4 Database Setup (SQLite for MVP)

**צור `server/src/config/database.config.ts`:**
```typescript
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/crm.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
export const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      google_id TEXT UNIQUE,
      google_access_token TEXT,
      google_refresh_token TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      title TEXT,
      source TEXT CHECK(source IN ('Inbound', 'Outbound', 'Referral')),
      status TEXT CHECK(status IN ('New', 'Active', 'Inactive')),
      owner_id TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      stage TEXT NOT NULL,
      expected_close_date TEXT,
      owner_id TEXT NOT NULL,
      priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')),
      health_score INTEGER,
      probability INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      due_date TEXT,
      status TEXT CHECK(status IN ('To Do', 'In Progress', 'Done')),
      priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')),
      assignee_id TEXT NOT NULL,
      related_type TEXT CHECK(related_type IN ('Deal', 'Contact')),
      related_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignee_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      service_interest TEXT,
      language TEXT CHECK(language IN ('he', 'en')),
      status TEXT CHECK(status IN ('new', 'in_progress', 'done')),
      ai_analysis TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
};
```

---

## 🟡 PHASE 2: Google Workspace Integration (היתרון המרכזי! - 4-5 שעות)

זה החלק החשוב ביותר - האינטגרציה עם Google Workspace היא הערך המוסף הייחודי של המערכת!

### 2.1 Google OAuth2 Setup

**צור `server/src/config/google.config.ts`:**
```typescript
import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents',
];

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
};
```

### 2.2 Gmail Integration

**צור `server/src/services/emailService.ts`:**
```typescript
import { google } from 'googleapis';
import { oauth2Client } from '../config/google.config';

export class EmailService {
  private gmail;

  constructor(accessToken: string) {
    oauth2Client.setCredentials({ access_token: accessToken });
    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }

  /**
   * שלח אימייל אוטומטי בתגובה לפנייה
   */
  async sendAutoReply(to: string, subject: string, body: string): Promise<void> {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  }

  /**
   * צור טיוטה (draft) למשתמש לבדיקה לפני שליחה
   */
  async createDraft(to: string, subject: string, body: string): Promise<string> {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await this.gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage,
        },
      },
    });

    return res.data.id!;
  }

  /**
   * קרא הודעות אחרונות (לזיהוי פניות חדשות)
   */
  async getRecentMessages(maxResults: number = 10) {
    const res = await this.gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: 'is:unread category:primary',
    });

    const messages = res.data.messages || [];
    const fullMessages = await Promise.all(
      messages.map(async (msg) => {
        const full = await this.gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
        });
        return full.data;
      })
    );

    return fullMessages;
  }
}
```

### 2.3 Google Calendar Integration

**צור `server/src/services/calendarService.ts`:**
```typescript
import { google } from 'googleapis';
import { oauth2Client } from '../config/google.config';

export class CalendarService {
  private calendar;

  constructor(accessToken: string) {
    oauth2Client.setCredentials({ access_token: accessToken });
    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  }

  /**
   * צור אירוע פגישה עם לקוח
   */
  async createMeeting(params: {
    summary: string;
    description: string;
    startTime: string; // ISO 8601
    endTime: string;
    attendees: string[]; // email addresses
    location?: string;
  }) {
    const event = {
      summary: params.summary,
      description: params.description,
      location: params.location || '',
      start: {
        dateTime: params.startTime,
        timeZone: 'Asia/Jerusalem',
      },
      end: {
        dateTime: params.endTime,
        timeZone: 'Asia/Jerusalem',
      },
      attendees: params.attendees.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // יום לפני
          { method: 'popup', minutes: 30 }, // חצי שעה לפני
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `crm-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const res = await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    return {
      id: res.data.id!,
      link: res.data.htmlLink!,
      meetLink: res.data.hangoutLink || res.data.conferenceData?.entryPoints?.[0]?.uri,
    };
  }

  /**
   * רשימת אירועים קרובים
   */
  async getUpcomingEvents(maxResults: number = 10) {
    const res = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.data.items || [];
  }

  /**
   * מצא זמנים פנויים
   */
  async findAvailableSlots(startDate: string, endDate: string) {
    const res = await this.calendar.freebusy.query({
      requestBody: {
        timeMin: startDate,
        timeMax: endDate,
        items: [{ id: 'primary' }],
      },
    });

    return res.data.calendars?.primary?.busy || [];
  }
}
```

### 2.4 Google Drive Integration

**צור `server/src/services/driveService.ts`:**
```typescript
import { google } from 'googleapis';
import { oauth2Client } from '../config/google.config';

export class DriveService {
  private drive;

  constructor(accessToken: string) {
    oauth2Client.setCredentials({ access_token: accessToken });
    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  /**
   * צור תיקייה ללקוח/דיל
   */
  async createFolder(name: string, parentFolderId?: string) {
    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentFolderId && { parents: [parentFolderId] }),
    };

    const res = await this.drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name, webViewLink',
    });

    return {
      id: res.data.id!,
      name: res.data.name!,
      link: res.data.webViewLink!,
    };
  }

  /**
   * שתף תיקייה עם לקוח
   */
  async shareFolder(folderId: string, email: string, role: 'reader' | 'writer' = 'reader') {
    await this.drive.permissions.create({
      fileId: folderId,
      requestBody: {
        type: 'user',
        role,
        emailAddress: email,
      },
      sendNotificationEmail: true,
    });
  }

  /**
   * העלה קובץ
   */
  async uploadFile(fileName: string, content: string, mimeType: string, folderId?: string) {
    const res = await this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType,
        ...(folderId && { parents: [folderId] }),
      },
      media: {
        mimeType,
        body: content,
      },
      fields: 'id, name, webViewLink',
    });

    return {
      id: res.data.id!,
      name: res.data.name!,
      link: res.data.webViewLink!,
    };
  }
}
```

### 2.5 Google Sheets Integration

**צור `server/src/services/sheetsService.ts`:**
```typescript
import { google } from 'googleapis';
import { oauth2Client } from '../config/google.config';

export class SheetsService {
  private sheets;

  constructor(accessToken: string) {
    oauth2Client.setCredentials({ access_token: accessToken });
    this.sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  }

  /**
   * צור דף מעקב חדש לפניות/דילים
   */
  async createTrackingSheet(title: string) {
    const res = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: { title },
        sheets: [
          {
            properties: { title: 'פניות' },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'תאריך' } },
                      { userEnteredValue: { stringValue: 'שם' } },
                      { userEnteredValue: { stringValue: 'אימייל' } },
                      { userEnteredValue: { stringValue: 'נושא' } },
                      { userEnteredValue: { stringValue: 'סטטוס' } },
                      { userEnteredValue: { stringValue: 'פוטנציאל' } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    return {
      id: res.data.spreadsheetId!,
      url: res.data.spreadsheetUrl!,
    };
  }

  /**
   * רשום פנייה בדף המעקב
   */
  async logInquiry(spreadsheetId: string, inquiry: {
    date: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    potential: string;
  }) {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'פניות!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          inquiry.date,
          inquiry.name,
          inquiry.email,
          inquiry.subject,
          inquiry.status,
          inquiry.potential,
        ]],
      },
    });
  }

  /**
   * קרא נתונים מדף
   */
  async readSheet(spreadsheetId: string, range: string) {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return res.data.values || [];
  }
}
```

### 2.6 Google Docs Integration

**צור `server/src/services/docsService.ts`:**
```typescript
import { google } from 'googleapis';
import { oauth2Client } from '../config/google.config';

export class DocsService {
  private docs;

  constructor(accessToken: string) {
    oauth2Client.setCredentials({ access_token: accessToken });
    this.docs = google.docs({ version: 'v1', auth: oauth2Client });
  }

  /**
   * צור תקציר פגישה / סיכום פנייה
   */
  async createSummaryDoc(title: string, content: string) {
    // Create document
    const createRes = await this.docs.documents.create({
      requestBody: { title },
    });

    const documentId = createRes.data.documentId!;

    // Insert content
    await this.docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: content,
            },
          },
        ],
      },
    });

    return {
      id: documentId,
      url: `https://docs.google.com/document/d/${documentId}/edit`,
    };
  }
}
```

### 2.7 Backend Google Routes

**צור `server/src/routes/google.routes.ts`:**
```typescript
import express from 'express';
import { googleController } from '../controllers/googleController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// כל ה-routes דורשים authentication
router.use(authMiddleware);

// Email
router.post('/email/send', googleController.sendEmail);
router.post('/email/draft', googleController.createDraft);
router.get('/email/recent', googleController.getRecentEmails);

// Calendar
router.post('/calendar/event', googleController.createCalendarEvent);
router.get('/calendar/events', googleController.getUpcomingEvents);
router.post('/calendar/available-slots', googleController.findAvailableSlots);

// Drive
router.post('/drive/folder', googleController.createFolder);
router.post('/drive/share', googleController.shareFolder);
router.post('/drive/upload', googleController.uploadFile);

// Sheets
router.post('/sheets/create', googleController.createSheet);
router.post('/sheets/log', googleController.logToSheet);
router.get('/sheets/:id', googleController.readSheet);

// Docs
router.post('/docs/summary', googleController.createSummaryDoc);

// Combined automation (הפעולה המלאה)
router.post('/automate-inquiry', googleController.automateInquiryWorkflow);

export default router;
```

**צור `server/src/controllers/googleController.ts`:**
```typescript
import { Request, Response } from 'express';
import { EmailService } from '../services/emailService';
import { CalendarService } from '../services/calendarService';
import { DriveService } from '../services/driveService';
import { SheetsService } from '../services/sheetsService';
import { DocsService } from '../services/docsService';

export const googleController = {
  /**
   * 🎯 הפעולה המרכזית - אוטומציה מלאה של פנייה
   * זה מה שמייחד את המערכת!
   */
  async automateInquiryWorkflow(req: Request, res: Response) {
    try {
      const { inquiry, analysis, actions } = req.body;
      const accessToken = req.user.googleAccessToken;

      const results: any = {
        email: null,
        calendar: null,
        drive: null,
        sheets: null,
        docs: null,
      };

      // 1. שלח אימייל אוטומטי (אם נדרש)
      if (actions.sendEmail) {
        const emailService = new EmailService(accessToken);
        await emailService.sendAutoReply(
          inquiry.email,
          `Re: ${inquiry.subject}`,
          analysis.auto_reply
        );
        results.email = { sent: true };
      }

      // 2. צור אירוע יומן (אם נדרש)
      if (actions.createCalendarEvent) {
        const calendarService = new CalendarService(accessToken);
        const meeting = await calendarService.createMeeting({
          summary: `פגישה עם ${inquiry.name}`,
          description: `נושא: ${inquiry.subject}\n\n${inquiry.message}`,
          startTime: actions.meetingTime.start,
          endTime: actions.meetingTime.end,
          attendees: [inquiry.email],
        });
        results.calendar = meeting;
      }

      // 3. צור תיקיית Drive (אם נדרש)
      if (actions.createDriveFolder) {
        const driveService = new DriveService(accessToken);
        const folder = await driveService.createFolder(
          `${inquiry.company || inquiry.name} - ${inquiry.subject}`
        );
        
        // שתף עם הלקוח
        await driveService.shareFolder(folder.id, inquiry.email, 'writer');
        results.drive = folder;
      }

      // 4. רשום ב-Sheets (אם נדרש)
      if (actions.logToSheets && req.user.trackingSheetId) {
        const sheetsService = new SheetsService(accessToken);
        await sheetsService.logInquiry(req.user.trackingSheetId, {
          date: new Date().toISOString(),
          name: inquiry.name,
          email: inquiry.email,
          subject: inquiry.subject,
          status: inquiry.status,
          potential: analysis.potential_score,
        });
        results.sheets = { logged: true };
      }

      // 5. צור תקציר ב-Docs (אם נדרש)
      if (actions.createDocsSummary) {
        const docsService = new DocsService(accessToken);
        const doc = await docsService.createSummaryDoc(
          `סיכום פנייה - ${inquiry.name}`,
          `
# סיכום פנייה מ-${inquiry.name}

## פרטי הפונה
- **שם:** ${inquiry.name}
- **אימייל:** ${inquiry.email}
- **טלפון:** ${inquiry.phone || 'לא צוין'}
- **תאריך:** ${new Date().toLocaleDateString('he-IL')}

## נושא הפנייה
${inquiry.subject}

## תוכן הפנייה
${inquiry.message}

## ניתוח AI
- **פוטנציאל עסקי:** ${analysis.potential_score}
- **קטגוריה:** ${analysis.suggested_category}
- **סטטוס מוצע:** ${analysis.suggested_status}
- **דרושה התערבות אנושית:** ${analysis.human_required ? 'כן' : 'לא'}

## תגובה מוצעת
${analysis.auto_reply}

## פעולות נוספות
${analysis.google_action.notes}
          `
        );
        results.docs = doc;
      }

      res.json({
        success: true,
        message: 'Workflow completed successfully',
        results,
      });
    } catch (error) {
      console.error('Workflow automation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to automate workflow' 
      });
    }
  },

  // ... שאר הפונקציות (sendEmail, createCalendarEvent, וכו')
};
```

### 2.8 Frontend Integration with Google

**עדכן `src/components/AnalysisModal.tsx`:**

הוסף כפתורים אינטראקטיביים שמפעילים את Google Actions בפועל:

```typescript
const GoogleActionButton: React.FC<{ 
  icon: React.ReactNode, 
  text: string,
  onClick: () => void,
  loading?: boolean 
}> = ({ icon, text, onClick, loading }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
  >
    {loading ? <LoadingSpinner /> : icon}
    <span>{text}</span>
  </button>
);

// בתוך הקומפוננטה:
const handleExecuteWorkflow = async () => {
  try {
    setIsExecuting(true);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/google/automate-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        inquiry: selectedInquiry,
        analysis: analysisResult,
        actions: {
          sendEmail: result.google_action.calendar_event === 'yes',
          createCalendarEvent: result.google_action.calendar_event === 'yes',
          createDriveFolder: result.google_action.share_drive_folder === 'yes',
          logToSheets: result.google_action.sheet_log === 'yes',
          createDocsSummary: result.google_action.create_doc_summary === 'yes',
        },
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      toast.success('כל הפעולות בוצעו בהצלחה! ✨');
      // הצג תוצאות למשתמש
    }
  } catch (error) {
    toast.error('שגיאה בביצוע הפעולות');
  } finally {
    setIsExecuting(false);
  }
};
```

---

## 🟢 PHASE 3: Advanced AI Features (2-3 שעות)

### 3.1 Enhanced AI Analysis

**הרחב את `server/src/services/geminiService.ts`:**

```typescript
import { GoogleGenAI, Type } from '@google/genai';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY! 
    });
  }

  /**
   * ניתוח פנייה מקורי (משופר)
   */
  async analyzeInquiry(inquiry: any) {
    const systemInstruction = `
אתה עוזר CRM חכם המחובר ל-Google Workspace של המשתמש.
המטרה שלך: לנתח פניות לקוחות, לזהות הזדמנויות עסקיות, ולהציע פעולות קונקרטיות.

הקשר נוסף:
- המערכת שלנו מחוברת ל-Gmail, Calendar, Drive, Sheets, Docs
- אנחנו יכולים לבצע פעולות אוטומטיות בכל הכלים האלה
- התשובות שלך צריכות להיות מעשיות ומדויקות

נתח את הפנייה והחזר JSON מובנה.
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `${systemInstruction}\n\nפנייה לניתוח:\n${JSON.stringify(inquiry, null, 2)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            potential_score: { 
              type: Type.STRING, 
              enum: ['high', 'medium', 'low'],
              description: 'הערכת הפוטנציאל העסקי של הפנייה'
            },
            lead_score: {
              type: Type.NUMBER,
              description: 'ציון מספרי 0-100 לאיכות הליד'
            },
            suggested_status: { 
              type: Type.STRING, 
              enum: ['in_progress', 'done'] 
            },
            suggested_category: { 
              type: Type.STRING,
              description: 'קטגוריית שירות מתאימה'
            },
            auto_reply: { 
              type: Type.STRING,
              description: 'תשובה אוטומטית מנומסת ומקצועית בשפת הפונה'
            },
            human_required: { 
              type: Type.BOOLEAN,
              description: 'האם נדרשת התערבות אנושית'
            },
            sentiment: {
              type: Type.STRING,
              enum: ['positive', 'neutral', 'negative'],
              description: 'סנטימנט ההודעה'
            },
            urgency: {
              type: Type.STRING,
              enum: ['high', 'medium', 'low'],
              description: 'דחיפות הטיפול'
            },
            suggested_next_actions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: 'רשימת פעולות המשך מומלצות'
            },
            google_action: {
              type: Type.OBJECT,
              properties: {
                calendar_event: { 
                  type: Type.STRING, 
                  enum: ['yes', 'no'],
                  description: 'האם לקבוע פגישה ביומן'
                },
                meeting_suggestion: {
                  type: Type.STRING,
                  description: 'הצעה לזמן ותיאור הפגישה'
                },
                sheet_log: { 
                  type: Type.STRING, 
                  enum: ['yes', 'no'],
                  description: 'האם לתעד ב-Sheets'
                },
                create_doc_summary: { 
                  type: Type.STRING, 
                  enum: ['yes', 'no'],
                  description: 'האם ליצור תקציר ב-Docs'
                },
                share_drive_folder: { 
                  type: Type.STRING, 
                  enum: ['yes', 'no'],
                  description: 'האם לפתוח תיקיית Drive משותפת'
                },
                folder_structure: {
                  type: Type.STRING,
                  description: 'הצעה למבנה תיקיות אם רלוונטי'
                },
                notes: { 
                  type: Type.STRING, 
                  description: 'הסבר מפורט על ההמלצות'
                },
              },
            },
            estimated_deal_value: {
              type: Type.NUMBER,
              description: 'הערכת ערך הדיל בדולרים (אם רלוונטי)'
            },
            probability: {
              type: Type.NUMBER,
              description: 'הסתברות לסגירת עסקה (0-100)'
            },
          },
        },
      },
    });

    return JSON.parse(response.text.trim());
  }

  /**
   * יצירת טיוטת אימייל חכמה
   */
  async generateEmailDraft(params: {
    context: string;
    tone: 'formal' | 'casual' | 'friendly';
    language: 'he' | 'en';
    recipientName: string;
    previousContext?: string;
  }) {
    const prompt = `
צור טיוטת אימייל מקצועית עבור CRM.

הקשר: ${params.context}
סגנון: ${params.tone === 'formal' ? 'פורמלי' : params.tone === 'casual' ? 'קז'ואלי' : 'ידידותי'}
שפה: ${params.language === 'he' ? 'עברית' : 'אנגלית'}
שם הנמען: ${params.recipientName}
${params.previousContext ? `הקשר קודם: ${params.previousContext}` : ''}

דרישות:
1. נושא (Subject) קצר ומושך
2. גוף ההודעה מנומס ומקצועי
3. קריאה לפעולה (CTA) ברורה
4. חתימה מתאימה

החזר JSON עם: subject, body, cta
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
            cta: { type: Type.STRING },
          },
        },
      },
    });

    return JSON.parse(response.text.trim());
  }

  /**
   * הצעה לפעולה הבאה (Next Best Action)
   */
  async suggestNextAction(params: {
    dealId: string;
    dealStage: string;
    lastActivity: string;
    contactHistory: any[];
  }) {
    const prompt = `
אתה עוזר CRM שמנתח את מצב הדיל ומציע את הפעולה הבאה הטובה ביותר.

מצב הדיל:
- ID: ${params.dealId}
- שלב נוכחי: ${params.dealStage}
- פעילות אחרונה: ${params.lastActivity}
- היסטוריית אינטראקציות: ${JSON.stringify(params.contactHistory)}

הצע פעולה קונקרטית, מעשית ומתוזמנת.
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
            timing: { type: Type.STRING },
            expected_outcome: { type: Type.STRING },
          },
        },
      },
    });

    return JSON.parse(response.text.trim());
  }

  /**
   * חיזוי מכירות (Sales Forecasting)
   */
  async forecastSales(deals: any[]) {
    const prompt = `
נתח את הדילים הפתוחים וספק חיזוי מכירות לחודש הקרוב.

דילים: ${JSON.stringify(deals)}

ספק:
1. סך צפוי להכנסות
2. רמת ביטחון בחיזוי
3. דילים עם סבירות גבוהה לסגירה
4. המלצות לשיפור
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            total_forecast: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            high_probability_deals: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
          },
        },
      },
    });

    return JSON.parse(response.text.trim());
  }
}
```

---

## 🎨 PHASE 4: State Management & Performance (2 שעות)

### 4.1 Context API Implementation

**צור `src/contexts/CRMContext.tsx`:**

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Contact, Deal, Task, Inquiry, User } from '../types';

interface CRMContextType {
  // State
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  inquiries: Inquiry[];
  users: User[];
  currentUser: User | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  analyzeInquiry: (inquiry: Inquiry) => Promise<any>;
  
  // Refresh
  refreshData: () => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('authToken');

  const fetchWithAuth = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }, [apiUrl, token]);

  // Fetch all data on mount
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [contactsData, dealsData, tasksData, inquiriesData] = await Promise.all([
        fetchWithAuth('/contacts'),
        fetchWithAuth('/deals'),
        fetchWithAuth('/tasks'),
        fetchWithAuth('/inquiries'),
      ]);

      setContacts(contactsData);
      setDeals(dealsData);
      setTasks(tasksData);
      setInquiries(inquiriesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    if (token) {
      refreshData();
    }
  }, [token, refreshData]);

  // Contacts
  const addContact = useCallback(async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContact = await fetchWithAuth('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
    setContacts(prev => [...prev, newContact]);
  }, [fetchWithAuth]);

  const updateContact = useCallback(async (id: string, contact: Partial<Contact>) => {
    const updated = await fetchWithAuth(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
    setContacts(prev => prev.map(c => c.id === id ? updated : c));
  }, [fetchWithAuth]);

  const deleteContact = useCallback(async (id: string) => {
    await fetchWithAuth(`/contacts/${id}`, { method: 'DELETE' });
    setContacts(prev => prev.filter(c => c.id !== id));
  }, [fetchWithAuth]);

  // Similar implementations for deals, tasks, etc.
  // ...

  const analyzeInquiry = useCallback(async (inquiry: Inquiry) => {
    return await fetchWithAuth('/ai/analyze-inquiry', {
      method: 'POST',
      body: JSON.stringify({ inquiry }),
    });
  }, [fetchWithAuth]);

  const value: CRMContextType = {
    contacts,
    deals,
    tasks,
    inquiries,
    users,
    currentUser,
    isLoading,
    error,
    addContact,
    updateContact,
    deleteContact,
    addDeal,
    updateDeal,
    deleteDeal,
    addTask,
    updateTask,
    deleteTask,
    analyzeInquiry,
    refreshData,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within CRMProvider');
  }
  return context;
};
```

**עדכן `src/main.tsx` או `src/index.tsx`:**
```typescript
import { CRMProvider } from './contexts/CRMContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CRMProvider>
      <App />
    </CRMProvider>
  </React.StrictMode>
);
```

### 4.2 Performance Optimization

**צור custom hooks ב-`src/hooks/`:**

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
```

**הוסף memoization ל-components:**

```typescript
import React, { memo, useMemo, useCallback } from 'react';

const ContactsView = memo(({ contacts, users, onAddNew, onEdit }: ContactsViewProps) => {
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [contacts]);

  const handleEdit = useCallback((contact: Contact) => {
    onEdit(contact);
  }, [onEdit]);

  // ... rest of component
});

export default ContactsView;
```

---

## 📦 PHASE 5: Testing & Documentation (2 שעות)

### 5.1 Testing Setup

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

**צור `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
```

**צור tests:**
```typescript
// tests/unit/ContactModal.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactModal from '../../src/components/ContactModal';

describe('ContactModal', () => {
  it('renders correctly when open', () => {
    render(
      <ContactModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSave={vi.fn()}
        contactToEdit={null}
        users={[]}
        currentUserId="u1"
      />
    );
    
    expect(screen.getByText('איש קשר חדש')).toBeInTheDocument();
  });

  // More tests...
});
```

### 5.2 Documentation

**עדכן `README.md`:**

```markdown
# Zenith CRM - מערכת CRM חכמה עם Google Workspace

CRM מתקדם המשלב AI (Gemini) עם Google Workspace לאוטומציה מלאה של תהליכי מכירה ושירות.

## 🌟 תכונות מרכזיות

### 🤖 AI-Powered
- ניתוח אוטומטי של פניות לקוחות
- הצעות לפעולות הבאות
- יצירת טיוטות אימייל
- חיזוי מכירות

### 🔗 Google Workspace Integration
- **Gmail**: שליחת אימיילים אוטומטיים, יצירת טיוטות
- **Calendar**: קביעת פגישות, חיפוש זמנים פנויים
- **Drive**: יצירת תיקיות ושיתופן עם לקוחות
- **Sheets**: רישום פניות וניהול נתונים
- **Docs**: יצירת תקצירים ומסמכי עבודה

### 💼 CRM Core
- ניהול אנשי קשר
- pipeline מכירות ויזואלי
- ניהול משימות
- דוחות וניתוחים

## 🚀 התקנה והרצה

### Prerequisites
- Node.js 18+
- Google Cloud Project עם APIs מופעלים
- Gemini API Key

### Setup

1. **Clone the repository:**
```bash
git clone <repo-url>
cd zenith-crm
```

2. **Install dependencies:**
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

3. **Environment Variables:**

צור `.env.local` (frontend):
```bash
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_client_id
```

צור `server/.env`:
```bash
# Copy from server/.env.example and fill in your values
cp server/.env.example server/.env
```

4. **Google Cloud Setup:**

- צור פרויקט ב-[Google Cloud Console](https://console.cloud.google.com)
- הפעל APIs: Gmail, Calendar, Drive, Sheets, Docs
- צור OAuth 2.0 credentials
- הוסף `http://localhost:3001/api/auth/google/callback` ל-Authorized redirect URIs

5. **Run:**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

6. **Visit:** http://localhost:3000

## 📚 API Documentation

### Authentication
```
POST /api/auth/google
POST /api/auth/google/callback
GET  /api/auth/me
POST /api/auth/logout
```

### Contacts
```
GET    /api/contacts
POST   /api/contacts
GET    /api/contacts/:id
PUT    /api/contacts/:id
DELETE /api/contacts/:id
```

### AI
```
POST /api/ai/analyze-inquiry
POST /api/ai/generate-email-draft
POST /api/ai/score-lead
POST /api/ai/suggest-next-action
POST /api/ai/forecast-sales
```

### Google Workspace
```
POST /api/google/email/send
POST /api/google/email/draft
POST /api/google/calendar/event
POST /api/google/drive/folder
POST /api/google/sheets/log
POST /api/google/docs/summary
POST /api/google/automate-inquiry  # 🌟 Full workflow automation
```

## 🧪 Testing

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## 🏗️ Architecture

```
/src
  /components    - React components
  /contexts      - State management
  /hooks         - Custom hooks
  /services      - API calls
  /utils         - Helper functions
  /schemas       - Validation schemas
  /types         - TypeScript types

/server
  /src
    /routes       - API routes
    /controllers  - Business logic
    /services     - External integrations
    /middleware   - Express middleware
    /models       - Data models
    /config       - Configuration
```

## 🤝 Contributing

ראה [CONTRIBUTING.md](CONTRIBUTING.md) להנחיות.

## 📄 License

MIT
```

---

## 🎯 סדר ביצוע מומלץ - Step by Step

### Week 1: Foundation (8-10 hours)
- [ ] Day 1-2: Backend setup + Database + Auth
- [ ] Day 3: Environment variables + Security
- [ ] Day 4: Testing setup

### Week 2: Google Integration (10-12 hours)  
- [ ] Day 1: OAuth2 + Gmail
- [ ] Day 2: Calendar + Drive
- [ ] Day 3: Sheets + Docs
- [ ] Day 4: Workflow automation endpoint

### Week 3: Frontend & AI (8-10 hours)
- [ ] Day 1: Context API + State management
- [ ] Day 2: Connect frontend to backend
- [ ] Day 3: Enhanced AI features
- [ ] Day 4: Performance optimization

### Week 4: Polish (6-8 hours)
- [ ] Day 1: Testing
- [ ] Day 2: Documentation
- [ ] Day 3: Bug fixes + UX improvements
- [ ] Day 4: Deployment setup

---

## ✅ Success Criteria

בסוף האיטרציה, המערכת צריכה:

1. ✅ **Backend API מאובטח** עם authentication
2. ✅ **חיבור מלא ל-Google Workspace** - כל השירותים עובדים
3. ✅ **אוטומציה מלאה** - לחיצה אחת מבצעת את כל הפעולות
4. ✅ **AI מתקדם** - לא רק analysis, גם generation ו-prediction
5. ✅ **State management** - Context API או Zustand
6. ✅ **Security** - Validation, sanitization, error handling
7. ✅ **Testing** - לפחות 20 unit tests
8. ✅ **Documentation** - README מקיף + API docs
9. ✅ **Performance** - Memoization + optimizations
10. ✅ **Production-ready** - מוכן לdeployment אמיתי

---

## 🎁 Bonus Features (אם יש זמן)

- [ ] Real-time notifications (WebSockets)
- [ ] Multi-language support (i18n)
- [ ] Dark/Light mode toggle
- [ ] Keyboard shortcuts
- [ ] Export to CSV/PDF
- [ ] Activity timeline
- [ ] Advanced search & filters
- [ ] Mobile responsive improvements
- [ ] Undo/Redo functionality
- [ ] Collaboration features

---

## 🚀 הבא אחר כך (Future Roadmap)

- Google Workspace Add-on
- Chrome Extension
- Mobile App (React Native)
- Advanced analytics dashboard
- Machine Learning predictions
- Voice commands (Speech-to-Text)
- Video calls integration (Google Meet)
```

---

## 📝 הערות חשובות

### מדוע ההתמקדות ב-Google Workspace?

זה **היתרון התחרותי** שלך! מערכות CRM רגילות לא מחוברות באופן טבעי ל-Google Workspace.
כשאתה בונה ב-Google AI Studio, יש לך access קל לכל ה-APIs של Google + AI של Gemini.

זה מה שהופך את המערכת לייחודית:
- **One-click automation**: לחיצה אחת = אימייל + פגישה + תיקייה + רישום
- **Native integration**: לא צריך integrations מסובכים
- **Smart suggestions**: Gemini מבין את ההקשר של Google Workspace
- **Seamless UX**: הכל בתוך סביבת העבודה הטבעית של המשתמש

### מה הכי קריטי?

1. **Backend API** - בלי זה, הכל חשוף ולא בטוח
2. **Google OAuth** - זה מה שמאפשר את כל ההשאר
3. **Workflow automation** - זה הvalue proposition
4. **Good UX** - צריך להיות קל ונוח להשתמש

---

האם לתחיל לממש את זה עכשיו? אני יכול להתחיל עם Phase 1 או Phase 2 לפי בחירתך! 🚀
