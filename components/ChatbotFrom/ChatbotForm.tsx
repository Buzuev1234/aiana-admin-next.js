"use client!"

import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  Grid,
  Typography,
  Input,
  Button,
  Avatar,
  TextField,
  Menu,
  MenuItem,
  Card,
  Autocomplete,
  Box,
} from "@mui/material"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/router"
import { AUTH_API } from "@/components/utils/serverURL"
import CustomSwitch from "../CustomSwitch"


const ChatbotForm = ({ bot }) => {
  const [name, setName] = useState("")
  const [active, setActive] = useState(false)
  const [knowledgeBase, setKnowleBase] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [timeFrom, setTimeFrom] = useState("09:00")
  const [timeUntil, setTimeUntil] = useState("17:00")
  const [anchorEl, setAnchorEl] = useState(null)
  const [themeColor, setThemeColor] = useState("#1976D2")
  const [isLoading, setIsLoading] = useState(false);
  const [bases, setBases] = useState([])
  const [knowledgeBases, setKnowledgeBases] = useState([])

  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [userId, setUserId] = useState(null)

  console.log("Editing Bot:", bot)

  const handleColorButtonClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleColorMenuItemClick = (color) => {
    setThemeColor(color)
    setAnchorEl(null)
  }

  const colors = [
    "#FFFF00",
    "#FFDAB9",
    "#FFC0CB",
    "#FFA500",
    "#FA8072",
    "#FF7F50",
    "#98FB98",
    "#87CEEB",
    "#00FFFF",
    "#40E0D0",
    "#008080",
    "#1976D2",
    "#C8A2C8",
    "#800080",
    "#0000FF",
    "#A52A2A",
    "#708090",
    "#000000",
  ]

   // Fetch knowledge bases when component mounts
  React.useEffect(() => {
    setIsLoading(true)
    const userID = localStorage.getItem('userID');
    setUserId(userID)
     const requestOptions = {
      headers: new Headers({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': "1",
      })
    };

    if (userID) {
      fetch(`${AUTH_API.GET_KNOWLEDGE_BASES}?userId=${userID}`, requestOptions)
        .then(response => response.json())
        .then((data) => {
          setBases(data)
          console.log("bases", data)
          setIsLoading(false)
        })

        .catch(error => {
          console.error('Error fetching knowledge bases:', error);
          setIsLoading(false);
        });
    }
    if (bot!=='-1') {
      setIsLoading(true);

      fetch(`${AUTH_API.GET_CHATBOT}?botId=${bot}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log("Bot info >>>>.>",data)
          setName(data.name)
          setActive(data.active)
          setKnowleBase(data.knowledge_base)
          setAvatarPreview(data.avatar)
          setTimeFrom(data.start_time)
          setTimeUntil(data.end_time)
          console.log("bases", data)
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching knowledge bases:', error);
          setIsLoading(false);
        });
    }
  }, [bot]); // Empty dependency array means this effect will only run once after the initial render


  useEffect(() => {
    if (bases) {
      setKnowledgeBases(bases.map(base => base.name))
    }
  }, [bases ? bases.length : undefined])

  const handleAvatarChange = (event) => {
    const file = event.target.files && event.target.files[0]
    setAvatar(file)
    const reader = new FileReader()

    reader.onload = () => {
      setAvatarPreview(reader.result)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const handleSwitchChange = () => {
    setActive((prevActive) => !prevActive) // Toggle the value of active
    console.log(active)
  }

  const handleTimeFromChange = (event) => {
    setTimeFrom(event.target.value)
  }

  const handleTimeUntilChange = (event) => {
    setTimeUntil(event.target.value)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleKnowledgeBaseChange = (value) => {
    // Find the index of the selected value in the bases array
    const selectedIndex = bases.findIndex(base => base.name === value);

    // Check if a matching base was found
    if (selectedIndex !== -1) {
      // Set the name of the knowledge base
      setKnowleBase(bases[selectedIndex].name);
      // Update the index state with the found index
      setIndex(selectedIndex);
    } else {
      // Handle the case where no matching base was found
      console.error('No matching base found for the selected value:', value);
    }
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("avatar", avatar)
    formData.append("color", themeColor)
    formData.append("active", (active !== undefined ? active.toString() : "false"));
    formData.append("start_time", timeFrom)
    formData.append("end_time", timeUntil)
    formData.append("knowledge_base", bases[index].unique_id)
    formData.append("user_id", userId)
    
    if (!name || !knowledgeBase) {
      toast.error("Name and Knowledge Base are required.", { position: toast.POSITION.TOP_RIGHT })
      return;
    }
    try {
      let API_URL = ''
      if (bot!=="-1"){
        API_URL = `${AUTH_API.UPDATE_CHATBOT}?botId=${bot}`
      } else {
        API_URL = AUTH_API.CREATE_BOT
      }
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Success:", response.data)
      toast.success("Successulfy Created!", { position: toast.POSITION.TOP_RIGHT })
      router.push('/chatbot')
    } catch (error) {
      console.error("Error uploading:", error)
    }
  }
  const handleCancelClick = () => {
    router.push('/chatbot')
  }

  if (isLoading){
    return <div>Loading...</div>
  }

  return (
    <div className="w-full h-full mt-10">
      <Grid container spacing={1} justifyContent="start" alignItems="center">
        <Grid item xs={12} className="w-full ml-1">
          <Typography variant="h5" align="left">
            Chatbot
          </Typography>
        </Grid>
        <div className="bg-none w-full rounded-lg p-4 flex flex-col gap-4 mt-1">
          <Grid container direction="row" spacing={1} alignItems="center">
            <Grid item alignItems="start" className="mr-3">
              <Typography variant="body1" align="right">
                Name:
              </Typography>
            </Grid>
            <Grid item sm={12} md={4}>
              <Input
                fullWidth
                inputProps={{ "aria-label": "description" }}
                disableUnderline
                value={name}
                onChange={handleNameChange}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={1} alignItems="center" className="mt-1">
            <Grid item alignItems="start" className="mr-3">
              <Typography variant="body1" align="right">
                Avatar:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} className="flex items-center gap-2">
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <Button variant="contained" component="span" className="bg-[#5b0c99]">
                  <Typography variant="body1" className="ml-2" style={{ textTransform: "none" }}>
                    + Upload Avatar
                  </Typography>
                </Button>
              </label>
              {avatarPreview && (
                <div className="flex flex-col justify-center items-center">
                  <Avatar src={avatarPreview} sx={{ width: 70, height: 70, objectFit: "cover" }} />
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={1} alignItems="center" className="mt-1">
            <Grid item alignItems="start" className="mr-3">
              <Typography variant="body1" align="right">
                Color:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Button
                onClick={handleColorButtonClick}
                className="!w-[30px] h-[30px]"
                style={{ backgroundColor: themeColor }}
              />
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                {colors.map((color) => (
                  <MenuItem
                    key={color}
                    onClick={() => handleColorMenuItemClick(color)}
                    className="flex justify-start items-center"
                  >
                    <Card className="w-6 h-6 mr-2 mb-1" style={{ backgroundColor: color }} />
                    <Typography>{color}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={1} alignItems="center" className="mt-1">
            <Grid item alignItems="start" className="mr-3">
              <CustomSwitch value={active}  onChange={handleSwitchChange} />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={1} alignItems="center" className="mt-2">
            <Typography variant="body1" align="right" className="mr-2">
              Timing:
            </Typography>
            <Input type="time" value={timeFrom} onChange={handleTimeFromChange} className="mr-2" />
            <Typography variant="body1" align="right">
              -
            </Typography>
            <Input
              type="time"
              value={timeUntil}
              onChange={handleTimeUntilChange}
              className="ml-2"
            />
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mt-3">
            <Typography variant="body1" align="right">
              Knowledge Base:
            </Typography>
            <Autocomplete
              disablePortal
              value={knowledgeBase}
              id="knowledge_base"
              options={knowledgeBases}
              onChange={(_, value) => handleKnowledgeBaseChange(value)}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Box className="flex justify-end items-center ">
            <Button
              variant="contained"
              color="primary"
              className="bg-[#fa6374] w-24 h-10"
              sx={{ textTransform: "none" }}
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="bg-[#00d7ca] w-24 h-10 ml-2"
              sx={{ textTransform: "none" }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </div>
      </Grid>
      <ToastContainer />
    </div>
  )
}

export default ChatbotForm
