import Breadcrumb from './Breadcrumb';

type Props = React.PropsWithChildren<{
  community?: { id: string, name: string }
  campaign?: { id: string, name: string }
}>;

// Define shared Page structure here, rather than in the root layout, in order
// to get all of the route parameters.
//
// See https://github.com/vercel/next.js/discussions/49507.
export default async function Page({
  children,
  community,
  campaign,
}: Props) {
  return (
    <>
      <header>
        <h1>Coordination Tool</h1>
        <Breadcrumb campaign={campaign} community={community} />
      </header>
      <main>{children}</main>
    </>
  );
}
