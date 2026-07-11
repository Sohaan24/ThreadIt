import MainLayout from "./Components/MainLayout";
import Feed from "./Components/Feed" ;
import CreatePost from "./Components/CreatePost" ;
import {Routes, Route} from "react-router-dom" ;

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element = {<MainLayout><Feed/></MainLayout>}></Route>
        <Route path="/create-post" element = {<MainLayout><CreatePost/></MainLayout>}></Route>

      </Routes>
    </>
  );
}

export default App;
