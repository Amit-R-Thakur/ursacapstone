import React,{ Component } from "react";
import axios from "axios"
import "./Admin.css"


class Admin extends Component {


    constructor(){
        super()
        this.state = {
            
            email:'',
            password:''
        }
        
        this.changeEmail = this.changeEmail.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    changeEmail(event){
        this.setState({
            email:event.target.value
        })
    }
changePassword(event){
        this.setState({
            password:event.target.value
        })
    }

    onSubmit(event){
        event.preventDefault()

        const Login = {
            
            email:this.state.email,
            password:this.state.password
        }

        axios.post('http://localhost:4000/app/login', Login)
    
        
            
        
        
    }
render(){
    
    return(
        <div>
        <div className="container">
            <div className="form-div">
                <form onSubmit={this.onSubmit}>
                   

                    <input type = 'text'
                    placeholder="Email" 
                    onChange={this.changeEmail}
                    value={this.state.email}
                    className="form-control form-group"/>

                    <input type = 'text'
                    placeholder="Password" 
                    onChange={this.changePassword}
                    value={this.state.password}
                    className="form-control form-group"/>

            <input type='submit' className="btn btn-danger btn-block1 " value='Login'/>
                    <input type='submit' className="btn btn-danger btn-block2 " value='Register'/>
                </form>
            </div>
        </div>
    </div>
    );
}
}
export default Admin