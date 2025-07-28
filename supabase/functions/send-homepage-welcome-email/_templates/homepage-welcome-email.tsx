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
    <Preview>Welcome to HomeAI — Smarter insights from your inspection report</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Heading style={h1}>Welcome to HomeAI</Heading>
        
        {/* Body paragraph */}
        <Text style={text}>
          Thanks for checking out HomeAI -- a smarter way to understand your home condition using your inspection report.
        </Text>

        {/* CTA Button */}
        <div style={buttonContainer}>
          <Button href="https://gethomeai.com/anonymous-upload" style={button}>
            Explore HomeAI →
          </Button>
        </div>

        {/* Benefits list */}
        <ul style={list}>
          <li style={listItem}>Clear summaries of critical issues</li>
          <li style={listItem}>Estimated repair costs for budgeting</li>
          <li style={listItem}>Insights to guide your home purchase</li>
          <li style={listItem}>Awareness of safety concerns</li>
        </ul>

        {/* Free to use text */}
        <Text style={freeText}>
          And best of all, the platform is entirely free to use!
        </Text>

      </Container>
      
      {/* Footer */}
      <Text style={footer}>
        You're receiving this email because you asked to learn more about HomeAI at gethomeai.com.{' '}
        <Link href="#" style={unsubscribeLink}>Unsubscribe</Link>
      </Text>
    </Body>
  </Html>
);

export default HomepageWelcomeEmail;

const main = {
  backgroundColor: '#f5f7fa',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: '20px 0'
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e4e8ee',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '40px'
};

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
  textAlign: 'center' as const
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0'
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#4ade80',
  borderRadius: '4px',
  border: '2px solid #22c55e',
  color: '#ffffff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 16px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  margin: '0 auto',
  width: '260px'
};

const list = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  paddingLeft: '20px'
};

const listItem = {
  marginBottom: '8px'
};

const freeText = {
  color: '#374151',
  fontSize: '16px',
  margin: '16px 0',
};

const footer = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '32px',
  textAlign: 'center' as const
};

const unsubscribeLink = {
  color: '#9ca3af',
  textDecoration: 'underline',
};