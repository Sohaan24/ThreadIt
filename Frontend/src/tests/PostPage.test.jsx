import { render, screen} from "@testing-library/react";
import PostPage from "../Components/PostPage" ;

import { vi, describe, it, expect } from "vitest";

import { MyContext } from "../Components/MyContext";
import { BrowserRouter } from "react-router-dom";



vi.mock("../hooks/useVote", ()=> {

    return {
        default : ()=> ({
            hasUp : false ,
            hasDown : false ,
            upvoteCount : 0,
            downvoteCount : 0,

            handleVote : vi.fn() 
        })
    }
});

const post = {
    _id : "1",
    caption : "Why arrow of time moves forward",
    author : "101",
    commentCount : 0
}

describe("Rendering of PostPage", ()=> {

    it("looking for a post getting displayed", ()=> {
        render(<BrowserRouter>
        <MyContext.Provider value={{user : {_id : "101", username : "TestUser"}}}>
            <PostPage post={post}/>
        </MyContext.Provider>
        </BrowserRouter>) ;

        const text = screen.getByText("Why arrow of time moves forward") ;

        expect(text).toBeInTheDocument();
    })
})



 
