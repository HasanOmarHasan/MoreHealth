// import InputItem from '../../ui/InputItem'
import Button from "../../ui/Button";
import { useAuth } from "../../context/Auth";

export default function General() {
  const { user, darkMode, toggleTheme } = useAuth();
  console.log(user, darkMode);

  return (
    <div className=" py-6  flex flex-col gap-6 justify-center items-center ">
      <h1 className="text-3xl font-semibold">General</h1>

      <h3>Toggle Theme</h3>
      <Button content={darkMode ? "Dark" : "Light"} onClick={toggleTheme} />
      
    </div>
  );
}
