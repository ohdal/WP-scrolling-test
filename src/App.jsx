import React, {Suspense} from 'react';
import './App.scss';
import Header from "./layout/Header";

const PinkBox = React.lazy(() => import("./boxes/PinkBox"))
const BlueBox = React.lazy(() => import("./boxes/BlueBox"))
const YellowBox = React.lazy(() => import("./boxes/YellowBox"))

const boxArray = [<PinkBox key={1}/>, <BlueBox key={2}/>, <YellowBox key={3}/>]
const height = window.innerHeight - 45; // 헤더높이 빼기
const scrollSpeed = 200; //몇초동안 이동할것인지
let exScroll = 0; // 이전 scrollTop 위치 저장

const scrolling = (scrollTop, size, goal, isDown) => {
  const frame = Math.ceil(scrollSpeed * (1 / 15))
  let scrollY = scrollTop;
  for (let i = 0; i < frame; i++) {
    setTimeout(() => {
      if (i !== frame - 1) {
        scrollY += isDown ? size / frame : size / frame * -1
      } else {
        scrollY = goal
      }
      document.getElementById("scrollView").scrollTo(0, scrollY)
    }, scrollSpeed / frame * i)
  }
}

const scrollAuto = async (e) => {
  const scrollTop = e.target.scrollTop
  if (scrollTop - exScroll > 0) {
    if (scrollTop % height > 0 && scrollTop % height < 5) {
      const goal = (Math.floor(scrollTop / height) + 1) * height
      const size = goal - scrollTop
      scrolling(scrollTop, size, goal, true)
    }
  } else {
    if (scrollTop % height < height && scrollTop % height > height - 5) {
      const goal = Math.floor(scrollTop / height) * height
      const size = scrollTop - goal
      scrolling(scrollTop, size, goal, false)
    }
  }

  exScroll = e.target.scrollTop
}

const App = () => {

  return (
      <div className="App">
        <Header/>
        <div className="content">
          <div id={"scrollView"} onScroll={(e) => {scrollAuto(e)}}>
            <Suspense fallback={<div>loading...</div>}>
              {boxArray.map((item) => {
                return item;
              })}
            </Suspense>
          </div>
        </div>
      </div>
  );
}

export default App;
