import React from 'react';
// import './Signin.css';


class Signin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: ''
		}
	}

	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value});
	}

	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value});
	}

	saveAuthTokenInSession = (token) => {
		window.sessionStorage.setItem('token', token); // using browser api
		// window.localStorage.setItem('token', token); 
	}

	onSubmitSignIn = () => {
		// console.log(this.state); //  {signInEmail: "test@gmail.com", signInPassword: "test"}
		const { signInEmail, signInPassword } = this.state;

		fetch(`${process.env.SERVER_URL}/signin`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: signInEmail,
				password: signInPassword
			})
		})
			.then(res => res.json())
			// Old Code
			// .then(user => {
			// 	if (user.id) {
			// 		this.props.loadUser(user);
			// 		this.props.onRouteChange('home');
			// 	}
			// })
			.then(data => {
				if (data.userId && data.success === 'true') {
					this.saveAuthTokenInSession(data.token);
					// console.log('success we need to get user profile');
					fetch(`${process.env.SERVER_URL}/profile/${data.userId}`, {
						method: 'get',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': data.token
						}
					})
					.then(resp => resp.json())
					.then(user => {
						// console.log(user)
						if (user && user.email) {
							this.props.loadUser(user);
							this.props.onRouteChange('home');
						}
					})
				}
			})
	}

	render() {
		const { onRouteChange } = this.props;
		return(
			<article className="br3 shadow-5 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 center">
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f2 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" />
				      </div>
				    </fieldset>
				    <div className="">
				      <input 
				      	onClick={this.onSubmitSignIn}  
				      	className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
				      	type="submit" 
				      	value="Sign in" />
				    </div>
				    <div className="lh-copy mt3">
				      <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
				    </div>
				  </div>
				</main>
			</article>
		);
	}
}

export default Signin;