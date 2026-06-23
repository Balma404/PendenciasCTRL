import "./globals.css";

export const metadata = {
  title: "Dashboard de Pendências",
  description: "Controle de pendências dos participantes em tempo real.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
