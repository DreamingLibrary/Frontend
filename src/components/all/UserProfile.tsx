'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function UserProfile() {
  const router = useRouter();
  const [name, setName] = useState('000');
  const [studentId, setStudentId] = useState('00000000');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    setName(window.localStorage.getItem('name') || '');
    setStudentId(window.localStorage.getItem('studentId') || '');
  }, []);

  // 이름의 첫 글자를 가져옵니다 (아바타에 표시)
  const firstChar = name?.charAt(0);

  // 로그아웃 처리
  const handleLogout = () => {
    // 실제로는 로그아웃 API 호출 등의 처리
    window.localStorage.clear();
    router.push('/login');
  };

  useEffect(() => {
    if (localStorage.getItem('studentId') === null) {
      router.push('/login');
    }
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <span className="text-sm font-medium">{firstChar}</span>
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">학번: {studentId}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          title="로그아웃"
          onClick={() => setIsLogoutDialogOpen(true)}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* 로그아웃 확인 다이얼로그 */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>로그아웃</DialogTitle>
            <DialogDescription>정말 로그아웃 하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              취소
            </Button>
            <Button variant="default" onClick={handleLogout}>
              로그아웃
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
