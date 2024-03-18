import Link from 'next/link';
import styles from './Breadcrumb.module.css';

type Props = {
  community: { id: string, name: string } | undefined
  campaign: { id: string, name: string } | undefined
  className?: string | undefined
};

type Element = {
  key: string
  text: string
  href: string | undefined
};

export default function Breadcrumb({
  community,
  campaign,
  className,
}: Props) {
  function getElements() {
    const elems: Element[] = [
      {
        key: 'root',
        text: 'Your Communities',
        href: community && '/communities',
      },
    ];

    if (community) {
      elems.push({
        key: community.id,
        text: community.name,
        href: campaign && `/communities/${community.id}`,
      });

      if (campaign) {
        elems.push({
          key: campaign.id,
          text: campaign.name,
          href: undefined,
        });
      }
    }

    return elems;
  }

  return (
    <nav className={className} data-testid="breadcrumb">
      {getElements().map(({ key, text, href }, i) => (
        <>
          { i > 0 && <span className={styles['separator']}> &gt; </span> }
          <span key={key} className={styles['element']}>
            { href ? <Link href={href}>{text}</Link> : text }
          </span>
        </>
      ))}
    </nav>
  );
}
