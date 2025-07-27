/**
 * CommentsItem - 댓글 아이템 컴포넌트
 * @description 개별 댓글을 표시하는 최적화된 컴포넌트
 */

import React, { useCallback } from 'react'
import { List, Checkbox, Avatar } from 'antd'
import { 
  CommentOutlined, 
  MailOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useCommentsStore from '../../store/useCommentsStore'
import '../../styles/pages.css'
import './comments.css'

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
    >
      <div className={`comment-item-container ${checked ? 'checked' : ''}`}>
        {/* 아바타 */}
        <div className="comment-item-avatar">
          <Avatar 
            size={48}
            className={`comment-avatar item-avatar ${checked ? 'checked' : ''}`}
            icon={<CommentOutlined />}
          >
            {getAvatarText(comment.email)}
          </Avatar>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="comment-item-content">
          {/* 제목 줄 */}
          <div className="comment-item-title">
            <span className="comment-item-name">
              {getSummaryTitle(comment.name)}
            </span>
            <span className="comment-item-post-id">
              Post #{comment.postId}
            </span>
          </div>

          {/* 연락처 및 본문 정보 */}
          <div className="comment-item-details">
            <div className="comment-item-contact">
              <MailOutlined />
              <span>{comment.email}</span>
            </div>
            <div className="comment-item-body">
              {getSummaryBody(comment.body)}
            </div>
          </div>
        </div>

        {/* 태그 정보 */}
        <div className="comment-item-tags">
          {comment.body?.length > 150 && (
            <div className="comment-tag-item">긴 댓글</div>
          )}
          {comment.id <= 50 && (
            <div className="comment-tag-item">인기</div>
          )}
          {comment.id > 450 && (
            <div className="comment-tag-item">최신</div>
          )}
        </div>

        {/* 체크박스 (우측 끝) */}
        <div className="checkbox-container comment-item-checkbox">
          <Checkbox
            checked={checked}
            onChange={handleCheckToggle}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </List.Item>
  )
})

// displayName 설정 (디버깅용)
CommentsItem.displayName = 'CommentsItem'

export default CommentsItem
