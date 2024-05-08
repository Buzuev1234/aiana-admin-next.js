import React, { useState, useEffect } from "react"
import axios from "axios"
import { Box, Typography, Grid, TextField, Button } from "@mui/material"
import { ToastContainer, toast } from "react-toastify"
import router from "next/router"
import { AUTH_API } from "@/components/utils/serverURL"
import CustomSelect from "../../CustomSelect"
import Country from "../../country"
import Language from "../../Language"

const Profile = () => {
  const INITIAL_REGISTER_OBJ = {
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
    email: "",
    language: "",
    com_name: "",
    com_vat: "",
    com_street: "",
    com_city: "",
    com_country: "",
    com_postal: "",
    com_phone: "",
    com_website: "",
  }

  const [formState, setFormState] = useState(INITIAL_REGISTER_OBJ)
  const [change, setChange] = useState(false)
  const [userID, setUserID] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setUserID(localStorage.getItem("userID"))
    if (userID !== undefined) {
      setIsLoading(true)
      axios
        .post(AUTH_API.GET_USER, { userID })
        .then((response) => {
          // console.log(response)
          if (response.status === 200) {
            const userData = response.data // Assuming the response contains user data in the expected format
            setFormState((prevState) => ({
              ...prevState,
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              language: userData.language,
              com_name: userData.com_name,
              com_vat: userData.com_vat,
              com_street: userData.com_street,
              com_city: userData.com_city,
              com_country: userData.com_country,
              com_postal: userData.com_postal,
              com_phone: userData.com_phone,
              com_website: userData.com_website,
              // Update other fields as per the response data
            }))
          }
          setIsLoading(false)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log("Here >>>>>", error)
          setIsLoading(false)
        })
    }
  }, [userID])

  useEffect(() => {
    setChange(true)
  }, [formState])

  const handleInputChange = (id, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }
  const handleSubmit = () => {
    if (change) {
      setIsLoading(true)
      axios
        .post(AUTH_API.UPDATE_USER, {
          userID,
          first_name: formState.first_name,
          last_name: formState.last_name,
          password: formState.password,
          confirm_password: formState.confirm_password,
          email: formState.email,
          language: formState.language,
          com_name: formState.com_name,
          com_vat: formState.com_vat,
          com_street: formState.com_street,
          com_city: formState.com_city,
          com_country: formState.com_country,
          com_postal: formState.com_postal,
          com_phone: formState.com_phone,
          com_website: formState.com_website,
        })
        .then((response) => {
          // console.log(response)
          if (response.status === 201) {
            toast.success("Successfully updated!", { position: toast.POSITION.TOP_RIGHT })
            setIsLoading(false)
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log("Here >>>>>", error)
          setIsLoading(false)
        })
    }
    router.push("/admin")
  }
  if(isLoading){
    return <div>Loading...</div>
  }
  return (
    <div className="d-flex flex-column bg-transparent">
      <Box className="row justify-content-center my-auto px-8">
        <Grid container spacing={3} className="mt-2 max-h-[650px] overflow-hidden overflow-y-auto">
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" className="text-primary" fontWeight="bold">
              Your Company
            </Typography>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Name:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="com_name"
                  value={formState.com_name}
                  onChange={(e) => {
                    handleInputChange("com_name", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  VAT number:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="com_vat"
                  value={formState.com_vat}
                  onChange={(e) => {
                    handleInputChange("com_vat", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Street:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="com_street"
                  value={formState.com_street}
                  onChange={(e) => {
                    handleInputChange("com_street", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  City:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="com_city"
                  value={formState.com_city}
                  onChange={(e) => {
                    handleInputChange("com_city", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Country:
                </Typography>
              </Grid>
              <Grid item>
                <CustomSelect
                  id="com_country"
                  value={formState.com_country}
                  onChange={handleInputChange}
                  props={Country}
                  text="Select a country"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Number:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="com_phone"
                  value={formState.com_phone}
                  onChange={(e) => {
                    handleInputChange("com_phone", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Postal code:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="com_postal"
                  value={formState.com_postal}
                  onChange={(e) => {
                    handleInputChange("com_postal", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Website url:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="com_website"
                  value={formState.com_website}
                  onChange={(e) => {
                    handleInputChange("com_website", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" className="text-primary" fontWeight="bold">
              Your User
            </Typography>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  First name:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="first_name"
                  value={formState.first_name}
                  onChange={(e) => {
                    handleInputChange("first_name", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Last name:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="last_name"
                  value={formState.last_name}
                  onChange={(e) => {
                    handleInputChange("last_name", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Email:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="email"
                  value={formState.email}
                  onChange={(e) => {
                    handleInputChange("email", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Language:
                </Typography>
              </Grid>
              <Grid item>
                <CustomSelect
                  id="language"
                  value={formState.language}
                  onChange={handleInputChange}
                  props={Language}
                  text="Select a language"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Password:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="password"
                  type="password"
                  value={formState.password}
                  onChange={(e) => {
                    handleInputChange("password", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className="mt-1">
              <Grid item>
                <Typography variant="body1" className="text-primary">
                  Repeat password:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="confirm_password"
                  type="password"
                  value={formState.confirm_password}
                  onChange={(e) => {
                    handleInputChange("confirm_password", e.target.value)
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box className="w-full flex justify-end gap-1">
          <Box className="mt-3 w-1/3 flex justify-start gap-1">
            <Button
              variant="contained"
              color="primary"
              className="mt-3 bg-[#fa6374] px-10 font-sans text-[16pxpx]"
              style={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="mt-3 bg-[#00d7ca] px-10 font-sans text-[16pxpx]"
              style={{ textTransform: "none" }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </div>
  )
}

export default Profile
