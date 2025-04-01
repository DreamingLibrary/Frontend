'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, LoaderCircle, SquarePlus } from 'lucide-react';
import BookTable from '@/components/library/BookTable';
import SideBar from '@/components/all/SideBar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

// 그룹 데이터 인터페이스
interface Group {
  id: number;
  name: string;
  description: string;
}

// 샘플 그룹 데이터
const groups: Record<string, Group> = {
  '1': {
    id: 1,
    name: 'CNU',
    description: '공지사항 ~~~ 주의하세요 ~~~',
  },
  '2': {
    id: 2,
    name: 'RELEASE',
    description: '공지사항 ~~~ 주의하세요 ~~~',
  },
  '3': {
    id: 3,
    name: 'GDGoC',
    description: '공지사항 ~~~ 주의하세요 ~~~',
  },
  '4': {
    id: 4,
    name: 'PARROT',
    description: '공지사항 ~~~ 주의하세요 ~~~',
  },
};

// 폼 데이터 타입 정의
interface BookFormData {
  title: string;
  author: string;
  category: string;
  description?: string;
}

export default function LibraryPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [group, setGroup] = useState<Group | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<BookFormData>();

  // 그룹 정보 가져오기
  useEffect(() => {
    // 실제로는 API 호출을 통해 그룹 정보를 가져옴
    if (groupId && groups[groupId]) {
      setGroup(groups[groupId]);
    }
  }, [groupId]);

  const onSubmit = (data: BookFormData) => {
    // 여기서 데이터 처리
    console.log(data);
    alert(`${group?.name}에 책이 등록되었습니다! 도서명: ${data.title}`);
    reset(); // 폼 초기화
    setIsModalOpen(false);
  };

  if (!group) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <SideBar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-8 overflow-auto">
        <Tabs defaultValue="books" className="w-full">
          <TabsContent value="books" className="mt-0">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{group.name}</h2>
                <p className="text-muted-foreground">{group.description}</p>
              </div>
              <div className="flex flex-col items-center hover:cursor-pointer hover:bg-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  <SquarePlus className="h-3 w-3 mr-1" />책 등록하기
                </Button>
              </div>
            </div>

            {/* 검색 및 필터링 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="도서명 또는 저자 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex">
                <Tabs
                  defaultValue="all"
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="w-full md:w-auto"
                >
                  <TabsList>
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-gray-200"
                    >
                      전체
                    </TabsTrigger>
                    <TabsTrigger
                      value="전공"
                      className="data-[state=active]:bg-gray-200"
                    >
                      전공
                    </TabsTrigger>
                    <TabsTrigger
                      value="일반"
                      className="data-[state=active]:bg-gray-200"
                    >
                      일반
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* 도서 목록 테이블 */}
            <BookTable
              searchQuery={searchQuery}
              categoryFilter={
                selectedCategory === 'all' ? null : selectedCategory
              }
              groupId={Number.parseInt(groupId)}
            />
          </TabsContent>

          <TabsContent value="members">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{group.name} - 그룹 멤버</h2>
              <p className="text-muted-foreground">
                그룹에 속한 멤버 목록입니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <p className="text-center text-muted-foreground py-8">
                준비 중입니다.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="loans">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{group.name} - 대출 현황</h2>
              <p className="text-muted-foreground">
                그룹 내 도서 대출 현황입니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <p className="text-center text-muted-foreground py-8">
                준비 중입니다.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{group.name} - 그룹 설정</h2>
              <p className="text-muted-foreground">그룹 설정을 관리합니다.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <p className="text-center text-muted-foreground py-8">
                준비 중입니다.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 책 등록 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>책 등록하기</DialogTitle>
            <DialogDescription>새로운 책 등록</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('title', { required: true })}
              type="text"
              placeholder="도서명"
            />
            <Input
              {...register('author', { required: true })}
              type="text"
              placeholder="저자"
            />
            <Input
              {...register('category', { required: true })}
              type="text"
              placeholder="카테고리"
            />
            <Textarea
              {...register('description')}
              placeholder="설명을 입력해주세요(선택)"
            />
            <Button type="submit">등록</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
