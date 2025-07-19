import React, { memo, useCallback } from 'react'
import { List, Checkbox, Typography, Tag, Avatar } from 'antd'
import { BookOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCheckedStore } from '../../store/useCheckedStore'

const { Text, Paragraph } = Typography

/**
 * 개별 Post 아이템 컴포넌트
 * 체크박스와 게시글 정보를 표시하며, 클릭 시 상세 페이지로 이동
 */
const PostsItem = memo(({ post }) => {
  const navigate = useNavigate()
  const { checkedItems, toggleItem } = useCheckedStore()
  const isChecked = checkedItems[post.id] || false

  // 체크박스 상태 변경
  const handleCheckboxChange = useCallback((e) => {
    e.stopPropagation()
    toggleItem(post.id)
  }, [post.id, toggleItem])

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
      className={`post-item list-item-base ${isChecked ? 'checked' : ''}`}
      onClick={handleItemClick}
      style={{ 
        cursor: 'pointer',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        backgroundColor: isChecked ? '#f0f9ff' : '#ffffff'
      }}
      actions={[
        <Tag key="id" color="blue">
          ID: {post.id}
        </Tag>,
        <Tag key="userId" color="green" icon={<UserOutlined />}>
          User: {post.userId}
        </Tag>
      ]}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%' }}>
        {/* 체크박스 */}
        <Checkbox
          checked={isChecked}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
        />

        {/* 게시글 메타 정보 */}
        <List.Item.Meta
          avatar={
            <Avatar 
              icon={<BookOutlined />} 
              style={{ 
                backgroundColor: '#722ed1',
                fontSize: '18px'
              }} 
            />
          }
          title={
            <div>
              <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                {truncatedTitle}
              </Text>
            </div>
          }
          description={
            <div style={{ marginTop: '8px' }}>
              <Paragraph
                style={{
                  margin: 0,
                  color: '#666666',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}
              >
                {truncatedBody}
              </Paragraph>
            </div>
          }
        />
      </div>
    </List.Item>
  )
})

PostsItem.displayName = 'PostsItem'

export default PostsItem
