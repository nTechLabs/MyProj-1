/**
 * CommentsPage - 댓글 관리 메인 페이지
 * @description React Query + Zustand 기반 댓글 CRUD 애플리케이션
 */

import React from 'react'
import { Typography } from 'antd'
import CommentsList from './CommentsList'
import '../../styles/pages.css'
import './comments.css'

const { Title } = Typography

/**
 * 댓글 관리 메인 컨테이너 컴포넌트
 * @returns {JSX.Element} CommentsPage 컴포넌트
 */
const CommentsPage = () => {
  return (
    <div className="comments-page">
      <CommentsList />
    </div>
  )
}

export default CommentsPage
