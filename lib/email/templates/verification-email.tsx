import { Button, Section, Text } from "@react-email/components";
import BaseEmail, { emailStyles } from "./base";

interface VerificationEmailProps {
  name?: string;
  verificationUrl: string;
}

export default function VerificationEmail({
  name = "étudiant",
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <BaseEmail
      preview="Vérifiez votre email pour activer votre compte StudySpace"
      heading={`Bonjour ${name}`}
    >
      <Text style={emailStyles.text}>
        Bienvenue sur <strong>StudySpace</strong> ! Pour activer votre compte
        et commencer à collaborer avec d'autres étudiants, veuillez vérifier
        votre adresse email.
      </Text>

      <Text style={emailStyles.text}>
        Cliquez sur le bouton ci-dessous pour confirmer votre email :
      </Text>

      {/* CTA Button */}
      <Section style={emailStyles.buttonContainer}>
        <Button style={emailStyles.button} href={verificationUrl}>
          Vérifier mon email
        </Button>
      </Section>

      <Text style={emailStyles.footer}>
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre
        navigateur :
        <br />
        <a href={verificationUrl} style={emailStyles.link}>
          {verificationUrl}
        </a>
      </Text>

      <Text style={{ ...emailStyles.footer, marginTop: "20px", fontSize: "12px", color: "#a3a3a3" }}>
        Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte,
        ignorez cet email.
      </Text>
    </BaseEmail>
  );
}
