import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditScreen(props) {
  const productId = props.match.params.id;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [keynumber, setKeynumber] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
      props.history.push('/productlist');
    }
    if (!product || product._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
      setKeynumber(product.keynumber)
    }
  }, [product, dispatch, productId, successUpdate, props.history]);
  const submitHandler = (e) => {
    e.preventDefault();
    // TODO: dispatch update product
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
        keynumber
      })
    );
  };
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post('/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImage(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Sửa sản phẩm {productId}</h1>
        </div>
        {loadingUpdate && <LoadingBox></LoadingBox>}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
              <>
                <div>
                  <label htmlFor="name">Tên</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Nhập tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="price">Giá</label>
                  <input
                    id="price"
                    type="text"
                    placeholder="Nhập giá"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="image">Hình ảnh</label>
                  <input
                    id="image"
                    type="text"
                    placeholder="Nhập tên hình"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="category">Thể loại</label>
                  <input
                    id="category"
                    type="text"
                    placeholder="Nhập thể loại"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="imageFile">Tệp hình ảnh</label>
                  <input
                    type="file"
                    id="imageFile"
                    label="Choose Image"
                    onChange={uploadFileHandler}
                  ></input>
                  {loadingUpload && <LoadingBox></LoadingBox>}
                  {errorUpload && (
                    <MessageBox variant="danger">{errorUpload}</MessageBox>
                  )}
                </div>
                <div>
                  <label htmlFor="brand">Nhà phát hành</label>
                  <input
                    id="brand"
                    type="text"
                    placeholder="Nhập nhà phát hành"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="countInStock">Số lượng trong kho</label>
                  <input
                    id="countInStock"
                    type="text"
                    placeholder="Nhập số lượng"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="key">Mã Game</label>
                  <input
                    id="key"
                    type="text"
                    placeholder="Nhập mã game"
                    value={keynumber}
                    onChange={(e) => setKeynumber(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="description">Mô tả</label>
                  <textarea
                    id="description"
                    rows="3"
                    type="text"
                    placeholder="Nhập mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label></label>
                  <button className="primary" type="submit">
                    Cập nhật
              </button>
                </div>
              </>
            )}
      </form>
    </div>
  );
}