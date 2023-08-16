import { Row, Col, Rate, Divider, Button, notification, message } from 'antd';
import './Book.scss';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import GalleryModal from './GalleryModal'
import Loader from './Loader';
import { fetchBookByID } from '../../services/apiServices';
import { doAddBook } from '../../redux/order/orderSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
const ViewDetail = (props) => {
  const { bookID } = props
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const [bookData, setBookData] = useState({})
  const refGallery = useRef(null);
  const [bookImages, setBookImages] = useState([])
  const [currentQuantity, setCurrentQuantity] = useState(1)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fetchBook = async () => {
    setIsLoading(true)
    const res = await fetchBookByID(bookID)
    // console.log("check res", res)
    if (res && res.data) {
      setBookData(res.data)
      const images = []
      images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.thumbnail}`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.thumbnail}`,
        originalClass: "original-image",
        thumbnailClass: "thumbnail-image"
      })
      const imageSlider = res.data.slider.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image"
        })
      })
      // console.log("img final", images)
      setBookImages(images)
    }
    setIsLoading(false)
  }

  const handleChangeButtonQuantity = (type) => {
    if (type === 'DECREASE') {
      if (currentQuantity < 2) return;
      setCurrentQuantity(+currentQuantity - 1)
    }
    if (type === 'INCREASE') {
      if (currentQuantity === bookData.quantity) return;
      setCurrentQuantity(+currentQuantity + 1)
    }
  }

  const handleOnClickImage = () => {
    //get current index onClick
    // alert(refGallery?.current?.getCurrentIndex());
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    // refGallery?.current?.fullScreen()
  }

  const handleChangeInputQuantity = (value) => {
    if (!isNaN(value)) {
      if (value <= 0) {
        setCurrentQuantity(1)
      } else if (value > bookData.quantity) {
        setCurrentQuantity(bookData.quantity)
      } else {
        setCurrentQuantity(value)
      }
    }
  };

  const handleAddToCart = () => {
    message.success('Thêm sản phẩm vào giỏ hàng!');
    dispatch(doAddBook({ quantity: currentQuantity, _id: bookData._id, detail: bookData }))
  }

  const handleBuy = () => {
    dispatch(doAddBook({ quantity: currentQuantity, _id: bookData._id, detail: bookData }))
    navigate('/order')
  }



  useEffect(() => {
    fetchBook()
  }, [])

  return (
    <div style={{ background: '#efefef', padding: "20px 0" }}>
      <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
        <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
          {isLoading === false ? <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
              <ImageGallery
                ref={refGallery}
                items={bookImages}
                showPlayButton={false} //hide play button
                showFullscreenButton={false} //hide fullscreen button
                renderLeftNav={() => <></>} //left arrow === <> </>
                renderRightNav={() => <></>}//right arrow === <> </>
                slideOnThumbnailOver={true}  //onHover => auto scroll images
                onClick={() => handleOnClickImage()}
              />
            </Col>
            <Col md={14} sm={24}>
              <Col md={0} sm={24} xs={24}>
                <ImageGallery
                  ref={refGallery}
                  items={bookImages}
                  showPlayButton={false} //hide play button
                  showFullscreenButton={false} //hide fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>}//right arrow === <> </>
                  showThumbnails={false}
                />
              </Col>
              <Col span={24}>
                <div className='author'>Tác giả: <a href='#'>{bookData.author}</a> </div>
                <div className='title'>{bookData.mainText}</div>
                <div className='rating'>
                  <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                  <span className='sold'>
                    <Divider type="vertical" />
                    Đã bán {bookData.sold}</span>
                </div>
                <div className='price'>
                  <span className='currency'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookData.price)}
                  </span>
                </div>
                <div className='delivery'>
                  <div>
                    <span className='left-side'>Vận chuyển</span>
                    <span className='right-side'>Miễn phí vận chuyển</span>
                  </div>
                </div>
                <div className='quantity'>
                  <span className='left-side'>Số lượng</span>
                  <span className='right-side'>
                    <button onClick={() => handleChangeButtonQuantity("DECREASE")}><MinusOutlined /></button>
                    <input
                      value={currentQuantity}
                      onChange={(event) => handleChangeInputQuantity(event.target.value)}
                    />
                    <button onClick={() => handleChangeButtonQuantity("INCREASE")}><PlusOutlined /></button>
                    <span className='left-side' style={{ marginLeft: '12px', padding: '5px 0' }}>{bookData.quantity} có sẵn</span>
                  </span>
                </div>
                <div className='buy'>
                  <button
                    className='cart'
                    onClick={() => handleAddToCart()}
                  >
                    <BsCartPlus className='icon-cart' />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button
                    onClick={() => handleBuy()}
                    className='now'>
                    Mua ngay
                  </button>
                </div>
              </Col>
            </Col>
          </Row> :
            <Loader />}


        </div>
      </div>
      <GalleryModal
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={bookImages}
        title={"hardcode"}
      />
    </div>
  )
}

export default ViewDetail;