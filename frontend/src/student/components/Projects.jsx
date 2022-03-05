import React from "react";
import styled from "styled-components";
import AvatarImage4 from "../../images/avatarImage4.jpg";
import { cardShadow, hoverEffect, themeColor } from "./utils/untils.js";

function Projects() {
  return (
    <YourProjects>
      <Project>
        <Avatar>
          <img src={AvatarImage4} alt="" />
        </Avatar>
        <Detail>
          <Title>XYZ Project/Assignment</Title>
          <SubTitle>1 day remaining</SubTitle>
        </Detail>
      </Project>
      {/* <Project>
        <Avatar>
          <img src={AvatarImage4} alt="" />
        </Avatar>
        <Detail>
          <Title>ABC Project/Assignment</Title>
          <SubTitle>5 days remaining</SubTitle>
        </Detail>
      </Project> */}
      <AllProjects>See all projects</AllProjects>
    </YourProjects>
  );
}

const YourProjects = styled.div`
  height: 64%;
  background-color: white;
  margin: 0;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: ${cardShadow};
  transition: 0.4s ease-in-out;
  &:hover {
    box-shadow: ${hoverEffect};
  }
  @media screen and (min-width: 320px) and (max-width: 1080px) {
    height: max-content;
    width: 75%;
    margin-top: 1rem;
  }
`;

const Project = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;
const Avatar = styled.div`
  img {
    height: 4rem;
    width: 4rem;
    border-radius: 4rem;
  }
`;
const Detail = styled.div`
  margin-left: 1rem;
`;
const Title = styled.h4`
  font-weight: 500;
  @media screen and (min-width: 320px) and (max-width: 1080px) {
    font-size: 1rem;
  }
`;
const SubTitle = styled.h5`
  font-weight: 300;
`;
const AllProjects = styled.h5`
  text-align: end;
  color: ${themeColor};
  cursor: pointer;
`;

export default Projects;
