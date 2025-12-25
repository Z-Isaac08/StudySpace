import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BaseEmailProps {
  preview: string;
  heading: string;
  children: React.ReactNode;
}

export default function BaseEmail({
  preview,
  heading,
  children,
}: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>StudySpace</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>{heading}</Heading>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={copyright}>
              © {new Date().getFullYear()} StudySpace. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, -apple-system, BlinkMacSystemFont",
};

const container = {
  margin: "40px auto",
  width: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const header = {
  padding: "40px 40px 20px",
  textAlign: "center" as const,
  borderBottom: "1px solid #e5e5e5",
};

const headerTitle = {
  margin: "0",
  color: "#2563eb",
  fontSize: "28px",
  fontWeight: "700",
};

const content = {
  padding: "40px",
};

const h1 = {
  margin: "0 0 20px",
  color: "#171717",
  fontSize: "24px",
  fontWeight: "600",
};

const footerSection = {
  padding: "20px 40px",
  backgroundColor: "#fafafa",
  borderTop: "1px solid #e5e5e5",
};

const copyright = {
  margin: "0",
  color: "#a3a3a3",
  fontSize: "12px",
  textAlign: "center" as const,
};

// Export des styles réutilisables
export const emailStyles = {
  text: {
    margin: "0 0 20px",
    color: "#525252",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    padding: "14px 32px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
  },
  buttonContainer: {
    textAlign: "center" as const,
    padding: "20px 0",
  },
  footer: {
    margin: "30px 0 0",
    color: "#737373",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  link: {
    color: "#2563eb",
    wordBreak: "break-all" as const,
  },
  warningBox: {
    marginTop: "30px",
    padding: "16px",
    backgroundColor: "#fef3c7",
    borderLeft: "4px solid #f59e0b",
    borderRadius: "4px",
  },
  warningText: {
    margin: "0",
    color: "#92400e",
    fontSize: "14px",
    lineHeight: "1.5",
  },
};
