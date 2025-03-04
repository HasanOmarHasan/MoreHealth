// import { Routes, Route } from 'react-router-dom';
// import GroupList from './GroupList';
// import QuestionList from './QuestionList';
// import CommentsList from './CommentsList';
import { useNavigate } from "react-router-dom";
import GroupList from "./GroupList";

export default function Groups() {
  const navigate = useNavigate();
  return (
    <>
      <GroupList onSelect={(groupId) => navigate(`/groups/${groupId}`)} />
    </>
  );
}
