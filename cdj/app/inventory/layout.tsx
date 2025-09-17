import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Inventory - CDJ Auto Supply",
  description: "Inventory management for CDJ Auto Supply",
};

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
