import {renderHook, act, waitFor} from "@testing-library/react" ;
import {describe, it,vi, expect, afterEach} from "vitest" ;
import useVote from "../hooks/useVote" ;
import api from "../Components/axiosConfig" ;
import { MyContext } from "../Components/MyContext";

vi.mock("../Components/axiosConfig") ;

const contextWrapper = ({children})=> {
    return (
        <MyContext.Provider value= {{user : {id : "101", username : "test user"}}}>
            {children}
        </MyContext.Provider>
    )
}

describe("UseVote hook testing", ()=> {
     afterEach(()=>{
            vi.clearAllMocks() ;
        }) ;

    it("dynamic upvote downvote update", async()=> {

        api.post.mockResolvedValueOnce({
            data : {
                upvoteCount : 1 ,
                downvoteCount : 0,
                hasUpvoted : true ,
                hasDownvoted : false ,
            }
        }) ;

        const fakePost = {
            _id : "101",
            caption : "Why arrow of the time always  moves forward" ,
            upvotedBy : [],
            downvotedBy : [] 
        }

        const {result} = renderHook(()=>useVote(fakePost), {wrapper : contextWrapper} ) ;

        expect(result.current.hasUp).toBe(false) ;
        expect(result.current.upvoteCount).toBe(0) ;

        act(()=> {
            result.current.handleVote("up") ;
        }) ;

        expect(result.current.hasUp).toBe(true) ;
        expect(result.current.upvoteCount).toBe(1) ;


        await waitFor(()=> {
            expect(api.patch).toHaveBeenCalledWith(`/api/post/vote/${fakePost._id}`,{voteType : "up"})
        });
    })
})



