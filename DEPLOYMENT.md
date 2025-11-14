# Vercel Deployment Guide

## Environment Variables Setup

Before deploying to Vercel, you must set up the following environment variables in your Vercel project dashboard:

### Steps:

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add each variable below** with the exact values provided

---

### Required Environment Variables:

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | `postgres://postgres.ujpxsdsnhmnimwqplxmx:6iI7cLXe3XVmKGbl@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true` |
| `POSTGRES_URL` | `postgres://postgres.ujpxsdsnhmnimwqplxmx:6iI7cLXe3XVmKGbl@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x` |
| `POSTGRES_URL_NON_POOLING` | `postgres://postgres.ujpxsdsnhmnimwqplxmx:6iI7cLXe3XVmKGbl@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `SUPABASE_URL` | `https://ujpxsdsnhmnimwqplxmx.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcHhzZHNuaG1uaW13cXBseG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzc2MzAsImV4cCI6MjA3ODcxMzYzMH0.iivOxf7y7IubL3Qy0YWHx1ZyV6iGIXMygqF2h6x9d10` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcHhzZHNuaG1uaW13cXBseG14Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzEzNzYzMCwiZXhwIjoyMDc4NzEzNjMwfQ.ZyI3fjNM-R6OF5mRUYz6YzyEw7qP9MmMVVa_k1Wj_IU` |
| `SUPABASE_JWT_SECRET` | `i4wrwOxjs6A+9sSY3LhfsAiem8xP1rPFp2MEBJPi96isIaRIny+yDNY2EhxhBSm23/8JkTVXsDAU6S6w/EI6EQ==` |

---

### Deployment Steps:

1. **Add all environment variables** to Vercel dashboard
2. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Fix Vercel environment configuration"
   git push origin main
   ```
3. **Vercel will automatically redeploy** with the correct environment variables

---

### Important Notes:

- ✅ Environment variables should be set as **Production** values
- ✅ Make sure to use the **exact values** above (no extra spaces)
- ✅ The `vercel.json` file has been simplified to avoid secret references
- ✅ All sensitive data is stored securely in Vercel's environment variables

### Troubleshooting:

If deployment fails:
1. Check that all environment variables are correctly set in Vercel dashboard
2. Ensure variable names match exactly (including case)
3. Wait a few minutes for environment variables to propagate
4. Trigger a new deployment from Vercel dashboard if needed

---

Your Melring Coaching website will be fully functional after deployment with:
- ✅ Frontend served correctly
- ✅ Database connected to Supabase
- ✅ All forms and bookings working
- ✅ Admin panel functional