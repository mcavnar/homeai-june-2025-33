
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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ReminderEmailProps {
  uploadUrl: string;
}

export const ReminderEmail = ({ uploadUrl }: ReminderEmailProps) => (
  <Html>
    <Head />
    <Preview>Upload your home inspection report for instant analysis</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Ready to analyze your home inspection?</Heading>
        <Text style={text}>
          Get instant insights about your potential home, including:
        </Text>
        <ul style={list}>
          <li style={listItem}>Prioritized issues and estimated repair costs</li>
          <li style={listItem}>Expert recommendations for negotiations</li>
          <li style={listItem}>Detailed property analysis and comparisons</li>
        </ul>
        <Button style={button} href={uploadUrl}>
          Upload Your Report
        </Button>
        <Text style={footer}>
          If you didn't request this email, you can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReminderEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '40px 0 20px',
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const list = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
  padding: '0 0 0 20px',
}

const listItem = {
  margin: '8px 0',
}

const button = {
  backgroundColor: '#10B981',
  borderRadius: '8px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '1',
  padding: '16px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  margin: '24px 0',
}
