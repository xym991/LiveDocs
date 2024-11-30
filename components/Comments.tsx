"use client";

import { useThreads } from "@liveblocks/react";
import { Composer, Thread } from "@liveblocks/react-ui";
import React, { ReactChildren, ReactNode } from "react";
import ThreadWrapper from "./ThreadWrapper";
const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  try {
    return children;
  } catch (error) {
    console.error("Caught error in ErrorBoundary:", error);
    return <div>Error rendering component</div>;
  }
};

const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className="comments-container">
      <Composer className="comment-composer"></Composer>
      {threads?.map((thread, index) => {
        console.log(thread, index);
        return (
          <ErrorBoundary>
            <ThreadWrapper key={thread.id} thread={thread} />
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default Comments;
