
import axios from "axios";

 class Api{
  
    getAllUsers= async()=>{
        try {
            const response = await axios.get(`https://randomuser.me/api/?results=25&page=1`);
            return response;
          } catch (err) {
            return err;
          }

    }
}

export default Api;