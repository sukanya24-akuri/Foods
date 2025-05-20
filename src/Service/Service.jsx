import axios from "axios";

const url_api='http://localhost:8081/api/food';
export const fetchFoodList=async()=>
    {
        try {
            const response=await axios.get(url_api);
            return response.data;
        } catch (error) {
            console.log('error occurend in fetch food list',error);
            throw error;
        }
    }

    export const fetchFoodDetails = async (id) => {
        try {
    
          const response = await axios.get(url_api+"/foods/"+id);
          return response.data;
        } catch (error) {
          console.log('Error fetching food details:', error);
          throw error;
        }
      }
