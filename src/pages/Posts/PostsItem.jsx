import React, { memo, useCallback } from 'react'
import { List, Checkbox, Typography, Tag, Avatar } from 'antd'
import { BookOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import usePostsCheckedStore from '../../store/usePostsCheckedStore'
import './posts-list.css'
import '../../styles/pages.css'

const { Text, Paragraph } = Typography

/**
 * 개별 Post 아이템 컴포넌트
 * 체크박스와 게시글 정보를 표시하며, 클릭 시 상세 페이지로 이동
 */
const PostsItem = memo(({ post }) => {
  const navigate = useNavigate()
  
  // Posts 전용 Zustand store에서 필요한 상태와 함수들을 가져오기
  const { checkedIds, toggleCheck } = usePostsCheckedStore()
  const checked = checkedIds.has(post.id) // Set 객체이므로 has() 메서드 사용

  // 체크박스 상태 변경
  const handleCheckboxChange = useCallback((e) => {
    e.stopPropagation() // 이벤트 버블링 방지
    console.log(`체크박스 클릭: Post ID ${post.id}, 현재 상태: ${checked}`) // 디버깅용
    toggleCheck(post.id)
  }, [post.id, toggleCheck, checked])

  // 게시글 클릭 시 상세 페이지로 이동
  const handleItemClick = useCallback(() => {
    navigate(`/posts/post/${post.id}`)
  }, [navigate, post.id])

  // 제목 줄임 처리 - 더 긴 제목 허용
  const truncatedTitle = post.title?.length > 80 
    ? `${post.title.substring(0, 80)}...` 
    : post.title

  // 내용 줄임 처리 - 더 많은 내용 표시
  const truncatedBody = post.body?.length > 150 
    ? `${post.body.substring(0, 150)}...` 
    : post.body

  return (
    <List.Item
      className={`list-item-base ${checked ? 'checked' : ''}`}
      onClick={handleItemClick}
      style={{
        overflow: 'hidden',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
      }}
      actions={[
        <Tag key="id" color="blue" className="item-tag">
          <strong>ID: {post.id}</strong>
        </Tag>,
        <Tag key="userId" color="green" icon={<UserOutlined />} className="item-tag">
          <strong>User: {post.userId}</strong>
        </Tag>
      ]}
    >
      <div className="checkbox-container" style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* 체크박스 */}
        <Checkbox
          checked={checked}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          style={{ flexShrink: 0, marginTop: '4px' }}
        />

        {/* 게시글 메타 정보 */}
        <List.Item.Meta
          avatar={
            <Avatar 
              icon={<BookOutlined />} 
              className="item-avatar post-avatar"
            />
          }
          title={
            <div style={{ 
              color: '#262626', 
              fontSize: '18px', 
              fontWeight: 700, 
              lineHeight: 1.4,
              marginBottom: '12px',
              display: 'block',
              width: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}>
              {truncatedTitle}
            </div>
          }
          description={
            <div style={{ 
              color: '#595959', 
              fontSize: '15px', 
              lineHeight: 1.6,
              background: 'rgba(114, 46, 209, 0.02)',
              padding: '12px 16px',
              borderRadius: '8px',
              borderLeft: '3px solid #722ed1',
              display: 'block',
              width: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              minHeight: '50px'
            }}>
              {truncatedBody}
            </div>
          }
        />
      </div>
    </List.Item>
  )
})

PostsItem.displayName = 'PostsItem'

export default PostsItem
