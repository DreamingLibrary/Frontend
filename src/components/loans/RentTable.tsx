'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
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
import { Loader2 } from 'lucide-react';
import { Rent, MyLentsResponse } from '@/types/type';
import { fetchBookExtend, fetchBookReturn, fetchMyLents } from '@/app/api/apis';

type GROUPNAME = 'CNU' | 'PARROT' | 'GDGoC' | 'RELEASE';

export default function RentTable() {
  const [selectedRent, setSelectedRent] = useState<Rent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rents, setRents] = useState<Rent[] | null>(null);

  const fetchMyLentsCall = async () => {
    try {
      const response = (await fetchMyLents()) as MyLentsResponse[];
      const formattedRents: Rent[] = response.map((rent) => ({
        rentId: rent.rentId,
        title: rent.bookTitle,
        groupName: rent.userName as GROUPNAME,
        returnAt: new Date(rent.returnAt),
        rentalPeriod: 14,
        createdAt: new Date(rent.createdAt),
      }));
      setRents(formattedRents);
    } catch (error) {
      console.error('대출 목록 조회 중 오류 발생:', error);
    }
  };

  // 대출 연장 처리 함수
  const handleExtend = async (rent: Rent) => {
    try {
      await fetchBookExtend(rent.rentId);
      alert(`"${rent.title}" 도서의 대출이 연장되었습니다.`);
      await fetchMyLentsCall();
    } catch (error) {
      console.error('대출 연장 중 오류 발생:', error);
      alert('대출 연장 중 오류가 발생했습니다.');
    } finally {
      setIsModalOpen(false);
    }
  };

  // 대출 반납 처리 함수
  const handleReturn = async (rent: Rent) => {
    try {
      await fetchBookReturn(rent.rentId);
      alert(`"${rent.title}" 도서의 대출이 반납되었습니다.`);
      await fetchMyLentsCall();
    } catch (error) {
      console.error('대출 반납 중 오류 발생:', error);
      alert('대출 반납 중 오류가 발생했습니다.');
    }
  };

  // 반납 예정일까지 남은 일수 계산
  const getDaysRemaining = (returnDate: Date) => {
    const today = new Date();
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  interface StatusType {
    color:
      | 'destructive'
      | 'secondary'
      | 'default'
      | 'outline'
      | null
      | undefined;
    text: string;
  }
  // 반납 상태에 따른 배지 색상 및 텍스트
  const getReturnStatus = (returnDate: Date): StatusType => {
    const daysRemaining = getDaysRemaining(returnDate);

    if (daysRemaining < 0) {
      return {
        color: 'destructive',
        text: '연체',
      };
    } else if (daysRemaining <= 3) {
      return {
        color: 'outline',
        text: '임박',
      };
    } else {
      return { color: 'default', text: '정상' };
    }
  };

  useEffect(() => {
    fetchMyLentsCall();
  }, []);

  return (
    <>
      <div className="rounded-md border bg-white relative">
        {rents === null ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>도서명</TableHead>
                <TableHead>그룹</TableHead>
                <TableHead>반납 예정일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>대출일</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rents.length > 0 ? (
                rents.map((rent) => {
                  const status = getReturnStatus(rent.returnAt);
                  return (
                    <TableRow key={rent.rentId}>
                      <TableCell className="font-medium">
                        {rent.title}
                      </TableCell>
                      <TableCell>{rent.groupName}</TableCell>
                      <TableCell>
                        {format(rent.returnAt, 'yyyy년 MM월 dd일', {
                          locale: ko,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={status.color}
                          className="flex items-center w-fit"
                        >
                          {status.text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(rent.createdAt, 'yyyy년 MM월 dd일', {
                          locale: ko,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRent(rent);
                              setIsModalOpen(true);
                            }}
                            disabled={status.text === '연체'}
                          >
                            연장
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReturn(rent)}
                          >
                            반납
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    현재 대출 중인 도서가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* 대출 연장 모달 */}
      {selectedRent && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>대출 연장</DialogTitle>
              <DialogDescription>
                아래 도서의 대출 기간을 연장하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">도서명</div>
                <div className="col-span-2">{selectedRent.title}</div>

                <div className="font-medium">현재 반납일</div>
                <div className="col-span-2">
                  {format(selectedRent.returnAt, 'yyyy년 MM월 dd일', {
                    locale: ko,
                  })}
                </div>

                <div className="font-medium">연장 후 반납일</div>
                <div className="col-span-2">
                  {format(
                    new Date(
                      selectedRent.returnAt.getTime() + 7 * 24 * 60 * 60 * 1000
                    ),
                    'yyyy년 MM월 dd일',
                    { locale: ko }
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                취소자
              </Button>
              <Button onClick={() => handleExtend(selectedRent)}>
                연장하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
