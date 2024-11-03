import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
//카트에 아이템 추가하기
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "카트에 아이템이 추가 됐습니다.",
          status: "success",
        })
      );
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "카트에 이미 담긴 상품입니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

//카트에 담긴 아이템 리스트 가져오기
export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");
      if (response.status !== 200) throw new Error(response.error);
      // console.log("getCartList", response.data.data);
      return response.data.data.items;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(getCartList());
      dispatch(getCartQty());
      dispatch(
        showToastMessage({
          message: "상품이 삭제 됐습니다.",
          status: "success",
        })
      );
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "잠시 후 다시 시도해주세요.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { dispatch, rejectWithValue }) => {
    try {
      console.log("id", id, value);
      const response = await api.put(`/cart/${id}`, { qty: value });
      if (response.status !== 200) throw new Error(response.error);
      console.log("updateQty", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

//카트에 담긴 아이템 갯수 가져오기
export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.cartItemQty;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      //카트에 아이템 추가
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItemCount = action.payload;
        state.error = "";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //카트에 담긴 아이템 갯수
      .addCase(getCartQty.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItemCount = action.payload;
        state.error = "";
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //카트에 담긴 아이템 리스트
      .addCase(getCartList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
        state.error = "";
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //카트페이지의 개별 상품 qty 변경
      .addCase(updateQty.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload.items;
        state.totalPrice = action.payload.items.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
        state.error = "";
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //카트에 담긴 상품 삭제
      .addCase(deleteCartItem.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
