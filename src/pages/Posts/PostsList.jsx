import React, { memo, useCallback } from 'react'
import { List, Alert, Spin, Button, FloatButton } from 'antd'
import { PlusOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { usePostsQuery, useDeletePostsMutation } from '../../hooks/usePostsQueries'
import usePostsStore from '../../store/usePostsStore'
import PostsItem from './PostsItem'
import './posts.css'
import '../../styles/pages.css'

/**
 * Posts 리스트 컴포넌트 (최적화)
 * React Query로 데이터 관리, Posts 전용 Zustand로 체크박스 상태 관리
 */
const PostsList = memo(() => {
  const navigate = useNavigate()
  const { data: posts, isLoading, error } = usePostsQuery()
  const deletePostsMutation = useDeletePostsMutation()
  const { checkedIds, clearChecked } = usePostsStore()

  // 체크된 항목이 있는지 확인
  const hasCheckedItems = checkedIds.size > 0

  // 체크된 항목들 삭제 - useCallback으로 최적화
  const handleDeleteSelected = useCallback(async () => {
    if (checkedIds.size === 0) return
    
    try {
      await deletePostsMutation.mutateAsync(Array.from(checkedIds)) // Set을 배열로 변환
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }, [checkedIds, deletePostsMutation])

  // 새 게시글 추가 페이지로 이동 - useCallback으로 최적화
  const handleAddPost = useCallback(() => {
    navigate('/posts/post/new')
  }, [navigate])

  if (error) {
    return (
      <Alert
        message="데이터 로딩 오류"
        description="게시글 목록을 불러오는 중 오류가 발생했습니다."
        type="error"
        showIcon
        className="error-alert"
      />
    )
  }

  return (
    <div className="page-list-container posts-list-container">
      <Spin spinning={isLoading} tip="게시글을 불러오는 중...">
        <List
          className={`list-scroll-hide page-list ${hasCheckedItems ? 'has-bottom-action' : ''}`}
          itemLayout="vertical"
          size="large"
          dataSource={posts || []}
          renderItem={(post) => (
            <PostsItem key={post.id} post={post} />
          )}
          locale={{
            emptyText: (
              <div className="empty-container">
                <BookOutlined className="empty-icon" />
                <p className="empty-text">등록된 게시글이 없습니다.</p>
              </div>
            )
          }}
        />
      </Spin>

      {/* 새 게시글 추가 플로팅 버튼 */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        tooltip="새 게시글 추가"
        onClick={handleAddPost}
        className={hasCheckedItems ? 'float-button-with-action' : 'float-button-default'}
      />

      {/* 체크된 게시글 삭제 버튼 - 체크된 항목이 있을 때만 표시 */}
      {hasCheckedItems && (
        <div className="bottom-action-bar">
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={handleDeleteSelected}
            loading={deletePostsMutation.isPending}
            className="delete-selected-button"
          >
            선택된 {checkedIds.size}개 게시글 삭제
          </Button>
        </div>
      )}
    </div>
  )
})

PostsList.displayName = 'PostsList'

export default PostsList
