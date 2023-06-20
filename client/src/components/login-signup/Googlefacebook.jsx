import React, { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useMutation } from "@apollo/client";
import { ADD_USER, LOGIN_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";

export default function GoogleFacebook() {
  const [addUser, { error: errorSignup, data: dataSignup }] = useMutation(ADD_USER);
  const [login, { error: errorLogin, data: dataLogin }] = useMutation(LOGIN_USER);

  async function handleCallbackResponse(response) {
    const userObject = jwt_decode(response.credential);
    console.log(userObject);

    const googleEmail = userObject.email;
    const googleUsername = userObject.name;
    const googlePassword = userObject.sub;

    try {
      const { data } = await login({
        variables: {
          email: googleEmail,
          password: googlePassword
        }
      });
      Auth.login(data.login.token);
    } catch (error) {
      if (error.message === "No user found with this email address") {
        const { data } = await addUser({
          variables: {
            username: googleUsername,
            email: googleEmail,
            password: googlePassword
          }
        });
        Auth.login(data.addUser.token);
      } else {
        console.log("Error:", error.message);
      }
    }
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "123219296172-np6f7lh6ep8m9vguqoak50bt795n0tse.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
      text: "Continue with Google",
      theme_id: "2",
      width: "300px",
      height: "50px",
      longtitle: false,
      onsuccess: handleCallbackResponse,
      onFailure: console.error,
      ux_mode: "redirect",
      redirect_uri: "https://example.com",
    });
  }, []);

  return (
    <div>
      <div id="signInDiv"></div>
    </div>
  );
}
