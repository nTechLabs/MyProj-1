/**
 * Data Source Manager - 환경 변수에 따른 데이터 소스 관리
 * @description 네트워크 설정에 따라 API 호출 또는 로컬 JSON 파일 사용을 결정
 */

// 환경 변수에서 네트워크 사용 여부 확인
const USE_NETWORK = import.meta.env.VITE_USE_NETWORK === 'true'

// 로컬 JSON 파일 경로 매핑 (public 폴더 기준)
const LOCAL_DATA_PATHS = {
  comments: '/src/apidata/comments_data.json',
  photos: '/src/apidata/photos_data.json',
  posts: '/src/apidata/posts_data.json',
  todos: '/src/apidata/todos_data.json',
  users: '/src/apidata/users_data.json'
}

/**
 * 로컬 JSON 데이터를 로드합니다
 * @param {string} dataType - 데이터 타입 (comments, photos, posts, todos, users)
 * @returns {Promise<Array>} JSON 데이터
 */
export const loadLocalData = async (dataType) => {
  try {
    let data
    
    // 동적 import를 사용하여 JSON 파일 로드
    switch (dataType) {
      case 'comments':
        data = (await import('../apidata/comments_data.json')).default
        break
      case 'photos':
        data = (await import('../apidata/photos_data.json')).default
        break
      case 'posts':
        data = (await import('../apidata/posts_data.json')).default
        break
      case 'todos':
        data = (await import('../apidata/todos_data.json')).default
        break
      case 'users':
        data = (await import('../apidata/users_data.json')).default
        break
      default:
        throw new Error(`Unknown data type: ${dataType}`)
    }
    
    return data
  } catch (error) {
    console.error(`Error loading local data for ${dataType}:`, error)
    throw error
  }
}

/**
 * ID로 로컬 데이터에서 특정 아이템을 찾습니다
 * @param {string} dataType - 데이터 타입
 * @param {string|number} id - 찾을 아이템의 ID
 * @returns {Promise<Object>} 찾은 아이템 객체
 */
export const findLocalDataById = async (dataType, id) => {
  const data = await loadLocalData(dataType)
  const item = data.find(item => item.id == id)
  
  if (!item) {
    throw new Error(`Item with id ${id} not found in ${dataType}`)
  }
  
  return item
}

/**
 * 현재 네트워크 사용 설정을 반환합니다
 * @returns {boolean} 네트워크 사용 여부
 */
export const isNetworkEnabled = () => USE_NETWORK

/**
 * 개발용 - 네트워크 설정 정보 출력
 */
export const logDataSourceInfo = () => {
  console.log(`🌐 Data Source: ${USE_NETWORK ? 'Network API' : 'Local JSON Files'}`)
  console.log(`� Environment Variable VITE_USE_NETWORK:`, import.meta.env.VITE_USE_NETWORK)
}
