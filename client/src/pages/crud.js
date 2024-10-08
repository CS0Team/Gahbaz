import { useMutation } from '@tanstack/react-query'
import customFetch from '../utils/customFetch'
import { notifications } from '@mantine/notifications'

export function useDeleteElement(queryClient, collection) {
  return useMutation({
    mutationFn: async (eleId) => {
      console.log('try delete')
      // console.log('delete id:', eleId)

      const response = await customFetch.delete(`/${collection[0]}/${eleId}`)
    },
    onError: (error) => {
      // console.log(error)
      notifications.show({
        id: 'error-delete',
        title: 'خطأ!',
        message: error?.response?.data?.msg||'خطأ',
        variant: 'error',
        color:'red',
        autoClose: 5000,
      })

      throw error // Re-throw the error for handling in handleSubmit
    },
    onMutate: (eleId) => {
      queryClient.setQueryData(collection, (prevElements) => {
        //   console.log('prevElements',prevElements)
        // console.log('delete id:', eleId)
        return prevElements?.filter((ele) => ele._id !== eleId)
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: collection }),
  })
}

export function useGetElements(collection) {
  return {
    queryKey:[ ...collection],
    queryFn: async () => {
      //send api request here
      console.log(collection.join('/'))
      const { data } = await customFetch.get(`${collection.join('/')}`) // Adjust this URL as per your API route
      console.log('all geten elements', data)
      return data
    },
    refetchOnWindowFocus: false,
  }
}

export function useUpdateElement(queryClient, collection) {
  return useMutation({
    mutationFn: async (element) => {
      const { data } = await customFetch.patch(`${collection[0]}/${element._id}`, element)
      return data
    },
    onError: (error) => {
      // console.log(error)
      notifications.show({
        id: 'error-delete',
        title: 'خطأ!',
        message: error?.response?.data?.msg||'خطأ',
        variant: 'error',
        color:'red',
        autoClose: 5000,
      })

      throw error // Re-throw the error for handling in handleSubmit
    },
    // onMutate: (newElement) => {
    //   queryClient.setQueryData(collection, (prevElements) => {
    //     console.log('newElement', newElement)
    //     console.log('prevElements :', prevElements)
    //     return prevElements?.map((prevElement) =>
    //       prevElement._id === newElement._id ? newElement : prevElement,
    //     )
    //   })
    // },
    onSettled: () => queryClient.invalidateQueries({ queryKey: collection }),
  })
}

export function useUpdateOneElement(queryClient, collection) {
  return useMutation({
    mutationFn: async (element) => {
      const { data } = await customFetch.patch(`${collection[0]}/${element._id}`, element)
      return data
    },
    onError: (error) => {
      // console.log(error)
      notifications.show({
        id: 'error-delete',
        title: 'خطأ!',
        message: error?.response?.data?.msg||'خطأ',
        variant: 'error',
        color:'red',
        autoClose: 5000,
      })

      throw error // Re-throw the error for handling in handleSubmit
    },
    // onMutate: (newElement) => {
    //   queryClient.setQueryData(collection, (prevElements) => {
    //     console.log('newElement', newElement)
    //     console.log('prevElements :', prevElements)
    //     return prevElements?.map((prevElement) =>
    //       prevElement._id === newElement._id ? newElement : prevElement,
    //     )
    //   })
    // },
    onSettled: () => queryClient.invalidateQueries({ queryKey: collection }),
  })
}

export function useCreateElement(queryClient, collection) {
  return useMutation({
    mutationFn: async (element) => {
      console.log('try create')
      console.log('data:', element)
      const response = await customFetch.post(`${collection[0]}`, element)
      return response.data // Assuming the API returns the created element data
    },

    onError: (error) => {
      // console.log(error)
      notifications.show({
        id: 'error-delete',
        title: 'خطأ!',
        message: error?.response?.data?.msg||'خطأ',
        variant: 'error',
        color:'red',
        autoClose: 5000,
      })

      throw error // Re-throw the error for handling in handleSubmit
    },
    onMutate: (newElement) => {
      queryClient.setQueryData(collection, (prevElements) => [
        ...prevElements,
        {
          ...newElement,
        },
      ])
    },


    onSettled: () => queryClient.invalidateQueries({ queryKey: collection }),

  })
}

