import {useState, useEffect} from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Paper from "@mui/material/Paper"
import Link from "@mui/material/Link"
import { Typography } from "@mui/material"
import BackArrow from "@mui/icons-material/ArrowBack"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { AUTH_API } from "@/components/utils/serverURL"
import formatDateString from "@/components/utils/common"
import router from "next/router"
import Image from 'next/image'

const Logs = ({session}) => {
  const INITIAL_BOT_OBJ = {
    bot_name: "",
    greetings: "Hello! How can I assist you today?",
    avatar: "",
    start_time: "",
  }
  const [isLoading, setIsLoading] = useState(false);
  const [bot, setBot] = useState(INITIAL_BOT_OBJ)
  const [conversation, setConversation] = useState([])
  const [botAvatar, setBotAvatar] = useState('/images/logo_short.png');

  useEffect(() => {
    if (session !== undefined) {
      setIsLoading(true)
      axios
        .post(AUTH_API.GET_LOG_DATA, { session }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example for adding Authorization header
            'Content-Type': 'application/json',  // Explicitly defining the Content-Type
          }
        })
        .then((response) => {
          if ( response.status === 401){
            toast.error("Please login!", {position: toast.POSITION.TOP_RIGHT});
            router.push("/signin");
          }
          // console.log("conversation >>>>>", response.data)

          if (response.data && response.data.log) {
            // Assuming log contains keys like bot_name and created_at
            const updatedBot = {
              ...INITIAL_BOT_OBJ,
              bot_name: response.data.log.bot_name || INITIAL_BOT_OBJ.bot_name,
              start_time: formatDateString(response.data.log.created_at || INITIAL_BOT_OBJ.start_time),
              avatar: response.data.log.avatar || INITIAL_BOT_OBJ.avatar,
              greetings: response.data.log.greetings || INITIAL_BOT_OBJ.greetings,

              // Add more mappings as needed based on the structure of response.data.log
            };
            setBot(updatedBot);
          }
          if (response.data && response.data.conversation){
            setConversation(response.data.conversation)
          }
          if (response.data && response.data.bot_avatar){
            setBotAvatar(response.data.bot_avatar)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
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
        })
    }
  }, [session])

  if(isLoading){
    return (
      <div>Loading...</div>
    )
  }
  return (
    <>
      <div className="w-full h-[50px] relative flex items-center justify-start text-black_8 pt-[20px] mb-[10px] text-[20px]">
      <Typography
          className={`m-0 ml-5
             px-2 text-black inline-block text-[24px]`}
        >
          ChatLog
        </Typography>
        {bot.start_time}
        
        <Link
          underline="none"
          href="/dashboard"
          className="text-gray-600 flex items-center absolute right-10 text-[16px]"
        >
          <BackArrow className="h-[15px]" />
          Back to Logs
        </Link>
      </div>
      <div className="max-w-[1000px] overflow-y-auto">
        <Paper className="p-10">
          <List className="overflow-y-auto rounded-md mt-5 p-3">
            <ListItem className="border-b flex flex-col border-gray-300 text-gray-500">
              <div className="flex justify-between mb-5 w-full items-start">
                <div className="flex flex-row">
                  <Image
                    src={botAvatar}
                    width={40}
                    height={40}
                    className="w-[40px] h-[40px] rounded-[50px] mr-4"
                    alt="avatar"
                  />
                  <div>
                    <Typography className="font-bold text-black">{bot.bot_name}</Typography>
                    <Typography className="text-[14px] text-gray-600">
                      {bot.greetings}
                    </Typography>
                  </div>
                </div>
                <Typography>{bot.start_time}</Typography>
              </div>

              {conversation.map((conv)=>(
                <div key={conv.id} className="flex flex-col w-full">
                <div className="flex flex-row justify-between w-full pl-10">
                  <div className="flex flex-col items-start gap-1 ">
                    <div className="flex flex-row gap-1">
                      <div className=" w-[30px] h-[30px]"> 
                        <Image
                        src="/images/face.PNG"
                        width={30}
                        height={30}
                        className="rounded-full mr-4 mt-1" // Changed rounded-[50px] to rounded-full for better clarity
                        alt="avatar"
                        />
                      </div>
                      <Typography className="font-bold text-black flex justify-center items-center mt-1">Website visitor</Typography></div>
                    <div>
                      <Typography className="text-[14px] text-gray-600">
                        {conv.user_message}
                      </Typography>
                    </div>
                  </div>
                  <Typography>{formatDateString(conv.created_at)}</Typography>
                </div>
                <div className="flex flex-row justify-between w-full pl-10">
                  <div className="flex flex-col items-start gap-2 w-[70%]">
                    <div className="flex flex-row gap-2">
                      <div className="!w-[25px] !h-[25px] ">
                        <Image
                          src={botAvatar}
                          width={30}
                          height={30}
                          className="rounded-full mr-4" // Changed rounded-[50px] to rounded-full for better clarity
                          alt="avatar"
                        />
                      </div>
                      <Typography className="font-bold text-black flex justify-center items-center mt-1">{bot.bot_name}</Typography>

                    </div>
                    
                    <div className="flex-1">
                      <Typography className="text-[14px] text-gray-600">
                        {conv.response}
                      </Typography>
                    </div>
                  </div>
                  <Typography>{formatDateString(conv.created_at)}</Typography>
                </div>
              </div>
              
                
              ))}
            </ListItem>
          </List>
        </Paper>
      </div>
      <ToastContainer />
    </>
  )
}

export default Logs
