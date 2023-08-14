import { Divider, Table, Tag } from "antd";
import { getOrdersHistory } from "../../services/apiServices";
import { useEffect, useState } from "react";
import moment from "moment";
import { CheckCircleOutlined } from "@ant-design/icons";
import ReactJson from 'react-json-view'


const History = () => {
  const [listOrder, setListOrder] = useState([])


  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (text, record, index) => index + 1, // Generate order numbers
      width: '100px'
    },
    {
      title: 'Thời gian',
      dataIndex: 'updatedAt',
      width: '250px'
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalPrice',
      width: '250px'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '200px'
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      // render: (detail) => (
      //   <ReactJson
      //     src={detail}
      //     name={"Chi tiết đơn hàng"}
      //     collapsed={true}
      //     displayObjectSize={false}
      //     displayDataTypes={false}
      //   />
      // ),
      render: (text, record, detail) => (
        <div>
          {
            record.detail && record.detail.map((detail, index) => (
              <div key={index}>
                Tên sách: {detail.bookName} - Số lượng: {detail.quantity}
              </div>
            ))
          }
        </div>
      )
    },
  ];

  useEffect(() => {
    const fetchOrdersHistory = async () => {
      const res = await getOrdersHistory();
      if (res && res.data) {
        const listOrder = res.data.map((order, index) => ({
          key: index,
          updatedAt: moment(order.updatedAt).format('DD-MM-YY HH:mm:ss'),
          status: <Tag icon={<CheckCircleOutlined />} color="success">
            thành công
          </Tag>,
          totalPrice: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(order.totalPrice),
          detail: order.detail
        }))
        setListOrder(listOrder)
        console.log(">>listordee", listOrder)
      }
    }
    fetchOrdersHistory();
  }, [])

  return (
    <>
      <div style={{ background: '#efefef', padding: "30px 30px" }}>
        <Table
          caption={<Divider style={{ fontWeight: "bold" }}>Lịch sử đặt hàng</Divider>}
          dataSource={listOrder}
          columns={columns}
          pagination={false}

        />
        <div style={{ marginBottom: '330px' }}></div>
      </div>

    </>
  )
}

export default History