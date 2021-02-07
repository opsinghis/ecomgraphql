import { withData } from "next-apollo";
import { HttpLink } from "apollo-boost";

const SPACE = process.env.SPACE;
const TOKEN = process.env.ACCESS_TOKEN;
const CONTENTFUL_URL = `https://graphql.contentful.com/content/v1/spaces/${SPACE}`;

const config = {
  link: new HttpLink({
    uri: CONTENTFUL_URL, // Server URL (must be absolute)
    headers: {
      authorization: `Bearer ${TOKEN}`,
      "Content-Language": "en-us",
    },
    opts: {
      credentials: "same-origin",
    },
  }),
};

export default withData(config);