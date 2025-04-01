'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

// 로그인 폼 스키마
const loginFormSchema = z.object({
  studentId: z.string().min(1, { message: '학번을 입력해주세요' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요' }),
});

// 회원가입 폼 스키마
const registerFormSchema = z
  .object({
    name: z.string().min(1, { message: '이름을 입력해주세요' }),
    studentId: z.string().min(1, { message: '학번을 입력해주세요' }),
    password: z
      .string()
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' }),
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해주세요' }),
    phoneNumber: z.string().min(1, { message: '전화번호를 입력해주세요' }),
    email: z
      .string()
      .email({ message: '유효한 이메일 주소를 입력해주세요' })
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export default function SignPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const router = useRouter();

  // 로그인 폼
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      studentId: '',
      password: '',
    },
  });

  // 회원가입 폼
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      studentId: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      email: '',
    },
  });

  // 로그인 제출 핸들러
  function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
    // 여기에 로그인 로직 구현
    alert('로그인 시도: ' + JSON.stringify(values));
    // TODO: API 받아서 넣기
    localStorage.setItem('name', '000');
    localStorage.setItem('studentId', values.studentId);
    router.push('/');
  }

  // 회원가입 제출 핸들러
  function onRegisterSubmit(values: z.infer<typeof registerFormSchema>) {
    console.log(values);
    // 여기에 회원가입 로직 구현
    alert('회원가입 시도: ' + JSON.stringify(values));
    localStorage.setItem('name', '000');
    localStorage.setItem('studentId', values.studentId);
    router.push('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Dreaming Library</CardTitle>
          <CardDescription>
            도서관 관리 시스템에 로그인하거나 회원가입하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-200">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-500"
              >
                로그인
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-500"
              >
                회원가입
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>학번</FormLabel>
                        <FormControl>
                          <Input placeholder="학번을 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <div className="flex items-center space-x-2 my-4">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      로그인 상태 유지
                    </label>
                  </div> */}
                  <div className="p-1"></div>
                  <Button type="submit" className="w-full">
                    로그인
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  계정이 없으신가요?{' '}
                </span>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setActiveTab('register')}
                >
                  회원가입
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름</FormLabel>
                        <FormControl>
                          <Input placeholder="이름을 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>학번</FormLabel>
                        <FormControl>
                          <Input placeholder="학번을 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호 확인</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>전화번호</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="전화번호를 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일 (선택사항)</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="이메일을 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          이메일은 선택사항입니다
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    회원가입
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  이미 계정이 있으신가요?{' '}
                </span>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setActiveTab('login')}
                >
                  로그인
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
