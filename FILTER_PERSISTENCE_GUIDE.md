# 필터 상태 영속성 기능 안내

## 개요
Comments 페이지의 필터 설정(검색어, 필터 타입)이 이제 localStorage에 자동으로 저장되어, 애플리케이션을 종료하고 다시 실행하거나 페이지를 새로고침해도 이전에 설정했던 필터 옵션들이 유지됩니다.

## 적용된 변경사항

### 1. useCommentsStore.js 수정
- **Zustand persist 미들웨어 추가**: `persist` 미들웨어를 사용하여 상태를 localStorage에 저장
- **선택적 상태 저장**: 필터 관련 상태만 저장하고 체크 상태는 제외
- **자동 복원**: 앱 시작 시 이전 필터 설정 자동 복원

### 2. 저장되는 상태
- ✅ `searchTerm`: 검색어
- ✅ `filterTypes`: 선택된 필터 타입들 (최신, 인기, 긴 댓글, 짧은 댓글)
- ❌ `checkedIds`: 체크된 항목들 (세션마다 초기화)

### 3. localStorage 키
- **키 이름**: `comments-store`
- **저장 위치**: 브라우저의 localStorage

## 사용법 테스트

### 테스트 시나리오
1. **Comments 페이지 접속**
   - 브라우저에서 `http://localhost:5173/comments` 접속

2. **필터 설정**
   - 검색어 입력 (예: "sunt")
   - 필터 옵션 선택 (예: "최신", "긴 댓글")

3. **상태 확인**
   - 개발자 도구 > Application > Local Storage > `http://localhost:5173` 확인
   - `comments-store` 키에 설정값이 저장되었는지 확인

4. **영속성 테스트**
   - 페이지 새로고침 (F5)
   - 다른 페이지로 이동 후 Comments 페이지로 돌아오기
   - 브라우저 종료 후 재시작
   - 설정한 필터 옵션들이 유지되는지 확인

## 기술적 세부사항

### Zustand Persist 설정
```javascript
persist(
  (set, get) => ({
    // 상태 및 액션들...
  }),
  {
    name: 'comments-store', // localStorage 키 이름
    partialize: (state) => ({
      // 필터 관련 상태만 저장 (체크 상태는 제외)
      searchTerm: state.searchTerm,
      filterTypes: state.filterTypes
    })
  }
)
```

### 미들웨어 순서
```javascript
create(
  devtools(
    subscribeWithSelector(
      persist(
        // 스토어 로직
      )
    )
  )
)
```

## 향후 확장 가능성

### 다른 페이지 필터 기능 추가
현재는 Comments 페이지에서만 필터 기능을 사용하지만, 다른 페이지들도 비슷한 방식으로 확장 가능:

1. **Posts 페이지**: 카테고리별 필터, 작성자별 필터
2. **Users 페이지**: 지역별 필터, 회사별 필터  
3. **Photos 페이지**: 앨범별 필터, 크기별 필터
4. **Todos 페이지**: 완료 상태별 필터, 우선순위별 필터

### 전역 설정 관리
- 모든 페이지의 필터 설정을 통합 관리
- 사용자별 기본 필터 설정
- 필터 프리셋 기능

## 주의사항

1. **브라우저 의존성**: localStorage는 브라우저별로 독립적으로 저장됩니다.
2. **용량 제한**: localStorage는 보통 5-10MB 제한이 있습니다.
3. **보안**: 민감한 정보는 localStorage에 저장하지 마세요.
4. **호환성**: 구형 브라우저에서는 localStorage가 지원되지 않을 수 있습니다.

## 디버깅

### localStorage 내용 확인
```javascript
// 브라우저 콘솔에서 실행
console.log(localStorage.getItem('comments-store'))
```

### 저장된 상태 초기화
```javascript
// 브라우저 콘솔에서 실행
localStorage.removeItem('comments-store')
```

## 완료 ✅

Comments 페이지의 필터 상태 영속성 기능이 성공적으로 구현되었습니다. 이제 애플리케이션을 종료하고 다시 실행해도 이전에 설정했던 검색어와 필터 옵션들이 자동으로 복원됩니다.
