import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import CreatePost from "../Components/CreatePost";
import api from "../Components/axiosConfig"; 
import { BrowserRouter } from "react-router-dom";
import { MyContext } from "../Components/MyContext";


vi.mock("../Components/axiosConfig");


const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CreatePost Component", () => {
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("allows a user to fill out the form and submit successfully", async () => {
  
    const user = userEvent.setup();

  
    api.post.mockResolvedValueOnce({ data: { message: "Post created successfully!" } });

    render(
      <BrowserRouter>
        <MyContext.Provider value={{ user: { _id: "101", username: "TestUser" } }}>
          <CreatePost />
        </MyContext.Provider>
      </BrowserRouter>
    );

    const captionInput = screen.getByLabelText(/Title/i);
    const contentInput = screen.getByPlaceholderText(/What are your thoughts?/i);
    const submitButton = screen.getByRole("button", { name: /Post/i });

  
    await user.type(captionInput, "My First Test Post");
    await user.type(contentInput, "This is the content of my test post.");

 
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/post/createPost", 
       expect.any(FormData) 
      );
    });


    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});