import { Inquiry } from './types';

export const INQUIRIES: Inquiry[] = [
  {
    id: 'inq1',
    name: 'ישראל ישראלי',
    email: 'israel@example.com',
    phone: '052-1234567',
    subject: 'הצעה לפיתוח אפליקציה',
    message: 'שלום, אנחנו חברת סטארטאפ בתחום הפינטק ומחפשים צוות שיפתח עבורנו אפליקציית מובייל. נשמח לקבוע פגישת ייעוץ להצגת הדרישות וקבלת הצעת מחיר. יש לנו מסמך אפיון ראשוני.',
    service_interest: 'פיתוח אפליקציות',
    language: 'he',
    status: 'new',
  },
  {
    id: 'inq2',
    name: 'Dana Cohen',
    email: 'dana.c@globex.com',
    subject: 'Question about SEO services',
    message: 'Hi, I saw your case studies and was very impressed. Can you please provide more details on your SEO packages for e-commerce sites? We are looking to improve our organic traffic.',
    service_interest: 'SEO',
    language: 'en',
    status: 'new',
  },
  {
    id: 'inq3',
    name: 'אביב חדש',
    email: 'aviv.h@music.co.il',
    phone: '',
    subject: 'בעיה בהתחברות לאתר',
    message: 'אני לא מצליח להתחבר לחשבון שלי כבר כמה ימים. ניסיתי לאפס סיסמה אבל לא קיבלתי אימייל. אשמח לעזרתכם הדחופה.',
    service_interest: 'תמיכה טכנית',
    language: 'he',
    status: 'in_progress',
  },
   {
    id: 'inq4',
    name: 'Yara Levi',
    email: 'yara.l@designs.net',
    phone: '054-9876543',
    subject: 'Collaboration Proposal - Design Project',
    message: 'Hello, I am a freelance UI/UX designer and would like to propose a collaboration on a new web project. I have a client who needs development work and I think your team would be a great fit. Can we schedule a short call to discuss?',
    service_interest: 'web_development',
    language: 'en',
    status: 'new',
  }
];
