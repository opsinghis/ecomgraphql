import React from "react";

// prettier-ignore
import { Box, Heading, Text, Image, Card, Button, Mask, IconButton } from "gestalt";
import { calculatePrice, setCart, getCart } from "../utils";
import { Link } from "react-router-dom";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const { REACT_APP_ACCESS_TOKEN,REACT_APP_SPACE_ID } = process.env;
const CONTENTFUL_URL = `https://graphql.contentful.com/content/v1/spaces/${REACT_APP_SPACE_ID}`

class Brews extends React.Component {
  state = {
    brews: [],
    brand: "",
    cartItems: []
  };


  async componentDidMount() {
    fetch(
        CONTENTFUL_URL,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${REACT_APP_ACCESS_TOKEN}`
            },
            body: JSON.stringify({ query :`
              {
                brand(id: "${this.props.match.params.brandId}"){
                  sys{
                    id
                  }
                  name
                  linkedFrom{
                    brewCollection{
                      items{
                        sys{
                          id
                        }
                        name
                        description{
                          json
                        }
                        price
                        image{
                          url
                        }
                        
                      }
                    }
                  }
                }
              }`              
            })
          }
    )
      .then(res => res.json())
      .then(response => {
        console.log(response);

        const { data } = response;
        this.setState({
          brews: data ? data.brand.linkedFrom.brewCollection.items : [],
          brand: data.brand.name,
          cartItems: getCart()
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message
        });
      });
  }


  addToCart = brew => {
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item.sys.id === brew.sys.id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1,"brand" : this.state.brand
      });
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  deleteItemFromCart = itemToDeleteId => {
    const filteredItems = this.state.cartItems.filter(
      item => item.sys.id !== itemToDeleteId
    );
    this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
  };

  render() {
    const { brand, brews, cartItems } = this.state;

    console.log("state date brews", brews);

    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
        dangerouslySetInlineStyle={{
          __style: {
            flexWrap: "wrap-reverse"
          }
        }}
      >
        {/* Brews Section */}
        <Box display="flex" direction="column" alignItems="center">
          {/* Brews Heading */}
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>
          {/* Brews */}
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#bdcdd9"
              }
            }}
            wrap
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
          >
            {brews.map(brew => (
              <Box paddingY={4} margin={2} width={210} key={brew.sys.id}>
                <Card
                  image={
                    <Box height={250} width={200}>
                      <Image
                        fit="cover"
                        alt="Brand"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={brew.image.url}
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Box marginBottom={2}>
                      <Text bold size="xl">
                        {brew.name}
                      </Text>
                    </Box>
                    <Text>{documentToReactComponents(brew.description.json)}</Text>
                    <Text color="orchid">${brew.price}</Text>
                    <Box marginTop={2}>
                      <Text bold size="xl">
                        <Button
                          onClick={() => this.addToCart(brew)}
                          color="blue"
                          text="Add to Cart"
                        />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* User Cart */}
        <Box alignSelf="end" marginTop={2} marginLeft={8}>
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              {/* User Cart Heading */}
              <Heading align="center" size="sm">
                Your Cart
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>

              {/* Cart Items */}
              {cartItems.map(item => (
                <Box key={item._id} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} - $
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCart(item.sys.id)}
                  />
                </Box>
              ))}

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select some items</Text>
                  )}
                </Box>
                <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">Checkout</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>
      </Box>
    );
  }
}

export default Brews;
