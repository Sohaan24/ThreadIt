import MainLayout from "./Components/MainLayout";
import Feed from "./Components/Feed" ;
import CreatePost from "./Components/CreatePost" ;
import {Routes, Route} from "react-router-dom" ;
import EditPost from "./Components/EditPost";

function App() {
  return (
    <>
      <Routes>
        <Route element = {<MainLayout/>}>
          <Route path="/" element = {<Feed/>}></Route>
          <Route path="/create-post" element = {<CreatePost/>}></Route>
          <Route path="/edit-post/:postId" element = {<EditPost/>}></Route>
        </Route>
        

      </Routes>
    </>
  );
}

export default App;
