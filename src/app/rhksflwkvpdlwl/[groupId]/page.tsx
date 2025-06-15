'use client';

import { User } from '@/types/type';
import { useEffect, useState } from 'react';
import {
  fetchGroupUserApproval,
  fetchGroupUserListPENDING,
} from '../../api/apis';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetchGroupUserListPENDING(groupId, 'PENDING');
        console.log(response);
        setUsers(response.result);
      } catch (error) {
        console.error('사용자 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [groupId]);

  const handleUserApproval = async (
    userId: number,
    action: 'APPROVED' | 'REJECTED'
  ) => {
    try {
      await fetchGroupUserApproval(userId, action, parseInt(groupId));
      setUsers(users.filter((user) => user.userId !== userId));
      alert(`사용자가 ${action === 'APPROVED' ? '승인' : '거절'}되었습니다.`);
    } catch (error) {
      console.error('사용자 승인 처리 중 오류 발생:', error);
      alert('작업 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="min-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">관리자 페이지</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">사용자 승인 관리</h2>
          <div className="space-y-4">
            {/* 테이블 헤더 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <span className="text-gray-600 font-medium w-1/3">학번</span>
              <span className="text-gray-600 font-medium w-1/3">이름</span>
              <span className="text-gray-600 font-medium w-1/3 text-center">
                관리
              </span>
            </div>

            {/* 테이블 내용 */}
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                승인 대기 중인 사용자가 없습니다.
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 last:rounded-b-lg"
                >
                  <span className="text-gray-800 w-1/3">
                    {user.studentNumber}
                  </span>
                  <span className="text-gray-800 w-1/3">{user.name}</span>
                  <div className="flex gap-2 w-1/3 justify-center">
                    <button
                      onClick={() =>
                        handleUserApproval(user.userId, 'APPROVED')
                      }
                      disabled={user.status === 'APPROVED'}
                      className={`px-4 py-2 rounded-md text-white transition-colors ${
                        user.status === 'APPROVED'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      승인
                    </button>
                    <button
                      onClick={() =>
                        handleUserApproval(user.userId, 'REJECTED')
                      }
                      disabled={user.status === 'REJECTED'}
                      className={`px-4 py-2 rounded-md text-white transition-colors ${
                        user.status === 'REJECTED'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
