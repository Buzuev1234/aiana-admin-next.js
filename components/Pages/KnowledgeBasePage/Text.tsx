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

const Text = ({questionAnswers, setQuestionAnswers}) => {
  const [questionInputValue, setQuestionInputValue] = useState("")
  const [answerInputValue, setAnswerInputValue] = useState("")
 

  const handleQAAdd = () => {
    if (questionInputValue && answerInputValue) {
      setQuestionAnswers([
        ...questionAnswers,
        { question: questionInputValue, answer: answerInputValue },
      ])
      setQuestionInputValue("")
      setAnswerInputValue("")
    } else {
      alert("Please enter both question and answer.")
    }
  }

  const handleDeleteQA = (index) => {
    const updatedQuestionAnswers = questionAnswers.filter((qa, i) => i !== index)
    setQuestionAnswers(updatedQuestionAnswers)
  }

  return (
    <Paper elevation={3} className="w-[700px] h-[90%] p-5 mt-20">
      <Grid container className="p-5">
        <Typography className="bg-[#e6f2ff] w-full mr-5 ml-5 p-3" sx={{ lineHeight: "2" }}>
          <InfoIcon className="text-[#33adff] mr-2 mb-1" />
          Add question and answer pairs to build your chatbot&apos;s knowledge base. These pairs
          help train your chatbot to answer questions accurately.
        </Typography>
      </Grid>
      <Grid item xs={12} className="flex justify-end items-end ">
        <Button className="bg-[#0099ff]" variant="contained" onClick={handleQAAdd}>
          + Add
        </Button>
      </Grid>
      <Grid container spacing={2} className="mt-1">
        <Grid item xs={1} className="flex justify-end items-center">
          <Typography>Q:</Typography>
        </Grid>
        <Grid item xs={11}>
          <TextField
            type="text"
            value={questionInputValue}
            onChange={(e) => setQuestionInputValue(e.target.value)}
            className="w-full"
            id="questionInput"
          />
        </Grid>
        <Grid item xs={1} className="flex justify-end items-center">
          <Typography>A:</Typography>
        </Grid>
        <Grid item xs={11}>
          <TextField
            type="text"
            value={answerInputValue}
            onChange={(e) => setAnswerInputValue(e.target.value)}
            className="w-full"
            id="answerInput"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="column">
        <Grid item xs={8}>
          <List className="h-[350px] overflow-y-auto border-solid border border-gray-300 rounded-md mt-5 p-3">
            {questionAnswers.map((qa, index) => (
              <ListItem key={qa.question} className="border-b border-gray-300">
                <ListItemText primary={`Q: ${qa.question} `} secondary={`A: ${qa.answer}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteQA(index)}>
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

export default Text
