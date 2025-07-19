/**
 * Photos API 관련 함수들
 */
export const photosApi = {
  // 모든 사진 조회
  getAll: async () => {
    const response = await fetch(PHOTOS_API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 특정 사진 조회
  getById: async (id) => {
    const response = await fetch(`${PHOTOS_API_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 새 사진 추가
  create: async (photoData) => {
    const response = await fetch(PHOTOS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(photoData)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 사진 수정
  update: async (id, photoData) => {
    const response = await fetch(`${PHOTOS_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(photoData)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 사진 삭제
  delete: async (id) => {
    const response = await fetch(`${PHOTOS_API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 다중 사진 삭제
  deleteMany: async (ids) => {
    const results = await Promise.all(
      ids.map(id => photosApi.delete(id))
    )
    return ids // 삭제된 ID 배열 반환
  }
}
