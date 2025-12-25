import { Button, Section, Text } from "@react-email/components";
import BaseEmail, { emailStyles } from "./base";

interface ResetPasswordEmailProps {
  name?: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  name = "étudiant",
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <BaseEmail
      preview="Réinitialisez votre mot de passe StudySpace"
      heading={`Bonjour ${name}`}
    >
      <Text style={emailStyles.text}>
        Vous avez demandé à réinitialiser votre mot de passe sur{" "}
        <strong>StudySpace</strong>.
      </Text>

      <Text style={emailStyles.text}>
        Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
      </Text>

      {/* CTA Button */}
      <Section style={emailStyles.buttonContainer}>
        <Button style={emailStyles.button} href={resetUrl}>
          Réinitialiser mon mot de passe
        </Button>
      </Section>

      <Text style={emailStyles.footer}>
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre
        navigateur :
        <br />
        <a href={resetUrl} style={emailStyles.link}>
          {resetUrl}
        </a>
      </Text>

      {/* Security Warning */}
      <Section style={emailStyles.warningBox}>
        <Text style={emailStyles.warningText}>
          <strong>⚠️ Sécurité :</strong> Si vous n'avez pas demandé cette
          réinitialisation, ignorez cet email. Votre mot de passe actuel reste
          inchangé.
        </Text>
      </Section>

      <Text
        style={{
          ...emailStyles.footer,
          marginTop: "20px",
          fontSize: "12px",
          color: "#a3a3a3",
        }}
      >
        Ce lien expire dans 1 heure pour des raisons de sécurité.
      </Text>
    </BaseEmail>
  );
}
