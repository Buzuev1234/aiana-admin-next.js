import React from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/InfoRounded";


// interface DocumentObject {
//  created_at: string;
//  filename: string;
//  id: number;
//  type: string;
//  unique_id: string;
// }

const Document = ({documents, setDocuments, setFiles}) => {
  

  const handleDocumentChanged = (event) => {
     const fileList = event.target.files;
     setFiles(Array.from(fileList));
    const newDocs = Array.from(fileList).map((file: File) => ({
      created_at: new Date().toISOString(),
      filename: file.name,
      id: -1,
      type: file.type,
      unique_id: "",
    }))
    setDocuments([...documents, ...newDocs]);
  };

  const handleDeleteDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  

  return (
    <Paper elevation={3} className="w-[700px] h-[90%] p-5 mt-20 overflow-y-auto">
      <Grid container className="p-5">
        <Typography className="bg-[#e6f2ff] w-full mr-5 ml-5 p-3" sx={{ lineHeight: "2" }}>
          <InfoIcon className="text-[#33adff] mr-2 mb-1" />
          Build your chatbot&apos;s knowledge base by uploading documents. These documents train
          your chatbot to answer questions accurately.
        </Typography>
      </Grid>
      <Grid container spacing={2} className="flex justify-center items-center">
        <Grid item>
          <Button
            component="label"
            className="bg-transparent text-gray-600 w-[200px] flex flex-col h-[150px] border-dashed border-2 border-gray-200"
            tabIndex={-1}
            style={{ textTransform: "none" }}
          >
            <CloudUploadIcon className="w-10 h-10" />
            <Typography className="font-bold text-black text-[16px] text-center">
              Drop files here or click to upload
            </Typography>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleDocumentChanged}
              multiple
              style={{ display: "none" }}
            />
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="column">
        <Grid item xs={8}>
          <List className="h-[300px] overflow-y-auto border-solid border border-gray-300 rounded-md mt-5 p-3">
            {documents.map((doc, index) => (
              <ListItem key={doc.id} className="border-b border-gray-300">
                <ListItemText primary={doc.filename} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteDocument(index)}
                  >
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

export default Document
