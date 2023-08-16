import './Home.scss'
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import { fetchBookWithQuery, getCategory } from '../../services/apiServices';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const [searchTerm, setSearchTerm] = useOutletContext();
  const [form] = Form.useForm();
  const [listCategory, setListCategory] = useState([])
  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sorterFilter, setSorterFilter] = useState('')
  const [sorterField, setSorterField] = useState('')
  const [filter, setFilter] = useState('')
  const navigate = useNavigate()



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
    if (searchTerm) {
      query += `&mainText=/${searchTerm}/i`
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
      // console.log("Check list book", listBook)

      // console.log(">>data", data)
    }
    setIsLoading(false)

  }

  const handleReset = () => {
    form.resetFields();
    // setSearchTerm("")
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

  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }

  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book.id}`)
  }

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

  }, [current, pageSize, filter, sorterField, sorterFilter, searchTerm])




  return (
    <div style={{ background: '#efefef', padding: "20px 0" }}>
      <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Row gutter={[20, 20]}>
          <Col md={4} sm={0} xs={0} style={{}}>
            <div style={{ marginLeft: '-12px', padding: "20px", background: '#fff', borderRadius: 5 }}>
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
            </div>
          </Col>

          <Col md={20} xs={24} style={{}}>
            <Spin spinning={isLoading}
              tip="Loading..."
              size="large">
              <div className="content" />
              <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                <Row>
                  <Tabs defaultActiveKey="1" items={items} onChange={onChangeTabs} />
                </Row>


                <Row
                  className='customize-row'
                >
                  {listBook && listBook.length > 0 && listBook.map((book, index) => {
                    return (
                      <div className="column" key={`book-${index}`}
                        onClick={() => handleRedirectBook(book)}>
                        <div className='wrapper'>
                          <div className='thumbnail'>
                            <img src={`http://localhost:6969/images/book/${book.thumbnail}`}
                              alt="thumbnail book" />
                          </div>
                          <div className='text' style={{ fontSize: '14px' }}>{book.mainText}</div>
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
                    )
                  })}


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
              </div>
            </Spin>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Home