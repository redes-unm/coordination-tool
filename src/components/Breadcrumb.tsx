'use client';

import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Suspense, useMemo } from 'react';
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
  key: string
  text: string | AsyncResource<string>
  href: string | null
};

export default function Breadcrumb({ className }: Props) {
  const segments = useSelectedLayoutSegments();

  const show = useMemo(() => segments[0] === 'communities', [segments]);

  const communityId = useMemo(
    () => (segments[0] === 'communities' && segments[1]) || null,
    [segments],
  );

  const campaignId = useMemo(
    () => (segments[0] === 'communities' && segments[2] === 'campaigns' && segments[3]) || null,
    [segments],
  );

  const communityName = useMemo(() => (
    communityId
      ? new AsyncResource(newDb().getCommunityName(communityId))
      : null
  ), [communityId]);

  const campaignName = useMemo(() => (
    campaignId
      ? new AsyncResource(newDb().getCampaignName(campaignId))
      : null
  ), [campaignId]);

  const elements = useMemo(() => {
    if (!show) {
      return [];
    }

    const elems: Element[] = [
      {
        key: 'root',
        text: 'Your Communities',
        href: communityId ? '/communities' : null,
      },
    ];

    if (communityId && communityName) {
      elems.push({
        key: communityId,
        text: communityName,
        href: campaignId ? `/communities/${communityId}` : null,
      });

      if (campaignId && campaignName) {
        elems.push({
          key: campaignId,
          text: campaignName,
          href: null,
        });
      }
    }

    return elems;
  }, [show, communityId, communityName, campaignId, campaignName]);

  return (
    <nav className={className}>
      {elements.map(({ key, text, href }, i) => {
        const t = text instanceof AsyncResource
          ? <Suspense fallback="..."><AsyncText text={text} /></Suspense>
          : text;

        return (
          <span key={key}>
            { i > 0 && <span className={styles['separator']}> &gt; </span> }
            <ErrorBoundary fallback={<span>[error]</span>}>
              <span className={styles['element']}>
                { href ? <Link href={href}>{t}</Link> : t }
              </span>
            </ErrorBoundary>
          </span>
        );
      })}
    </nav>
  );
}
