import { useQuery, useMutation } from '@tanstack/react-query'
import { photosApi } from '../api/photosApi'
import { handleReactQueryError } from '../utils/handleAxiosError'
import { createQueryOptions, createMutationOptions, invalidateQueries } from '../config/reactQueryConfig'
import useNotificationStore from '../store/useNotificationStore'
import { usePhotosClearChecked } from '../store/usePhotosStore'

/**
 * Photos QueryKey Factory Pattern (최적화)
 */
export const photosKeys = {
  all: () => ["photos"],
  list: (filters = {}) => [...photosKeys.all(), "list", filters],
  detail: (id) => [...photosKeys.all(), "detail", id],
}

/**
 * Photos 목록 조회 훅 (최적화)
 */
export const usePhotosQuery = () => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: photosKeys.list(),
    queryFn: photosApi.getAll,
    ...createQueryOptions({
      onError: (error) => {
        showError(handleReactQueryError(error, '사진 목록 조회'))
      }
    })
  })
}

/**
 * 특정 Photo 조회 훅 (최적화)
 */
export const usePhotoQuery = (id) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: photosKeys.detail(id),
    queryFn: () => photosApi.getById(id),
    enabled: !!id && id !== 'new',
    ...createQueryOptions({
      onError: (error) => {
        showError(handleReactQueryError(error, '사진 조회'))
      }
    })
  })
}

/**
 * 다중 Photos 삭제 뮤테이션 훅 (최적화)
 */
export const useDeletePhotosMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const clearChecked = usePhotosClearChecked()
  
  return useMutation({
    mutationFn: photosApi.deleteMany,
    ...createMutationOptions({
      onSuccess: (deletedIds) => {
        showSuccess(`${deletedIds.length}개의 사진이 삭제되었습니다.`)
        clearChecked()
        invalidateQueries.listByEntity('photos')
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '사진 삭제'))
      }
    })
  })
}

/**
 * Photo 추가 뮤테이션 훅 (최적화)
 */
export const useAddPhotoMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: photosApi.create,
    ...createMutationOptions({
      onSuccess: (newPhoto) => {
        showSuccess('새 사진이 추가되었습니다.')
        invalidateQueries.listByEntity('photos')
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '사진 추가'))
      }
    })
  })
}

/**
 * Photo 수정 뮤테이션 훅 (최적화)
 */
export const useUpdatePhotoMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: ({ id, ...photoData }) => photosApi.update(id, photoData),
    ...createMutationOptions({
      onSuccess: (updatedPhoto) => {
        showSuccess('사진이 수정되었습니다.')
        invalidateQueries.listByEntity('photos')
        invalidateQueries.detailByEntity('photos', updatedPhoto.id)
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '사진 수정'))
      }
    })
  })
}
