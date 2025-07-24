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
    <Preview>Welcome to HomeAI — Your Smart Home Analysis Tool</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thanks for checking out HomeAI!</Heading>
        
        <Text style={text}>
          HomeAI is a smarter way to understand the condition of any home using your inspection report.
        </Text>

        <div style={buttonContainer}>
          <Button href={uploadUrl} style={button}>
            Get Started Now
          </Button>
        </div>

        <Text style={text}>
          HomeAI will help you understand:
        </Text>

        <ul style={list}>
          <li style={listItem}>Critical issues that need immediate attention</li>
          <li style={listItem}>Estimated repair costs for budgeting</li>
          <li style={listItem}>Negotiation leverage for your home purchase</li>
          <li style={listItem}>Safety concerns you should be aware of</li>
        </ul>

        <Text style={text}>
          And best of all, the platform is entirely free to use!
        </Text>

        <Text style={footer}>
          Happy analyzing,<br />
          The HomeAI Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default HomepageWelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px 0',
  padding: '0',
  lineHeight: '1.4',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#007cff',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0',
  lineHeight: '1.4',
};

const list = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
  paddingLeft: '20px',
};

const listItem = {
  margin: '8px 0',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '1.6',
  marginTop: '32px',
  paddingTop: '20px',
  borderTop: '1px solid #eee',
};