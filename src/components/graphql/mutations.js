/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOrder = `mutation submitOrder ($order: CreateOrderRequest!){
  createOrder(order: $order) {
    order {
      orderId
      address {
        city
        country
        name
        phoneNumber
        postCode
        state
        streetAddress
      }
      createdDate
      modifiedDate
      products {
        category
        name
        productId
        quantity
        price
      }
      total
      status
    }
    success
    message
    errors
  }
}`;
