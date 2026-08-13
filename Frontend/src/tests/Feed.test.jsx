import { render, screen } from "@testing-library/react";
import Feed from "../Components/Feed";
import api from "../Components/axiosConfig";
import { vi, describe, it, expect, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { MyContext } from "../Components/MyContext";

vi.mock("../Components/axiosConfig");

vi.mock("../Components/PostPage", () => {
  return {
    // Return a dummy React component that just renders the text you need to find
    default: ({ post }) => (
      <div data-testid="mock-show-post">
        {post.caption}
      </div>
    ),
  };
});

describe("ThreadIt Feed Component", () => {
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches posts from the API and renders them", async () => {
    const posts = [
      {
        _id: "1",
        caption: "Why does the arrow of time only go forward?",
        content:
          "Entropy dictates that closed systems move from order to disorder. But at a quantum level, most physics equations are entirely time-reversible. Why do we only experience time macroscopically in one direction?",
        author: "101",
        commentCount: 0,
      },
      {
        _id: "2",
        caption: "The sheer scale of the observable universe.",
        imageUrl:
          "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
        author: "102",
        commentCount: 0,
      },
    ];

    api.get.mockResolvedValueOnce({ data: { posts: posts } });

    render(
      <BrowserRouter>
        <MyContext.Provider value={{ user: { id: "101", username: "TestUser" } }}>
          <Feed />
        </MyContext.Provider>
      </BrowserRouter>
    );


    const post = await screen.findByText(
      "Why does the arrow of time only go forward?"
    );
    expect(post).toBeInTheDocument();

    expect(api.get).toHaveBeenCalledWith("/api/post/all");
  });
});