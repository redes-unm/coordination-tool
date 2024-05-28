'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Suspense, useContext, useEffect, useMemo, useState,
} from 'react';
import { AsyncResource } from '@/lib/AsyncResource';
import { newDb } from '@/db/client';
import { ErrorBoundary } from 'react-error-boundary';
import BreadcrumbContext from '@/contexts/BreadcrumbContext';
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
  key: number
};

export default function Breadcrumb({ className }: Props) {
  const db = useMemo(() => newDb(), []);
  const pathname = usePathname();
  const { key } = useContext(BreadcrumbContext);
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => setElements((old) => {
    const segments = pathname.substring(1).split('/');
    const elems: Element[] = [];
    let href = '';

    if (segments[0] !== 'communities') return elems;
    href += `/${segments[0]}`;
    elems.push({ text: 'Your Communities', href, key });

    if (!segments[1]) return elems;
    href += `/${segments[1]}`;

    if (segments[1] === 'add') {
      elems.push({ text: 'Create a new community', href, key });
      return elems;
    }

    const communityId = segments[1];
    elems.push({
      // use old text if the id (embedded in href) hasn't changed to avoid
      // re-fetching the community name on every navigation
      text: old[1]?.key === key && old[1]?.href === href
        ? old[1].text
        : new AsyncResource(db.getCommunityName(communityId)),
      href,
      key,
    });

    href += `/${segments[2]}`;

    if (segments[2] === 'edit') {
      elems.push({ text: 'Edit community', href, key });
      return elems;
    }

    if (segments[2] !== 'tasks' && segments[2] !== 'campaigns') return elems;
    elems.push({ text: segments[2] === 'tasks' ? 'Tasks' : 'Campaigns', href, key });

    return elems;
  }), [db, pathname, key]);

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
