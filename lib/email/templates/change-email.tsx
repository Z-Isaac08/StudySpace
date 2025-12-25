import { Button, Section, Text } from "@react-email/components";
import BaseEmail, { emailStyles } from "./base";

interface ChangeEmailProps {
  name?: string;
  newEmail: string;
  verificationUrl: string;
}

export default function ChangeEmailTemplate({
  name = "étudiant",
  newEmail,
  verificationUrl,
}: ChangeEmailProps) {
  return (
    <BaseEmail
      preview="Vérifiez votre nouvelle adresse email"
      heading={`Bonjour ${name}`}
    >
      <Text style={emailStyles.text}>
        Vous avez demandé à changer votre adresse email sur{" "}
        <strong>StudySpace</strong> vers :
      </Text>

      <Text
        style={{
          ...emailStyles.text,
          fontWeight: "600",
          color: "#3b82f6",
          textAlign: "center",
          padding: "12px",
          backgroundColor: "#eff6ff",
          borderRadius: "6px",
        }}
      >
        {newEmail}
      </Text>

      <Text style={emailStyles.text}>
        Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous :
      </Text>

      {/* CTA Button */}
      <Section style={emailStyles.buttonContainer}>
        <Button style={emailStyles.button} href={verificationUrl}>
          Vérifier ma nouvelle adresse
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

      <Text
        style={{
          ...emailStyles.footer,
          marginTop: "20px",
          fontSize: "12px",
          color: "#a3a3a3",
        }}
      >
        Ce lien expire dans 24 heures. Si vous n'avez pas demandé ce changement,
        ignorez cet email et votre adresse actuelle restera inchangée.
      </Text>
    </BaseEmail>
  );
}
