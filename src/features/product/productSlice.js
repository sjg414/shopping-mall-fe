import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", { params: { ...query } });
      if (response.status !== 200) throw new Error(response.error);
      // console.log("rrrr", response.data.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      console.log("getDetail", response.data.product);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({ message: "상품 생성 완료", status: "success" })
      );
      return response.data;
    } catch (err) {
      dispatch(
        showToastMessage({ message: "상품 생성 실패", status: "error" })
      );
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/delete/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({ message: "상품 삭제 완료", status: "success" })
      );
      dispatch(getProductList({ page: 1 }));
      return response.data;
    } catch (err) {
      dispatch(
        showToastMessage({ message: "상품 삭제 실패", status: "error" })
      );
      return rejectWithValue(err.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/${id}`, formData);
      if (response.status !== 200) throw new Error(response.error);
      console.log("rrrr", response.data);
      dispatch(
        showToastMessage({ message: "상품 수정 완료", status: "success" })
      );
      // dispatch(getProductList({ page: 1 }));
      return response.data;
    } catch (err) {
      dispatch(
        showToastMessage({ message: "상품 수정 실패", status: "error" })
      );
      return rejectWithValue(err.message);
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //상품 생성
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.success = true; //상품 생성 성공 시, 다이얼로그 닫고 / 실패 시, 실패메세지를 다이얼로그에 보여주고 닫지 않음
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      //상품 정보 가져오기
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
        state.error = "";
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //상품 수정
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = "";
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      //상품 삭제
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //상품 디테일 가져오기
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product;
        state.error = "";
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError, setError } =
  productSlice.actions;
export default productSlice.reducer;
