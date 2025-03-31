'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Group, UserGroup } from '@/types/type';
import { Input } from '@/components/ui/input';
import SideBar from '@/components/all/SideBar';
import { useRouter } from 'next/navigation';

const groups: UserGroup[] = [
  { groupId: 1, name: 'CNU_none', status: 'NONE' },
  { groupId: 2, name: 'RELEASE_accepted', status: 'ACCEPTED' },
  { groupId: 3, name: 'GDG on Campus_rejected', status: 'REJECTED' },
  { groupId: 4, name: 'Parrot_pending', status: 'PENDING' },
];

export default function HomePage() {
  const [selectedGroup, setSelectedGroup] = useState<Group>({
    groupId: 0,
    name: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openGroupModal = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const router = useRouter();

  return (
    <main className="flex h-screen bg-gray-50">
      <SideBar />

      <section className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">그룹</h2>
          <p className="text-muted-foreground">학회 목록</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {groups.map((group) => {
            if (group.status === 'REJECTED')
              return (
                <Card key={group.groupId} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-3xl">{group.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" disabled>
                      거절됨
                    </Button>
                  </CardFooter>
                </Card>
              );
            else if (group.status === 'ACCEPTED')
              return (
                <Card key={group.groupId} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-3xl">{group.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => router.push(`/library/${group.groupId}`)}
                    >
                      입장하기
                    </Button>
                  </CardFooter>
                </Card>
              );
            else if (group.status === 'PENDING')
              return (
                <Card key={group.groupId} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-3xl">{group.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-gray-300" disabled>
                      승인 대기 중
                    </Button>
                  </CardFooter>
                </Card>
              );
            // status == 'NONE'
            else
              return (
                <Card key={group.groupId} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-3xl">{group.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => openGroupModal(group)}
                    >
                      입장하기
                    </Button>
                  </CardFooter>
                </Card>
              );
          })}
        </div>
      </section>

      {/* 그룹 입장 모달 */}
      {selectedGroup && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedGroup.name}</DialogTitle>
              <DialogDescription>
                그룹에 입장하기 위해선 암호를 입력해야 합니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Input placeholder="암호를 입력하세요" type="password" />
              <Button
                onClick={() => {
                  alert(
                    `${selectedGroup.name}의 관리자의 승인을 기다려주세요!`
                  );
                  setIsModalOpen(false);
                }}
              >
                입장신청
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
