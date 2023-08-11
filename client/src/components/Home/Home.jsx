import './Home.scss'
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import { fetchBookWithQuery, getCategory } from '../../services/apiServices';
import { useEffect, useState } from 'react';
import moment from 'moment';

const Home = () => {
  const [form] = Form.useForm();

  const [listCategory, setListCategory] = useState([])
  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sorterFilter, setSorterFilter] = useState('')
  const [sorterField, setSorterField] = useState('')
  const [filter, setFilter] = useState('')

  const fetchListBook = async () => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (filter) {
      query += `&${filter}`
    }
    if (sorterFilter && sorterFilter === 'ascend') {
      query += `&sort=${sorterField}`
    } else if (sorterFilter && sorterFilter === 'descend') {
      query += `&sort=-${sorterField}`
    } else {
      query += `&sort=-sold`
    }
    const res = await fetchBookWithQuery(query)
    // console.log(">>check pagination and fiklter", pagination)
    // console.log(">>res", res.data)
    // console.log(">>res resuklts", res.data.result)

    if (res && res.data) {
      const listBook = res.data.result.map((book, index) => ({
        key: index,
        id: book._id,
        mainText: book.mainText,
        category: book.category,
        author: book.author,
        sold: book.sold,
        quantity: book.quantity,
        price: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(book.price),
        deleted: book.isDeleted ? 'true' : 'false',
        thumbnail: book.thumbnail,
        slider: book.slider,
        updatedAt: moment(book.updatedAt).format('DD-MM-YY HH:mm:ss'),
        updatedAt: moment(book.createdAt).format('DD-MM-YY HH:mm:ss'),
      })
      )

      setTotal(res.data.meta.total)
      setListBook(listBook)
      console.log("Check list book", listBook)

      // console.log(">>data", data)
    }
    setIsLoading(false)

  }

  const handleReset = () => {
    form.resetFields();
    handleChangeFilter({ category: [] }, { category: [] });
  };


  const handleChangeFilter = (changedValues, values) => {
    // console.log(">>changed values ", changedValues)
    // console.log(">> values ", values)
    if (changedValues.category) {
      if (changedValues.category.length > 0) {
        const concatenatedFilter = changedValues.category.toString()
        setFilter(`category=${concatenatedFilter}`);
        // console.log("fil", concatenatedFilter)
      } else {
        setFilter('')
      }
    }
  }


  const onFinish = (values) => {
    // console.log("values", values)
    // console.log("values from", values.range.from)
    // console.log("values to", values.range.to)
    if (values?.range) {
      let fil = ''
      if (values?.range?.from) {
        // let filter = `price>=${values.range.from}&price<=${values.range.to}`;
        fil = `price>=${values?.range?.from}`;
      }
      if (values?.range?.to) {
        fil = `price<=${values?.range?.to}`;
      }
      if (values?.range?.to && values?.range?.from) {
        fil = `price>=${values.range.from}&price<=${values.range.to}`;
      }
      if (values?.category?.length >= 0) {
        const concatenatedFilter = values?.category?.toString()
        fil += (`&category=${concatenatedFilter}`);

      }
      setFilter(fil)
    }
  }



  const onChangeTabs = (key) => {
    // console.log(key);
    if (key === "sold") {
      setSorterField("sold")
      setSorterFilter("descend")

    }
    if (key === "updatedAt") {
      setSorterField("updatedAt")
      setSorterFilter("descend")

    }
    if (key === "price") {
      setSorterField("price")
      setSorterFilter("ascend")

    }
    if (key === "-price") {
      setSorterField("price")
      setSorterFilter("descend")

    }
  };

  const handleChangePagination = async (pagination) => {

    if (pagination && current !== pagination.current) {
      setCurrent(pagination.current)
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize)
      setCurrent(1)
    }
  };



  const items = [
    {
      key: 'sold',
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: 'updatedAt',
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: 'price',
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: '-price',
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategory();
      if (res && res.data) {
        const d = res.data.map(item => {
          return { label: item, value: item }
        })
        setListCategory(d);
      }
    }
    fetchCategory();
  }, [])

  useEffect(() => {
    fetchListBook()

  }, [current, pageSize, filter, sorterField, sorterFilter])




  return (
    <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
      <Row gutter={[20, 20]}>
        <Col md={4} sm={0} xs={0} style={{}}>
          <div style={{ display: 'flex', justifyContent: "space-between", padding: '12px 0' }}>
            <span> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
            <ReloadOutlined title="Reset" onClick={() => handleReset()} />

          </div>
          <Divider></Divider>
          <Form
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
          >
            <Form.Item
              name="category"
              label="Danh mục các thể loại sách"
              labelCol={{ span: 24 }}
            >
              <Checkbox.Group>
                <Row>
                  {listCategory && listCategory.length > 0 && listCategory.map((category, index) =>
                    <Col span={24} key={index} style={{ padding: '8px 0' }}>
                      <Checkbox value={category.label} >
                        {category.value}
                      </Checkbox>
                    </Col>
                  )}

                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />
            <Form.Item
              label="Khoảng giá"
              labelCol={{ span: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Form.Item name={["range", 'from']}>
                  <InputNumber
                    name='from'
                    min={0}
                    placeholder="đ TỪ"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
                <span >-</span>
                <Form.Item name={["range", 'to']}>
                  <InputNumber
                    name='to'
                    min={0}
                    placeholder="đ ĐẾN"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </div>
              <div>
                <Button onClick={() => form.submit()}
                  style={{ width: "100%" }} type='primary'>Áp dụng</Button>
              </div>
            </Form.Item>
            <Divider />

          </Form>
        </Col>
        <Col md={20} xs={24} style={{}}>
          <Spin spinning={isLoading}
            tip="Loading..."
            size="large">
            <div className="content" />
            <Row>
              <Tabs defaultActiveKey="1" items={items} onChange={onChangeTabs} />
            </Row>


            <Row
              className='customize-row'
            >
              {listBook && listBook.length > 0 && listBook.map((book, index) => (
                <div className="column" key={`book-${index}`}>
                  <div className='wrapper'>
                    <div className='thumbnail'>
                      <img src={`http://localhost:6969/images/book/${book.thumbnail}`}
                        alt="thumbnail book" />
                    </div>
                    <div className='text'>{book.mainText}</div>
                    <div className='price'>
                      {/* {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)} */}
                      {book.price}
                    </div>
                    <div className='rating'>
                      <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                      <span>Đã bán {book.sold}</span>
                    </div>
                  </div>
                </div>
              ))}

            </Row>
            <Divider />
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                current={current}
                pageSize={pageSize}
                total={total}
                responsive
                onChange={(p, s) => handleChangePagination({ current: p, pageSize: s })}
              />
            </Row>
          </Spin>
        </Col>
      </Row>
    </div>
  )
}

export default Home