import React, { useEffect ,useState} from 'react';
import jwt_decode from 'jwt-decode'



export default function Googlefacebook() {

  const [user, setUser] = useState({});



    function handleCallbackResponse(response) {
var userObject = jwt_decode(response.credential);
console.log(userObject);
setUser(userObject);
    }

useEffect(() => {
/* global google */
google.accounts.id.initialize({
    client_id :"123219296172-np6f7lh6ep8m9vguqoak50bt795n0tse.apps.googleusercontent.com",
    callback: handleCallbackResponse
});

google.accounts.id.renderButton(
  document.getElementById('signInDiv'), { theme: "outline", size: "large" }
);



},[])

  return (

    <div>
        <div id="signInDiv">
                </div>
        
    </div>
  )
}
