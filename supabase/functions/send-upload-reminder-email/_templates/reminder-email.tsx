import * as React from 'npm:react@18.3.1';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22';

interface ReminderEmailProps {
  uploadUrl: string;
}

export const ReminderEmail: React.FC<ReminderEmailProps> = ({ uploadUrl }) => (
  <Html>
    <Head />
    <Preview>Your Home Inspection Report Analysis - Upload When Ready</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Ready to Analyze Your Home Inspection?</Heading>
        <Text style={text}>
          We've saved your spot! When you have your home inspection report ready, simply click the button below to upload and analyze it.
        </Text>
        <Text style={text}>
          HomeAI will help you understand:
        </Text>
        <ul>
          <li style={listItem}>Critical issues that need immediate attention</li>
          <li style={listItem}>Estimated repair costs for budgeting</li>
          <li style={listItem}>Negotiation leverage for your home purchase</li>
          <li style={listItem}>Safety concerns you should be aware of</li>
        </ul>
        <Link
          href={uploadUrl}
          target="_blank"
          style={button}
        >
          Upload Your Inspection Report
        </Link>
        <Text style={{...text, marginTop: '24px'}}>
          If you have any questions, simply reply to this email and we'll be happy to help.
        </Text>
        <Text style={footer}>
          © {new Date().getFullYear()} HomeAI - AI-powered home inspection analysis
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles
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
  color: '#1a56db',
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

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '8px'
};

const button = {
  backgroundColor: '#1a56db',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 16px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  margin: '30px auto',
  width: '260px'
};

const footer = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '32px',
  textAlign: 'center' as const
};

export default ReminderEmail;