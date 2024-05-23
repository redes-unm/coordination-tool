'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Suspense, useEffect, useMemo, useState,
} from 'react';
import { AsyncResource } from '@/lib/AsyncResource';
import { newDb } from '@/db/client';
import { ErrorBoundary } from 'react-error-boundary';
import styles from './Breadcrumb.module.css';

function AsyncText({ text }: { text: AsyncResource<string> }) {
  return text.read();
}

type Props = {
  className?: string | undefined
};

type Element = {
  text: string | AsyncResource<string>
  href: string
};

export default function Breadcrumb({ className }: Props) {
  const db = useMemo(() => newDb(), []);
  const pathname = usePathname();
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => setElements((old) => {
    const segments = pathname.substring(1).split('/');
    const elems: Element[] = [];
    let href = '';

    if (segments[0] !== 'communities') return elems;
    href += `/${segments[0]}`;
    elems.push({ text: 'Your Communities', href });

    if (!segments[1]) return elems;
    href += `/${segments[1]}`;

    if (segments[1] === 'add') {
      elems.push({ text: 'Create a new community', href });
      return elems;
    }

    const communityId = segments[1];
    elems.push({
      // use old text if the id (embedded in href) hasn't changed to avoid
      // re-fetching the community name on every navigation
      text: old[1]?.href === href
        ? old[1].text
        : new AsyncResource(db.getCommunityName(communityId)),
      href,
    });

    if (segments[2] !== 'tasks' && segments[2] !== 'campaigns') return elems;
    href += `/${segments[2]}`;
    elems.push({ text: segments[2] === 'tasks' ? 'Tasks' : 'Campaigns', href });

    return elems;
  }), [db, pathname]);

  return (
    <nav className={className}>
      {elements.map(({ text, href }, i) => {
        const t = text instanceof AsyncResource
          ? <Suspense fallback="..."><AsyncText text={text} /></Suspense>
          : text;

        return (
          <span key={href}>
            { i > 0 && <span className={styles['separator']}> &gt; </span> }
            <ErrorBoundary fallback={<span>[error]</span>}>
              <span className={styles['element']}>
                { i === elements.length - 1 ? t : <Link href={href}>{t}</Link> }
              </span>
            </ErrorBoundary>
          </span>
        );
      })}
    </nav>
  );
}
