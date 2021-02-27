import React from "react";


const initialState = [
    { firstname:["john", "Carter"], lastname: 'Smith' ,age:'24'},
    { firstname: ["Mona", "Darling"], lastname: 'Johnson' ,age: '35'},
    { firstname: ["Jonny", "Master"], lastname: 'Brown' ,age:'45'}
   ]

 const formData = {
    reusable: true,
    paymentMethod: {
      name: 'name',
      expiryMonth: 10,
      expiryYear: 2021,
      issueNumber: 1,
      startMonth: 2,
      startYear: 2013,
      cardNumber: '5454 5454 5454 5454',
      type: 'Card',
      cvc: '123'
    },
    clientKey: 'your key'
  }

class Poc extends React.Component {

 async componentDidMount() {
    console.log("initial list", initialState);

    const filteredItems=initialState.map(function({lastname, age }) {
                        return { lastname: lastname, age: age };
                        });
       console.log("Filtered list", filteredItems);
 }

 handleSubmitOrder = async () => {
    fetch('https://api.worldpay.com/v1/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(formData)
      })
        .then(data => {
          if (data.ok) {
            data.json().then(result => {
              // if data is valid you will get token
              console.log('result', result) // <- 
            })
          }
        })
        .catch(err => console.log('err', err))

 }


render() {
    return (
    <div>
        POC page and look at logs
    </div>
    )
}


}

export default Poc;