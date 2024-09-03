import React, { Suspense, useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";

const Root = () => {
  const matches = useMatches();
  const handle = matches.length > 0 ? matches[matches.length - 1].handle : {};

  useEffect(() => {
    if (handle.title) {
      document.title = handle.title;
    }
  }, [matches]);

  console.log("1");

  return (
    <Suspense fallback={<div>Abc</div>}>
      <Outlet />
    </Suspense>
  );
};

export default Root;
