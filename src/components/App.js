import React, { Component } from "react";
// prettier-ignore
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon } from "gestalt";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import "./App.css";

const { REACT_APP_ACCESS_TOKEN,REACT_APP_SPACE_ID } = process.env;
const CONTENTFUL_URL = `https://graphql.contentful.com/content/v1/spaces/${REACT_APP_SPACE_ID}`


const query = `
{
    brandCollection{
      items{
        sys{
          id
        }
        name
        description{
          json
        }
        image{
          title
          url
        }
      }
    }
}`;


class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
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
            body: JSON.stringify({
              query
            })
          }
    )
      .then(res => res.json())
      .then(response => {
        console.log(response);

        const { data } = response;
        this.setState({
          loadingBrands: false,
          brands: data ? data.brandCollection.items : []
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message
        });
      });
  }


  handleChange = ({ value }) => {
    this.setState({ searchTerm: value });
  };

  filteredBrands = ({ searchTerm, brands }) => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        documentToReactComponents(brand.description.json).toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  render() {
    const { searchTerm, loadingBrands } = this.state;

    return (
      <Container>
        {/* Brands Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
            value={searchTerm}
            placeholder="Search Brands"
          />
          <Box margin={3}>
            <Icon
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        {/* Brands Section */}
        <Box display="flex" justifyContent="center" marginBottom={2}>
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        {/* Brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="around"
        >
          {this.filteredBrands(this.state).map(brand => (
            <Box paddingY={4} margin={2} width={200} key={brand.sys.id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      fit="cover"
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={brand.image.url}
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
                  <Text bold size="xl">
                    {brand.name}
                  </Text>
                  <Text>{documentToReactComponents(brand.description.json)}</Text>
                  <Text bold size="xl">
                    <Link to={`/${brand.sys.id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        {/* <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" /> */}
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
