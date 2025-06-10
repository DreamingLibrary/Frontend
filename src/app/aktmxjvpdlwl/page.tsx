'use client';

import { useState } from 'react';
import {
  fetchCreateGroup,
  fetchGroupAdminPromotion,
  fetchGroupNameChange,
  fetchGroupDelete,
} from '../api/apis';

export default function AdminPage() {
  const [groupName, setGroupName] = useState('');
  const [adminPromotionGroupId, setAdminPromotionGroupId] = useState('');
  const [adminPromotionUserId, setAdminPromotionUserId] = useState('');
  const [nameChangeGroupId, setNameChangeGroupId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [deleteGroupId, setDeleteGroupId] = useState('');

  const handleCreateGroup = async (groupName: string) => {
    try {
      const response = await fetchCreateGroup(groupName);

      if (response.success) {
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

  const handleAdminPromotion = async () => {
    try {
      const response = await fetchGroupAdminPromotion(
        parseInt(adminPromotionGroupId)
        // TODO: id 넘기기
        // parseInt(adminPromotionUserId)
      );

      if (response.success) {
        alert('관리자로 승격되었습니다.');
        setAdminPromotionGroupId('');
        setAdminPromotionUserId('');
      } else {
        alert('관리자 승격에 실패했습니다.');
      }
    } catch (error) {
      console.error('관리자 승격 중 오류 발생:', error);
      alert('관리자 승격 중 오류가 발생했습니다.');
    }
  };

  const handleGroupNameChange = async () => {
    try {
      const response = await fetchGroupNameChange(
        parseInt(nameChangeGroupId),
        newGroupName
      );

      if (response.success) {
        alert('그룹 이름이 변경되었습니다.');
        setNameChangeGroupId('');
        setNewGroupName('');
      } else {
        alert('그룹 이름 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('그룹 이름 변경 중 오류 발생:', error);
      alert('그룹 이름 변경 중 오류가 발생했습니다.');
    }
  };

  const handleGroupDelete = async () => {
    if (!window.confirm('정말로 이 그룹을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetchGroupDelete(parseInt(deleteGroupId));

      if (response.success) {
        alert('그룹이 삭제되었습니다.');
        setDeleteGroupId('');
      } else {
        alert('그룹 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('그룹 삭제 중 오류 발생:', error);
      alert('그룹 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold mb-8">마스터 페이지</h1>
        {/* 관리자 승격 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">그룹 관리자 승격</h2>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="그룹 ID"
              value={adminPromotionGroupId}
              onChange={(e) => setAdminPromotionGroupId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="사용자 ID"
              value={adminPromotionUserId}
              onChange={(e) => setAdminPromotionUserId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAdminPromotion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              관리자로 승격
            </button>
          </div>
        </div>

        {/* 그룹 생성 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
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
              onClick={() => handleCreateGroup(groupName)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              그룹 생성
            </button>
          </div>
        </div>

        {/* 그룹 이름 변경 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">그룹 이름 변경</h2>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="그룹 ID"
              value={nameChangeGroupId}
              onChange={(e) => setNameChangeGroupId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="새 그룹 이름"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleGroupNameChange}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              이름 변경
            </button>
          </div>
        </div>

        {/* 그룹 삭제 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">그룹 삭제</h2>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="그룹 ID"
              value={deleteGroupId}
              onChange={(e) => setDeleteGroupId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleGroupDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              그룹 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
