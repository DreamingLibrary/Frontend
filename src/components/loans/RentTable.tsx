'use client';

import { useState } from 'react';
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
import { AlertCircle } from 'lucide-react';
import { Rent } from '@/types/type';

// 샘플 데이터
const sampleRents: Rent[] = [
  {
    rentId: 1001,
    title: '해리 포터와 마법사의 돌',
    groupName: 'CNU',
    returnAt: new Date(2025, 3, 1),
    rentalPeriod: 14,
    rentalCount: 0,
    createdAt: new Date(2025, 3, 1),
  },
  {
    rentId: 1002,
    title: '1984',
    groupName: 'PARROT',
    returnAt: new Date(2025, 2, 10),
    rentalPeriod: 14,
    rentalCount: 1,
    createdAt: new Date(2025, 2, 27),
  },
  {
    rentId: 1003,
    title: '클린 코드: 애자일 소프트웨어 장인 정신',
    groupName: 'GDGoC',
    returnAt: new Date(2025, 3, 5),
    rentalPeriod: 7,
    rentalCount: 2,
    createdAt: new Date(2025, 2, 22),
  },
];

export default function RentTable() {
  const [selectedRent, setSelectedRent] = useState<Rent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 대출 연장 처리 함수
  const handleExtend = (rent: Rent) => {
    // TODO: API 연동
    alert(`"${rent.title}" 도서의 대출이 연장되었습니다.`);
    setIsModalOpen(false);
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

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>도서명</TableHead>
              <TableHead>그룹</TableHead>
              <TableHead>반납 예정일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>연장 횟수</TableHead>
              <TableHead>대출일</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleRents.length > 0 ? (
              sampleRents.map((rent) => {
                const status = getReturnStatus(rent.returnAt);
                return (
                  <TableRow key={rent.rentId}>
                    <TableCell className="font-medium">{rent.title}</TableCell>
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
                    <TableCell>{rent.rentalCount}회</TableCell>
                    <TableCell>
                      {format(rent.createdAt, 'yyyy년 MM월 dd일', {
                        locale: ko,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRent(rent);
                          setIsModalOpen(true);
                        }}
                        disabled={
                          rent.rentalCount >= 2 || status.text === '연체'
                        }
                      >
                        연장
                      </Button>
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
                      selectedRent.returnAt.getTime() +
                        selectedRent.rentalPeriod * 24 * 60 * 60 * 1000
                    ),
                    'yyyy년 MM월 dd일',
                    { locale: ko }
                  )}
                </div>

                <div className="font-medium">연장 횟수</div>
                <div className="col-span-2">
                  {selectedRent.rentalCount} / 2회
                </div>
              </div>

              {selectedRent.rentalCount >= 2 && (
                <div className="text-sm text-destructive flex items-center mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  최대 연장 횟수(2회)를 초과하여 더 이상 연장할 수 없습니다.
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
              <Button
                onClick={() => handleExtend(selectedRent)}
                disabled={selectedRent.rentalCount >= 2}
              >
                연장하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
