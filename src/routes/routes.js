// 라우트 경로 상수들
export const ROUTES = {
  HOME: '/',
  USERS: '/users',
  USER_DETAIL: '/users/user/:id',
  USER_NEW: '/users/user/new',
  COUNTER: '/counter',
}

// 라우트 정보 객체들
export const routeConfig = [
  {
    path: ROUTES.HOME,
    name: 'Home',
    title: '홈',
  },
  {
    path: ROUTES.USERS,
    name: 'Users',
    title: '사용자',
  },
  {
    path: ROUTES.COUNTER,
    name: 'Counter',
    title: '카운터',
  },
]
