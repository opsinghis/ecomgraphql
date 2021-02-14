import React from "react";
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
//import { setToken } from "../utils";
import ToastMessage from "./ToastMessage";

import { Auth } from 'aws-amplify';

class Signup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        username: '',
        password: '',
        email: '',
        confirmationCode: '',
        verified: false,
        toast: false,
        toastMessage: "",
        loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.signUp = this.signUp.bind(this);
    this.confirmSignUp = this.confirmSignUp.bind(this);
}


  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };


  confirmSignUp() {
    console.log("confirmSignUp  is called correct now ");

    const { username, confirmationCode } = this.state;

    console.log("confirmation code is " ,confirmationCode );
    Auth.confirmSignUp(username, confirmationCode)
      .then((data) => {
        console.log('Successfully confirmed signed up', data);
        //setToken(data.user.signInUserSession.accessToken.jwtToken);
        this.redirectUser("/Signin");
       })
      .catch((err) => console.log(`Error confirming sign up - ${err}`))
  }


  signUp() {
    const { username, password, email } = this.state;
    Auth.signUp({
      username: username,
      password: password,
      attributes: {
        email: email
      }
    })
      .then((data) => {
        console.log("well done user created ", data);
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log("opps you need to correct this ", err);
        this.setState({ loading: false });
        this.showToast(err.message);
      });
  };

  handleSubmit = async event => {
    const { verified } = this.state

    event.preventDefault();

    console.log("Handle submit verfied  ", verified);
    if (verified) {
      this.confirmSignUp();
      this.setState({
        confirmationCode: '',
        username: ''
      });
    } else {

      if (this.isFormEmpty(this.state)) {
        this.showToast("Fill in all fields");
        return;
      }

      this.signUp();
      this.setState({
        password: '',
        email: '',
        verified: true
      });
    }

   // event.target.reset();

    /*     try {
          const { user } = await Auth.signUp({
              username : username,
              password : password,
              attributes: {
                  email : email         // optional
                  //phone_number,   // optional - E.164 number convention
                  // other custom attributes 
              }
          });
          console.log(user);
        } catch (error) {
          console.log('error signing up:', error);
         } */
  };

  redirectUser = path => this.props.history.push(path);

  isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password;
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };

  render() {
    const { toastMessage, toast, loading, verified } = this.state;
    if (verified) {
      return (
        <div>
          <Heading color="midnight">Last step , kindly validate your code</Heading>
              <Text italic color="orchid">
                Confirmation code!
              </Text>
          <form onSubmit={this.handleSubmit}>
            <TextField id='confirmationCode' type='text' name="confirmationCode"  onChange={this.handleChange} />
            <Button inline disabled={loading} color="blue" text="Submit" type="submit" />
          </form>
          <ToastMessage show={toast} message={toastMessage} />
        </div>
      );
    } else {
      return (
        <div>
           <Heading color="midnight">Let's Get Started</Heading>
              <Text italic color="orchid">
                Sign up to order some brews!
              </Text>
          <form onSubmit={this.handleSubmit}>
            <label>Username</label>
            <TextField id='username' type='text' name="username" onChange={this.handleChange} />
            <label>Password</label>
            <TextField id='password' type='password' name="password" onChange={this.handleChange} />
            <label>Email</label>
            <TextField id='email' type='email' name="email" onChange={this.handleChange} />
            <Button inline disabled={loading} color="blue" text="Submit" type="submit" />
            <ToastMessage show={toast} message={toastMessage} />
          </form>
        </div>
      );
    }
  }
}

export default Signup;
