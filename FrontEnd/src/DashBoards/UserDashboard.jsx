import React from 'react'
import CreateCapsule from './CreateCapsule'
import CapsuleInputs from './CapsuleInputs'
import ProfileCard from './ProfileCard'
import InviteContributer from './InviteContributer'

const UserDashboard = () => {
  return (
    <>
        <CreateCapsule/>
        <CapsuleInputs/>
        <InviteContributer/>
        <ProfileCard/>
    </>
  )
}

export default UserDashboard