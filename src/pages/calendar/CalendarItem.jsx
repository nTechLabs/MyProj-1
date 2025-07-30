import React, { useCallback } from 'react'
import { List, Badge, Typography, Tag, Avatar } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined, BookOutlined, HeartOutlined, TrophyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCalendarToggleCheck, useCalendarIsChecked } from '../../store/useCalendarStore'
import './calendar.css'

const { Text } = Typography

/**
 * 캘린더 개별 항목 컴포넌트
 * Task 타입별 색상과 아이콘으로 구별
 * 체크박스 선택 및 상세 페이지 이동 기능
 */
const CalendarItem = ({ calendar }) => {
  const navigate = useNavigate()
  const toggleCheck = useCalendarToggleCheck()
  const isChecked = useCalendarIsChecked()

  // Task 타입별 설정
  const taskTypeConfig = {
    meeting: { color: '#1890ff', icon: <TeamOutlined />, label: '회의', bgColor: '#e6f7ff' },
    task: { color: '#52c41a', icon: <BookOutlined />, label: '업무', bgColor: '#f6ffed' },
    personal: { color: '#fa8c16', icon: <HeartOutlined />, label: '개인', bgColor: '#fff7e6' },
    event: { color: '#722ed1', icon: <TrophyOutlined />, label: '이벤트', bgColor: '#f9f0ff' },
    reminder: { color: '#eb2f96', icon: <ClockCircleOutlined />, label: '알림', bgColor: '#fff0f6' }
  }

  const config = taskTypeConfig[calendar.type] || taskTypeConfig.task
  const checked = isChecked(calendar.id)

  // 체크박스 토글
  const handleCheckboxChange = useCallback((e) => {
    e.stopPropagation()
    toggleCheck(calendar.id)
  }, [calendar.id, toggleCheck])

  // 상세 페이지로 이동
  const handleClick = useCallback(() => {
    navigate(`/calendar/calendar/${calendar.id}`)
  }, [calendar.id, navigate])

  // 날짜 및 시간 포맷팅
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime)
    const dateStr = date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    })
    const timeStr = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return { dateStr, timeStr }
  }

  const { dateStr, timeStr } = formatDateTime(calendar.date)

  // 디버깅을 위한 콘솔 로그 추가
  console.log('CalendarItem rendering:', {
    id: calendar.id,
    title: calendar.title,
    type: calendar.type,
    date: calendar.date,
    description: calendar.description,
    location: calendar.location
  })

  return (
    <List.Item
      className={`list-item-base calendar-item ${checked ? 'checked' : ''}`}
      onClick={handleClick}
      style={{ 
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        minHeight: '120px',
        backgroundColor: '#ffffff',
        border: '1px solid #d9d9d9',
        borderRadius: '12px',
        marginBottom: '12px'
      }}
    >
      <div className="calendar-item-wrapper" style={{ 
        display: 'flex', 
        padding: '16px', 
        minHeight: '100px',
        visibility: 'visible',
        opacity: 1
      }}>
        {/* 체크박스 */}
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            className="calendar-item-checkbox"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* 아바타 영역 */}
        <div className="calendar-item-avatar-container" style={{ flexShrink: 0 }}>
          <Avatar
            icon={config.icon}
            className={`calendar-item-avatar calendar-avatar-${calendar.type}`}
            size={48}
            style={{
              backgroundColor: config.color,
              color: '#ffffff',
              border: '2px solid #ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="calendar-item-content" style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          visibility: 'visible',
          opacity: 1
        }}>
          {/* 제목과 태그 영역 */}
          <div className="calendar-item-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start' 
          }}>
            <div className="calendar-item-title-section" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              flex: 1 
            }}>
              <Text strong className="calendar-item-title" style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#262626',
                margin: 0,
                visibility: 'visible',
                opacity: 1
              }}>
                {calendar.title}
              </Text>
              <Tag className={`calendar-item-tag calendar-tag-${calendar.type}`} style={{
                backgroundColor: config.color,
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                {config.label}
              </Tag>
            </div>
            {/* 우선순위 표시 */}
            {calendar.priority && (
              <div className="calendar-item-priority">
                <Badge
                  className={`calendar-item-priority-badge calendar-priority-${calendar.priority}`}
                  text={calendar.priority === 'high' ? '높음' : calendar.priority === 'medium' ? '보통' : '낮음'}
                />
              </div>
            )}
          </div>

          {/* 시간 정보 */}
          <div className="calendar-item-time" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            background: '#f8f9ff',
            borderRadius: '8px',
            border: '1px solid #e6f0ff',
            borderLeft: '4px solid #722ed1'
          }}>
            <CalendarOutlined className="calendar-item-time-icon" style={{
              fontSize: '14px',
              color: '#722ed1'
            }} />
            <Text type="secondary" className="calendar-item-time-text" style={{
              color: '#722ed1',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {dateStr} {timeStr}
            </Text>
          </div>

          {/* 설명 */}
          {calendar.description && (
            <div className="calendar-item-desc-text" style={{
              margin: 0,
              padding: '12px',
              background: '#fafafa',
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}>
              <Text type="secondary" className="calendar-item-description-content" style={{
                fontSize: '14px',
                color: '#595959',
                lineHeight: '1.6',
                fontWeight: '400',
                display: 'block',
                margin: 0
              }}>
                {calendar.description}
              </Text>
            </div>
          )}

          {/* 위치 정보 */}
          {calendar.location && (
            <div className="calendar-item-location" style={{
              margin: 0,
              padding: '10px 12px',
              background: '#f6ffed',
              borderRadius: '8px',
              border: '1px solid #e6f7e6',
              borderLeft: '4px solid #52c41a'
            }}>
              <Text type="secondary" className="calendar-item-location-text" style={{
                fontSize: '14px',
                color: '#52c41a',
                fontWeight: '600'
              }}>
                📍 {calendar.location}
              </Text>
            </div>
          )}
        </div>
      </div>
    </List.Item>
  )
}

export default React.memo(CalendarItem)
