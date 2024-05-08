import * as React from "react";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import router from "next/router";
import { AUTH_API } from "@/components/utils/serverURL"

const KnowledgeBase = () => {
  const [bases, setBases] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleAddRow = () => {
    router.push(`/knowledge/edit?baseId=-1`);
  }

  // Fetch knowledge bases when component mounts
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
      fetch(`${AUTH_API.GET_KNOWLEDGE_BASES}?userId=${userID}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setBases(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching knowledge bases:', error);
          setIsLoading(false);
        });
    }
  }, []); // Empty dependency array means this effect will only run once after the initial render

  const handleEditClick = (baseId) => {
     router.push(`/knowledge/edit?baseId=${baseId}`);

  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-full h-[50px] flex items-center justify-center pt-[24px] mb-[10px] text-[28px]">
        <Typography className="text-[20px] w-2/3">Knowledge Base</Typography>
        <Box sx={{ width: "30%", height: "fit-content" }}>
          <Button
            onClick={handleAddRow}
            className="bg-[#5b0c99] text-white font-bold py-2 px-4 rounded m-2"
            variant="contained"
            style={{ textTransform: "none" }}
          >
            + Create Knowledgebase
          </Button>
        </Box>
      </div>
      <div className="w-full h-fit flex flex-wrap mt-10 items-center justify-start">
        {bases.map((base) => (
          <div key={base.id} className="w-72 h-30 bg-white shadow-sm p-4 m-3">
            <div className="w-full h-fit flex flex-row items-center justify-center">
              <div className="flex-grow flex flex-col">
                <Typography className="text-[20px]">{base.name}</Typography>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="w-12 h-8 text-[12px] my-1 rounded-sm bg-[#00D7CA] text-white"
                style={{ textTransform: "none" }}
                onClick={()=>handleEditClick(base.id)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default KnowledgeBase;
