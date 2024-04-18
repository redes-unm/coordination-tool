import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import React from 'react';
import Page from '@/components/Page';

export const metadata: Metadata = {
  title: 'CellWatch Community Coordination Tool',
  description: 'Plan cellular network measurement campaigns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="body-content">
          <Page>
            {children}
          </Page>
        </div>
      </body>
    </html>
  );
}
