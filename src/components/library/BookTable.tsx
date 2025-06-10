'use client';

import { Fragment, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { fetchBookLent, fetchBookList } from '@/app/api/apis';

// 카테고리 enum
enum Category {
  WEB_DEVELOPMENT = '웹 개발',
  MOBILE_DEVELOPMENT = '모바일 개발',
  DEVOPS = 'DevOps',
  DATABASE = '데이터베이스',
  SECURITY = '보안',
  GAME_DEVELOPMENT = '게임 개발',
  COMPUTER_SCIENCE = '컴퓨터 과학',
  ALGORITHMS = '알고리즘',
  TESTING = '테스팅',
  UI_UX_DESIGN = 'UI/UX 디자인',
}

// 책 인터페이스
export interface Book {
  bookId: number;
  title: string;
  author: string;
  description?: string;
  category: string;
}

// 샘플 도서 데이터
// const sampleBooks: Book[] = [
//   {
//     bookId: 1,
//     title: '클린 코드: 애자일 소프트웨어 장인 정신',
//     author: '로버트 C. 마틴',
//     description:
//       '소프트웨어 개발의 기본이 되는 코드 작성법과 프로그래밍 원칙을 다룬 책입니다. 읽기 쉽고 유지보수가 용이한 코드를 작성하는 방법을 배울 수 있습니다.',
//     category: '전공',
//   },
//   {
//     bookId: 2,
//     title: '객체지향의 사실과 오해',
//     author: '조영호',
//     description:
//       '객체지향 프로그래밍의 핵심 개념과 원칙을 쉽게 설명한 책입니다. 객체지향적 사고방식을 기르는 데 도움이 됩니다.',
//     category: '전공',
//   },
//   {
//     bookId: 3,
//     title: '해리 포터와 마법사의 돌',
//     author: 'J.K. 롤링',
//     description:
//       '마법 세계를 배경으로 한 판타지 소설로, 마법사가 되기 위해 호그와트 마법학교에 입학한 해리 포터의 모험을 그린 시리즈의 첫 번째 책입니다.',
//     category: '일반',
//   },
//   {
//     bookId: 4,
//     title: '1984',
//     author: '조지 오웰',
//     description:
//       '전체주의 사회를 배경으로 한 디스토피아 소설로, 감시와 통제가 일상화된 사회에서 살아가는 주인공의 이야기를 담고 있습니다.',
//     category: '일반',
//   },
//   {
//     bookId: 5,
//     title: '데이터베이스 시스템',
//     author: 'Abraham Silberschatz',
//     description:
//       '데이터베이스의 기본 개념부터 고급 주제까지 폭넓게 다루는 교재입니다. SQL, 트랜잭션 관리, 데이터베이스 설계 등을 배울 수 있습니다.',
//     category: '전공',
//   },
//   {
//     bookId: 6,
//     title: '어린 왕자',
//     author: '생텍쥐페리',
//     description:
//       '순수함과 상상력을 간직한 어린 왕자의 여행을 통해 인생의 본질적인 가치를 되돌아보게 하는 작품입니다.',
//     category: '일반',
//   },
//   {
//     bookId: 7,
//     title: '컴퓨터 구조 및 설계',
//     author: 'David A. Patterson',
//     description:
//       '컴퓨터 아키텍처의 기본 원리와 설계 방법을 다루는 책입니다. 프로세서, 메모리, 입출력 시스템 등에 대해 배울 수 있습니다.',
//     category: '전공',
//   },
// ];

interface BookTableProps {
  searchQuery: string;
  categoryFilter: string | null;
  groupId: number;
}

export default function BookTable({
  searchQuery,
  categoryFilter,
  groupId,
}: BookTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetchBookList();
      const groupBooks = response.result.list.filter(
        (book) => book.groupId === groupId
      );
      setBooks(groupBooks);
      setFilteredBooks(groupBooks);
    };
    fetchBooks();
  }, [groupId]);

  // 검색어와 카테고리 필터링
  useEffect(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        searchQuery === '' ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === null ||
        categoryFilter === 'all' ||
        book.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
    setFilteredBooks(filtered);
  }, [searchQuery, categoryFilter, books]);

  // 행 확장 토글
  const toggleRowExpansion = (bookId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(bookId)) {
      newExpandedRows.delete(bookId);
    } else {
      newExpandedRows.add(bookId);
    }
    setExpandedRows(newExpandedRows);
  };

  // 대출 모달 열기
  const openBorrowModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  // 대출 처리
  const handleBorrow = async () => {
    try {
      await fetchBookLent(selectedBook?.bookId || 0);
      alert(`"${selectedBook?.title}" 도서가 대출되었습니다.`);
      setIsModalOpen(false);

      // 도서 목록 새로고침
      const updatedBooks = await fetchBookList();
      const groupBooks = updatedBooks.result.list.filter(
        (book) => book.groupId === groupId
      );
      setBooks(groupBooks);
      setFilteredBooks(groupBooks);
    } catch (error) {
      console.error('대출 중 오류 발생:', error);
      alert('대출에 실패했습니다.');
    }
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>도서명</TableHead>
              <TableHead>저자</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, idx) => (
                <Fragment key={idx}>
                  <TableRow
                    key={book.bookId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleRowExpansion(book.bookId)}
                  >
                    <TableCell>
                      {expandedRows.has(book.bookId) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {Category[book.category as keyof typeof Category] ||
                          book.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openBorrowModal(book);
                        }}
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        대여하기
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(book.bookId) && (
                    <TableRow key={`${book.bookId}-expanded`}>
                      <TableCell></TableCell>
                      <TableCell colSpan={4} className="bg-muted/30 p-4">
                        <div className="text-sm">
                          <h4 className="font-semibold mb-2">설명</h4>
                          <p>{book.description || '설명이 없습니다.'}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  {searchQuery || categoryFilter
                    ? '검색 결과가 없습니다.'
                    : '도서 목록이 비어 있습니다.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 대출 모달 */}
      {selectedBook && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>도서 대여</DialogTitle>
              <DialogDescription>
                아래 도서를 대여하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">도서명</div>
                <div className="col-span-2">{selectedBook.title}</div>

                <div className="font-medium">저자</div>
                <div className="col-span-2">{selectedBook.author}</div>

                <div className="font-medium">카테고리</div>
                <div className="col-span-2">
                  <Badge variant="secondary">
                    {Category[selectedBook.category as keyof typeof Category] ||
                      selectedBook.category}
                  </Badge>
                </div>

                <div className="font-medium">대여 기간</div>
                <div className="col-span-2">14일</div>
              </div>

              <div className="text-sm text-muted-foreground mt-2">
                대여 후 최대 2회까지 연장 가능합니다.
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleBorrow}>대여하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
