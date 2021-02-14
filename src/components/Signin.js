import React from "react";
import { Container, Box, Button, Heading, TextField } from "gestalt";
import { setToken } from "../utils";
import ToastMessage from "./ToastMessage";

import { Auth } from 'aws-amplify';



class Signin extends React.Component {
  state = {
    username: "",
    password: "",
    toast: false,
    toastMessage: "",
    loading: false
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  
  signIn() {
    const { username, password } = this.state;  
    this.setState({ loading: true });
    Auth.signIn({
        username: username,
        password: password
    })
      .then((user) => {
        console.log("successfully signed in",user);
        this.setState({ loading: true });
        setToken(user.signInUserSession.idToken.jwtToken);
        this.redirectUser("/");

      })
      .catch((err) => {
        console.log("opps you need to correct this ",err);
        this.setState({ loading: false });
        this.showToast(err.message);
      });
}

  confirmSignIn() {
      const { username } = this.state;
      Auth.confirmSignIn(username)
      .then(() => console.log('successfully confirmed signed in'))
      .catch((err) => console.log(`Error confirming sign up - ${ err }`))
  }


  handleSubmit = async event => {
    event.preventDefault();
    //const { username, password } = this.state;

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }


    this.signIn();
    this.confirmSignIn()
    this.setState({
        username: '',
        password: '',
        signedIn: true
    });    

    // Sign up user
 /*    try {
      this.setState({ loading: true });
      const response = await strapi.login(username, password);
      this.setState({ loading: false });
      setToken(response.jwt);
      this.redirectUser("/");
    } catch (err) {
      this.setState({ loading: false });
      this.showToast(err.message);
    } */
  };

  redirectUser = path => this.props.history.push(path);

  isFormEmpty = ({ username, password }) => {
    return !username || !password;
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };

  render() {
    const { toastMessage, toast, loading } = this.state;

    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6a3b1"
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          {/* Sign In Form */}
          <form
            style={{
              display: "inlineBlock",
              textAlign: "center",
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            {/* Sign In Form Heading */}
            <Box marginBottom={2}>
              <Heading color="midnight">Welcome Back!</Heading>
            </Box>

            {/* Username Input */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
            {/* Password Input */}
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <Button
              inline
              disabled={loading}
              color="blue"
              text="Submit"
              type="submit"
            />
          </form>
        </Box>
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

export default Signin;
