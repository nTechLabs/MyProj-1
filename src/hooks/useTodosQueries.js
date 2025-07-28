import { useQuery, useMutation } from '@tanstack/react-query'
import { todosApi } from '../api/todosApi'
import { handleReactQueryError } from '../utils/handleAxiosError'
import { invalidateQueries } from '../config/reactQueryConfig'
import { queryClient } from '../main'
import useNotificationStore from '../store/useNotificationStore'
import { useTodosClearChecked } from '../store/useTodosStore'

/**
 * Todos QueryKey Factory Pattern (최적화)
 */
export const todosKeys = {
  all: () => ["todos"],
  list: (filters = {}) => [...todosKeys.all(), "list", filters],
  detail: (id) => [...todosKeys.all(), "detail", id],
}

/**
 * Todos 목록 조회 훅 (최적화)
 */
export const useTodosQuery = () => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: todosKeys.list(),
    queryFn: todosApi.getAll,
    onError: (error) => {
      showError(handleReactQueryError(error, '할일 목록 조회'))
    }
  })
}

/**
 * 특정 Todo 조회 훅 (최적화)
 */
export const useTodoQuery = (id) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: todosKeys.detail(id),
    queryFn: () => todosApi.getById(id),
    enabled: !!id && id !== 'new',
    onError: (error) => {
      showError(handleReactQueryError(error, '할일 조회'))
    }
  })
}

/**
 * 다중 Todos 삭제 뮤테이션 훅 (최적화)
 */
export const useDeleteTodosMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const clearChecked = useTodosClearChecked()

  return useMutation({
    mutationFn: todosApi.delete,
    onSuccess: (results) => {
      const successCount = results.filter(result => result.success).length
      const failCount = results.length - successCount
      
      if (successCount > 0) {
        showSuccess(`${successCount}개의 할일이 삭제되었습니다.`)
        invalidateQueries.listByEntity('todos')
        clearChecked()
      }
      
      if (failCount > 0) {
        showError(`${failCount}개의 할일 삭제에 실패했습니다.`)
      }
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '할일 삭제'))
    }
  })
}

/**
 * Todo 추가 뮤테이션 훅 (최적화)
 */
export const useAddTodoMutation = () => {
  const { showSuccess, showError } = useNotificationStore()

  return useMutation({
    mutationFn: todosApi.create,
    onSuccess: (data) => {
      showSuccess('새 할일이 추가되었습니다.')
      invalidateQueries.listByEntity('todos')
      queryClient.setQueryData(todosKeys.detail(data.id), data)
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '할일 추가'))
    }
  })
}

/**
 * Todo 수정 뮤테이션 훅 (최적화)
 */
export const useUpdateTodoMutation = () => {
  const { showSuccess, showError } = useNotificationStore()

  return useMutation({
    mutationFn: ({ id, data }) => todosApi.update(id, data),
    onSuccess: (data, variables) => {
      showSuccess('할일이 수정되었습니다.')
      invalidateQueries.listByEntity('todos')
      invalidateQueries.detailByEntity('todos', variables.id)
      queryClient.setQueryData(todosKeys.detail(variables.id), data)
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '할일 수정'))
    }
  })
}
