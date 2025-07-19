import { useQuery, useMutation } from '@tanstack/react-query'
import { postsApi } from '../api/postsApi'
import { handleReactQueryError } from '../utils/handleAxiosError'
import { createQueryOptions, createMutationOptions, invalidateQueries } from '../config/reactQueryConfig'
import useNotificationStore from '../store/useNotificationStore'
import { usePostsClearChecked } from '../store/usePostsCheckedStore'

/**
 * Posts QueryKey Factory Pattern (최적화)
 */
export const postsKeys = {
  all: () => ["posts"],
  list: (filters = {}) => [...postsKeys.all(), "list", filters],
  detail: (id) => [...postsKeys.all(), "detail", id],
}

/**
 * Posts 목록 조회 훅 (최적화)
 */
export const usePostsQuery = (options = {}) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: postsKeys.list(),
    queryFn: postsApi.getAll,
    ...createQueryOptions({
      onError: (error) => {
        showError(handleReactQueryError(error, '게시글 목록 조회'))
      },
      ...options
    })
  })
}

/**
 * 특정 Post 조회 훅 (최적화)
 */
export const usePostQuery = (id, options = {}) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: () => postsApi.getById(id),
    enabled: !!id && id !== 'new',
    ...createQueryOptions({
      onError: (error) => {
        showError(handleReactQueryError(error, '게시글 조회'))
      },
      ...options
    })
  })
}

/**
 * 다중 Posts 삭제 뮤테이션 훅 (최적화)
 */
export const useDeletePostsMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const clearChecked = usePostsClearChecked()
  
  return useMutation({
    mutationFn: postsApi.deleteMany,
    ...createMutationOptions({
      onSuccess: (deletedIds) => {
        showSuccess(`${deletedIds.length}개의 게시글이 삭제되었습니다.`)
        clearChecked()
        invalidateQueries.listByEntity('posts')
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '게시글 삭제'))
      }
    })
  })
}

/**
 * Post 추가 뮤테이션 훅 (최적화)
 */
export const useAddPostMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: postsApi.create,
    ...createMutationOptions({
      onSuccess: (newPost) => {
        showSuccess('새 게시글이 추가되었습니다.')
        invalidateQueries.listByEntity('posts')
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '게시글 추가'))
      }
    })
  })
}

/**
 * Post 수정 뮤테이션 훅 (최적화)
 */
export const useUpdatePostMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: ({ id, ...postData }) => postsApi.update(id, postData),
    ...createMutationOptions({
      onSuccess: (updatedPost) => {
        showSuccess('게시글이 수정되었습니다.')
        invalidateQueries.listByEntity('posts')
        invalidateQueries.detailByEntity('posts', updatedPost.id)
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '게시글 수정'))
      }
    })
  })
}
