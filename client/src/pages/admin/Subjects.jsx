import { useMemo, useEffect, useState } from 'react'
import {
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
  MantineReactTable,
  useMantineReactTable,
  MRT_EditActionButtons,
} from 'mantine-react-table'
import { Link, useLoaderData, useParams } from 'react-router-dom'

// import useTable
import {
  ActionIcon,
  Button,
  Flex,
  Text,
  Tooltip,
  Title,
  Box,
  Menu,
  Badge,
  MantineProvider,
  Anchor,
  Stack,
  TextInput,
  MultiSelect,
  Grid,
} from '@mantine/core'
import { IconUserCircle, IconSend } from '@tabler/icons-react'
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useCreateElement, useDeleteElement, useGetElements, useUpdateElement } from '../crud'
import { modals } from '@mantine/modals'

export default function Subjects({ queryClient }) {
  //call CREATE hook
  const { id: collageId } = useParams()
  const { mutateAsync: createSubject, isLoading: isCreatingSubject } = useCreateElement(
    queryClient,
    ['subjects', collageId],
  )

  const {
    data: subjects = [],
    isError: isLoadingSubjectsError,
    isFetching: isFetchingSubjects,
    isLoading: isLoadingSubjects,
  } = useQuery(useGetElements(['subjects', collageId]))
  const {
    data: teachers = [],
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['teachers']))

  // console.log(subjects)
  const { mutateAsync: updateSubject, isLoading: isUpdatingSubject } = useUpdateElement(
    queryClient,
    ['subjects', collageId],
  )
  const { mutateAsync: deleteSubject, isLoading: isDeletingSubject } = useDeleteElement(
    queryClient,
    ['subjects', collageId],
  )

  const teachersForSelect = getMultiSelectData(teachers)
  const [editingRowData, setEditingRowData] = useState({}) // State for new row data
  const [gradeSchema, setGradeSchema] = useState({}) // State for new row data

  const handleCreateSubject = async ({ values, row, table, exitCreatingMode }) => {
    // console.log(newRowData)
    await createSubject({ ...newRowData, collage: collageId })
    modals.closeAll()
    table.setCreatingRow(false)
  }

  const [newRowData, setNewrowData] = useState({}) // State for new row data

  //UPDATE action
  const handleSaveSubject = async ({ values, row, table }) => {
    await updateSubject({ ...values, ...editingRowData, _id: row.id })
    table.setEditingRow(null) //exit editing mode
  }

  //DELETE action
  const openDeleteConfirmModal = (row) => deleteSubject(row.id)

  const columns = useMemo(
    () => [
      {
        id: 'index',
        enableEditing: false,
        accessorFn: (row, rowIndex) => rowIndex + 1,
        header: '#',
      },
      {
        accessorKey: 'name',
        header: 'الأسم',
      },
      {
        accessorKey: 'subtitle',
        header: 'العنوان الفرعي',
      },
      {
        accessorKey: 'category',
        header: 'التصنيف',
      },
      {
        accessorKey: 'teachers',
        Cell: ({ cell,row }) => {
          if (!cell.getValue()) return ''
         
          return (
            row.original.teachers?.map((val)=><Badge>{`${val.firstName} ${val.lastName}`}</Badge>)

          )
        },
        header: 'المعلمون',
      },
      {
        accessorKey: 'gradeSchema',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return ''
          const elements = cell.getValue().grade
          const keys = Object.keys(cell.getValue().grade)
          const grades = keys?.map((ele) => (
            <Badge>{`${elements[ele]?.name ?? ''}: ${elements[ele]?.value ?? ''} `}</Badge>
          ))
          return (
            <>
              {grades}
              <Badge color="green">{`المجموع: ${cell.getValue()?.total ?? ''} `}</Badge>
            </>
          )
        },
        header: 'هيكلية الدرجات',
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns: columns,
    data: subjects,
    // enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,
    enableEditing: true,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableRowActions: true,
    getRowId: (row) => row._id,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'xl',
      size: 'lg',
    },
    mantineToolbarAlertBannerProps: isLoadingSubjectsError
      ? {
          color: 'red',
          children: 'خطأ في تحميل البيانات',
        }
      : undefined,
    mantineTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },

    onCreatingRowSave: handleCreateSubject,
    onEditingRowSave: handleSaveSubject,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="تعديل">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="حذف">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderCreateRowModalContent: ({ internalEditComponents, row, table }) => (
      <Stack>
        <Title order={5}>إنشاء</Title>
        <TextInput
          withAsterisk
          label="الأسم"
          name="name"
          id="name"
          // placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...newRowData, name: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="العنوان الفرعي"
          name="subtitle"
          id="subtitle"
          // placeholder=" subtitle"
          onChange={(e) => setNewrowData({ ...newRowData, subtitle: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="التصنيف"
          name="category"
          id="category"
          // placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...newRowData, category: e.target.value })}
        />
        <MultiSelect
          data={teachersForSelect}
          label="المعلمون"
          // placeholder="Pick all that you like"
          name="teachers"
          id="teachers"
          onChange={(selectedValue) => setNewrowData({ ...newRowData, teachers: selectedValue })}
        />
        <Flex justify="flex-end">
          <MRT_EditActionButtons row={row} table={table} variant="text" />{' '}
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ internalEditComponents, row, table }) => (
      <Stack>
        <Title order={5}>تعديل</Title>
        <TextInput
          withAsterisk
          label="الأسم"
          name="name"
          defaultValue={row?.original.name}
          id="name"
          // placeholder="اسم الكلية"
          onChange={(e) => setEditingRowData({ ...editingRowData, name: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="العنوان الفرعي"
          name="subtitle"
          defaultValue={row?.original.subtitle}
          id="subtitle"
          // placeholder=" subtitle"
          onChange={(e) => setEditingRowData({ ...editingRowData, subtitle: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="التصنيف"
          name="category"
          defaultValue={row?.original.category}
          id="category"
          // placeholder="اسم الكلية"
          onChange={(e) => setEditingRowData({ ...editingRowData, category: e.target.value })}
        />
        <MultiSelect
          data={teachersForSelect}
          label="المعلمون"
          // placeholder="Pick all that you like"
          // defaultValue={row?.getAllCells()[5]?.getValue()}
          name="teachers"
          id="teachers"
          onChange={(selectedValue) =>
            setEditingRowData({ ...editingRowData, teachers: selectedValue })
          }
        />
        <Flex justify="flex-end">
          <MRT_EditActionButtons row={row} table={table} variant="text" />{' '}
        </Flex>
      </Stack>
    ),
    mantineCreateRowModalProps: {
      centered: true,
      closeButtonProps: {},
      onClose: () => setNewrowData({}),
    },
    mantineEditRowModalProps: {
      centered: true,
      onClose: () => setEditingRowData({}),
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true)
        }}
      >
        إنشاء{' '}
      </Button>
    ),

    renderRowActionMenuItems: ({ row }) => (
      <Box>
        <ActionIcon
        // onClick={() => setEditingRowData({ subjects: row.getAllCells()[2].getValue() })}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon onClick={() => console.info('Delete')}>{/* <DeleteI /> */}</ActionIcon>
      </Box>
    ),
    state: {
      isLoading: isLoadingSubjects,
      isSaving: isCreatingSubject || isUpdatingSubject,
      showAlertBanner: isLoadingSubjectsError,
      showProgressBars: isFetchingSubjects,
    },
  })

  return <MantineReactTable table={table} />
}

const getMultiSelectData = (subjects) =>
  Object.values(subjects).map((sub) => ({
    value: sub._id,
    label: `${sub.firstName} ${sub.lastName}`,
  }))

const getTheTotal = (elements) => {
  let total = 0
  for (const ele in elements) total += elements[ele].value
  return total
}
