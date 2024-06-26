import * as React from "react"
import { Box, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import router from "next/router"
import { AUTH_API } from "@/components/utils/serverURL"
import AlertDialog from "@/components/AlertDialog"
import EmbedAlert from '@/components/Alerts/EmbedAlert'
import ChatbotPage from "@/components/Pages/ChatPage"
import { toast } from "react-toastify"
import axios from "axios"

const Chatbots = () => {

  const [isLoading, setIsLoading] = React.useState(false);
  const [bots, setBots] = React.useState([]);
  const [botId, setBotId] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const [botVisible, setBotVisible] = React.useState(false)
  const [ openDialog, setOpenDialog]= React.useState(false);
  const [botName, setBotName] = React.useState('')
  const [botAvatar, setBotAvatar] = React.useState('')
  const [botThemeColor, setBotThemeColor] = React.useState('#1976D2')
  const [userId, setUserId] = React.useState('')
  const [userIndex, setUserIndex] = React.useState('')
  const [startTime, setStartTime] = React.useState('')
  const [endTime, setEndTime] = React.useState('')
  const [index, setIndex] = React.useState('');
  const handleAddRow = () => {
    router.push(`/chatbot/edit?bot=-1`)
  }

  React.useEffect(() => {
  const userID = localStorage.getItem('userID');
  setUserIndex(localStorage.getItem('userIndex'));
    if (userID) setUserId(userID)
     const requestOptions = {
      headers: new Headers({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': "1",
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
      })
    };
    if (userID && userID!=="") {
      setIsLoading(true)

      fetch(`${AUTH_API.GET_CHATBOTS}?userId=${userID}`, requestOptions)
        .then(response => {
          if (response.status === 401) {
            // Handle 401 Unauthorized
            toast.error("Session expired, please sign in again.", { position: toast.POSITION.TOP_RIGHT });
            setIsLoading(false); // Ensure loading state is updated
            router.push('/signin'); // Redirect to sign-in page
          }
          setIsLoading(false);
          return response.json(); // Continue to parse the JSON body
        })
        .then(data => {
          setBots(data);
          setIsLoading(false);
        })
        .catch(error => {
          if (error.response) {
            console.log('Error status code:', error.response.status);
            console.log('Error response data:', error.response.data);
            if (error.response.status === 401){
              toast.error("Session Expired. Please log in again!", { position: toast.POSITION.TOP_RIGHT });

              router.push("/signin")
            }
            // Handle the error response as needed
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Error request:', error.request);
            toast.error(error.request, { position: toast.POSITION.TOP_RIGHT });

          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error message:', error.message);
            toast.error(error.message, { position: toast.POSITION.TOP_RIGHT });

          }
          setIsLoading(false);
        });
    }
  }, []); // Empty dependency array means this effect will only run once after the initial render
  const handleEditClickButton = (id: any) => {
    router.push(`/chatbot/edit?bot=${id}`)
  }
  const handleChatClickButton = (id: any) => {
    const bot = bots.find((b) => b.id === id)
    if (!bot.active) {
      toast.warn("This bot is not active yet. Please wait until it is active.", {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
    setStartTime(bot.start_time)
    setEndTime(bot.end_time)
    setBotId(id)
    setBotName(bot.name)
    setBotAvatar(bot.avatar)
    setBotThemeColor(bot.color) // Assuming there's a themeColor property
    setBotVisible(true)
  }

  const handleDelete = (bot) => {
    axios
      .post(AUTH_API.DELETE_BOT, {botId:bot}, 
        {
          headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
          'Content-Type': 'application/json',  // Explicitly defining the Content-Type
          'ngrok-skip-browser-warning': "1",
        }
      })
      .then((response) => {
        if (response.status === 201) {
          setBots(prevBases => prevBases.filter(prev => prev.id !== bot));
          toast.success("Successfully deleted!", {position:toast.POSITION.TOP_RIGHT});
        } else {
          toast.error("Invalid Request!", { position:toast.POSITION.TOP_RIGHT })
        }
      })
      .catch((error) =>  {
          
        if (error.response) {
          console.log('Error status code:', error.response.status);
          console.log('Error response data:', error.response.data);
          if (error.response.status === 401){
            toast.error("Session Expired. Please log in again!", { position: toast.POSITION.TOP_RIGHT });

            router.push("/signin")
          }
          // Handle the error response as needed
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error request:', error.request);
          toast.error(error.request, { position: toast.POSITION.TOP_RIGHT });

        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message:', error.message);
          toast.error(error.message, { position: toast.POSITION.TOP_RIGHT });

        }
        setIsLoading(false);
      });
  }

  const handleDeleteClickButton = (bot) => {
    setIndex(bot);
    setOpenDialog(true);
  }

  const handleEmbedClickButton = (bot) => {
    const embeddingCode = `<script src="https://login.aiana.io/aiana.js" data-user-id=${userIndex} data-bot-id=${bot}></script>`;
    setDescription(embeddingCode);
    setOpen(true);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("Successfully copied!", {position:toast.POSITION.TOP_RIGHT});
  }

  const handleAgree = ()=> {
    setOpenDialog(false);
    handleDelete(index);
  }

  const handleDisagree = ()=>{
    setOpenDialog(false);
  }
  if(isLoading) {
    return <div>Loading...</div>
  }
  return (
    <>
      <div className="w-full h-[50px] flex items-center justify-center pt-[24px] mb-[10px] text-[28px]">
        <Typography className="text-[20px] w-2/3">Chatbots</Typography>
        <Box sx={{ width: "30%", height: "fit-content" }}>
          <Button
            onClick={handleAddRow}
            className="bg-[#5b0c99] text-white font-bold py-2 px-4 rounded m-2"
            variant="contained"
            style={{ textTransform: "none" }}
          >
            + Create Chatbot
          </Button>
        </Box>
      </div>
      <div className="relative w-full h-fit flex flex-wrap mt-10 items-center justify-start">
        {bots && bots.length!==0 && bots.map((bot) => (
          <div key={bot.id} className="w-72 h-40 bg-[#e6e6e6] shadow-sm p-4 m-3">
            <div className="w-full h-fit flex flex-row items-center justify-center">
              <img
                src={bot.avatar ? bot.avatar : "/images/logo_short.png"}
                className="w-[60px] h-[60px] rounded-[50px] mr-4"
                alt="avatar"
              />
              <div className="flex-grow flex flex-col">
                <Typography className="text-[20px]">{bot.name}</Typography>
                <Typography className="text-[14px] text-gray-600">{bot.time}</Typography>
                <Button
                  className={`w-16 h-8 text-[13px] my-1 ${bot.active ? "bg-[#33A186] hover:text-gray-600 hover:bg-[#33A186] text-white" : "bg-gray-400 text-gray-600"}`}
                  style={{ textTransform: "none" }}
                >
                  {bot.active ? "Active" : "Inactive"}
                </Button>
              </div>
              
            </div>
            <div className="flex flex-row justify-between gap-3 mt-5 mx-5">
              <div>
                <button
                  type="button"
                  className="w-12 h-8 text-[12px] my-1 rounded-sm bg-[#00D7CA] text-white"
                  style={{ textTransform: "none" }}
                  onClick={() => handleEditClickButton(bot.id)}
                >
                  Edit
                </button>
              </div>
              <div>
                <button
                    type="button"
                    className="w-12 h-8 text-[12px] my-1 rounded-sm bg-[#6290F0] text-white "
                    style={{ textTransform: "none" }}
                    onClick={() => handleEmbedClickButton(bot.index)}
                  >
                    Embed
                  </button>
              </div>
              <div>
                <button
                  type="button"
                  className="w-12 h-8 text-[12px] my-1 rounded-sm bg-[#8166F4] text-white"
                  style={{ textTransform: "none" }}
                  onClick={() => handleChatClickButton(bot.id)}
                >
                  Chat
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="w-12 h-8 text-[12px] my-1 rounded-sm bg-[#9B42F8] text-white mr-6"
                  style={{ textTransform: "none" }}
                  onClick={() => handleDeleteClickButton(bot.id)}
                >
                  Delete
                </button>
              </div>
             
              
            </div>
          </div>
        ))}
       
      </div>
      <AlertDialog
        title="Confirm Delete"
        description="Are you sure you want to delete this item? This action cannot be undone."
        handleAgree={handleAgree}
        handleDisagree={handleDisagree}
        open={openDialog}
        setOpen={setOpenDialog}
        />
        <EmbedAlert open={open} setOpen={setOpen} description={description} handleCopy={handleCopy}/>

      <ChatbotPage userId={userId} userIndex={userIndex} startTime={startTime} endTime={endTime} botId={botId} botName={botName} color={botThemeColor} avatar={botAvatar}  visible={botVisible} setVisible={setBotVisible} />
      </>
  )
}

export default Chatbots
