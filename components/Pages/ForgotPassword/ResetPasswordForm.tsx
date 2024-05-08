import React, { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import axios from "axios"
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material"
import { AUTH_API } from "@/components/utils/serverURL"

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("")

  const handleSendButton = () => {
    if (email !== "") {
      axios
        .post(AUTH_API.FORGOT_PASSWORD, {
          email,
        })
        .then((response) => {
          // console.log(response)
          if (response.status === 201) {
            toast.success("Reset link sent", { position: toast.POSITION.TOP_RIGHT })
          }
        })
        .catch((error) => {
          if (error.response) {
            const { status } = error.response; // Destructure status directly
            if (status === 404) {
              toast.error("Unregistered email", {
                position: toast.POSITION.TOP_RIGHT,
              });
            } else if (status === 500) {
              toast.error("Internal Server Error: Something went wrong on the server", {
                position: toast.POSITION.TOP_RIGHT,
              });
            } else {
              toast.error(`Error: ${status}`, { position: toast.POSITION.TOP_RIGHT });
            }
          } else {
            toast.error("Network Error: Unable to connect to the server", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        });
    } else {
      toast.error("Please enter your email", { position: toast.POSITION.TOP_RIGHT })
    }
  }

  return (
    <Container className="w-[450px] bg-gray-100 flex flex-col justify-center items-center">
      <div>
        <Card className="w-full md:w-[450px]">
          <CardContent>
            <div className="flex flex-col text-center mt-5">
              <div className="relative ">
                <img
                  src="/images/logo_big.png"
                  alt="Logo"
                  className="absolute right-0 mx-auto h-20"
                />
              </div>
              <Typography variant="h5" className="text-primary mt-[100px] font-mono text-[#00d7ca]">
                Reset Password
              </Typography>
              Forgot your password?
              <br /> No problem.
            </div>
            <div className="bg-[#D6ECE7] h-[50px] text-[14px] mt-10 m-[15px] flex items-center justify-center">
              Enter your Email and instructions will be sent to you!
            </div>

            <Box
              className="mt-10"
              component="form"
              action="/admin"
              noValidate
              sx={{ mt: 3, m: "15px" }}
            >
              <Typography variant="body1" className="text-primary font-mono !m-0">
                Email
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Enter email"
                autoFocus
                className="bg-white mt-2"
              />

              <div className="mt-2 text-right">
                <Button
                  type="button"
                  onClick={handleSendButton}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  className="mt-3 bg-[#00d7ca] w-[95px]"
                  style={{ textTransform: "none" }}
                >
                  Reset
                </Button>
              </div>
              <div className="text-center">
                <Typography variant="body2">
                  Or go to&nbsp;
                  <Link underline="none" href="/signin" variant="body2" className="text-[#00d7ca]">
                    Sign in
                  </Link>
                </Typography>
              </div>
            </Box>
            <ToastContainer />
          </CardContent>
        </Card>
      </div>
      <div className="text-center text-muted  mt-4 absolute bottom-20">
        <Typography
          variant="body2"
          color="textSecondary"
          className="text-gray-300"
          suppressHydrationWarning
        >
          © {new Date().getFullYear()} aiana
        </Typography>
      </div>
    </Container>
  )
}

export default ResetPasswordForm
