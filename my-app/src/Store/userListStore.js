import Api from "../Api/api";
import { action, computed, makeObservable, observable,toJS } from "mobx";
import axios from "axios";



 class UserStore{

    users=[]
    


    constructor() {
        makeObservable(this, {
           users: observable,
           getUsersFromApi:action
           
        });
    }


    getUsersFromApi=async()=> {
        const response =  await axios.get(`https://randomuser.me/api/?results=25&page=1`);
        const fetched= response.data.results;
        for (let user of fetched) {
            let newUser={
             key:user.login.uuid , 
             name:user.name.first+" " +user.name.last,
             gender:user.gender,
             age:user.dob.age,
             email:user.email,
             country:user.location.country
             
        
          }
             this.users.push(newUser);
    }          

    }

    addUser(){
        let newUser={
            key:0,
            name:'',
            gender:'',
            age:'',
            email:'',
            country: ''
        }

        this.users.push(newUser);


    }

    getUsers(){
        return (toJS(this.users));

    }





}





export default new UserStore();
