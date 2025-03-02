// import { Routes, Route } from 'react-router-dom';
// import GroupList from './GroupList';
// import QuestionList from './QuestionList';
// import CommentsList from './CommentsList';
import {  useNavigate } from 'react-router-dom';
import GroupList from './GroupList';

export default function Groups() {
  const navigate = useNavigate();
  return (<>
  
  
    {/* <div className="grid grid-cols-4 h-screen">
    <div className="">
      <input type="search" name="search" id="search" placeholder='search' />
    </div>

    </div> */}
      
        <GroupList onSelect={(groupId) => navigate(`/groups/${groupId}`)} />
      
     
    {/* </div>
  //   <div className="container mx-auto p-4">
  //   <Routes>
  //     <Route index element={<GroupList />} />
  //     <Route path=":groupId" element={<QuestionList />} />
  //     <Route path=":groupId/questions/:questionId" element={<CommentsList />} />
  //   </Routes>
  // </div> */}
  
  </>
  )
}

