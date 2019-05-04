import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Particles from 'react-particles-js';
import Register from './components/Register/Register';
import './App.css';

const app = new Clarifai.App({
 apiKey: '8a42ce1eb3e249e09d716334203a3b00'
});


const particleOptions = {
"particles": {
    "number": {
      "value": 100
    },
    "shape": {
      "type": "circle"
    },
    "size": {
      "value": 10,
      "random": true
    },
    "line_linked": {
      "enable": false
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "bottom",
      "straight": false
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false
      }
    },
    "modes": {
      "push": {
        "particles_nb": 12
      }
    }
  }
}

const initialState = {
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

class App extends Component{

  constructor() {
    super();
    this.state = initialState;
      
    }
  

  loadUser = (data) => {
      this.setState({ user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined 


        }
          
      })
  }

  /*
  componentDidMount() {
    fetch('http://localhost:3001/')
    .then(response => response.json())
    .then(console.log);
  }
  */

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }


   onInputChange = (event) => {
    //this.setState({input: event.target.value});
    this.setState({input: event.target.value});
  }

  onRouteChange = (route) => {
    
    if(route==='signout') {
      this.setState(initialState);
    } else if(route==='home') {
      this.setState({isSignedIn:true});
    } 
    
    this.setState({ route: route });
  }



  onButtonSubmit = () => {
      //console.log('click');
      this.setState({imageUrl: this.state.input});
      app.models.predict(Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
        .then(response => {
          
          if(response){
            fetch('http://localhost:3001/image', {
                method: 'put',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    id: this.state.user.id

              })
            }) 

              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count}))
              })

          }
          this.displayFaceBox(this.calculateFaceLocation(response))

        })
        .catch(err => console.log(err));
  }

  render(){
      const {isSignedIn, imageUrl, route, box} = this.state;
      return (
      <div className="App">
          <Particles className='particles' params={particleOptions} />
          
          <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home'

              ? <div> 
                  <Logo />
                  <ImageLinkForm 
                    onInputChange={this.onInputChange} 
                    onButtonSubmit = {this.onButtonSubmit} />
                  <Rank name={this.state.user.name} entries={this.state.user.entries} />
                  <FaceRecognition box={box} imageUrl = {imageUrl}/>
                </div>

                :(
                    route === 'signin' 
                    ? <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
                    : <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />
                 )
                
          }
          
          
      </div>
    );  
  }
}

export default App;