import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Divider, Button, Drawer, Descriptions, Badge, Popconfirm, message, notification } from 'antd';

import { DeleteOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';

import * as XLSX from 'xlsx';
import InputSearch from './InputSearch';
import { fetchBookByID, fetchBookWithQuery } from '../../../services/apiServices';
import BookViewDetail from './BookViewDetail';


// https://stackblitz.com/run?file=demo.tsx
const BookTable = () => {
  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sorterFilter, setSorterFilter] = useState('')
  const [sorterField, setSorterField] = useState('')
  const [filter, setFilter] = useState('')
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState([])
  const [openModalCreateBook, setOpenModalCreateBook] = useState(false);
  const [openModalImportBook, setOpenModalImportBook] = useState(false);
  const [openModalUpdateBook, setOpenModalUpdateBook] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({})


  const showViewDetail = () => {
    setOpenViewDetail(true);
  };


  const showModalCreateBook = () => {
    setOpenModalCreateBook(true);
  };

  const showModalImportBook = () => {
    setOpenModalImportBook(true);
  };

  const handleUpdateBook = (book) => {
    // console.log(">>book update", book)
    setDataUpdate(book)
    setOpenModalUpdateBook(true)
  }

  const handleDeleteBook = async (bookID) => {
    const results = await deleteBook(bookID)
    console.log(">>>resuolts ddeelete", results)
    if (results && results.data) {
      message.success('Xóa người dùng thành công');
      fetchListBook()
    } else {
      notification.error({
        message: 'Xóa người dùng thất bại',
        description: results.message,
        duration: 3
      });
    }
  }




  const handleViewDetail = async (book) => {
    showViewDetail()
    // console.log(">>record", book.id)
    const res = await fetchBookByID(book.id)
    if (res && res.data) {
      // console.log(">>res", res.data)
      const book = res.data
      setDataViewDetail([
        {
          key: '1',
          label: 'ID',
          children: book._id,
        },
        {
          key: '2',
          label: 'Tên sách',
          children: book.mainText,
        },
        {
          key: '3',
          label: 'Tác giả',
          children: book.author,
        },
        {
          key: '4',
          label: 'Giá tiền',
          children: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(book.price),
        },
        {
          key: '5',
          label: 'Thể loại',
          children: <Badge status="processing" text={`${book.category}`} />,
          span: 2
        },
        {
          key: '6',
          label: 'Created At',
          children: moment(book.createdAt).format('DD-MM-YY HH:mm:ss'),

        },
        {
          key: '7',
          label: 'Updated At',
          children: moment(book.updatedAt).format('DD-MM-YY HH:mm:ss'),
        },
        { key: '8', thumbnail: book.thumbnail },
        { key: '9', slider: book.slider },
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
      title: 'Tên sách',
      dataIndex: 'mainText',
      sorter: true,
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      sorter: true
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      sorter: true
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      sorter: true,
      width: "100px"
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      sorter: true,
      width: "150px"
    },
    // {
    //     title: 'Đã xóa',
    //     dataIndex: 'deleted',
    //     sorter: true
    // },
    {
      title: 'Action',
      width: '110px',
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              title="Xóa người dùng"
              description="Bạn có chắc muốn xóa người dùng này?"
              onConfirm={() => handleDeleteBook(record.id)}
              // onCancel={cancel}
              placement="left"
              okText="Có"
              cancelText="Hủy"
            >
              <span>
                <DeleteOutlined
                  style={{ color: 'red', cursor: 'pointer' }}
                />
              </span>
            </Popconfirm >



            <span style={{ marginLeft: '16px' }}>
              <EditTwoTone
                twoToneColor={'#f57800'}
                onClick={() => handleUpdateBook(record)} />
            </span>
          </>
        )
      }
    },

  ];


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
      query += `&sort=updatedAt`
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
        price: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(book.price),
        deleted: book.isDeleted ? 'true' : 'false',
        updatedAt: moment(book.updatedAt).format('DD-MM-YY HH:mm:ss'),
      })
      )

      setTotal(res.data.meta.total)
      setListBook(listBook)
      console.log("Check list book", listBook)

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

  const handleExportBookData = () => {
    if (listBook.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listBook);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workbook, "BookDataExport.xlsx");
    }

  }



  const RenderHeader = () => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: 'space-between', padding: '20px' }}>
          <span style={{ fontSize: '20px' }}>Table List Books</span>
          <span style={{ display: 'flex', gap: 15 }}>
            <Button
              icon={<ExportOutlined />}
              type='primary'
              onClick={() => handleExportBookData()}
            >
              Export
            </Button>
            <Button
              icon={<ImportOutlined />}
              type='primary'
              onClick={showModalImportBook}>

              Import
            </Button>
            <Button
              icon={<PlusOutlined />}
              type='primary'
              onClick={showModalCreateBook}>
              Thêm mới
            </Button>

          </span>
        </div>
      </>
    )
  }

  useEffect(() => {
    fetchListBook()

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
            dataSource={listBook}
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
      <BookViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      {/* <ModalCreateBook
        openModalCreateBook={openModalCreateBook}
        setOpenModalCreateBook={setOpenModalCreateBook}
        fetchListBook={fetchListBook}
      />
      <ModalBookImport
        openModalImportBook={openModalImportBook}
        setOpenModalImportBook={setOpenModalImportBook}
        fetchListBook={fetchListBook}
        listBook={listBook}
      />
      <ModalUpdateBook
        openModalUpdateBook={openModalUpdateBook}
        setOpenModalUpdateBook={setOpenModalUpdateBook}
        dataUpdate={dataUpdate}
        fetchListBook={fetchListBook}
      /> */}

    </>
  )
}


export default BookTable;