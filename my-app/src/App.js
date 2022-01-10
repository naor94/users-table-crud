import './App.css';
import EditableTable from './Components/Table/Table';
import  UserStore  from "./Store/userListStore";


function App() {
  return (
    <div className="App">
      <EditableTable userStore={UserStore}/>
    </div>
  );
}

export default App;
