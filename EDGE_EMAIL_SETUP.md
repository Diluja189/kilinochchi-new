# Email via Supabase Edge Function (No Nodemailer)

This project now sends admin emails through a Supabase Edge Function that talks
to your SMTP server. The backend calls the Edge Function; the frontend does not
need SMTP credentials.

## 1) Edge Function code
- File: `supabase/functions/send-admin-email/index.ts`
- Already added to this repo; deploy it with the Supabase CLI.

## 2) Set SMTP secrets (Supabase)
Run these in your terminal (PowerShell):

```powershell
supabase secrets set SMTP_HOST="smtp.example.com" SMTP_PORT="465" SMTP_SECURE="tls" SMTP_USER="user@example.com" SMTP_PASS="app-password" ADMIN_TO="admin@example.com" MAIL_FROM="no-reply@example.com" MAIL_FROM_NAME="DBIT Notifications"
```

Optional if your SMTP server needs a specific auth type:
```powershell
supabase secrets set SMTP_AUTH_METHOD="login"
```

## 3) Deploy the function
```powershell
supabase functions deploy send-admin-email
```

## 4) Backend env vars (server/.env)
Add these to your backend environment:

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_EMAIL_FUNCTION=send-admin-email
# Optional override:
SUPABASE_FUNCTIONS_URL=https://<project-ref>.functions.supabase.co
```

Notes:
- Use the service role key on the backend only (never in React).
- Node 18+ is required for global `fetch`.

## 5) Test
From the backend API:
```
GET /api/test-mail
```

Or call the function directly:
```powershell
curl -i https://<project-ref>.functions.supabase.co/send-admin-email ^
  -H "Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>" ^
  -H "Content-Type: application/json" ^
  -d "{\"subject\":\"Test\",\"text\":\"Hello from edge\"}"
```
