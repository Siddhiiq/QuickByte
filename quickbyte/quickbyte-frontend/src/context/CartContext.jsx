import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  addItemToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearBackendCart,
} from "../api/cartApi";

const CartContext =
  createContext(null);

export function CartProvider({
  children,
}) {

  const { user } =
    useAuth();

  const [items, setItems] =
    useState([]);

  const [backendCartId, setBackendCartId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  /*
   * LOAD CART AFTER LOGIN
   */
  useEffect(() => {

    if (!user?.id) {

      setItems([]);
      setBackendCartId(null);

      return;
    }

    loadCart();

  }, [user?.id]);

  /*
   * GET CART
   */
  const loadCart = async () => {

    if (!user?.id) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await getCart(user.id);

      const cart =
        response.data;

      setBackendCartId(
        cart?.id ?? null
      );

      const backendItems =
        cart?.cartItems ||
        cart?.items ||
        [];

      const mappedItems =
        backendItems.map(
          (item) => {

            const foodId =
              item.food?.id ??
              item.foodId;

            const variantId =
              item.variant?.id ??
              item.variantId;

            const foodName =
              item.food?.name ??
              item.foodName ??
              "Food item";

            const unitPrice =
              item.unitPrice ??
              item.price ??
              item.food?.price ??
              0;

            const quantity =
              item.quantity ?? 1;

            const image =
              item.imageUrl ||
              item.food?.images?.find(
                (imageItem) =>
                  imageItem?.thumbnail &&
                  imageItem?.imageUrl
              )?.imageUrl ||
              item.food?.images?.find(
                (imageItem) =>
                  imageItem?.imageUrl
              )?.imageUrl ||
              item.food?.images?.[0]
                ?.imageUrl ||
              null;

            return {

              key:
                `${foodId}-${variantId}`,

              id:
                item.id,

              foodId,

              variantId,

              name:
                foodName,

              variantName:
                item.variantType ??
                item.variant?.variantType ??
                null,

              price:
                Number(unitPrice),

              quantity:
                Number(quantity),

              totalPrice:
                Number(
                  item.totalPrice ??
                  Number(unitPrice) *
                  Number(quantity)
                ),

              image,

            };
          }
        );

      setItems(
        mappedItems
      );

    } catch (error) {

      if (
        error.response?.status ===
        404
      ) {

        setItems([]);
        setBackendCartId(null);

      } else {

        console.error(
          "Failed to load cart:",
          error
        );
      }

    } finally {

      setLoading(false);

    }
  };

  /*
   * ADD ITEM TO BACKEND CART
   */
  const addToCart =
    async (item) => {

      if (!user?.id) {

        throw new Error(
          "Please login before adding items to cart."
        );
      }

      if (!item?.foodId) {

        throw new Error(
          "Food ID is required."
        );
      }


      const payload = {

        userId:
          user.id,

        foodId:
          item.foodId,

        variantId:
          item.variantId,

        quantity:
          item.quantity || 1,

        addonIds:
          item.addonIds || [],

      };

      console.log(
        "===== CART REQUEST PAYLOAD ====="
      );

      console.log(
        payload
      );

      try {

        setLoading(true);

        await addItemToCart(
          payload
        );

        await loadCart();

      } catch (error) {

        console.error(
          "Failed to add item to cart:",
          error.response?.data ||
          error
        );

        throw error;

      } finally {

        setLoading(false);

      }
    };

  /*
   * UPDATE QUANTITY
   */
  const updateQuantity =
    async (
      key,
      quantity
    ) => {

      if (!user?.id) {

        throw new Error(
          "Please login before updating your cart."
        );
      }

      const item =
        items.find(
          (cartItem) =>
            cartItem.key ===
            key
        );

      if (!item?.id) {
        return;
      }

      if (
        Number(quantity) < 1
      ) {

        await removeFromCart(
          key
        );

        return;
      }

      try {

        setLoading(true);

        await updateCartItem(
          item.id,
          user.id,
          quantity
        );

        await loadCart();

      } catch (error) {

        console.error(
          "Failed to update cart quantity:",
          error.response?.data ||
          error
        );

        throw error;

      } finally {

        setLoading(false);

      }
    };

  /*
   * REMOVE ITEM
   */
  const removeFromCart =
    async (key) => {

      if (!user?.id) {
        return;
      }

      const item =
        items.find(
          (cartItem) =>
            cartItem.key ===
            key
        );

      if (!item?.id) {
        return;
      }

      try {

        setLoading(true);

        await removeCartItem(
          item.id,
          user.id
        );

        await loadCart();

      } catch (error) {

        console.error(
          "Failed to remove cart item:",
          error.response?.data ||
          error
        );

        throw error;

      } finally {

        setLoading(false);

      }
    };

  /*
   * CLEAR CART
   */
  const clearCart =
    async () => {

      if (!user?.id) {

        setItems([]);
        setBackendCartId(null);

        return;
      }

      try {

        setLoading(true);

        await clearBackendCart(
          user.id
        );

        setItems([]);
        setBackendCartId(null);

      } catch (error) {

        console.error(
          "Failed to clear cart:",
          error.response?.data ||
          error
        );

        throw error;

      } finally {

        setLoading(false);

      }
    };

  /*
   * TOTAL PRICE
   */
  const total =
    useMemo(
      () =>
        items.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.price || 0
            ) *
            Number(
              item.quantity || 0
            ),
          0
        ),
      [items]
    );

  /*
   * TOTAL ITEMS
   */
  const count =
    useMemo(
      () =>
        items.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.quantity || 0
            ),
          0
        ),
      [items]
    );

  return (

    <CartContext.Provider
      value={{

        items,

        addToCart,

        removeFromCart,

        clearCart,

        updateQuantity,

        total,

        count,

        loading,

        backendCartId,

        reloadCart:
          loadCart,

      }}
    >

      {children}

    </CartContext.Provider>
  );
}

export const useCart =
  () =>
    useContext(
      CartContext
    );