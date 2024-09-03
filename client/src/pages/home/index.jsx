import React, { useEffect } from "react";
import { useActions } from "../../libs/connect";
import { increment } from "../../redux/actions/app";

const Home = () => {
  const actions = useActions({ increment });
  useEffect(() => {
    console.log("123");

    actions.increment();
  }, []);
  console.log("abc");

  return (
    <div>
      <h3>This is home page</h3>
      <div>
        <div>Test image</div>
        <img src='/images/hinh-anh-thien-nhien-3d-tuyet-dep-003.jpg' width={300} />
      </div>
    </div>
  );
};

export default Home;
