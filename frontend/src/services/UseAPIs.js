import {useState, useEffect} from 'react'

export const useFetch = (url) =>{
    const [response, setResponse] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    
    useEffect(()=>{

        let unsubscribe  = false;

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
        const fetchData = () =>{
            if(unsubscribe) return;
            setIsLoading(true);
            fetch(url,requestOptions)
                .then(res=>res.json())
                .then(res=>setResponse(res))
                .then(setIsLoading(false))
                .catch(e=>{ 
                    // console.log(e)
                    setError(e);
                    setIsLoading(false)
                })
        }

        fetchData();

        return () =>{
            unsubscribe = true;
        }
    },[])

    return {response,isLoading,error};
}   


