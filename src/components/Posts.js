import React, { useEffect } from 'react'
import styled from 'styled-components'

const PostsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px 0;
  overflow-y: auto;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    visibility: hidden;
  }
`

const SectionTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  .title {
    width: 100%;
    color: #ffffff;
    font-size: 26px;
    font-weight: 700;
    display: flex;
    align-items: center;
    &::before,
    &::after {
      content: "";
      width: 100%;
      display: block;
      height: 1px;
      background-color: #686868;
      flex-grow: 1;
    }
    &::before {
      margin-right: 1rem;
    }
    &::after {
      margin-left: 1rem;
    }
  }
`

const CardsContainer = styled.div`
  padding: 20px 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;

  @media screen and (max-width: 1400px)  {
     grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media screen and (max-width: 1400px)  {
     grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media screen and (max-width: 1280px)  {
     grid-template-columns: 1fr 1fr 1fr;
  }
  @media screen and (max-width: 1200px)  {
     grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: 768px)  {
     grid-template-columns: 1fr;
  }  
`

const Card = styled.div`
  position: relative;
  border-radius: 4px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 140px;
  background-color: #ffffff;
  padding: 16px;
  cursor: pointer;
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #333333;
  }
  .changeTime {
    font-size: 12px;
    font-weight: 400;
    line-height: 22px;
    font-style: italic;
    color: #777777;
    display: flex;
    align-items: center;
    i {
      margin-right: 5px;
    }
  }
  .viewMode {
    position: absolute;
    bottom: 8px;
    right: 16px;
    font-size: 12px;
    font-weight: 600;
    font-style: italic;
    color: #777777;
    text-align: right;
  }
  &:hover {
    background-color: #eee;
  }
  .tooltip .tooltiptext {
    position: absolute;
    visibility: hidden;
    font-style: normal;
    width: 120px;
    background-color: rgba(0,0,0,0.75);
    color: #fff;
    font-weight: 600;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    z-index: 1;
    top: -24px;
    left: calc(-54px);
  }
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
`

const Posts = (props) => {
  // for testing, will remove 
  const arr = new Array(10).fill('test')
  return (
    <PostsContainer id="postsContainer">
      <SectionTitle>
        <div className="title">Posts</div>
      </SectionTitle>
      <CardsContainer>
        {arr.map( i => {
          return (<Card>
            <div className="title">Title</div>
            <div className="changeTime"><i className="fas fa-history"></i>changed 2 days ago</div>
            <div className="viewMode tooltip">
              <i className="far fa-eye "></i>
              <span className="tooltiptext">Open in view mode</span>
            </div>
          </Card>)
        })}
      </CardsContainer>
    </PostsContainer>
    )
  }

export default Posts