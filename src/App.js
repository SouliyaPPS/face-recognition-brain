import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRegonition from './components/FaceRegonition/FaceRegonition';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initailState = {
	input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
  	id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initailState;
  }

  loadUser = (data) => {
  	this.setState({
	  	user: { 
	  		id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined
	  	}
  	})
  }

  componentDidMount() {
  	fetch('https://lit-escarpment-37081.herokuapp.com/')
  		.then(res => res.json())
  		// .then(console.log)
  }

  onRouteChange = (route) => {
    if (route === 'signout' || route === 'signin' ) {
      this.setState(initailState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:3001/imageurl', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				input: this.state.input
			})
		})
		.then(response => response.json())
    .then(response => {
    	if (response) {
    		fetch('http://localhost:3001/image', {
    			method: 'put',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				id: this.state.user.id
    			})
    		})
    			.then(res => res.json())
    			.then(count => {
    				// this.setState({user: {
    				// 	entries: count
    				// }})
    				this.setState(Object.assign(this.state.user, {entries: count}))
    			})
    	} 
    	this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(error => console.log(error))
  }

  render() {

    const { isSignedIn, imageUrl, route, box } = this.state;
    const { name, entries } = this.state.user;
    return (
      <div className="App">
        <Particles 
          className='particles' 
          params={particlesOptions} 
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={name} entries={entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRegonition box={box} imageUrl={imageUrl} />
            </div>
          : (
          	route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;