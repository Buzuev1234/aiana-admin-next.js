import React, { useState } from "react"
import {
  Grid,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import InfoIcon from "@mui/icons-material/InfoRounded"
import { isValidUrl } from "./validation" // Import your URL validation library here

// Define the interface for a website object
interface WebsiteObject {
 created_at: string;
 id: number;
 unique_id: string;
 url: string;
}
const Website = ({urls, setUrls}) => {
  const [urlInputValue, setUrlInputValue] = useState("")
  

  const handleUrlAdd = () => {
    if (isValidUrl(urlInputValue)) {
      // Example object creation. You might need to adjust this based on how you're generating these objects.
      const newWebsite: WebsiteObject = {
        created_at: new Date().toISOString(), // Example date
        id: -1, // Example ID. Adjust based on your actual ID generation logic.
        unique_id: "", // Example unique ID. Adjust based on your actual unique ID generation logic.
        url: urlInputValue,
      };
      setUrls([...urls, newWebsite]);
      setUrlInputValue("");
    } else {
      alert("Invalid URL. Please enter a valid URL.");
    }
 };

 const handleDeleteUrl = (index) => {
    const updatedUrls = urls.filter((_, i) => i !== index);
    setUrls(updatedUrls);
 };

  return (
    <Paper elevation={3} className="w-[700px] h-[90%] p-5 mt-20">
      <Grid container className="p-5">
        <Typography className="bg-[#e6f2ff] w-full mr-5 ml-5 p-3" sx={{ lineHeight: "2" }}>
          <InfoIcon className="text-[#33adff] mr-2 mb-1" />
          Add URLs to build your chatbot&apos;s knowledge base. These URLs help train your chatbot
          to answer questions accurately.
        </Typography>
      </Grid>
      <Grid container spacing={3} className="mt-5">
        <Grid item xs={2} className="flex justify-end items-center">
          <Typography>Enter URL:</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="text"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            className="w-full"
            id="urlInput"
          />
        </Grid>
        <Grid item xs={2}>
          <Button className="bg-[#0099ff]" variant="contained" onClick={handleUrlAdd}>
            Add
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="column">
        <Grid item xs={8}>
          <List className="h-[350px] overflow-y-auto border-solid border border-gray-300 rounded-md mt-5 p-3">
            {urls.map((url, index) => (
              <ListItem key={url.id} className="border-b border-gray-300">
                <ListItemText primary={url.url} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUrl(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Website
