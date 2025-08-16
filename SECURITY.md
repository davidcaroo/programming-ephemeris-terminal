# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Programming Ephemeris Terminal, please report it by emailing us directly instead of opening a public issue.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to include in your report:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes (if available)

### Response Timeline:

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Varies based on complexity

## Security Measures

### API Security
- **OpenRouter API Key**: Stored securely in environment variables
- **Supabase Keys**: Separate anon and service role keys with proper permissions
- **Cron Job Authentication**: Protected with `CRON_SECRET` for Vercel cron jobs
- **Rate Limiting**: Built-in protection through Vercel and Supabase

### Database Security
- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **Public Access**: Limited to read operations only
- **API Keys**: Service role key restricted to server-side operations only

### Environment Variables
Never commit the following sensitive data:
- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

### Best Practices
- All sensitive configuration stored in `.env.local` (gitignored)
- API endpoints validate input and sanitize output
- No user authentication required (public read-only application)
- HTTPS enforced in production via Vercel

## Dependencies

We regularly monitor our dependencies for known vulnerabilities using:
- npm audit
- Dependabot security alerts
- Regular updates to latest stable versions

## Contact

For security-related questions or concerns, please contact:
- **Email**: [Your email here]
- **Response Time**: 24-48 hours

---

**Note**: This is an open-source educational project. While we take security seriously, please use appropriate caution when deploying in production environments.