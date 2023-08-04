import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Divider, Button, Drawer, Descriptions, Badge } from 'antd';
import InputSearch from './InputSearch';
import { fetchUserByID, fetchUserWithQuery } from '../../../services/apiServices';
import { DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import UserViewDetail from './UserViewDetail';
import moment from 'moment';

// https://stackblitz.com/run?file=demo.tsx
const UserTable = () => {
    const [listUser, setListUser] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [sorterFilter, setSorterFilter] = useState('')
    const [sorterField, setSorterField] = useState('')
    const [filter, setFilter] = useState('')
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState([])



    const showViewDetail = () => {
        setOpenViewDetail(true);
    };




    const handleViewDetail = async (user) => {
        showViewDetail()
        // console.log(">>record", user.id)
        const res = await fetchUserByID(user.id)
        if (res && res.data) {
            // console.log(">>res", res.data)
            const user = res.data
            setDataViewDetail([
                {
                    key: '1',
                    label: 'ID',
                    children: user._id,
                },
                {
                    key: '2',
                    label: 'Tên hiển thị',
                    children: user.fullName,
                },
                {
                    key: '3',
                    label: 'Email',
                    children: user.email,
                },
                {
                    key: '4',
                    label: 'Số điện thoại',
                    children: user.phone,
                },
                {
                    key: '5',
                    label: 'Role',
                    children: <Badge status="processing" text={`${user.role}`} />,
                    span: 2
                },
                {
                    key: '6',
                    label: 'Created At',
                    children: moment(user.createdAt).format('DD-MM-YY HH:mm:ss'),

                },
                {
                    key: '7',
                    label: 'Updated At',
                    children: moment(user.updatedAt).format('DD-MM-YY HH:mm:ss'),

                },
            ])
        }

    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text, record) => (
                <a onClick={() => handleViewDetail(record)}>
                    {text}
                </a>
            ),
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <> <span>
                        <DeleteOutlined style={{ color: 'red' }} onClick={() => handleDelete(record.id)} />
                    </span></>
                )
            }
        },

    ];


    const fetchListUser = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }
        if (sorterFilter && sorterFilter === 'ascend') {
            query += `&sort=${sorterField}`
        } else if (sorterFilter && sorterFilter === 'descend') {
            query += `&sort=-${sorterField}`
        }
        const res = await fetchUserWithQuery(query)
        // console.log(">>check pagination and fiklter", pagination)
        // console.log(">>res", res.data)
        // console.log(">>res resuklts", res.data.result)
        if (res && res.data) {
            const listUser = res.data.result.map((user, index) => ({
                key: index,
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
            })
            )

            setTotal(res.data.meta.total)
            setListUser(listUser)
            // console.log(">>data", data)
        }
        setIsLoading(false)

    }




    const onChange = async (pagination, filters, sorter, extra) => {

        console.log('params', pagination, filters, sorter, extra);

        if (pagination && current !== pagination.current) {
            setCurrent(pagination.current)
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        if (sorter && sorter.order !== sorterFilter) {
            setSorterFilter(sorter.order)
            setSorterField(sorter.field)
            setCurrent(1)
        }

    };



    const RenderHeader = () => {
        return (
            <>
                <div style={{ display: "flex", justifyContent: 'space-between', padding: '20px' }}>
                    <span style={{ fontSize: '20px' }}>Table List Users</span>
                    <span style={{ display: 'flex', gap: 15 }}>
                        <Button
                            icon={<ExportOutlined />}
                            type='primary'>
                            Export
                        </Button>
                        <Button
                            icon={<ImportOutlined />}
                            type='primary'>
                            Import
                        </Button>
                        <Button
                            icon={<PlusOutlined />}
                            type='primary'>
                            Thêm mới
                        </Button>

                    </span>
                </div>
            </>
        )
    }

    useEffect(() => {
        fetchListUser()

    }, [current, pageSize, filter, sorterField, sorterFilter])

    return (
        <>
            <Row gutter={[20, 20]} style={{ padding: "20px" }}>
                <Col span={24} >
                    <InputSearch
                        setFilter={setFilter}
                    />
                </Col>


                <Col span={24}>
                    <Table
                        caption={<RenderHeader />}
                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        loading={isLoading}
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total,
                                showTotal: (total, range) => {
                                    return (
                                        <div>
                                            {range[0]} - {range[1]} trên {total}
                                        </div>
                                    )
                                }
                            }
                        }

                    />
                </Col>
            </Row >
            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    )
}


export default UserTable;