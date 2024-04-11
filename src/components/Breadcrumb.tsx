'use client';

import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import getDb from '@/db/mockDB';
import { AsyncResource } from '@/lib/AsyncResource';
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

  // TODO: make API call instead of using getDb
  const communityName = useMemo(() => (
    communityId
      ? new AsyncResource(getDb().getCommunity(communityId).then((c) => c.name))
      : null
  ), [communityId]);

  // TODO: make API call instead of using getDb
  const campaignName = useMemo(() => (
    campaignId
      ? new AsyncResource(getDb().getCampaign(campaignId).then((c) => c.name))
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
          ? <Suspense><AsyncText text={text} /></Suspense>
          : text;

        return (
          <span key={key}>
            { i > 0 && <span className={styles['separator']}> &gt; </span> }
            <span className={styles['element']}>
              { href ? <Link href={href}>{t}</Link> : t }
            </span>
          </span>
        );
      })}
    </nav>
  );
}
