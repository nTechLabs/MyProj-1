
/**
 * Todos API 관련 함수들
 */
export const todosApi = {
  // 모든 할일 조회
  getAll: async () => {
    const response = await fetch(TODOS_API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 특정 할일 조회
  getById: async (id) => {
    const response = await fetch(`${TODOS_API_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 새 할일 추가
  create: async (todoData) => {
    const response = await fetch(TODOS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 할일 수정
  update: async (id, todoData) => {
    const response = await fetch(`${TODOS_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 할일 삭제
  delete: async (id) => {
    const response = await fetch(`${TODOS_API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 여러 할일 삭제 (실제 API에서는 지원하지 않으므로 개별 삭제)
  deleteMultiple: async (ids) => {
    const deletePromises = ids.map(id => 
      fetch(`${TODOS_API_URL}/${id}`, { method: 'DELETE' })
        .then(response => ({ id, success: response.ok, status: response.status }))
        .catch(error => ({ id, success: false, error: error.message }))
    )
    
    return Promise.all(deletePromises)
  }
}
