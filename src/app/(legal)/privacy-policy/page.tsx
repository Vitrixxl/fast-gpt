import ReactMarkDown from 'react-markdown';
const privacyPolicyContent = `
# Privacy Policy

Last updated: January 28, 2025

## Legal Information

This service ("Faist") is provided by [Your Name], Auto-entrepreneur
- SIRET: [Your SIRET Number]
- Address: 11 rue des bergeres, Les Ulis, France
- Email: vitrice91@gmail.com

## 1. General Information

This Privacy Policy explains how Faist ("we", "us", "our") collects, uses, and protects your personal data while using our AI chat service.

## 2. Contact Information

- Email: [contact@faist.com]
- Service hosted in France

## 3. Data We Collect

### 3.1 Account Information
- Email address
- Username
- Password (encrypted)

### 3.2 Service Data
- Chat conversations with the AI
- User preferences and settings
- Session tokens for authentication

### 3.3 Technical Data
- IP addresses
- Browser type
- Device information
- Date and time of access
- Technical session information

## 4. How We Use Your Data

We use your data to:
- Provide and maintain our AI chat service
- Authenticate and secure your account
- Process your payments
- Improve our AI responses
- Send service-related communications
- Comply with legal obligations

## 5. Data Storage and Security

- All data is stored on secure servers located in France
- We implement appropriate security measures to protect your data
- Data is encrypted in transit and at rest
- Regular security assessments are performed
- Access to personal data is strictly limited

## 6. Legal Basis for Processing

We process your data based on:
- Contract fulfillment (service provision)
- Legal obligations
- Legitimate interests (service improvement, security)
- Your consent where required

## 7. Data Retention

- Account data: Retained while your account is active
- Chat history: Stored for the duration of your account
- Technical logs: 12 months
- Payment information: As required by law

## 8. Your Rights

Under GDPR, you have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Export your data
- Restrict processing
- Withdraw consent
- File a complaint with a supervisory authority

To exercise these rights, contact us at: [privacy@faist.com]

## 9. Technical Information

### 9.1 Essential Technical Storage
We use only essential technical storage (session tokens) necessary for:
- User authentication
- Service functionality
- Security purposes
No third-party tracking or analytics are used.

## 10. Children's Privacy

Our service is not intended for users under 13 years of age. We do not knowingly collect data from children under 13.

## 11. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

## 12. International Data Transfers

Your data is stored and processed in France. We do not transfer your personal data outside the European Union.

## 13. Data Protection Authority

You have the right to file a complaint with the French Data Protection Authority (CNIL) if you believe your data has been processed unlawfully.

CNIL Website: [www.cnil.fr](https://www.cnil.fr)

---

Contact us if you have any questions about this Privacy Policy at [privacy@faist.com].
`;
export default function () {
  return (
    <ReactMarkDown>
      {privacyPolicyContent}
    </ReactMarkDown>
  );
}
