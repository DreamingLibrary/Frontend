import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dreaming Library - 마스터 페이지',
  description: 'DL 마스터 페이지',
  icons: {
    icon: '/png/aktmxj.png',
  },
  openGraph: {
    title: 'Dreaming Library - 마스터 페이지',
    images: [
      {
        url: '/png/aktmxj.png',
      },
    ],
    type: 'website',
  },
};

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
