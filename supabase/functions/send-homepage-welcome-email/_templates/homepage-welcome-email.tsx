import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface HomepageWelcomeEmailProps {
  uploadUrl: string;
}

export const HomepageWelcomeEmail = ({ uploadUrl }: HomepageWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to HomeIQ — Your Smart Home Analysis Tool</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with logo space */}
        <div style={header}>
          <Heading style={h1}>Welcome to HomeIQ</Heading>
          <Text style={subtitle}>Your Smart Home Analysis Tool</Text>
        </div>
        
        {/* Content section */}
        <div style={contentSection}>
          <Text style={text}>
            Thanks for checking out HomeIQ — a smarter way to understand the condition of any home using your inspection report.
          </Text>

          <div style={buttonContainer}>
            <Button href={uploadUrl} style={button}>
              Get Started →
            </Button>
          </div>

          <div style={benefitsSection}>
            <Text style={benefitsHeader}>
              HomeIQ will help you understand:
            </Text>

            <ul style={list}>
              <li style={listItem}>✓ Critical issues that need immediate attention</li>
              <li style={listItem}>✓ Estimated repair costs for budgeting</li>
              <li style={listItem}>✓ Negotiation leverage for your home purchase</li>
              <li style={listItem}>✓ Safety concerns you should be aware of</li>
            </ul>

            <div style={highlight}>
              <Text style={highlightText}>
                Best of all, the platform is entirely free to use!
              </Text>
            </div>
          </div>
        </div>

        <div style={footerSection}>
          <Text style={footer}>
            Happy analyzing,<br />
            <strong>The HomeIQ Team</strong>
          </Text>
        </div>
      </Container>
    </Body>
  </Html>
);

export default HomepageWelcomeEmail;

const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '40px 20px',
};

const container = {
  margin: '0 auto',
  padding: '32px',
  maxWidth: '560px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  paddingBottom: '24px',
  borderBottom: '1px solid #e2e8f0',
};

const h1 = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  padding: '0',
  lineHeight: '1.2',
};

const subtitle = {
  color: '#64748b',
  fontSize: '16px',
  margin: '0',
  fontWeight: '500',
};

const contentSection = {
  marginBottom: '32px',
};

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#22c55e',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  margin: '0',
  lineHeight: '1.4',
  boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)',
  transition: 'all 0.2s ease',
};

const benefitsSection = {
  backgroundColor: '#f1f5f9',
  padding: '24px',
  borderRadius: '8px',
  marginTop: '24px',
};

const benefitsHeader = {
  color: '#1e293b',
  fontSize: '17px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const list = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
  paddingLeft: '0',
  listStyle: 'none',
};

const listItem = {
  margin: '10px 0',
  paddingLeft: '4px',
};

const highlight = {
  backgroundColor: '#dcfce7',
  border: '1px solid #bbf7d0',
  borderRadius: '6px',
  padding: '16px',
  textAlign: 'center' as const,
};

const highlightText = {
  color: '#166534',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const footerSection = {
  borderTop: '1px solid #e2e8f0',
  paddingTop: '24px',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center' as const,
};