import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
  };
export default function Loading() {
  return (
    <div className="w-full flex justify-center items-center h-screen">
            <ClipLoader
              color="black"
              loading={true}
              size={150}
              css={override}
            />
    </div>
  )
}