/**
 * CommentsItem - 댓글 아이템 컴포넌트
 * @description 개별 댓글을 표시하는 최적화된 컴포넌트
 */

import React, { useCallback } from 'react'
import { List, Checkbox, Avatar, Tag, Typography, Space } from 'antd'
import { 
  CommentOutlined, 
  MailOutlined,
  NumberOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useCommentsStore from '../../store/useCommentsStore'
import '../../styles/pages.css'
import './comments-list.css'

const { Text } = Typography

/**
 * 댓글 아이템 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.comment - 댓글 데이터
 * @returns {JSX.Element} CommentsItem 컴포넌트
 */
const CommentsItem = React.memo(({ comment }) => {
  const navigate = useNavigate()
  const { checkedIds, toggleCheck, isChecked } = useCommentsStore()

  // 체크 상태
  const checked = isChecked(comment.id)

  /**
   * 체크박스 토글 핸들러
   * @param {Object} e - 체크박스 이벤트
   */
  const handleCheckToggle = useCallback((e) => {
    e.stopPropagation()
    toggleCheck(comment.id)
  }, [comment.id, toggleCheck])

  /**
   * 댓글 아이템 클릭 핸들러 - 상세 페이지로 이동
   * @param {Object} e - 클릭 이벤트
   */
  const handleItemClick = useCallback((e) => {
    // 체크박스 클릭은 제외
    if (e.target.type === 'checkbox') return
    navigate(`/comments/comment/${comment.id}`)
  }, [comment.id, navigate])

  /**
   * 이메일에서 아바타 텍스트 생성
   * @param {string} email - 이메일 주소
   * @returns {string} 아바타 텍스트
   */
  const getAvatarText = useCallback((email) => {
    if (!email) return 'C'
    const parts = email.split('@')
    return parts[0].charAt(0).toUpperCase()
  }, [])

  /**
   * 댓글 제목 요약 생성
   * @param {string} name - 댓글 제목
   * @returns {string} 요약된 제목
   */
  const getSummaryTitle = useCallback((name) => {
    if (!name) return '제목 없음'
    // 최대 50자까지 표시
    return name.length > 50 ? `${name.substring(0, 50)}...` : name
  }, [])

  /**
   * 댓글 내용 요약 생성
   * @param {string} body - 댓글 내용
   * @returns {string} 요약된 내용
   */
  const getSummaryBody = useCallback((body) => {
    if (!body || body.trim() === '') return '댓글 내용이 없습니다.'
    const cleanBody = body.trim()
    // 최대 200자까지 표시 (약 4줄 정도)
    return cleanBody.length > 200 ? `${cleanBody.substring(0, 200)}...` : cleanBody
  }, [])

  return (
    <List.Item
      className={`list-item-base ${checked ? 'checked' : ''} comment-item`}
      onClick={handleItemClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="checkbox-container">
        <Checkbox
          checked={checked}
          onChange={handleCheckToggle}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <List.Item.Meta
        avatar={
          <Avatar 
            className="comment-avatar item-avatar"
            icon={<CommentOutlined />}
          >
            {getAvatarText(comment.email)}
          </Avatar>
        }
        title={
          <>
            <Text className="item-meta-title" strong>
              {getSummaryTitle(comment.name)}
            </Text>
            <div style={{ marginTop: '4px' }}>
              <Space size={4}>
                <Tag 
                  icon={<MailOutlined />} 
                  className="comment-email"
                  color="orange"
                  size="small"
                >
                  {comment.email}
                </Tag>
                <Tag 
                  icon={<NumberOutlined />} 
                  className="comment-post-id"
                  size="small"
                >
                  Post #{comment.postId}
                </Tag>
              </Space>
            </div>
          </>
        }
        description={
          <>
            <div className="comment-body">
              {getSummaryBody(comment.body)}
            </div>
            
            {(comment.body?.length > 150 || comment.id <= 50 || comment.id > 450) && (
              <div className="comment-tags" style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', gap: '8px' }}>
                {comment.body?.length > 150 && (
                  <Tag className="comment-tag" size="small">긴 댓글</Tag>
                )}
                {comment.id <= 50 && (
                  <Tag className="comment-tag" size="small">인기</Tag>
                )}
                {comment.id > 450 && (
                  <Tag className="comment-tag" size="small">최신</Tag>
                )}
              </div>
            )}
          </>
        }
      />
    </List.Item>
  )
})

// displayName 설정 (디버깅용)
CommentsItem.displayName = 'CommentsItem'

export default CommentsItem
