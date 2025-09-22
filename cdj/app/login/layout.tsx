import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login - CDJ Auto Supply",
  description: "Login to CDJ Auto Supply inventory and sales management system",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
