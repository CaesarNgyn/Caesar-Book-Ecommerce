import { ExportOutlined, PlusOutlined } from "@ant-design/icons"
import { Badge, Button, Col, Table } from "antd"
import { useEffect, useState } from "react"
import { fetchOrderByID, fetchOrderWithQuery } from "../../../services/apiServices"
import moment from "moment"
import OrderViewDetail from "./OrderViewDetail"

const OrderTable = () => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [listOrder, setListOrder] = useState([])
  const [sorterFilter, setSorterFilter] = useState('')
  const [sorterField, setSorterField] = useState('')
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState([])


  const showViewDetail = () => {
    setOpenViewDetail(true);
  };

  const fetchListOrder = async () => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (sorterFilter && sorterFilter === 'ascend') {
      query += `&sort=${sorterField}`
    } else if (sorterFilter && sorterFilter === 'descend') {
      query += `&sort=-${sorterField}`
    } else {
      query += `&sort=-updatedAt`
    }


    const res = await fetchOrderWithQuery(query)

    if (res && res.data) {
      console.log(">>res", res)
      const listOrder = res.data.result.map((order, index) => ({
        key: index,
        id: order._id,
        email: order.email,
        name: order.name,
        phone: order.phone,
        address: order.address,
        detail: order.detail,
        totalPrice: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(order.totalPrice),
        deleted: order.isDeleted ? 'true' : 'false',
        createdAt: moment(order.createdAt).format('DD-MM-YY HH:mm:ss'),
        updatedAt: moment(order.updatedAt).format('DD-MM-YY HH:mm:ss'),
      })
      )
      setTotal(res.data.meta.total)
      setListOrder(listOrder)
      console.log("Check list order", listOrder)

      // console.log(">>data", data)
    }
    setIsLoading(false)

  }

  const handleViewDetail = async (order) => {
    showViewDetail()
    // console.log(">>record", order.id)
    const res = await fetchOrderByID(order.id)
    if (res && res.data) {
      // console.log(">>res", res.data)
      const order = res.data
      setDataViewDetail([
        {
          key: '1',
          label: 'ID',
          children: order._id,
          span: 2
        },
        {
          key: '2',
          label: 'Tài khoản đặt hàng',
          children: order.email,
        },
        {
          key: '3',
          label: 'Người nhận',
          children: order.name,
        },
        {
          key: '4',
          label: 'Tổng thanh toán',
          children: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(order.totalPrice),
        },
        {
          key: '5',
          label: 'Số điện thoại',
          children: order.phone,
        },
        {
          key: '6',
          label: 'Địa chỉ nhận hàng',
          children: order.address,
          span: 4
        },
        {
          key: '7',
          label: 'Chi tiết',
          children:
            <>
              {order.detail.map((detail, index) => (
                <div key={index}>
                  Tên sách: {detail.bookName} - Số lượng: {detail.quantity}
                </div>
              ))}
            </>,
          span: 2
        },
        {
          key: '8',
          label: 'Created At',
          children: moment(order.createdAt).format('DD-MM-YY HH:mm:ss'),
          span: 2

        },
        {
          key: '9',
          label: 'Updated At',
          children: moment(order.updatedAt).format('DD-MM-YY HH:mm:ss'),
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
      title: 'Tài khoản đặt hàng',
      dataIndex: 'email',
      sorter: true,
      width: '250px'
    },
    {
      title: 'Tên người nhận',
      dataIndex: 'name',
      sorter: true,
      width: "250px"
    },
    {
      title: 'Thanh toán',
      dataIndex: 'totalPrice',
      sorter: true,
      width: "250px"
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      sorter: true,
      width: "350px"
    }
  ]

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
          <span style={{ fontSize: '20px' }}>Table List Orders</span>
        </div>
      </>
    )
  }

  useEffect(() => {
    fetchListOrder()

  }, [current, pageSize, sorterField, sorterFilter])

  return (

    <div style={{ padding: "16px" }}>
      <Col span={24}>
        <Table
          caption={<RenderHeader />}
          columns={columns}
          dataSource={listOrder}
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
      <OrderViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>

  )
}

export default OrderTable