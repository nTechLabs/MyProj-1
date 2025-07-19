import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todosApi } from '../api/todosApi'
import { handleAxiosError, createQueryOptions, createMutationOptions } from '../api/config'
import useNotificationStore from '../store/useNotificationStore'
import useCheckedStore from '../store/useCheckedStore'

/**
 * Todos QueryKey Factory Pattern
 * 일관된 쿼리 키 관리를 위한 팩토리 함수들
 */
export const todosKeys = {
  all: ['todos'],
  lists: () => [...todosKeys.all, 'list'],
  list: (filters) => [...todosKeys.lists(), filters],
  details: () => [...todosKeys.all, 'detail'],
  detail: (id) => [...todosKeys.details(), id],
}

/**
 * Todos 목록을 조회하는 React Query 훅
 * @param {Object} options - React Query 옵션들
 */
export const useTodosQuery = (options = {}) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: todosKeys.lists(),
    queryFn: todosApi.getAll,
    ...createQueryOptions({
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`할일 목록을 불러오는데 실패했습니다: ${errorMessage}`)
      },
      ...options
    })
  })
}

/**
 * 특정 Todo를 조회하는 React Query 훅
 * @param {string|number} id - Todo ID
 * @param {Object} options - React Query 옵션들
 */
export const useTodoQuery = (id, options = {}) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: todosKeys.detail(id),
    queryFn: () => todosApi.getById(id),
    enabled: !!id && id !== 'new', // id가 있고 'new'가 아닐 때만 실행
    ...createQueryOptions({
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`할일을 불러오는데 실패했습니다: ${errorMessage}`)
      },
      ...options
    })
  })
}

/**
 * 여러 Todos를 삭제하는 React Query 뮤테이션 훅
 */
export const useDeleteTodosMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()
  const { clearChecked } = useCheckedStore()

  return useMutation({
    mutationFn: todosApi.deleteMultiple,
    ...createMutationOptions({
      onSuccess: (results) => {
        const successCount = results.filter(result => result.success).length
        const failCount = results.length - successCount
        
        if (successCount > 0) {
          showSuccess(`${successCount}개의 할일이 삭제되었습니다.`)
          
          // 쿼리 캐시 무효화
          queryClient.invalidateQueries({ queryKey: todosKeys.lists() })
          
          // 선택된 항목들 초기화
          clearChecked()
        }
        
        if (failCount > 0) {
          showError(`${failCount}개의 할일 삭제에 실패했습니다.`)
        }
      },
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`할일 삭제에 실패했습니다: ${errorMessage}`)
      }
    })
  })
}

/**
 * 새 Todo를 추가하는 React Query 뮤테이션 훅
 */
export const useAddTodoMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()

  return useMutation({
    mutationFn: todosApi.create,
    ...createMutationOptions({
      onSuccess: (data) => {
        showSuccess('새 할일이 추가되었습니다.')
        
        // 쿼리 캐시 무효화
        queryClient.invalidateQueries({ queryKey: todosKeys.lists() })
        
        // 새로 생성된 할일을 캐시에 추가
        queryClient.setQueryData(todosKeys.detail(data.id), data)
      },
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`할일 추가에 실패했습니다: ${errorMessage}`)
      }
    })
  })
}

/**
 * Todo를 수정하는 React Query 뮤테이션 훅
 */
export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()

  return useMutation({
    mutationFn: ({ id, data }) => todosApi.update(id, data),
    ...createMutationOptions({
      onSuccess: (data, variables) => {
        showSuccess('할일이 수정되었습니다.')
        
        // 관련 쿼리들 무효화
        queryClient.invalidateQueries({ queryKey: todosKeys.lists() })
        queryClient.invalidateQueries({ queryKey: todosKeys.detail(variables.id) })
        
        // 수정된 할일을 캐시에 업데이트
        queryClient.setQueryData(todosKeys.detail(variables.id), data)
      },
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`할일 수정에 실패했습니다: ${errorMessage}`)
      }
    })
  })
}
