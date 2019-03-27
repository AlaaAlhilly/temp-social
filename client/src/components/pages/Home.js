import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import InNavbar from '../layout/InNavbar';
import OutNavbar from '../layout/OutNavbar';
import Snippets from './Snippets';
import API from "../../utils/API"

export default withAuth(
  class Home extends Component {
    state = {
       authenticated: null,
       response: null,
       endpoint: `http://localhost:3001`,
       thisAuthor:null

     
      };

    checkAuthentication = async () => {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        let user_obj = JSON.parse(localStorage.getItem('okta-token-storage'))
        let user_to_save = {
          name:user_obj.idToken.claims.name,
          email:user_obj.idToken.claims.email,
          okta_id:user_obj.idToken.clientId,
          snippets:[],
          likes:[]
        }
        API.getUser(user_to_save.okta_id).then(res=>{
          if(res.data== null){
            API.saveuser(user_to_save).then(res=>{console.log(res);this.setState({thisAuthor:res.data})})
          }else{
            this.setState({thisAuthor:res.data})
          }
        })
        this.setState({ authenticated });
      }
    };

    async componentDidMount() {
      this.checkAuthentication();
      console.log(JSON.parse(localStorage.getItem('okta-token-storage')))

      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.innerHTML = `
          $(document).on("click",".sh-comm",function(){
            if($(".comm").css("display") === "none"){
            $(".comm").show()
            }else{
              $(".comm").hide()
            }
          })

            `;
      document.head.appendChild(s);
      API.getSnippets().then(res=>{
        this.setState({response:res.data})
      })
      }

    async componentDidUpdate() {
      this.checkAuthentication();
    }

    login = async () => {
      this.props.auth.login('/');
    };

    logout = async () => {
      this.props.auth.logout('/');
      window.location.replace("/")
    };
    likeThisSnippet = (snippet_id)=>{
      let like_to_save = {
        author_id:this.state.thisAuthor.okta_id,
        snippet_id:snippet_id
      }
      API.getLike(this.state.thisAuthor.okta_id)
      .then(res=> {
        console.log(res)
        if(res.data == null){
          API.saveLike(like_to_save)
             .then(res=>{
               this.setState({response:res.data})
             })
        }else{
          this.setState({response:res.data})
        }
      })
    }
    commentForThisSnippet=(snippet_id)=>{
      console.log(snippet_id)
    }
    render() {
      if (this.state.authenticated === null) return null;

      const mainContent = this.state.authenticated ? (
        
        <div>
        <InNavbar logout={this.logout}/>
          <Snippets commentForThisSnippet={this.commentForThisSnippet} likeThisSnippet={this.likeThisSnippet} snippets = {this.state.response?this.state.response:[]}/>
        </div>
      ) : (
        <div>
        <OutNavbar />
          <p className="lead">
            If you are a staff member, please get your credentials from your
            supervisor
          </p>
          <button className="btn btn-dark btn-lg" onClick={this.login}>
            Login
          </button>
        </div>
      );

      return (
        <div className="container">
          {mainContent}
        </div>
      );
    }
  }
);