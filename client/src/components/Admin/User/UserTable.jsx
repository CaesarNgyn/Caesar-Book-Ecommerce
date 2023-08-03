import React, { useEffect, useState } from 'react';
import { Table, Row, Col } from 'antd';
import InputSearch from './InputSearch';
import { fetchUserWithPagination } from '../../../services/apiServices';

// https://stackblitz.com/run?file=demo.tsx
const UserTable = () => {
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true
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
                    <><button>Delete</button></>
                )
            }
        },
    ];


    const fetchListUser = async (pagination, filters, sorter, extra) => {
        const res = await fetchUserWithPagination(current, pageSize)
        // console.log(">>check pagination and fiklter", pagination)
        console.log(">>res", res.data)
        console.log(">>res resuklts", res.data.result)
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
            setData(listUser)
            console.log(">>data", data)
        }

    }

    useEffect(() => {
        fetchListUser()
    }, [current, pageSize])


    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }

    };

    return (
        <>
            <Row gutter={[20, 20]} style={{ padding: "20px" }}>
                <Col span={24} >
                    <InputSearch />
                </Col>
                <Col span={24}>
                    <Table
                        className='def'
                        columns={columns}
                        dataSource={data}
                        onChange={onChange}
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total
                            }
                        }
                    />
                </Col>
            </Row>
        </>
    )
}


export default UserTable;