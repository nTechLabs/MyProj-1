import React, { useState, useMemo, useCallback } from 'react'
import { Calendar, Badge, Card, Button, FloatButton, List, Typography, Space, Alert, Spin } from 'antd'
import { PlusOutlined, DeleteOutlined, CalendarOutlined, ClockCircleOutlined, TeamOutlined, BookOutlined, HeartOutlined, TrophyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useCalendarsQuery, useDeleteCalendarsMutation } from '../../hooks/useCalendarsQueries'
import { useCalendarCheckedIds, useCalendarToggleAllCheck, useCalendarClearChecked, useCalendarIsAllChecked, useCalendarIsIndeterminate, useCalendarCheckedCount } from '../../store/useCalendarStore'
import CalendarItem from './CalendarItem'
import '../../styles/pages.css'
import './calendar.css'

const { Text } = Typography

/**
 * 캘린더 리스트 컴포넌트
 * 4가지 뷰 타입을 지원: monthly, 2weekly, weekly, daily
 * Task 타입별 색상과 아이콘으로 구별
 */
const CalendarList = ({ viewType = 'monthly' }) => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(dayjs('2025-08-01'))
  const [showWeekends, setShowWeekends] = useState(false) // 주말 표시 상태
  
  // React Query 데이터 조회
  const { data: calendars = [], isLoading, error } = useCalendarsQuery()
  
  // Zustand 체크박스 상태 관리
  const checkedIds = useCalendarCheckedIds()
  const toggleAllCheck = useCalendarToggleAllCheck()
  const clearChecked = useCalendarClearChecked()
  const isAllChecked = useCalendarIsAllChecked()
  const isIndeterminate = useCalendarIsIndeterminate()
  const checkedCount = useCalendarCheckedCount()
  
  // 삭제 뮤테이션
  const deleteCalendarsMutation = useDeleteCalendarsMutation()

  // 태스크 타입별 설정 - 더 밝고 부드러운 톤으로 변경
  const taskTypeConfig = {
    meeting: { color: '#5B9BD5', icon: <TeamOutlined />, label: '회의' },
    task: { color: '#70AD47', icon: <BookOutlined />, label: '업무' },
    personal: { color: '#FFC000', icon: <HeartOutlined />, label: '개인' },
    event: { color: '#7030A0', icon: <TrophyOutlined />, label: '이벤트' },
    reminder: { color: '#C5504B', icon: <ClockCircleOutlined />, label: '알림' }
  }

  // 선택된 날짜의 이벤트 필터링
  const selectedDateEvents = useMemo(() => {
    if (!calendars.length) return []
    
    const selectedDateStr = selectedDate.format('YYYY-MM-DD')
    return calendars.filter(calendar => {
      const eventDate = new Date(calendar.date).toISOString().split('T')[0]
      return eventDate === selectedDateStr
    })
  }, [calendars, selectedDate])

  // 2주간 뷰용 cellRender - 현재 월의 첫 2주만 표시
  const cellRender2Weekly = useCallback((value, info) => {
    if (info.type !== 'date') return info.originNode
    
    const currentMonth = dayjs('2025-08-01') // 현재 선택된 달 기준
    const startOfMonth = currentMonth.startOf('month')
    const startOfFirstWeek = startOfMonth.startOf('week')
    
    // 해당 날짜가 속한 주 번호 계산 (0부터 시작)
    const valueWeekNumber = Math.floor(value.diff(startOfFirstWeek, 'week'))
    
    // 첫 2주만 표시 (0주차, 1주차)
    const showWeek = valueWeekNumber === 0 || valueWeekNumber === 1
    
    // 2주 범위에 포함되지 않으면 빈 셀 반환
    if (!showWeek) {
      return <div className="calendar-date-cell hidden-week"></div>
    }

    const dateStr = value.format('YYYY-MM-DD')
    const dayEvents = calendars.filter(calendar => {
      const eventDate = new Date(calendar.date).toISOString().split('T')[0]
      return eventDate === dateStr
    })

    // 일정이 없으면 빈 div 반환
    if (dayEvents.length === 0) {
      return <div className="calendar-date-cell"></div>
    }

    return (
      <div className="calendar-date-cell">
        {/* 일정 개수 뱃지 (빨간색) - 일정이 5개 이상일 때만 표시 */}
        {dayEvents.length >= 5 && (
          <div className="calendar-event-count-badge">
            <Badge 
              count={dayEvents.length} 
              className="calendar-count-badge calendar-count-badge-red"
            />
          </div>
        )}
        
        {/* 일정 미리보기 (최대 4개) */}
        <div className="calendar-events-preview">
          {dayEvents.slice(0, 4).map(event => {
            const config = taskTypeConfig[event.type] || taskTypeConfig.task
            return (
              <div
                key={event.id}
                className={`calendar-event-preview calendar-event-${event.type}`}
                data-color={config.color}
              >
                <span className="calendar-event-preview-icon">
                  {config.icon}
                </span>
                <span className="calendar-event-preview-title">
                  {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }, [calendars, taskTypeConfig])

  // 캘린더 셀 렌더링 (월간 뷰용)
  const cellRender = useCallback((value, info) => {
    if (info.type !== 'date') return info.originNode
    
    const dateStr = value.format('YYYY-MM-DD')
    const dayEvents = calendars.filter(calendar => {
      const eventDate = new Date(calendar.date).toISOString().split('T')[0]
      return eventDate === dateStr
    })

    // 일정이 없으면 빈 div 반환
    if (dayEvents.length === 0) {
      return <div className="calendar-date-cell"></div>
    }

    return (
      <div className="calendar-date-cell">
        {/* 일정 개수 뱃지 (빨간색) - 일정이 5개 이상일 때만 표시 */}
        {dayEvents.length >= 5 && (
          <div className="calendar-event-count-badge">
            <Badge 
              count={dayEvents.length} 
              className="calendar-count-badge calendar-count-badge-red"
            />
          </div>
        )}
        
        {/* 일정 미리보기 (최대 4개) */}
        <div className="calendar-events-preview">
          {dayEvents.slice(0, 4).map(event => {
            const config = taskTypeConfig[event.type] || taskTypeConfig.task
            return (
              <div
                key={event.id}
                className={`calendar-event-preview calendar-event-${event.type}`}
                data-color={config.color}
              >
                <span className="calendar-event-preview-icon">
                  {config.icon}
                </span>
                <span className="calendar-event-preview-title">
                  {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }, [calendars, taskTypeConfig])

  // 일간 뷰용 cellRender - 날짜별 일정 개수만 뱃지로 표시 (5개 이상일 때만)
  const cellRenderDaily = useCallback((value, info) => {
    if (info.type !== 'date') return info.originNode
    
    // 주말 숨김 처리 (일간 뷰에서만)
    if (!showWeekends && (value.day() === 0 || value.day() === 6)) {
      return <div style={{ display: 'none' }}></div>
    }
    
    const dateStr = value.format('YYYY-MM-DD')
    const dayEvents = calendars.filter(calendar => {
      const eventDate = new Date(calendar.date).toISOString().split('T')[0]
      return eventDate === dateStr
    })

    // 일정이 5개 미만이면 기본 셀 반환
    if (dayEvents.length < 5) {
      return info.originNode
    }

    return (
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        overflow: 'visible'
      }}>
        {info.originNode}
        {/* 5개 이상일 때만 뱃지 표시 */}
        <span 
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#ff4d4f',
            color: '#ffffff',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '9px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            border: '1px solid #ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            pointerEvents: 'none'
          }}
        >
          {dayEvents.length}
        </span>
      </div>
    )
  }, [calendars, showWeekends])

  // 삭제 핸들러
  const handleDelete = useCallback(() => {
    if (checkedIds.size === 0) return
    
    const idsToDelete = Array.from(checkedIds)
    deleteCalendarsMutation.mutate(idsToDelete)
  }, [checkedIds, deleteCalendarsMutation])

  // 새 일정 추가
  const handleAddNew = useCallback(() => {
    navigate('/calendar/calendar/new')
  }, [navigate])

  // 전체 선택/해제
  const handleToggleAll = useCallback(() => {
    const allIds = calendars.map(calendar => calendar.id)
    toggleAllCheck(allIds)
  }, [calendars, toggleAllCheck])

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="calendar-list-loading">
        <Spin size="large" />
        <Text className="calendar-list-loading-text" style={{ color: '#666666' }}>캘린더 데이터를 불러오는 중...</Text>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <Alert
        message="캘린더 데이터 로드 실패"
        description={error.message}
        type="error"
        showIcon
        className="calendar-list-error"
      />
    )
  }

  // 뷰 타입별 렌더링
  const renderCalendarView = () => {
    switch (viewType) {
      case 'monthly':
        return (
          <div className="calendar-monthly-container">
            <Card className="calendar-view-card">
              <Calendar
                cellRender={cellRender}
                onSelect={setSelectedDate}
                className="calendar-monthly"
              />
            </Card>
            
            {/* 선택된 날짜의 일정 표시 */}
            <Card 
              className="calendar-selected-events" 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{selectedDate.format('YYYY년 MM월 DD일')} 일정</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#666666',
                    backgroundColor: '#f5f5f5',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    border: '1px solid #e8e8e8'
                  }}>
                    {selectedDateEvents.filter(event => checkedIds.has(event.id)).length}/{selectedDateEvents.length}
                  </span>
                </div>
              }
            >
              {selectedDateEvents.length === 0 ? (
                <div className="empty-container">
                  <CalendarOutlined className="empty-icon" style={{ color: '#999999' }} />
                  <Text className="empty-text" style={{ color: '#666666' }}>선택한 날짜에 일정이 없습니다.</Text>
                </div>
              ) : (
                <List
                  dataSource={selectedDateEvents}
                  renderItem={(calendar) => (
                    <CalendarItem key={calendar.id} calendar={calendar} />
                  )}
                  className="calendar-monthly-event-list"
                />
              )}
            </Card>
          </div>
        )
      
      case '2weekly':
        return (
          <div className="calendar-weekly-container">
            <Card className="calendar-view-card">
              <Calendar
                mode="month"
                cellRender={cellRender2Weekly}
                onSelect={setSelectedDate}
                className="calendar-2weekly"
                value={dayjs()} // 항상 현재 달로 고정
              />
            </Card>
            
            {/* 선택된 날짜의 일정 표시 */}
            <Card 
              className="calendar-selected-events" 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{selectedDate.format('YYYY년 MM월 DD일')} 일정</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#666666',
                    backgroundColor: '#f5f5f5',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    border: '1px solid #e8e8e8'
                  }}>
                    {selectedDateEvents.filter(event => checkedIds.has(event.id)).length}/{selectedDateEvents.length}
                  </span>
                </div>
              }
            >
              {selectedDateEvents.length === 0 ? (
                <div className="empty-container">
                  <CalendarOutlined className="empty-icon" style={{ color: '#999999' }} />
                  <Text className="empty-text" style={{ color: '#666666' }}>선택한 날짜에 일정이 없습니다.</Text>
                </div>
              ) : (
                <List
                  dataSource={selectedDateEvents}
                  renderItem={(calendar) => (
                    <CalendarItem key={calendar.id} calendar={calendar} />
                  )}
                  className="calendar-2weekly-event-list"
                />
              )}
            </Card>
          </div>
        )
      
      case 'weekly':
        return (
          <div className="calendar-weekly-container">
            <Card className="calendar-view-card">
              <Calendar
                mode="month"
                cellRender={cellRender}
                onSelect={setSelectedDate}
                className="calendar-weekly"
              />
            </Card>
          </div>
        )
      
      case 'daily':
        return (
          <div className="calendar-daily-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Card className="calendar-date-selector" style={{ flex: 1 }}>
                <Calendar
                  mode="month"
                  fullscreen={false}
                  onSelect={setSelectedDate}
                  cellRender={cellRenderDaily}
                  className={`calendar-daily-picker ${!showWeekends ? 'hide-weekends' : ''}`}
                />
              </Card>
              
              {/* 주말 표시 버튼 */}
              <Button
                type={showWeekends ? "primary" : "default"}
                onClick={() => setShowWeekends(!showWeekends)}
                style={{ 
                  height: '40px', 
                  minWidth: '100px',
                  marginRight: '16px'
                }}
              >
                {showWeekends ? '주말 숨김' : '주말 표시'}
              </Button>
            </div>
            
            <Card 
              className="calendar-daily-events" 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{selectedDate.format('YYYY년 MM월 DD일')} 일정</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#666666',
                    backgroundColor: '#f5f5f5',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    border: '1px solid #e8e8e8'
                  }}>
                    {selectedDateEvents.filter(event => checkedIds.has(event.id)).length}/{selectedDateEvents.length}
                  </span>
                </div>
              }
            >
              {selectedDateEvents.length === 0 ? (
                <div className="empty-container">
                  <CalendarOutlined className="empty-icon" style={{ color: '#999999' }} />
                  <Text className="empty-text" style={{ color: '#666666' }}>선택한 날짜에 일정이 없습니다.</Text>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '16px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                    <Text strong style={{ color: '#495057' }}>디버깅 정보: </Text>
                    <Text style={{ color: '#666666' }}>선택된 날짜: {selectedDate.format('YYYY-MM-DD')}, 일정 개수: {selectedDateEvents.length}</Text>
                    <br />
                    <Text type="secondary" style={{ color: '#999999' }}>일정 목록: {selectedDateEvents.map(e => e.title).join(', ')}</Text>
                  </div>
                  <List
                    dataSource={selectedDateEvents}
                    renderItem={(calendar) => (
                      <CalendarItem key={calendar.id} calendar={calendar} />
                    )}
                    className="calendar-daily-list"
                  />
                </>
              )}
            </Card>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="page-list-container calendar-list-container">
      {/* 검색 및 필터 */}
      <div className="search-filter-container">
        <Space className="search-filter-space">
          <Text strong style={{ color: '#495057' }}>{viewType === 'monthly' ? '월간' : viewType === '2weekly' ? '2주간' : viewType === 'weekly' ? '주간' : '일간'} 캘린더</Text>
        </Space>
      </div>

      {/* 전체 선택 및 통계 */}
      {calendars.length > 0 && (viewType === 'daily' || viewType === 'monthly' || viewType === '2weekly' || selectedDateEvents.length > 0) && (
        <div className="select-all-container">
          <div className="select-all-left">
            <Button
              type="text"
              onClick={handleToggleAll}
              className="select-all-button"
            >
              {isAllChecked ? '전체 해제' : '전체 선택'}
            </Button>
          </div>
          <div className="select-stats">
            <Text type="secondary" style={{ color: '#999999' }}>
              {checkedCount > 0 ? `${checkedCount}개 선택됨` : `총 ${viewType === 'daily' ? selectedDateEvents.length : calendars.length}개`}
            </Text>
          </div>
        </div>
      )}

      {/* 캘린더 뷰 렌더링 */}
      {renderCalendarView()}

      {/* 빈 상태 (전체가 비어있을 때) */}
      {calendars.length === 0 && (
        <div className="empty-container">
          <CalendarOutlined className="empty-icon" style={{ color: '#999999' }} />
          <Text className="empty-text" style={{ color: '#666666' }}>등록된 일정이 없습니다.</Text>
        </div>
      )}

      {/* FloatButton - 새 일정 추가 */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={handleAddNew}
        tooltip="새 일정 추가"
        className={checkedCount > 0 ? "float-button-with-action" : "float-button-default"}
      />

      {/* 하단 삭제 버튼 */}
      {checkedCount > 0 && (
        <div className="fixed-delete-button">
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="large"
            onClick={handleDelete}
            loading={deleteCalendarsMutation.isPending}
            block
          >
            선택한 {checkedCount}개 일정 삭제
          </Button>
        </div>
      )}
    </div>
  )
}

export default React.memo(CalendarList)
