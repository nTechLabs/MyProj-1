import { useState, useMemo } from 'react'
import { List, Button, Alert, Spin, FloatButton, Checkbox, Input, Space, Select } from 'antd'
import { PlusOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTodosQuery, useDeleteTodosMutation } from '../../hooks/useTodosQueries'
import useCheckedStore from '../../store/useCheckedStore'
import TodosItem from './TodosItem'
import './todos-list.css'
import '../../styles/pages.css'

const { Option } = Select

/**
 * Todos 목록 컴포넌트
 * React Query를 사용한 데이터 조회 및 표시
 * 체크박스를 이용한 다중 선택 기능
 */
const TodosList = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'completed', 'pending'

  // React Query로 할일 목록 조회
  const { data: todos = [], isLoading, error, refetch } = useTodosQuery()
  
  // 삭제 뮤테이션
  const deleteTodosMutation = useDeleteTodosMutation()

  // 체크된 항목들 관리
  const { 
    checkedIds, 
    toggleAllCheck, 
    clearChecked, 
    isAllChecked, 
    isIndeterminate 
  } = useCheckedStore()

  // 검색 및 상태 필터링된 할일 목록
  const filteredTodos = useMemo(() => {
    let filtered = todos

    // 텍스트 검색 필터
    if (searchText) {
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(todo => {
        if (statusFilter === 'completed') return todo.completed
        if (statusFilter === 'pending') return !todo.completed
        return true
      })
    }

    return filtered
  }, [todos, searchText, statusFilter])

  const todoIds = filteredTodos.map(todo => todo.id)

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    toggleAllCheck(todoIds)
  }

  // 선택된 항목들 삭제
  const handleDeleteSelected = () => {
    if (checkedIds.length === 0) return
    deleteTodosMutation.mutate(checkedIds)
  }

  // 새 할일 추가 페이지로 이동
  const handleAddNew = () => {
    navigate('/todos/todo/new')
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p className="loading-text">할일 목록을 불러오는 중...</p>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <Alert
        message="오류 발생"
        description="할일 목록을 불러오는데 실패했습니다."
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

  // 통계 계산
  const completedCount = filteredTodos.filter(todo => todo.completed).length
  const totalCount = filteredTodos.length

  return (
    <div className="page-list-container">
      {/* 검색 및 필터 컨트롤 */}
      <Space direction="vertical" size="middle" className="search-filter-container">
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="할일 제목으로 검색..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="search-input"
          />
          
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="filter-select"
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">전체 보기</Option>
            <Option value="completed">완료됨</Option>
            <Option value="pending">미완료</Option>
          </Select>
        </Space>

        {/* 통계 및 전체 선택 */}
        <div className="select-all-container">
          <div className="select-all-left">
            <Checkbox
              indeterminate={isIndeterminate(todoIds)}
              checked={isAllChecked(todoIds)}
              onChange={handleSelectAll}
            >
              전체 선택 ({checkedIds.length}/{totalCount})
            </Checkbox>
            
            <span className="select-stats">
              완료: {completedCount} / 전체: {totalCount}
            </span>
          </div>
          
          {checkedIds.length > 0 && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteSelected}
              loading={deleteTodosMutation.isPending}
            >
              선택된 항목 삭제 ({checkedIds.length})
            </Button>
          )}
        </div>
      </Space>

      {/* 할일 목록 */}
      <List
        className="list-scroll-hide page-list"
        itemLayout="horizontal"
        dataSource={filteredTodos}
        renderItem={(todo) => (
          <TodosItem key={todo.id} todo={todo} />
        )}
        locale={{
          emptyText: searchText || statusFilter !== 'all'
            ? `검색 조건에 맞는 할일이 없습니다.`
            : '할일이 없습니다.'
        }}
      />

      {/* 새 항목 추가 플로팅 버튼 */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={handleAddNew}
        tooltip="새 할일 추가"
        className={checkedIds.length > 0 ? 'float-button-with-action' : 'float-button-default'}
      />

      {/* 삭제 버튼 고정 배치 */}
      {checkedIds.length > 0 && (
        <div className="fixed-delete-button">
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={handleDeleteSelected}
            loading={deleteTodosMutation.isPending}
            block
          >
            {checkedIds.length}개 항목 삭제
          </Button>
        </div>
      )}
    </div>
  )
}

export default TodosList
