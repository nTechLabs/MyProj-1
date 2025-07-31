import React, { memo, useCallback } from 'react'
import { List, Badge, Typography, Tag, Avatar } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined, BookOutlined, HeartOutlined, TrophyOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCalendarToggleCheck, useCalendarIsChecked } from '../../store/useCalendarStore'
import './calendar.css'

const { Text } = Typography

/**
 * 캘린더 개별 항목 컴포넌트 (최적화)
 * React.memo를 사용하여 불필요한 리렌더링 방지
 * Task 타입별 색상과 아이콘으로 구별
 * 체크박스 선택 및 상세 페이지 이동 기능
 */
const CalendarItem = memo(({ calendar }) => {
  const navigate = useNavigate()
  const toggleCheck = useCalendarToggleCheck()
  const isChecked = useCalendarIsChecked()
  const checked = isChecked(calendar.id)

  // Task 타입별 설정 - 더 밝고 부드러운 톤으로 변경
  const taskTypeConfig = {
    meeting: { color: '#5B9BD5', icon: <TeamOutlined />, label: '회의', bgColor: '#F0F7FF' },
    task: { color: '#70AD47', icon: <BookOutlined />, label: '업무', bgColor: '#F0F8F0' },
    personal: { color: '#FFC000', icon: <HeartOutlined />, label: '개인', bgColor: '#FFFBF0' },
    event: { color: '#7030A0', icon: <TrophyOutlined />, label: '이벤트', bgColor: '#F5F0FF' },
    reminder: { color: '#C5504B', icon: <ClockCircleOutlined />, label: '알림', bgColor: '#FFF0F0' }
  }

  const config = taskTypeConfig[calendar.type] || taskTypeConfig.task

  // 항목 클릭 핸들러 (상세 페이지로 이동) - 메모이제이션
  const handleItemClick = useCallback((e) => {
    // 체크박스 영역을 클릭한 경우 이동하지 않음
    if (e.target.closest('.checkbox-area')) {
      console.log('🚫 Item click blocked - checkbox area clicked')
      return
    }
    console.log('🔗 Item clicked, navigating to calendar detail:', calendar.id)
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

  return (
    <List.Item
      className={`calendar-item ${checked ? 'checked' : ''}`}
      onClick={handleItemClick}
    >
      <div className={`calendar-item-container ${checked ? 'checked' : ''}`}>
        {/* 아바타 */}
        <div className="calendar-item-avatar">
          <Avatar
            icon={config.icon}
            size={52}
            className={checked ? 'checked' : ''}
            style={{
              backgroundColor: config.color,
              color: '#ffffff',
              border: '2px solid #ffffff',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              fontWeight: '500'
            }}
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="calendar-item-content">
          {/* 제목과 태그 */}
          <div className="calendar-item-header">
            <div className="calendar-item-title">
              <span className="calendar-item-name" style={{
                color: '#2C2C2E',
                fontSize: '16px',
                fontWeight: '600',
                letterSpacing: '-0.02em'
              }}>
                {calendar.title}
              </span>
              <Tag 
                className={`calendar-item-tag calendar-tag-${calendar.type}`}
                style={{
                  backgroundColor: config.bgColor,
                  color: config.color,
                  border: `1px solid ${config.color}20`,
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '500',
                  marginLeft: '8px',
                  padding: '2px 10px',
                  height: '22px',
                  lineHeight: '18px'
                }}
              >
                {config.label}
              </Tag>
            </div>
          </div>

          {/* 날짜 및 시간 */}
          <div className="calendar-item-datetime">
            <div className="calendar-item-contact">
              <CalendarOutlined style={{ color: '#999999', fontSize: '14px' }} />
              <span style={{ color: '#666666', fontWeight: '500', fontSize: '14px' }}>
                {dateStr} {timeStr}
              </span>
            </div>
          </div>

          {/* 추가 정보 (위치, 설명) */}
          <div className="calendar-item-details">
            {calendar.location && (
              <div className="calendar-item-contact">
                <EnvironmentOutlined style={{ color: '#999999', fontSize: '13px' }} />
                <span style={{ color: '#999999', fontSize: '13px' }}>
                  {calendar.location}
                </span>
              </div>
            )}
            {calendar.description && (
              <div className="calendar-item-contact">
                <ClockCircleOutlined style={{ color: '#999999', fontSize: '13px' }} />
                <span style={{ color: '#999999', fontSize: '13px' }}>
                  {calendar.description.length > 25 
                    ? `${calendar.description.substring(0, 25)}...` 
                    : calendar.description
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 우측 정보 영역 */}
        <div className="calendar-item-right">
          {/* 우선순위 */}
          {calendar.priority && (
            <div className="calendar-item-priority">
              <Badge
                color={
                  calendar.priority === 'high' ? '#FF6B6B' : 
                  calendar.priority === 'medium' ? '#FFD93D' : '#6BCF7F'
                }
                text={
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '500',
                    color: '#666666'
                  }}>
                    {calendar.priority === 'high' ? '높음' : 
                     calendar.priority === 'medium' ? '보통' : '낮음'}
                  </span>
                }
              />
            </div>
          )}
          
          {/* 체크박스 */}
          <div 
            className="checkbox-area calendar-item-checkbox"
            onClick={(e) => {
              e.stopPropagation()
              console.log('🎯 Checkbox area clicked for calendar:', calendar.id, '(handled by onChange)')
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                console.log('🔲 Native checkbox onChange for calendar:', calendar.id, 'checked:', e.target.checked)
                e.stopPropagation()
                toggleCheck(calendar.id)
              }}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: config.color
              }}
            />
          </div>
        </div>
      </div>
    </List.Item>
  )
})

// 개발 환경에서 디버깅을 위한 displayName 설정
CalendarItem.displayName = 'CalendarItem'

export default CalendarItem
