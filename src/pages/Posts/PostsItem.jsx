import React, { memo, useCallback } from 'react'
import { List, Checkbox, Typography, Tag, Avatar } from 'antd'
import { BookOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useCheckedStore from '../../store/useCheckedStore'
import './posts-list.css'
import '../../styles/pages.css'

const { Text, Paragraph } = Typography

/**
 * 개별 Post 아이템 컴포넌트
 * 체크박스와 게시글 정보를 표시하며, 클릭 시 상세 페이지로 이동
 */
const PostsItem = memo(({ post }) => {
  const navigate = useNavigate()
  
  // Zustand store에서 필요한 상태와 함수들을 가져오기
  const { checkedIds, toggleCheck } = useCheckedStore()
  const checked = checkedIds.includes(post.id)

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

  // 제목 줄임 처리
  const truncatedTitle = post.title?.length > 50 
    ? `${post.title.substring(0, 50)}...` 
    : post.title

  // 내용 줄임 처리
  const truncatedBody = post.body?.length > 100 
    ? `${post.body.substring(0, 100)}...` 
    : post.body

  return (
    <List.Item
      className={`list-item-base ${checked ? 'checked' : ''}`}
      onClick={handleItemClick}
      actions={[
        <Tag key="id" color="blue" className="item-tag">
          ID: {post.id}
        </Tag>,
        <Tag key="userId" color="green" icon={<UserOutlined />} className="item-tag">
          User: {post.userId}
        </Tag>
      ]}
    >
      <div className="checkbox-container">
        {/* 체크박스 */}
        <Checkbox
          checked={checked}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
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
            <div>
              <Typography.Text strong className="item-meta-title">
                {truncatedTitle}
              </Typography.Text>
            </div>
          }
          description={
            <div className="post-description-container">
              <Typography.Paragraph className="item-meta-description">
                {truncatedBody}
              </Typography.Paragraph>
            </div>
          }
        />
      </div>
    </List.Item>
  )
})

PostsItem.displayName = 'PostsItem'

export default PostsItem
