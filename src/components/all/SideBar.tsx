import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import UserProfile from './UserProfile';

export default function SideBar() {
  const pathname = usePathname();
  console.log(pathname);
  const defaultTab =
    pathname === '/' || pathname.startsWith('/library')
      ? 'my-groups'
      : pathname.replace('/', '');
  const router = useRouter();
  return (
    <div className="w-64 bg-white border-r shrink-0 flex flex-col justify-between">
      <div className="p-6">
        <Link href={'/'} className="text-xl font-bold">
          Dreaming Library
        </Link>
      </div>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 h-auto p-0">
          <TabsTrigger
            value="my-groups"
            className="flex items-center justify-start px-6 py-3 data-[state=active]:bg-gray-100 rounded-none border-l-2 border-transparent"
            onClick={() => {
              router.push('/');
            }}
          >
            <Users className="mr-2 h-4 w-4" />내 그룹
          </TabsTrigger>
          <TabsTrigger
            value="loans"
            className="flex items-center justify-start px-6 py-3 data-[state=active]:bg-gray-100 rounded-none border-l-2 border-transparent"
            onClick={() => {
              router.push('/loans');
            }}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            대출 정보
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center justify-start px-6 py-3 data-[state=active]:bg-gray-100 rounded-none border-l-2 border-transparent"
            onClick={() => {
              router.push('/settings');
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            설정
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-auto border-t p-4">
        <UserProfile />
      </div>
    </div>
  );
}
