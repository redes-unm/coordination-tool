import Link from 'next/link';

type Props = {
  community: { id: string, name: string } | undefined
  campaign: { id: string, name: string } | undefined
};

type Element = {
  key: string
  text: string
  href: string | undefined
};

export default function Breadcrumb({
  community,
  campaign,
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
    <div>
      {getElements().map(({ key, text, href }) => {
        if (!href) {
          return <span key={key}>{text}</span>;
        }

        return <Link href={href} key={key}>{text}</Link>;
      })}
    </div>
  );
}
