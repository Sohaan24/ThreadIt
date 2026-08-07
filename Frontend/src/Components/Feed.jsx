import {useState, useEffect} from "react" ;
import {Box} from "@mui/material" ;
import PostPage from "./PostPage";
import api from './axiosConfig';


export default function Feed() {
    const[allPosts, setAllPosts] = useState([]) ;

    useEffect(()=> {

        const fetchData = async()=> {
            try{
                const response = await api.get("/api/post/all") ;
                setAllPosts(response.data.posts) ;
               
            }catch(error){
                console.log("failed to fetch posts :" ,error) ;
            }
            
        }

        fetchData() ;
    },[]) ;

    const handlePostDeleted = (deletedId)=>{
        setAllPosts(prev => prev.filter(p=> p._id !== deletedId)) ;
    }

    
    return (
        <>
            <Box sx= {{display : "flex", flexGrow : 1, color : "black", bgcolor : "#F5F6F7", p : {xs : 2, md : 4}, overflowY : "auto"}}>
                <Box sx={{maxWidth : "500px", width : "100%", mx : "auto"}}>
                    { allPosts && allPosts.map((post)=>(
                        <PostPage key={post._id} post = {post} onDelete={handlePostDeleted}/>
                    ))}
                </Box>
            </Box>
        </>
    );
}