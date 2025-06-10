import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dreaming Library - 그룹 관리자 페이지',
  description: 'DL 그룹 관리자 페이지',
  icons: {
    icon: '/png/rhksflwk.png',
  },
  openGraph: {
    title: 'Dreaming Library - 그룹 관리자 페이지',
    images: [
      {
        url: '/png/rhksflwk.png',
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
