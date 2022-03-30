import React from "react";
import Header from "../../global/component/Header";
import "./AdminDash.css";
import { sideBarData } from "../sidebarData";
import StudentNavbar from "./StudentNavbar";
import Quotes from "../components/Quotes";
import NoticeBoard from "../components/NoticeBoard";
export default function StudentDashboard() {
  return (
    <div style={{height:"100%"}}>
      <StudentNavbar list={sideBarData}/>
      <div className="dashboardContainer" style={{height:"calc(100vh - 10%)",display:"grid",gridTemplateColumns:"30% 1fr 30%",columnGap:"2px"}}>
        <div className="container1" style={{border:"1px solid green"}}>
          <div className="quotesContainer" style={{height:"35%",backgroundColor:"",display:"flex",alignItems:"center",justifyContent:"space-around"}}>
            <Quotes/>

          </div>
          <div className="quotesContainer" style={{height:"35%",backgroundColor:"",display:"flex",alignItems:"center",justifyContent:"space-around"}}>
            <NoticeBoard/>

          </div>

        </div>
        <div className="container2" style={{border:"1px solid yellow"}}>

        </div>
        <div className="container3" style={{border:"1px solid blue"}}>

        </div>
        

      </div>
    </div>
  );
}
