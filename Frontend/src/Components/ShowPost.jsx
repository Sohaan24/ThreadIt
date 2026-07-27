import {useState, useEffect} from "react" ;

import{useNavigate, useParams} from "react-router-dom" ;
import api from "./axiosConfig" ;

export default function ShowPost() {

    const {postId} = useParams() ;
    const navigate = useNavigate() ;

    const[post, setPost] = useState(null) ;

    useEffect(()=> {
        const fetchPost = async()=> {
            try{
                const response = await api.get(`/api/post/getPost/${postId}`) ;

                setPost(response.data.post) ;
            }catch(err) {
                console.log("Error occurred in showPost", err) ;
            }
        }

        fetchPost() ;
    },[postId])


    if(!post) {
        console.log("No post in the Show Post") ;

        navigate("/") ;
        return ;
    }

    


}