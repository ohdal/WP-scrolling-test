import React, {Suspense} from 'react';
import './App.scss';
import Header from "./layout/Header";

const PinkBox = React.lazy(() => import("./boxes/PinkBox"))
const BlueBox = React.lazy(() => import("./boxes/BlueBox"))
const YellowBox = React.lazy(() => import("./boxes/YellowBox"))

const boxArray = [<PinkBox key={1}/>, <BlueBox key={2}/>, <YellowBox key={3}/>, <PinkBox key={4}/>]
const offset = 5;
const height = window.innerHeight - 45; // 헤더높이 빼기
const scrollSpeed = 400; //몇초동안 이동할것인지
let isPending = false; //Pending 처리
let exScroll = 0; // 이전 scrollTop 위치 저장

const scrolling = (scrollTop, goal, isDown) => {
  if(!isPending) {
    isPending = true
    const frame = Math.ceil(scrollSpeed * (1 / 15))
    const size = isDown ? goal - scrollTop : scrollTop - goal
    let scrollY = scrollTop;

    const setScrollY = (value, state) => {
      switch (state) {
        case 'set':
          scrollY = value
          isPending = false
          break;
        case 'add':
          scrollY += value
          break;
        default:
          break;
      }
    }

    const getScrollY = () => {
      return scrollY
    }

    for (let i = 0; i < frame; i++) {
      setTimeout(() => {
        if (i !== frame - 1) {
          setScrollY(isDown ? size / frame : size / frame * -1, 'add')
        } else {
          setScrollY(goal, 'set')
        }
        document.getElementById("scrollView").scrollTo(0, getScrollY())
      }, scrollSpeed / frame * i)
    }
  }
}

const scrollAuto = (e) => {
  const scrollTop = e.target.scrollTop
  if (scrollTop - exScroll > 0) {
    if (scrollTop % height > 0 && scrollTop % height < offset) {
      const goal = (Math.floor(scrollTop / height) + 1) * height
      scrolling(scrollTop, goal, true)
    }
  } else {
    if (scrollTop % height < height && scrollTop % height > height - offset) {
      const goal = Math.floor(scrollTop / height) * height
      scrolling(scrollTop, goal, false)
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
              {boxArray}
            </Suspense>
          </div>
        </div>
      </div>
  );
}

export default App;
