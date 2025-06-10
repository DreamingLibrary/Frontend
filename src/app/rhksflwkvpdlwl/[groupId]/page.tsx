'use client';

import { User } from '@/types/type';
import { useEffect, useState } from 'react';
import {
  fetchGroupUserApproval,
  fetchGroupUserListPENDING,
} from '../../api/apis';

export default function AdminPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [groupId, setGroupId] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setGroupId(resolvedParams.groupId);
    };
    init();
  }, [params]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!groupId) return;
      const response = await fetchGroupUserListPENDING(groupId, 'PENDING');
      console.log(response);
      setUsers(response.result);
    };
    fetchUsers();
  }, [groupId]);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="min-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">관리자 페이지</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">사용자 승인 관리</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
              >
                <span className="text-gray-800">{user.studentNumber}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUserApproval(user.userId, 'APPROVED')}
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
                    onClick={() => handleUserApproval(user.userId, 'REJECTED')}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
