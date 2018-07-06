# react-google-oauth

*Directly inspired from [react-google-login](https://github.com/anthonyjgrove/react-google-login) project.*

With react-google-oauth you can quickly and easly add Login and Logout Google button.

![Google button with hover state](https://i.imgur.com/PDgUgJW.gif)



# How it works

This module is composed by two kind of components :

- \<GoogleAPI> used to inject and initialize the Google Api with your Google client ID, follow this [Google's documentation](https://developers.google.com/identity/sign-in/web/devconsole-project) to get yours
- \<GoogleLogin> \<GoogleLogout> \<CustomGoogleLogin> \<CustomGoogleLogout> components used to display buttons and connect each *clickEvents* to Google Oauth Api.

# Install

```bash
npm install react-google-oauth
```

# How use it

## 1°) Inject and init Google API script

Add \<GoogleAPI> component in your tree

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {GoogleAPI} from 'react-google-oauth'

ReactDOM.render(
        <GoogleAPI clientId="YOUR CLIENT ID"
            onUpdateSigninStatus={Function}
            onInitFailure={Function} >
         	<YourApp />
        </GoogleAPI>, document.getElementById('root'));
```

By default the Google API is initialize to make a simple Oauth with profile...

**Caution** : As other React component \<GoogleAPI> can have only one child

### GooleApi props

See [Google documentation](https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig) for complet values

| Parameters           | Default value             | Comment                                  | Type   |
| -------------------- | ------------------------- | ---------------------------------------- | ------ |
| clientId             | **REQUIRED**              |                                          | String |
| responseType         | 'permission'              |                                          | String |
| Prompt               | ''                        | [Doc](https://developers.google.com/identity/protocols/OpenIDConnect#prompt) | String |
| cookiePolicy         | 'single_host_origin'      |                                          | String |
| fetchBasicProfile    | true                      | Automatically add profile and email in Scope see [Doc](https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig) | Bool   |
| uxMode               | 'popup'                   |                                          | String |
| hostedDomain         | None                      |                                          | String |
| redirectUri          | None                      |                                          | String |
| Scope                | ''                        | More scope on this [page](https://developers.google.com/identity/protocols/googlescopes) | String |
| onUpdateSigninStatus | f => f                    | See below                                | Func   |
| onInitFailure        | err => console.error(err) | See below                                | Func   |



#### onUpdateSigninStatus  - Callback

[Doc](https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthissignedinlistenlistener) : listen for changes in the current user's sign-in state

A function that takes a boolean value. Passes `true` to this function when the user signs in, and `false` when the user signs out.



#### onInitFailure - Callback

The function called with an object containing an `error` property, if `GoogleAuth` failed to initialize



## 2°) Add a button

Add a button component under GoogleAPI *(each button component check if it is a child of GoogleAPI, if not an error message is displayed)*

```Jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {GoogleAPI,GoogleLogin,GoogleLogout} from 'react-google-oauth'

ReactDOM.render(
        <GoogleAPI clientId="YOUR CLIENT ID"
            onUpdateSigninStatus={CALLBACK}
            onInitFailure={CALLBACK} >
			<div>
              	<div><GoogleLogin /></div>
              	<div><GoogleLogout /></div>
    		</div>
        </GoogleAPI>, document.getElementById('root'));
```



### GoogleLogin params

| Callback                 | Default value          | Comment                                  |
| ------------------------ | ---------------------- | ---------------------------------------- |
| onLoginSuccess(response) | f => f                 | Function called when the authentification is done. Maybe it's more preferable to use onUpdateSigninStatus from \<GoogleAPI>. Fulfilled with the `GoogleUser` instance when the user successfully authenticates and grants the requested scopes. |
| onLoginFailure(error)    | f => f                 | function called when a error occured. By example when a user closed the Google's popup before he choiced an account. This function take an object containing an error property. See <a href="https://developers.google.com/identity/sign-in/web/reference#googleauthsigninoptions" >Error Code</a> on Google's documentation for more details. |
| onRequest()              | f => f                 | Called just before the call to Google Api Script, you can used this callback to display a loader by example. None parameter. |
| Text                     | ' Sign in with Google' | Text displayed in button                 |
| backgroundColor          | \#4285f4               | See Rendering paragraph                  |
| disabled                 | False                  | See Rendering paragraph                  |
| width                    | 240px                  | See Rendering paragraph                  |



### GoogleLogout params

| Callback               | Default value          | Comment                                  |
| ---------------------- | ---------------------- | ---------------------------------------- |
| onLogoutSuccess()      | f => f                 | Function called when the user has been signed out |
| onLogoutFailure(error) | f => f                 | function called when a error occured.  This function take an object containing an error property. See <a href="https://developers.google.com/identity/sign-in/web/reference#googleauthsigninoptions" >Error Code</a> on Google's documentation for more details. |
| onRequest()            | f => f                 | Called just before the call to Google Api Script, you can used this callback to display a loader by example. None parameter. |
| Text                   | ' Sign in with Google' | Text displayed in button                 |
| backgroundColor        | \#4285f4               | See Rendering paragraph                  |
| disabled               | False                  | See Rendering paragraph                  |
| width                  | 240px                  | See Rendering paragraph                  |





# Rendering

## \<GoogleLogin> & \<GoogleLogout>

Without parameters, buttons look like this :

```
<GoogleLogin />
<GoogleLogout />
```

![GoogleLogin button](https://i.imgur.com/LvEQ6yz.png) ![GoogleLogout button](https://i.imgur.com/SiR83vT.png)

## Text, Color, Width

With pre-define rendering you can only change the text, the  width and the background color.

*Sample*

```jsx
<GoogleLogin 
  	backgroundColor="#A31515" 
  	text="login"
  	width="180px"
  	/>
```

![Red GoogleLogin button](https://i.imgur.com/3LD3FTF.png)

*Hover and active state are automaticaly generate (opacity 50% for Hover state and filter:brightness(80%) for active state.)*

**Login button**

| Parameter       | Default value       |
| --------------- | ------------------- |
| text            | Sign in with Google |
| width           | 240px               |
| backgroundColor | \#4285f4            |

**Logout button**

| Parameter       | Default value |
| --------------- | ------------- |
| text            | Sign out      |
| width           | 180px         |
| backgroundColor | \#A31515      |

