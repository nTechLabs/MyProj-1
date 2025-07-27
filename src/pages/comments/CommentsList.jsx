/**
 * CommentsList - 댓글 목록 관리 컴포넌트
 * @description React Query를 사용한 댓글 데이터 조회 및 관리
 */

import React, { useState, useMemo, useCallback } from 'react'
import { 
  List, 
  Button, 
  Alert, 
  Spin, 
  FloatButton, 
  Input, 
  Select, 
  Space,
  Checkbox, 
  Typography,
  Empty,
  Badge,
  Tag
} from 'antd'
import { 
  PlusOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  CommentOutlined,
  MailOutlined,
  ClockCircleOutlined,
  FireOutlined,
  AlignLeftOutlined,
  MinusCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCommentsQuery, useDeleteCommentsMutation } from '../../hooks/useCommentsQueries'
import useCommentsStore from '../../store/useCommentsStore'
import CommentsItem from './CommentsItem'
import '../../styles/pages.css'
import './comments.css'

const { Text } = Typography
const { Search } = Input
const { Option } = Select

/**
 * 댓글 목록 컴포넌트
 * @returns {JSX.Element} CommentsList 컴포넌트
 */
const CommentsList = () => {
  const navigate = useNavigate()
  
  // 로컬 상태
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTypes, setFilterTypes] = useState([]) // 배열로 변경
  
  // React Query
  const { 
    data: comments = [], 
    isLoading, 
    isError, 
    error 
  } = useCommentsQuery()
  
  const deleteCommentsMutation = useDeleteCommentsMutation()
  
  // Zustand 상태
  const { 
    checkedIds, 
    toggleAllCheck, 
    clearChecked,
    isAllChecked,
    isIndeterminate,
    getCheckedCount 
  } = useCommentsStore()

  /**
   * 검색 및 필터링된 댓글 목록
   * @type {Array} 필터링된 댓글 배열
   */
  const filteredComments = useMemo(() => {
    if (!comments || comments.length === 0) return []
    
    let filtered = [...comments] // 원본 배열 복사
    
    // 검색 필터링 (검색어가 있을 때만)
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(comment => 
        (comment.name && comment.name.toLowerCase().includes(term)) ||
        (comment.email && comment.email.toLowerCase().includes(term)) ||
        (comment.body && comment.body.toLowerCase().includes(term))
      )
    }
    
    // 다중 타입 필터링
    if (filterTypes && filterTypes.length > 0) {
      filtered = filtered.filter(comment => {
        return filterTypes.some(filterType => {
          switch (filterType) {
            case 'recent':
              // 최신: ID가 높은 댓글들 (상위 20%)
              return comment.id > 400
            case 'popular':
              // 인기: ID가 낮은 댓글들 (하위 20%)
              return comment.id <= 100
            case 'long':
              // 긴 댓글: 본문이 긴 댓글들
              return comment.body && comment.body.length > 200
            case 'short':
              // 짧은 댓글: 본문이 짧은 댓글들
              return comment.body && comment.body.length <= 100
            default:
              return false
          }
        })
      })
    }
    
    // ID 기준 내림차순 정렬 (최신순)
    return filtered.sort((a, b) => b.id - a.id)
  }, [comments, searchTerm, filterTypes])

  /**
   * 검색어 변경 핸들러 (실시간 검색)
   * @param {string} value - 검색어
   */
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value)
    clearChecked()
  }, [clearChecked])

  /**
   * 검색 입력 변경 핸들러 (onChange)
   * @param {Object} e - 입력 이벤트
   */
  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value === '') {
      clearChecked()
    }
  }, [clearChecked])

  /**
   * 퀵 필터 토글 핸들러
   * @param {string} filterType - 필터 타입
   */
  const handleQuickFilterToggle = useCallback((filterType) => {
    setFilterTypes(prev => {
      const newTypes = [...prev]
      const index = newTypes.indexOf(filterType)
      
      if (index > -1) {
        // 이미 선택된 필터면 제거
        newTypes.splice(index, 1)
      } else {
        // 선택되지 않은 필터면 추가
        newTypes.push(filterType)
      }
      
      clearChecked()
      return newTypes
    })
  }, [clearChecked])

  /**
   * 필터 타입 변경 핸들러
   * @param {Array} values - 필터 타입 배열
   */
  const handleFilterChange = useCallback((values) => {
    setFilterTypes(values || [])
    clearChecked()
  }, [clearChecked])

  /**
   * 전체 선택 토글 핸들러
   * @param {Object} e - 체크박스 이벤트
   */
  const handleToggleAll = useCallback((e) => {
    const allIds = filteredComments.map(comment => comment.id)
    toggleAllCheck(allIds, e.target.checked)
  }, [filteredComments, toggleAllCheck])

  /**
   * 선택된 댓글 삭제 핸들러
   */
  const handleDeleteSelected = useCallback(() => {
    if (checkedIds.size === 0) return
    deleteCommentsMutation.mutate(Array.from(checkedIds)) // Set을 배열로 변환
  }, [checkedIds, deleteCommentsMutation])

  /**
   * 새 댓글 추가 페이지로 이동
   */
  const handleAddComment = useCallback(() => {
    navigate('/comments/comment/new')
  }, [navigate])

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <div className="loading-text">댓글을 불러오는 중...</div>
      </div>
    )
  }

  // 에러 상태
  if (isError) {
    return (
      <Alert
        message="댓글 목록 조회 실패"
        description={error?.message || '댓글 목록을 불러올 수 없습니다.'}
        type="error"
        showIcon
        className="error-alert"
      />
    )
  }

  // 체크된 항목 수
  const checkedCount = getCheckedCount()
  const hasChecked = checkedCount > 0

  return (
    <div className="page-list-container">
      {/* 검색 및 필터 */}
      <div className="search-filter-container">
        <div className="search-filter-row">
          <div className="search-filter-group">
            <Search
              placeholder="댓글 제목, 이메일, 내용으로 검색..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onSearch={handleSearchChange}
              onChange={handleSearchInputChange}
              className="search-input"
              prefix={<CommentOutlined />}
            />
            <Select
              mode="multiple"
              value={filterTypes}
              onChange={handleFilterChange}
              size="large"
              className="filter-select filter-select-custom"
              placeholder="필터 선택 (다중 선택 가능)"
              allowClear
              maxTagCount="responsive"
            >
              <Option value="recent">최신 (ID 400+)</Option>
              <Option value="popular">인기 (ID 1-100)</Option>
              <Option value="long">긴 댓글 (200자+)</Option>
              <Option value="short">짧은 댓글 (100자-)</Option>
            </Select>
          </div>
        </div>
        
        {/* 퀵 필터 버튼 */}
        <div className="quick-filter-row">
          <div className="quick-filter-group">
            <Tag.CheckableTag
              checked={filterTypes.includes('recent')}
              onChange={() => handleQuickFilterToggle('recent')}
              className="quick-filter-tag"
            >
              <ClockCircleOutlined /> 최신
            </Tag.CheckableTag>
            <Tag.CheckableTag
              checked={filterTypes.includes('popular')}
              onChange={() => handleQuickFilterToggle('popular')}
              className="quick-filter-tag"
            >
              <FireOutlined /> 인기
            </Tag.CheckableTag>
            <Tag.CheckableTag
              checked={filterTypes.includes('long')}
              onChange={() => handleQuickFilterToggle('long')}
              className="quick-filter-tag"
            >
              <AlignLeftOutlined /> 긴 댓글
            </Tag.CheckableTag>
            <Tag.CheckableTag
              checked={filterTypes.includes('short')}
              onChange={() => handleQuickFilterToggle('short')}
              className="quick-filter-tag"
            >
              <MinusCircleOutlined /> 짧은 댓글
            </Tag.CheckableTag>
          </div>
        </div>
      </div>

      {/* 전체 선택 및 통계 */}
      {filteredComments.length > 0 && (
        <div className="select-all-container">
          <div className="select-all-left">
            <Checkbox
              indeterminate={isIndeterminate}
              onChange={handleToggleAll}
              checked={isAllChecked(filteredComments.map(c => c.id))}
            >
              전체 선택
            </Checkbox>
            {(searchTerm || filterTypes?.length > 0) && (
              <Text type="secondary" className="filter-info-text">
                {searchTerm && `"${searchTerm}" 검색 결과`}
                {searchTerm && filterTypes?.length > 0 && ' | '}
                {filterTypes?.length > 0 && `${filterTypes.map(type => {
                  switch(type) {
                    case 'recent': return '최신';
                    case 'popular': return '인기';
                    case 'long': return '긴 댓글';
                    case 'short': return '짧은 댓글';
                    default: return type;
                  }
                }).join(', ')} 필터 적용`}
              </Text>
            )}
          </div>
          <div className="select-stats">
            <Space>
              <Badge 
                count={filteredComments.length}
              />
              <Text type="secondary">
                {comments.length !== filteredComments.length && 
                  `전체 ${comments.length}개 중 `}
                {checkedCount > 0 && `${checkedCount}개 선택됨`}
              </Text>
            </Space>
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      {filteredComments.length === 0 ? (
        <div className="empty-container">
          <Empty
            image={<CommentOutlined className="empty-icon" />}
            description={
              <div className="empty-text">
                {searchTerm && filterTypes?.length > 0 ? (
                  <>
                    <div>"{searchTerm}" 검색어와 {filterTypes.map(type => {
                      switch(type) {
                        case 'recent': return '최신';
                        case 'popular': return '인기';
                        case 'long': return '긴 댓글';
                        case 'short': return '짧은 댓글';
                        default: return type;
                      }
                    }).join(', ')} 필터에</div>
                    <div>맞는 댓글이 없습니다</div>
                  </>
                ) : searchTerm ? (
                  <>
                    <div>"{searchTerm}"에 대한</div>
                    <div>검색 결과가 없습니다</div>
                  </>
                ) : filterTypes?.length > 0 ? (
                  <>
                    <div>{filterTypes.map(type => {
                      switch(type) {
                        case 'recent': return '최신';
                        case 'popular': return '인기';
                        case 'long': return '긴 댓글';
                        case 'short': return '짧은 댓글';
                        default: return type;
                      }
                    }).join(', ')} 필터에</div>
                    <div>맞는 댓글이 없습니다</div>
                  </>
                ) : (
                  '댓글이 없습니다'
                )}
              </div>
            }
          />
        </div>
      ) : (
        <List
          className={`page-list list-scroll-hide ${hasChecked ? 'has-bottom-action' : ''}`}
          itemLayout="horizontal"
          dataSource={filteredComments}
          renderItem={(comment) => (
            <CommentsItem key={comment.id} comment={comment} />
          )}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total}개 댓글`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
        />
      )}

      {/* 선택된 항목 삭제 버튼 */}
      {hasChecked && (
        <div className="fixed-delete-button">
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={deleteCommentsMutation.isPending}
            onClick={handleDeleteSelected}
            size="large"
          >
            선택된 {checkedCount}개 삭제
          </Button>
        </div>
      )}

      {/* 새 댓글 추가 버튼 */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        className={hasChecked ? 'float-button-with-action' : 'float-button-default'}
        onClick={handleAddComment}
        tooltip="새 댓글 추가"
      />
    </div>
  )
}

export default CommentsList
