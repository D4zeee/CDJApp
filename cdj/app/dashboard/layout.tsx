import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - CDJ Auto Supply",
  description: "Dashboard overview for CDJ Auto Supply inventory and sales management",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
