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

  return (
    <List.Item
      className={`list-item-base calendar-item ${checked ? 'checked' : ''}`}
      onClick={handleClick}
    >
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          className="calendar-item-checkbox"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <List.Item.Meta
        avatar={
          <Avatar
            icon={config.icon}
            style={{ 
              backgroundColor: config.color,
              color: '#fff'
            }}
            className="calendar-item-avatar"
          />
        }
        title={
          <div className="calendar-item-title-container">
            <Text strong className="calendar-item-title">
              {calendar.title}
            </Text>
            <Tag 
              color={config.color} 
              className="calendar-item-tag"
            >
              {config.label}
            </Tag>
          </div>
        }
        description={
          <div className="calendar-item-description">
            <div className="calendar-item-time">
              <CalendarOutlined className="calendar-item-time-icon" />
              <Text type="secondary">{dateStr} {timeStr}</Text>
            </div>
            {calendar.description && (
              <div className="calendar-item-desc-text">
                <Text type="secondary" ellipsis>
                  {calendar.description}
                </Text>
              </div>
            )}
            {calendar.location && (
              <div className="calendar-item-location">
                <Text type="secondary" className="calendar-item-location-text">
                  📍 {calendar.location}
                </Text>
              </div>
            )}
          </div>
        }
      />

      {/* 우선순위 표시 */}
      {calendar.priority && (
        <div className="calendar-item-priority">
          <Badge
            color={calendar.priority === 'high' ? '#ff4d4f' : calendar.priority === 'medium' ? '#faad14' : '#52c41a'}
            text={calendar.priority === 'high' ? '높음' : calendar.priority === 'medium' ? '보통' : '낮음'}
            className="calendar-item-priority-badge"
          />
        </div>
      )}
    </List.Item>
  )
}

export default React.memo(CalendarItem)
