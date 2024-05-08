import React from "react"
import ResetPasswordForm from "./ResetPasswordForm"

function ForgotPassword() {
  return (
    <div
      className="no-scrollbar relative flex h-screen w-screen bg-center bg-cover items-center justify-center"
      style={{ backgroundImage: "url('/images/auth-bg-1.jpg')" }}
    >
      <ResetPasswordForm />
    </div>
  )
}

export default ForgotPassword
