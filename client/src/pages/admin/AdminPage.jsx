import { Card, Col, Divider, Row, Statistic } from "antd"
import LayoutAdmin from "../../components/Admin/LayoutAdmin"
import CountUp from 'react-countup';
import { useEffect, useState } from "react";
import { fetchDashboard } from "../../services/apiServices";
import Dashboard from "../../components/Admin/Dashboard/Dashboard";
import Page from "../../components/Admin/Dashboard/Page";


const AdminPage = () => {
  const formatter = (value) => <CountUp end={value} separator="," />;
  const [totalUser, setTotalUser] = useState(0)
  const [totalBook, setTotalBook] = useState(0)
  const [totalOrder, setTotalOrder] = useState(0)
  const [revenue, setRevenue] = useState([])

  const getDashboard = async () => {
    const res = await fetchDashboard()
    if (res && res?.data) {
      // console.log("??res", res)
      setTotalUser(res.data.users)
      setTotalBook(res.data.books)
      setTotalOrder(res.data.orders)
      setRevenue(res.data.revenue)
    }
  }
  useEffect(() => {
    getDashboard()
  }, [totalUser, totalBook, totalOrder])
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[20, 20]}>
        <Col span={8}>
          <Card style={{ width: 400 }}>
            <Statistic title="Người dùng hệ thống (Users)" value={totalUser} formatter={formatter} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ width: 400 }}>
            <Statistic title="Tổng sản phẩm (Books)" value={totalBook} formatter={formatter} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ width: 400 }}>
            <Statistic title="Tổng đơn hàng (Orders)" value={totalOrder} formatter={formatter} />
          </Card>
        </Col>
        <Divider>Doanh số</Divider>
        <Col span={24} style={{ marginTop: '24px' }}>
          <Dashboard revenue={revenue} />

        </Col>
      </Row>
    </div>

  )
}

export default AdminPage

