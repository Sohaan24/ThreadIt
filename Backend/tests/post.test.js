import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import PostModel from "../Models/PostModel";
import UserModel from "../Models/UserModel"; 
import jwt from "jsonwebtoken";
import './setup.js';

process.env.JWT_SECRET = "test_secret_key_for_vitest";

describe("POST /api/post/createPost", () => {
    
    let authToken;
    let testUserId;

   
    beforeEach(async () => {
      
        const testUser = await UserModel.create({
            email: "author@gmail.com",
            username: "author123",
            password: "hashedpassword" 
        });

        testUserId = testUser._id;

        authToken = jwt.sign(
            { id: testUser._id, username: testUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
    });

    it("must return status code 201 with post object when sending text content", async () => {
        const res = await request(app)
            .post("/api/post/createPost")
    
            .set("Cookie", [`token=${authToken}`]) 
           
            .field("caption", "Hello it a test Post") 
            .field("content", "Hello");

     
        expect(res.statusCode).toBe(201);
 
        expect(res.body.post).toHaveProperty("_id");
        expect(res.body.post.content).toBe("Hello");
        expect(res.body.post.caption).toBe("Hello it a test Post");
  
        expect(res.body.post.author.toString()).toBe(testUserId.toString()); 


        const postInDb = await PostModel.findById(res.body.post._id);
        expect(postInDb).not.toBeNull();
        expect(postInDb.content).toBe("Hello");
    });
});