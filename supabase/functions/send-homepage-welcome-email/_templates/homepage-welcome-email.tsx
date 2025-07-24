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
          Thanks for checking out HomeAI — a smarter way to understand the condition of any home using your inspection report.
        </Text>

        {/* CTA Button */}
        <div style={buttonContainer}>
          <Button href="https://gethomeai.com/anonymous-upload" style={button}>
            Explore HomeAI →
          </Button>
        </div>

        {/* Benefits list */}
        <ul style={list}>
          <li style={listItem}>• Clear summaries of critical issues</li>
          <li style={listItem}>• Estimated repair costs for budgeting</li>
          <li style={listItem}>• Insights to guide your home purchase</li>
          <li style={listItem}>• Awareness of safety concerns</li>
        </ul>

        {/* Free to use text */}
        <Text style={freeText}>
          Free to use.
        </Text>

        {/* Footer */}
        <Text style={footer}>
          You're receiving this email because you asked to learn more about HomeAI at gethomeai.com.{' '}
          <Link href="#" style={unsubscribeLink}>Unsubscribe</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default HomepageWelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '40px 20px',
};

const container = {
  margin: '0 auto',
  padding: '40px',
  maxWidth: '560px',
  backgroundColor: '#ffffff',
};

const h1 = {
  color: '#000000',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 32px 0',
  padding: '0',
  lineHeight: '1.2',
};

const text = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 32px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#22C55E',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0',
  lineHeight: '1.4',
};

const list = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 32px 0',
  paddingLeft: '20px',
  listStyle: 'none',
};

const listItem = {
  margin: '8px 0',
  paddingLeft: '0',
};

const freeText = {
  color: '#000000',
  fontSize: '16px',
  margin: '0 0 40px 0',
  fontWeight: '500',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center' as const,
};

const unsubscribeLink = {
  color: '#666666',
  textDecoration: 'underline',
};