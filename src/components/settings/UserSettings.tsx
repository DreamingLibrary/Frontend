'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Edit, User, Phone, Mail, BookMarked, Webhook } from 'lucide-react';
import { fetchUserInfo, updatePassword, updateUserInfo } from '@/app/api/apis';
import { LoginResponse } from '@/types/type';

// 사용자 역할 타입
type USER = 'ADMIN' | 'USER';

// 샘플 사용자 데이터
const sampleUser: LoginResponse = {
  name: '송은수',
  studentNumber: '20201593',
  role: 'ADMIN',
  phoneNumber: '010-1234-5678',
  email: 'songess@naver.com',
  id: 1,
};

// 폼 스키마
const formSchema = z.object({
  name: z.string().min(1, { message: '이름을 입력해주세요' }),
  phoneNumber: z.string().min(1, { message: '전화번호를 입력해주세요' }),
  email: z
    .string()
    .email({ message: '유효한 이메일 주소를 입력해주세요' })
    .optional()
    .or(z.literal('')),
});

export default function UserSettings() {
  const [user, setUser] = useState<LoginResponse>(sampleUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');

  // 폼 설정
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email || '',
    },
  });

  // 정보 수정 제출 핸들러
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateUserInfo({
        name: values.name,
        studentNumber: user.studentNumber,
        phoneNumber: values.phoneNumber,
        email: values.email,
      });
      setUser({
        ...user,
        name: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
      });
      setIsEditModalOpen(false);
      alert('사용자 정보가 업데이트되었습니다.');
    } catch (error) {
      console.error(error);
      alert('사용자 정보 수정에 실패했습니다.');
    }
  }

  // 비밀번호 수정 핸들러
  async function onPasswordSubmit() {
    try {
      await updatePassword(password);
      alert(`비밀번호가 변경되었습니다.${password}, ${passwordCheck}`);
    } catch (error) {
      console.error(error);
      alert('비밀번호 변경에 실패했습니다.');
    }
    setIsPasswordModalOpen(false);
  }

  // 역할에 따른 배지 색상
  const getRoleBadgeVariant = (role: USER) => {
    return role === 'ADMIN' ? 'default' : 'secondary';
  };

  // 역할에 따른 한글 표시
  const getRoleDisplay = (role: USER) => {
    return role === 'ADMIN' ? '관리자' : '일반 사용자';
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetchUserInfo();
      setUser(response);
    };
    getUserInfo();
  }, []);

  return (
    <>
      <Card className="w-3/4 shrink-0 self-center">
        <CardHeader>
          <CardTitle className="text-xl">계정 정보</CardTitle>
          <CardDescription>
            개인 정보를 확인하고 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이름 */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <User className="h-4 w-4 mr-2" />
                이름
              </div>
              <div className="font-medium">{user.name}</div>
            </div>

            {/* 학번 */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <BookMarked className="h-4 w-4 mr-2" />
                학번
              </div>
              <div className="font-medium">{user.studentNumber}</div>
            </div>

            {/* 역할 */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <Webhook className="h-4 w-4 mr-2" />
                역할
              </div>
              <div>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleDisplay(user.role)}
                </Badge>
              </div>
            </div>

            {/* 전화번호 */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                전화번호
              </div>
              <div className="font-medium">{user.phoneNumber}</div>
            </div>

            {/* 이메일 */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                이메일
              </div>
              <div className="font-medium">{user.email || '-'}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            비밀번호 변경
          </Button>
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            정보 수정
          </Button>
        </CardFooter>
      </Card>

      {/* 정보 수정 모달 */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>계정 정보 수정</DialogTitle>
            <DialogDescription>
              수정 후 저장버튼을 눌러주세요.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-1">
                <FormLabel>학번</FormLabel>
                <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                  <div className="font-medium">{user.studentNumber}</div>
                  <FormDescription className="ml-2 text-xs">
                    학번은 변경할 수 없습니다.
                  </FormDescription>
                </div>
              </div>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일 (선택사항)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>이메일은 선택사항입니다.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 비밀번호 변경 모달 */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
            <DialogDescription>새로운 비밀번호를 입력하세요.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 py-4">
            <div className="space-y-2">
              <div>새 비밀번호</div>
              <Input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div>비밀번호 확인</div>
              <Input
                type="password"
                autoComplete="new-password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={onPasswordSubmit}>변경하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
