import * as React from "react"
import { Box, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import router from "next/router"
import { AUTH_API } from "@/components/utils/serverURL"
import ChatbotPage from "@/components/Pages/ChatPage"
import { toast } from "react-toastify"


const Chatbots = () => {

  const [isLoading, setIsLoading] = React.useState(false);
  const [bots, setBots] = React.useState([]);
  const [botId, setBotId] = React.useState('')
  const [botVisible, setBotVisible] = React.useState(false)
  const [botName, setBotName] = React.useState('')
  const [botAvatar, setBotAvatar] = React.useState('')
  const [botKnowledgeBase, setBotKnowledgeBase] = React.useState('')
  const [botThemeColor, setBotThemeColor] = React.useState('#1976D2')
  const [botActive, setBotActive] = React.useState(false)
  const handleAddRow = () => {
    router.push(`/chatbot/edit?bot=-1`)
  }

  React.useEffect(() => {
    setIsLoading(true)
    const userID = localStorage.getItem('userID');
     const requestOptions = {
      headers: new Headers({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': "1",
      })
    };
    if (userID) {
      fetch(`${AUTH_API.GET_CHATBOTS}?userId=${userID}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setBots(data);
          console.log(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching knowledge bases:', error);
          setIsLoading(false);
        });
    }
  }, []); // Empty dependency array means this effect will only run once after the initial render
  const handleEditClickButton = (id: any) => {
    router.push(`/chatbot/edit?bot=${id}`)
  }
  const handleChatClickButton = (id: any) => {
    const bot = bots.find((bot) => bot.id === id)
    if (!bot.active) {
      toast.warn("This bot is not active yet. Please wait until it is active.", {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
    // Set the bot details
    setBotId(id)
    setBotName(bot.name)
    setBotAvatar(bot.avatar)
    setBotKnowledgeBase(bot.knowledge_base) // Assuming there's a knowledgeBase property
    setBotThemeColor(bot.color) // Assuming there's a themeColor property
    setBotActive(bot.active)
    setBotVisible(true)
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
        {bots.map((bot) => (
          <div key={bot.id} className="w-72 h-40 bg-white shadow-sm p-4 m-3">
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
            <div className="flex flex-row justify-between mt-5 mx-5">
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
                  className="w-12 h-8 text-[12px] my-1 rounded-sm bg-[#4c4fe7] text-white"
                  style={{ textTransform: "none" }}
                  onClick={() => handleChatClickButton(bot.id)}
                >
                  Chat
                </button>
              </div>
              </div>
          </div>
        ))}
       
      </div>
      <ChatbotPage botId={botId} botName={botName} color={botThemeColor} avatar={botAvatar}  visible={botVisible} setVisible={setBotVisible} />
      </>
  )
}

export default Chatbots
