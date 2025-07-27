/**
 * Comments React Query Hooks
 * @description Comments 엔티티를 위한 React Query 커스텀 훅 모음
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi } from '../api/commentsApi'
import { handleReactQueryError } from '../utils/handleAxiosError'
import useNotificationStore from '../store/useNotificationStore'
import { useCommentsClearChecked } from '../store/useCommentsStore'
import { createQueryOptions, createMutationOptions } from '../config/reactQueryConfig'

/**
 * QueryKey Factory 패턴 - Comments 쿼리 키 관리
 * @namespace commentsKeys
 */
export const commentsKeys = {
  all: () => ["comments"],
  list: (filters = {}) => [...commentsKeys.all(), "list", filters],
  detail: (id) => [...commentsKeys.all(), "detail", id],
}

/**
 * 댓글 목록 조회 훅
 * @returns {Object} React Query 결과 객체
 */
export const useCommentsQuery = () => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: commentsKeys.list(),
    queryFn: commentsApi.getAll,
    ...createQueryOptions({
      onError: (error) => {
        showError(handleReactQueryError(error, 'Comments 목록 조회'))
      }
    })
  })
}

/**
 * 단일 댓글 조회 훅
 * @param {string|number} id - 댓글 ID
 * @returns {Object} React Query 결과 객체
 */
export const useCommentQuery = (id) => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: commentsKeys.detail(id),
    queryFn: () => commentsApi.getById(id),
    enabled: !!id && id !== 'new',
    ...createQueryOptions({
      onError: (error) => {
        showError(handleReactQueryError(error, 'Comment 조회'))
      }
    })
  })
}

/**
 * 댓글 추가 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useAddCommentMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: commentsApi.create,
    ...createMutationOptions({
      onSuccess: (data) => {
        showSuccess('Comment가 성공적으로 추가되었습니다.')
        queryClient.invalidateQueries({ queryKey: commentsKeys.all() })
      },
      onError: (error) => {
        showError(handleReactQueryError(error, 'Comment 추가'))
      }
    })
  })
}

/**
 * 댓글 수정 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useUpdateCommentMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => commentsApi.update(id, data),
    ...createMutationOptions({
      onSuccess: (data, { id }) => {
        showSuccess('Comment가 성공적으로 수정되었습니다.')
        queryClient.invalidateQueries({ queryKey: commentsKeys.detail(id) })
        queryClient.invalidateQueries({ queryKey: commentsKeys.all() })
      },
      onError: (error) => {
        showError(handleReactQueryError(error, 'Comment 수정'))
      }
    })
  })
}

/**
 * 댓글 다중 삭제 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useDeleteCommentsMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const clearChecked = useCommentsClearChecked()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: commentsApi.delete,
    ...createMutationOptions({
      onSuccess: (data, ids) => {
        showSuccess(`${ids.length}개의 Comment가 성공적으로 삭제되었습니다.`)
        clearChecked()
        queryClient.invalidateQueries({ queryKey: commentsKeys.all() })
      },
      onError: (error) => {
        showError(handleReactQueryError(error, 'Comment 삭제'))
      }
    })
  })
}
