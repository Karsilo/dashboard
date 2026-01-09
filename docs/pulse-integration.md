# Pulse Email Integration

This document explains how the Karsilo Dashboard integrates with Pulse to send welcome emails to new users during onboarding.

## Overview

When a user completes the onboarding form, the system automatically sends them a welcome email via the Pulse API using a pre-configured email template.

## Setup

### 1. Configure Environment Variables

Update your `.env.local` file with the Pulse configuration:

```env
# Pulse Configuration
PULSE_API_KEY=To0dhCIAUgKoshTJkHHvkaRqNRlJ3UnoL3JFZH7hJpKKNVMwbUgZBChYachkNHLe00
PULSE_API_URL=https://pulse.salkaro.com
PULSE_ORGANISATION_ID=your-actual-org-id
PULSE_ENTITY_ID=your-actual-entity-id
```

**How to get these values:**

1. **PULSE_API_KEY**: Already configured ✅
2. **PULSE_API_URL**: `https://pulse.salkaro.com` ✅
3. **PULSE_ORGANISATION_ID**:
   - Log into Pulse at https://pulse.salkaro.com
   - Go to your organization settings
   - Copy the Organization ID
4. **PULSE_ENTITY_ID**:
   - In Pulse, navigate to Entities/Brands
   - Find or create the "Karsilo" entity
   - Copy the Entity ID

### 2. Configure Pulse Email Automation

In the Pulse application:

1. **Navigate to Automations**
   - Log into https://pulse.salkaro.com
   - Go to the Karsilo entity
   - Click on "Automations"

2. **Configure Email-on-Sign-Up**
   - Create or edit the "Email on Sign Up" automation
   - Set up your email template with the following:
     - Use `{{firstName}}` where you want the user's name
     - Set the CTA URL to `https://app.karsilo.com` (or your dashboard URL)
     - Configure sender email (e.g., `hello@karsilo.com`)

3. **Add and Verify Domain**
   - Go to Settings → Domains in Pulse
   - Add `karsilo.com`
   - Follow the DNS verification steps
   - Add the DKIM public key to your Cloudflare DNS

### 3. Verify DNS Configuration

Make sure your `karsilo.com` domain has these DNS records in Cloudflare:

```
# SPF Record
Type: TXT
Name: @
Content: v=spf1 include:zoho.eu ~all

# DMARC Record
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none; rua=mailto:dmarc@karsilo.com

# DKIM Record (from Pulse)
Type: TXT
Name: [selector]._domainkey
Content: v=DKIM1; k=rsa; p=[public-key-from-pulse]

# MX Records (Zoho)
Type: MX
Name: @
Mail Server: mx.zoho.eu
Priority: 10
```

### 4. Test the Integration

1. **Create a test user**
   - Go to http://localhost:3000/onboarding
   - Fill in the onboarding form with a test email
   - Complete the onboarding process

2. **Check the logs**
   - Look for any errors in the console
   - Verify the API call to Pulse was successful

3. **Check your email**
   - The test email should receive the welcome email
   - Verify it's not in spam
   - Check email headers to verify DKIM/SPF/DMARC pass

## How It Works

### Flow

1. User completes onboarding form
2. Form calls `sendWelcomeEmail()` server action
3. Server action makes POST request to Pulse API:
   ```
   POST https://pulse.salkaro.com/api/services/welcome-mail
   Headers: x-api-key: [PULSE_API_KEY]
   Body: {
     organisationId: [PULSE_ORGANISATION_ID],
     entityId: [PULSE_ENTITY_ID],
     customerEmail: [user's email],
     customerName: [user's first name]
   }
   ```
4. Pulse API:
   - Validates API key
   - Retrieves email template from automation
   - Extracts domain from template CTA URL
   - Retrieves domain configuration (DKIM keys)
   - Sends email with DKIM signing
5. User receives welcome email

### Files Involved

- **[onboarding-form.tsx](../src/components/auth/forms/onboarding-form.tsx)** - Onboarding form component
- **[send-welcome-email.ts](../src/services/pulse/send-welcome-email.ts)** - Server action for API call
- **[.env.local](../.env.local)** - Environment configuration

## Troubleshooting

### Email Not Sending

**Check:**
1. Environment variables are correctly set in `.env.local`
2. Pulse organization and entity IDs are correct
3. Email automation exists in Pulse for the entity
4. Domain is verified in Pulse
5. Check browser console and server logs for errors

### Email Going to Spam

**Check:**
1. Domain DNS records (SPF, DKIM, DMARC) are configured
2. DKIM signature is valid
3. Domain has been warmed up (send gradually increasing volumes)
4. Email content doesn't trigger spam filters

### API Key Errors

**Error: "Invalid API key"**
- Verify `PULSE_API_KEY` in `.env.local`
- Check the API key exists in Pulse organization tokens
- Ensure API key ends with "00" (admin access level)

**Error: "Invalid API key access level"**
- API key must have admin access (ends with "00")
- Generate a new admin-level API key in Pulse

### Domain Not Found

**Error: "Domain not found in organization"**
- Add `karsilo.com` in Pulse Settings → Domains
- Verify the domain (add DNS records)
- Wait for DNS propagation (up to 48 hours)

### Missing Environment Variables

**Error: "Email service not configured"**
- Check all Pulse environment variables are set:
  - `PULSE_API_KEY`
  - `PULSE_API_URL`
  - `PULSE_ORGANISATION_ID`
  - `PULSE_ENTITY_ID`
- Restart your Next.js dev server after adding env vars

## Security Notes

1. **Never expose API key client-side**: The API key is only used in server actions
2. **Keep .env.local secure**: Don't commit it to git (already in .gitignore)
3. **Rotate keys regularly**: Generate new API keys every 90 days
4. **Monitor usage**: Check Pulse logs for unauthorized API calls

## Future Enhancements

Potential improvements:

- [ ] Add email preference center (unsubscribe link)
- [ ] Track email open rates in Pulse
- [ ] Add more email templates (password reset, notifications, etc.)
- [ ] Implement retry logic for failed email sends
- [ ] Add email queue for high-volume sending
- [ ] Create admin dashboard to view email logs

## Support

For issues or questions:
- **Pulse API Documentation**: [pulse.salkaro.com/docs/api/welcome-mail.md](https://pulse.salkaro.com/docs/api/welcome-mail.md)
- **Email Configuration Guide**: See Pulse email configuration documentation
