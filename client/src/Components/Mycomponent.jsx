import React from 'react'
import { useSelector } from 'react-redux';

export default function Mycomponent() {
    const user = useSelector(state => state.user);
    const isLoggedin = useSelector(state => state.isLoggedin);
  return (
    <div>
      {user && user.username}
    </div>
  )
}