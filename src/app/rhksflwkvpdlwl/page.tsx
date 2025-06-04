'use client';

import { User } from '@/types/type';
import { useState } from 'react';

export default function AdminPage() {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const handleCreateGroup = async () => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName }),
      });

      if (response.ok) {
        alert('그룹이 생성되었습니다.');
        setGroupName('');
      } else {
        alert('그룹 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('그룹 생성 중 오류 발생:', error);
      alert('그룹 생성 중 오류가 발생했습니다.');
    }
  };

  const handleUserApproval = async (
    userId: number,
    action: 'ACCEPTED' | 'REJECTED'
  ) => {
    try {
      const response = await fetch(`/api/users/${userId}/approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.userId === userId ? { ...user, status: action } : user
          )
        );
        alert(`사용자가 ${action === 'ACCEPTED' ? '승인' : '거절'}되었습니다.`);
      } else {
        alert('작업 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('사용자 승인 처리 중 오류 발생:', error);
      alert('작업 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="min-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">관리자 페이지</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">그룹 생성</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="그룹 이름을 입력하세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateGroup}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              그룹 생성
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">사용자 승인 관리</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
              >
                <span className="text-gray-800">{user.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUserApproval(user.userId, 'ACCEPTED')}
                    disabled={user.status === 'ACCEPTED'}
                    className={`px-4 py-2 rounded-md text-white transition-colors ${
                      user.status === 'ACCEPTED'
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
