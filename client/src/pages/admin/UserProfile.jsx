import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import react, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IconArrowAutofitLeft } from '@tabler/icons-react'
import { useGetElements } from '../crud'
import { useQuery } from '@tanstack/react-query'
import { MantineReactTable } from 'mantine-react-table'
import { Helmet } from 'react-helmet'

export default function UserProfile({ queryClient }) {
  const { userId } = useParams()
  const {
    data: user = [],
    isError: isErrorLoading,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['users', userId]))

  if (isFetching || isLoading) {
    return (
      <>
        <div
          className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
        ></div>
        <div className="p-4">
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </div>
      </>
    )
  }
  const getRole = () => {
    if (user.__t === 'Student') return `طالب ${user?.major?.name}, الفصل ${user?.comingSemester}`
    if (user.__t === 'Teatcher') return `معلم`
    if (user.__t === 'Admin') return `مدير`
  }

  return (
    <Container fluid>
                                 <Helmet>
            <title>{ 'منصة جهبذ | معلومات المستخدم' }</title>
      </Helmet>
      <Container
        bg="white"
        sx={{
          background: 'ligth',
        }}
        h={180}
        fluid
        mb={34}
      >
        <Flex gap={'md'} justify={'space-between'} h={'100%'} align={'center'}>
          <Group noWrap sx={{}}>
            <Avatar size={'xl'} variant="outline" sx={{ borderRadius: '50%' }} src={user.avatar} />
            <Stack sx={{ gap: 0 }}>
              <Text mb={'xs'}>{`${user.firstName} ${user.lastName}`}</Text>
              <Text size="xs" color="dimmed">
                {getRole()}
              </Text>
            </Stack>
          </Group>
          <Stack sx={{ gap: 0 }}>
            <Text mb={'xs'}>{`${user.email}`}</Text>
            <Text size="xs" color="dimmed">
              {user.phone}
            </Text>
          </Stack>
        </Flex>
      </Container>
      {user.__t === 'Student' && (
        <Container>
          <Title order={4}>درجات الفصول</Title>
          <Grades queryClient={queryClient} user={user} />
        </Container>
      )}
    </Container>
  )
}

function Grades({ queryClient }) {
  //nested data is ok, see accessorKeys in ColumnDef below
  const { userId } = useParams()
  const {
    data: grades = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['grades', 'student-grades', userId]))

  if (isFetching || isLoading) {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        Loading
      </div>
    )
  }

  if (grades.length == 0) {
    return <div className="list-items" data-testid="loading" key={'loading'}></div>
  }

  return grades.map((gr) => (
    <>
      <Divider m="md" />
      <Title mt={'lg'} order={5}>
        {`${gr.semester.name} - ${Date.parse(gr.semester.startDate)} => ${gr.semester.endDate}`}{' '}
      </Title>
      <Box my={'xl'}>
        <GradesTable grades={gr.grades} />
      </Box>
    </>
  ))
}
const GradesTable = ({ grades }) => {
  const columns = useMemo(
    () => [
      {
        id: 'Course',
        header: 'الطالب',
        columns: [
          {
            id: 'course',
            accessorKey: 'course',
            Cell: ({ cell }) => {
              if (!cell.getValue() || cell.getValue().length == 0) return ''
              return cell.getValue()?.name || ''
            },
            header: 'course',
            enableEditing: false,
          },
        ],
      },
      {
        id: 'grade',
        header: 'الدرجة',
        columns: [
          ...Object.keys(grades[0].grade).map((gr, idx) => ({
            // accessorKey: `grade.${gr}.value`,
            accessorFn: (row) => {
              // console.log('row', row)
              return row.grade[gr].value
            },
            id: gr,
            header: grades[0].grade[gr].name,
          })),

          {
            accessorKey: 'total',
            id: 'total',
            header: 'المجموع',
          },
        ],
      },
    ],

    [],
  )

  return (
    // <MantineProvider dir="rtl">
    <MantineReactTable columns={columns} data={grades} getRowId={(row) => row.id} />
    // {/* </MantineProvider> */}
  )
}
