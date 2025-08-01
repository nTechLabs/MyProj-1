import React, { useState, useMemo, useCallback } from 'react'
import { List, Button, Alert, Spin, FloatButton, Checkbox, Input, Space, Select } from 'antd'
import { PlusOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTodosQuery, useDeleteTodosMutation } from '../../hooks/useTodosQueries'
import useTodosStore from '../../store/useTodosStore'
import TodosItem from './TodosItem'
import './todos.css'
import '../../styles/pages.css'

const { Option } = Select

/**
 * Todos 목록 컴포넌트 (최적화)
 * React Query를 사용한 데이터 조회 및 표시
 * 체크박스를 이용한 다중 선택 기능
 */
const TodosList = React.memo(() => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'todo', 'in_progress', 'review', 'completed', 'cancelled'

  // React Query로 할일 목록 조회
  const { data: todos = [], isLoading, error, refetch } = useTodosQuery()
  
  // 삭제 뮤테이션
  const deleteTodosMutation = useDeleteTodosMutation()

  // Todos 전용 체크된 항목들 관리
  const { 
    checkedIds, 
    toggleAllCheck, 
    clearChecked, 
    isAllChecked, 
    isIndeterminate 
  } = useTodosStore()

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
      filtered = filtered.filter(todo => todo.status === statusFilter)
    }

    return filtered
  }, [todos, searchText, statusFilter])

  const todoIds = filteredTodos.map(todo => todo.id)

  // 전체 선택/해제 핸들러 - useCallback으로 최적화
  const handleSelectAll = useCallback(() => {
    toggleAllCheck(todoIds)
  }, [toggleAllCheck, todoIds])

  // 선택된 항목들 삭제 - useCallback으로 최적화
  const handleDeleteSelected = useCallback(() => {
    if (checkedIds.size === 0) return
    deleteTodosMutation.mutate(Array.from(checkedIds)) // Set을 배열로 변환
  }, [checkedIds, deleteTodosMutation])

  // 새 할일 추가 페이지로 이동 - useCallback으로 최적화
  const handleAddNew = useCallback(() => {
    navigate('/todos/todo/new')
  }, [navigate])

  // 검색 핸들러 - useCallback으로 최적화
  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value)
  }, [])

  // 상태 필터 변경 핸들러 - useCallback으로 최적화
  const handleStatusFilterChange = useCallback((value) => {
    setStatusFilter(value)
  }, [])

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
  const completedCount = filteredTodos.filter(todo => todo.status === 'completed').length
  const totalCount = filteredTodos.length

  return (
    <div className="page-list-container">
      {/* 검색 및 필터 컨트롤 */}
      <Space direction="vertical" size="middle" className="search-filter-container">
        <Space wrap className="search-filter-space">
          <Input
            placeholder="할일 제목으로 검색..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearchChange}
            allowClear
            className="search-input"
          />
          
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="filter-select"
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">전체 보기</Option>
            <Option value="todo">할 일</Option>
            <Option value="in_progress">진행 중</Option>
            <Option value="review">검토 중</Option>
            <Option value="completed">완료됨</Option>
            <Option value="cancelled">취소됨</Option>
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
              전체 선택 ({checkedIds.size}/{totalCount})
            </Checkbox>
            
            <span className="select-stats">
              완료: {completedCount} / 전체: {totalCount}
            </span>
          </div>
          
          {checkedIds.size > 0 && (
            <span className="selected-count-text">
              {checkedIds.size} 개 선택됨
            </span>
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
        className={checkedIds.size > 0 ? 'float-button-with-action' : 'float-button-default'}
      />
    </div>
  )
})

TodosList.displayName = 'TodosList'

export default TodosList
