import { useState, useMemo } from 'react'
import { List, Button, Alert, Spin, FloatButton, Checkbox, Input, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUsersQuery, useDeleteUsersMutation } from '../../hooks/useUsersQueries'
import useUsersCheckedStore from '../../store/useUsersCheckedStore'
import UsersItem from './UsersItem'
import './users-list.css'
import '../../styles/pages.css'

/**
 * Users 목록 컴포넌트
 * React Query를 사용한 데이터 조회 및 표시
 * 체크박스를 이용한 다중 선택 기능
 */
const UsersList = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  // React Query로 사용자 목록 조회
  const { data: users = [], isLoading, error, refetch } = useUsersQuery()
  
  // 삭제 뮤테이션
  const deleteUsersMutation = useDeleteUsersMutation()

  // Users 전용 체크된 항목들 관리
  const { 
    checkedIds, 
    toggleAllCheck, 
    clearChecked, 
    isAllChecked, 
    isIndeterminate 
  } = useUsersCheckedStore()

  // 검색 필터링된 사용자 목록
  const filteredUsers = useMemo(() => {
    if (!searchText) return users
    return users.filter(user => 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [users, searchText])

  const userIds = filteredUsers.map(user => user.id)

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    toggleAllCheck(userIds)
  }

  // 선택된 항목들 삭제
  const handleDeleteSelected = () => {
    if (checkedIds.size === 0) return
    deleteUsersMutation.mutate(Array.from(checkedIds)) // Set을 배열로 변환
  }

  // 새 사용자 추가 페이지로 이동
  const handleAddNew = () => {
    navigate('/users/user/new')
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p className="loading-text">사용자 목록을 불러오는 중...</p>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <Alert
        message="오류 발생"
        description="사용자 목록을 불러오는데 실패했습니다."
        type="error"
        showIcon
        action={
          <Button onClick={() => refetch()} type="primary">
            다시 시도
          </Button>
        }
      />
    )
  }

  return (
    <div className="page-list-container">
      {/* 검색 및 전체 선택 컨트롤 */}
      <Space direction="vertical" size="middle" className="search-filter-container">
        <Input
          placeholder="이름, 이메일, 사용자명으로 검색..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="search-input"
        />
        
        <div className="select-all-container">
          <Checkbox
            indeterminate={isIndeterminate(userIds)}
            checked={isAllChecked(userIds)}
            onChange={handleSelectAll}
          >
            전체 선택 ({checkedIds.size}/{filteredUsers.length})
          </Checkbox>
          
          {checkedIds.size > 0 && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteSelected}
              loading={deleteUsersMutation.isPending}
            >
              선택된 항목 삭제 ({checkedIds.size})
            </Button>
          )}
        </div>
      </Space>

      {/* 사용자 목록 */}
      <List
        className="list-scroll-hide page-list"
        itemLayout="horizontal"
        dataSource={filteredUsers}
        renderItem={(user) => (
          <UsersItem key={user.id} user={user} />
        )}
        locale={{
          emptyText: searchText 
            ? `"${searchText}"에 대한 검색 결과가 없습니다.`
            : '사용자가 없습니다.'
        }}
      />

      {/* 새 항목 추가 플로팅 버튼 */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={handleAddNew}
        tooltip="새 사용자 추가"
        className={checkedIds.size > 0 ? 'float-button-with-action' : 'float-button-default'}
      />

      {/* 삭제 버튼 고정 배치 */}
      {checkedIds.size > 0 && (
        <div className="fixed-delete-button">
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={handleDeleteSelected}
            loading={deleteUsersMutation.isPending}
            block
          >
            {checkedIds.size}개 항목 삭제
          </Button>
        </div>
      )}
    </div>
  )
}

export default UsersList
