import {describe, it, expect, beforeEach} from "vitest" ;
import request from "supertest" ;
import app from "../app" ;
import User from "../Models/UserModel" ;
import './setup.js';
import bcrypt from "bcryptjs" ;

describe("POST / api/auth/signup", ()=> {

    it("proper working of signup route", async()=> {
        const res = await request(app) 
        .post("/api/auth/signup")
        .send({email : "testuser123@gmail.com", username : "testUser", password : "password"} ) ;


        expect(res.statusCode).toBe(201) ;
        expect(res.body.message).toBe("User created successfully please log in")
       

        const user = await User.findOne({email : "testuser123@gmail.com"}) ;
        
        expect(user).not.toBe(null) ;
    }) ;


    it("it should return 400 status code", async()=> {
        const res = await request(app)
        .post("/api/auth/signup")
        .send({email : "testuser001@gmail.com"}) ;

        expect(res.statusCode).toBe(400) ;
    })
})

process.env.JWT_SECRET = "test_secret_key_for_vitest";

describe("POST /api/auth/login", ()=> {

    beforeEach(async () => {
        
        const hashedPassword = await bcrypt.hash("password", 10);
        
        await User.create({
            email: "testuser123@gmail.com",
            username: "testuser",
            password: hashedPassword
        });
    });

    it("it must return status 200 with body", async()=> {

        const res = await request(app) 
        .post("/api/auth/login")
        .send({email : "testuser123@gmail.com", password : "password"}) ;

        expect(res.statusCode).toBe(200) ;
        expect(res.body.user).toHaveProperty("id") ;
        expect(res.body.user.username).toBe("testuser") ;

        const userInDb = await User.findById(res.body.user.id)
        expect(userInDb).not.toBeNull();

    })
})